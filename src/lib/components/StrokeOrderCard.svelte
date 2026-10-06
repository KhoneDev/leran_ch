<script lang="ts">
	import { onDestroy } from 'svelte';

	interface Props {
		word: string;
		pinyin?: string;
		thai?: string;
		level?: number;
		examples?: { icon?: string; cn: string; th: string }[];
		autoPlay?: boolean;
		onClose?: () => void;
	}

	const {
		word = '结婚',
		pinyin = '',
		thai = '',
		level,
		examples = [],
		autoPlay = true,
		onClose
	}: Props = $props();

	interface HanziWriterInstance {
		cancelQuiz: () => void;
		hideCharacter: () => void;
		showOutline: () => void;
		animateCharacter: (options?: { onComplete?: () => void }) => void;
		pauseAnimation: () => void;
		resumeAnimation: () => void;
		quiz: (options?: { onComplete?: () => void; onMistake?: () => void }) => void;
		options: { strokeAnimationSpeed: number };
	}

	interface HanziWriterStatic {
		create: (
			el: HTMLElement,
			char: string,
			options: Record<string, unknown>
		) => HanziWriterInstance;
	}

	let HanziWriterModule: HanziWriterStatic | null = null;

	let writers = $state<(HanziWriterInstance | null)[]>([]);
	let isPlaying = $state(false);
	let isPaused = $state(false);
	let activeCharIdx = $state(0);
	let speed = $state(1);
	let isQuizMode = $state(false);
	let loopAnimation = $state(true); // Automatically repeat after round 1 finishes
	let strokeCounts = $state<Record<number, number>>({});
	let charsLoaded = $state<Record<number, boolean>>({});
	let currentAnimationToken = 0;

	// Extract only Chinese Han characters for animation
	const hanziChars = $derived([...word].filter((c) => /\p{Script=Han}/u.test(c)));

	function writerAction(node: HTMLElement, params: { char: string; idx: number }) {
		let writerInstance: HanziWriterInstance | null = null;
		let destroyed = false;

		async function init() {
			if (typeof window === 'undefined') return;

			if (!HanziWriterModule) {
				try {
					const mod = await import('hanzi-writer');
					HanziWriterModule = (mod.default || mod) as unknown as HanziWriterStatic;
				} catch (err: unknown) {
					console.error('Failed to import hanzi-writer:', err);
					return;
				}
			}
			if (destroyed || !HanziWriterModule) return;

			node.innerHTML = '';
			const isMobile = window.innerWidth < 640;
			const total = hanziChars.length;
			let charSize = isMobile ? 130 : 170;
			if (total > 3) charSize = isMobile ? 85 : 115;
			else if (total > 2) charSize = isMobile ? 105 : 135;

			try {
				writerInstance = HanziWriterModule.create(node, params.char, {
					width: charSize,
					height: charSize,
					padding: 8,
					showOutline: true,
					showCharacter: false, // Start with ghost outline only
					strokeAnimationSpeed: speed,
					delayBetweenStrokes: 130,
					strokeColor: '#1c2833', // Deep ink / charcoal (matches user screenshot)
					outlineColor: '#dde4ed', // Soft light gray-blue ghost outline
					drawingColor: '#2563eb', // Blue for practice writing
					drawingWidth: Math.max(3, Math.round(charSize / 24)),
					showHintAfterMisses: 2,
					highlightOnComplete: true,
					charDataLoader: (
						charToLoad: string,
						onComplete: (data: unknown) => void,
						onError: (err: unknown) => void
					) => {
						const urlCdn = `https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/${encodeURIComponent(charToLoad)}.json`;
						const urlGh = `https://raw.githubusercontent.com/chanind/hanzi-writer-data/master/data/${encodeURIComponent(charToLoad)}.json`;

						fetch(urlCdn)
							.then((r) => {
								if (!r.ok) throw new Error('CDN status ' + r.status);
								return r.json();
							})
							.then(onComplete)
							.catch(() => {
								fetch(urlGh)
									.then((r) => r.json())
									.then(onComplete)
									.catch(onError);
							});
					},
					onLoadCharDataSuccess: (data: { strokes?: string[] }) => {
						if (destroyed) return;
						if (data?.strokes) {
							strokeCounts[params.idx] = data.strokes.length;
							strokeCounts = { ...strokeCounts };
						}
						charsLoaded[params.idx] = true;
						charsLoaded = { ...charsLoaded };

						// When all characters are loaded and autoPlay is true, trigger sequence animation
						const loadedAll = hanziChars.every((_, i) => charsLoaded[i]);
						if (loadedAll && autoPlay && !isQuizMode) {
							setTimeout(() => {
								if (!destroyed) startSequence();
							}, 250);
						}
					},
					onLoadCharDataError: (err: unknown) => {
						console.warn('Failed to load stroke data for', params.char, err);
					}
				});

				writers[params.idx] = writerInstance;
			} catch (e: unknown) {
				console.error('Error creating HanziWriter for', params.char, e);
			}
		}

		init();

		return {
			destroy() {
				destroyed = true;
				try {
					writerInstance?.cancelQuiz();
				} catch {
					/* ignore cleanup error */
				}
				writers[params.idx] = null;
			}
		};
	}

	async function startSequence() {
		if (writers.length === 0) return;
		const token = ++currentAnimationToken;
		isPlaying = true;
		isPaused = false;

		// Reset all characters to ghost outline state
		for (const w of writers) {
			if (!w) continue;
			try {
				w.cancelQuiz();
				w.hideCharacter();
				w.showOutline();
			} catch {
				/* ignore reset error */
			}
		}

		for (let i = 0; i < hanziChars.length; i++) {
			if (currentAnimationToken !== token) return;
			activeCharIdx = i;
			const w = writers[i];
			if (!w) continue;

			await new Promise<void>((resolve) => {
				w.animateCharacter({
					onComplete: () => {
						if (currentAnimationToken === token) resolve();
					}
				});
			});

			if (currentAnimationToken !== token) return;
			if (i < hanziChars.length - 1) {
				await new Promise((r) => setTimeout(r, 200));
			}
		}

		if (currentAnimationToken === token) {
			// Auto-loop: Pause briefly after finishing round 1, then restart sequence automatically!
			if (loopAnimation && !isQuizMode) {
				await new Promise((r) => setTimeout(r, 1600));
				if (currentAnimationToken === token && !isPaused && loopAnimation && !isQuizMode) {
					startSequence();
					return;
				}
			}
			isPlaying = false;
			isPaused = false;
		}
	}

	async function animateSingleChar(idx: number) {
		const w = writers[idx];
		if (!w) return;
		const token = ++currentAnimationToken;
		isPlaying = true;
		isPaused = false;
		activeCharIdx = idx;

		w.cancelQuiz();
		w.hideCharacter();
		w.showOutline();
		await new Promise<void>((resolve) => {
			w.animateCharacter({
				onComplete: () => {
					if (currentAnimationToken === token) resolve();
				}
			});
		});

		if (currentAnimationToken === token) {
			if (loopAnimation && !isQuizMode) {
				await new Promise((r) => setTimeout(r, 1600));
				if (currentAnimationToken === token && !isPaused && loopAnimation && !isQuizMode) {
					animateSingleChar(idx);
					return;
				}
			}
			isPlaying = false;
		}
	}

	function restartAnimation() {
		if (isQuizMode) {
			startQuiz();
		} else {
			startSequence();
		}
	}

	function togglePause() {
		if (!isPlaying) {
			startSequence();
			return;
		}

		const currentWriter = writers[activeCharIdx];
		if (!currentWriter) return;

		if (isPaused) {
			try {
				currentWriter.resumeAnimation();
				isPaused = false;
			} catch {
				startSequence();
			}
		} else {
			try {
				currentWriter.pauseAnimation();
				isPaused = true;
			} catch {
				/* ignore pause error */
			}
		}
	}

	function setSpeed(newSpeed: number) {
		speed = newSpeed;
		writers.forEach((w) => {
			if (w) {
				try {
					w.options.strokeAnimationSpeed = newSpeed;
				} catch {
					/* ignore speed error */
				}
			}
		});
		restartAnimation();
	}

	function startQuiz() {
		isQuizMode = true;
		isPlaying = false;
		isPaused = false;
		currentAnimationToken++;

		writers.forEach((w, idx) => {
			if (!w) return;
			w.cancelQuiz();
			w.hideCharacter();
			w.showOutline();
			if (idx === activeCharIdx) {
				w.quiz({
					onComplete: () => {
						if (activeCharIdx < hanziChars.length - 1) {
							activeCharIdx++;
							startQuiz();
						}
					}
				});
			}
		});
	}

	function switchToAnimation() {
		isQuizMode = false;
		writers.forEach((w) => w?.cancelQuiz());
		startSequence();
	}

	function speak(text: string) {
		if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
		window.speechSynthesis.cancel();
		const u = new SpeechSynthesisUtterance(text);
		u.lang = 'zh-CN';
		u.rate = 0.85;
		window.speechSynthesis.speak(u);
	}

	onDestroy(() => {
		currentAnimationToken++;
		writers.forEach((w) => {
			try {
				w?.cancelQuiz();
			} catch {
				/* ignore cleanup error */
			}
		});
	});
</script>

<div
	class="stroke-order-card bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-6 w-full max-w-2xl mx-auto transition-all"
>
	<!-- Top Header (Matches Screenshot) -->
	<div class="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
		<div class="flex items-center gap-3 min-w-0">
			<!-- Blue Rounded Badge with Play Triangle -->
			<div
				class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm"
			>
				<svg
					class="w-5 h-5 fill-current ml-0.5"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d="M8 5v14l11-7z" />
				</svg>
			</div>

			<!-- Title & Subtitle -->
			<div class="min-w-0">
				<h3 class="text-base sm:text-lg font-bold text-slate-800 leading-tight truncate">
					ແອນິເມຊັນລຳດັບຂີດ (Stroke Order)
				</h3>
				<p class="text-xs sm:text-sm text-slate-400 mt-0.5 truncate">
					ເບິ່ງການຂຽນແຕ່ລະຕົວອັກສອນຕາມລຳດັບຂີດ
				</p>
			</div>
		</div>

		<!-- Action Buttons: Replay + Pause -->
		<div class="flex items-center gap-1.5 shrink-0">
			<!-- Replay Button -->
			<button
				type="button"
				aria-label="Restart animation"
				title="ຫຼິ້ນໃໝ່ (Replay)"
				class="w-9 h-9 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
				onclick={restartAnimation}
			>
				<svg
					class="w-4 h-4"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
					<path d="M3 3v5h5" />
				</svg>
			</button>

			<!-- Pause / Resume Button -->
			<button
				type="button"
				aria-label={isPaused ? 'Resume animation' : 'Pause animation'}
				title={isPaused ? 'ຫຼິ້ນຕໍ່ (Resume)' : 'ຢຸດຊົ່ວຄາວ (Pause)'}
				class="w-9 h-9 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
				onclick={togglePause}
			>
				{#if isPaused}
					<svg class="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
						<path d="M8 5v14l11-7z" />
					</svg>
				{:else}
					<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
						<rect x="6" y="5" width="3.5" height="14" rx="1" />
						<rect x="14.5" y="5" width="3.5" height="14" rx="1" />
					</svg>
				{/if}
			</button>

			<!-- Auto-loop Button -->
			<button
				type="button"
				aria-label="Toggle loop"
				title={loopAnimation ? 'ວົນຊ້ຳອັດຕະໂນມັດ (ເປີດຢູ່)' : 'ວົນຊ້ຳອັດຕະໂນມັດ (ປິດຢູ່)'}
				class="w-9 h-9 rounded-lg border flex items-center justify-center transition-colors cursor-pointer {loopAnimation
					? 'bg-blue-50 border-blue-300 text-blue-600'
					: 'border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50'}"
				onclick={() => {
					loopAnimation = !loopAnimation;
					if (loopAnimation && !isPlaying) {
						startSequence();
					}
				}}
			>
				<svg
					class="w-4 h-4"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="m17 2 4 4-4 4" />
					<path d="M3 11v-1a4 4 0 0 1 4-4h14" />
					<path d="m7 22-4-4 4-4" />
					<path d="M21 13v1a4 4 0 0 1-4 4H3" />
				</svg>
			</button>

			{#if onClose}
				<button
					type="button"
					aria-label="Close modal"
					title="ປິດ"
					class="w-9 h-9 rounded-lg border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 flex items-center justify-center text-slate-400 transition-colors cursor-pointer ml-1"
					onclick={onClose}
				>
					✕
				</button>
			{/if}
		</div>
	</div>

	<!-- Main Character Canvas Display (Matches user screenshot: pure white background, dark ink strokes, ghost outline) -->
	<div class="relative py-8 sm:py-10 min-h-[220px] flex items-center justify-center bg-white">
		{#if hanziChars.length === 0}
			<div class="text-sm text-slate-400 py-6">ບໍ່ມີຕົວອັກສອນຈີນໃນຄຳສັບນີ້</div>
		{:else}
			{#key word}
				<div class="flex items-center justify-center gap-6 sm:gap-10 flex-wrap">
					{#each hanziChars as char, idx (char + idx)}
						<div class="flex flex-col items-center">
							<button
								type="button"
								class="char-box rounded-2xl bg-white p-2 sm:p-3 hover:bg-slate-50/70 transition-all cursor-pointer relative {activeCharIdx ===
								idx
									? 'ring-2 ring-blue-500/30'
									: ''}"
								title="ຄລິກເພື່ອຫຼິ້ນຕົວນີ້ດ່ຽວໆ"
								onclick={() => animateSingleChar(idx)}
							>
								<!-- Target DOM node where HanziWriter mounts directly -->
								<div
									use:writerAction={{ char, idx }}
									class="hanzi-target flex items-center justify-center select-none"
								></div>
							</button>

							<!-- Character Label & Stroke Count -->
							<div class="mt-2 text-center text-xs font-medium text-slate-500">
								<span class="text-slate-800 font-semibold text-sm">{char}</span>
								{#if strokeCounts[idx]}
									<span class="text-slate-400 ml-1">({strokeCounts[idx]} ຂີດ)</span>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{/key}
		{/if}
	</div>

	<!-- Footer Bar: Info, Audio & Extra Controls -->
	<div
		class="bg-slate-50/80 rounded-xl p-3 sm:p-4 border border-slate-100 flex flex-wrap items-center justify-between gap-3"
	>
		<div class="flex items-center gap-2 flex-wrap">
			<span class="text-lg font-bold text-slate-800">{word}</span>
			{#if pinyin}
				<span class="text-sm font-medium text-blue-600">{pinyin}</span>
			{/if}
			{#if thai}
				<span class="text-xs sm:text-sm text-slate-600 border-l border-slate-200 pl-2">{thai}</span>
			{/if}
			{#if level}
				<span class="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">
					HSK {level}
				</span>
			{/if}
			<button
				type="button"
				class="px-2 py-1 rounded bg-white border border-slate-200 hover:bg-amber-100 text-xs text-slate-700 transition-colors cursor-pointer"
				title="ອອກສຽງ"
				onclick={() => speak(word)}
			>
				🔊 ຟັງສຽງ
			</button>
		</div>

		<!-- Extra Controls: Mode & Speed -->
		<div class="flex items-center gap-2">
			<!-- Mode: Animation vs Practice -->
			<div class="flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs">
				<button
					type="button"
					class="px-2.5 py-1 rounded-md transition-colors cursor-pointer {!isQuizMode
						? 'bg-blue-600 text-white font-medium shadow-xs'
						: 'text-slate-600 hover:text-slate-900'}"
					onclick={switchToAnimation}
				>
					ແອນິເມຊັນ
				</button>
				<button
					type="button"
					class="px-2.5 py-1 rounded-md transition-colors cursor-pointer {isQuizMode
						? 'bg-blue-600 text-white font-medium shadow-xs'
						: 'text-slate-600 hover:text-slate-900'}"
					onclick={startQuiz}
					title="ຝຶກຂຽນດ້ວຍຕົນເອງ"
				>
					✍️ ຝຶກຂຽນ
				</button>
			</div>

			<!-- Speed Controls -->
			{#if !isQuizMode}
				<div class="flex items-center gap-1 text-xs text-slate-500">
					<span class="text-[11px] text-slate-400 hidden sm:inline">ຄວາມໄວ:</span>
					{#each [0.75, 1, 1.5] as s (s)}
						<button
							type="button"
							class="px-1.5 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer {speed ===
							s
								? 'bg-slate-200 text-slate-900 font-bold'
								: 'text-slate-500 hover:bg-slate-100'}"
							onclick={() => setSpeed(s)}
						>
							{s}x
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	{#if examples && examples.length > 0}
		<div class="mt-3.5 bg-amber-50/70 rounded-xl p-3 sm:p-4 border border-amber-200/70 text-left">
			<div class="text-xs font-semibold text-red-800 mb-2 flex items-center gap-1.5">
				<span>💬</span> <span>ຕົວຢ່າງປະໂຫຍກ:</span>
			</div>
			<div class="space-y-2">
				{#each examples as ex (ex.cn)}
					<div
						class="bg-white rounded-lg p-2.5 border border-amber-100/90 shadow-xs flex items-start justify-between gap-2"
					>
						<div class="text-xs sm:text-sm flex-1">
							<div class="font-medium text-slate-900 leading-snug">
								{ex.icon || '💬'}
								{ex.cn}
							</div>
							{#if ex.th}
								<div class="text-xs text-slate-600 mt-0.5 leading-relaxed pl-4">
									{ex.th}
								</div>
							{/if}
						</div>
						<button
							type="button"
							class="px-2 py-1 rounded bg-orange-100 hover:bg-amber-200 text-xs text-slate-700 transition-colors cursor-pointer shrink-0"
							title="ຟັງສຽງປະໂຫຍກ"
							onclick={() => speak(ex.cn)}
						>
							🔊
						</button>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	{#if isQuizMode}
		<div class="mt-3 text-center text-xs text-blue-600 font-medium">
			💡 ໃຊ້ນິ້ວມື ຫຼື ເມົ້າລາກເສັ້ນຕາມລຳດັບຂີດເທິງຕົວອັກສອນຈີນໄດ້ເລີຍ!
		</div>
	{/if}
</div>
