<script lang="ts">
	import { onDestroy } from 'svelte';
	import { CONVERSATIONS, type ConversationItem } from '$lib/data/conversations';

	let selectedConv = $state<ConversationItem>(CONVERSATIONS[0]);
	let selectedCategory = $state<string>('ທັງໝົດ');
	let showPinyin = $state(true);
	let showLao = $state(true);

	// Auto-play / Highlight state
	let playingLineIdx = $state<number | null>(null);
	let isAutoPlaying = $state(false);
	let autoPlayToken = 0;

	// Role-play mode: null (all), 'A', or 'B'
	let rolePlaySpeaker = $state<string | null>(null);

	// Voice recording
	let mediaRecorder: MediaRecorder | null = null;
	let audioChunks: Blob[] = [];
	let isRecording = $state(false);
	let recordedAudioUrl = $state<string | null>(null);
	let recordingTime = $state(0);
	let recordInterval: NodeJS.Timeout | null = null;

	const categories = $derived([
		'ທັງໝົດ',
		...Array.from(new Set(CONVERSATIONS.map((c) => c.category)))
	]);

	const filteredConversations = $derived(
		selectedCategory === 'ທັງໝົດ'
			? CONVERSATIONS
			: CONVERSATIONS.filter((c) => c.category === selectedCategory)
	);

	function speakText(text: string, onEnd?: () => void) {
		if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
			onEnd?.();
			return;
		}
		window.speechSynthesis.cancel();
		const u = new SpeechSynthesisUtterance(text);
		u.lang = 'zh-CN';
		u.rate = 0.85;
		u.onend = () => {
			onEnd?.();
		};
		u.onerror = () => {
			onEnd?.();
		};
		window.speechSynthesis.speak(u);
	}

	function playLine(idx: number) {
		stopAutoPlay();
		playingLineIdx = idx;
		speakText(selectedConv.lines[idx].cn, () => {
			if (playingLineIdx === idx) {
				playingLineIdx = null;
			}
		});
	}

	async function startAutoPlay() {
		if (isAutoPlaying) {
			stopAutoPlay();
			return;
		}
		isAutoPlaying = true;
		const token = ++autoPlayToken;

		for (let i = 0; i < selectedConv.lines.length; i++) {
			if (autoPlayToken !== token) break;
			playingLineIdx = i;
			await new Promise<void>((resolve) => {
				speakText(selectedConv.lines[i].cn, () => resolve());
			});
			if (autoPlayToken !== token) break;
			// Brief natural pause between dialogue turns
			await new Promise((r) => setTimeout(r, 600));
		}

		if (autoPlayToken === token) {
			isAutoPlaying = false;
			playingLineIdx = null;
		}
	}

	function stopAutoPlay() {
		autoPlayToken++;
		isAutoPlaying = false;
		playingLineIdx = null;
		if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
			window.speechSynthesis.cancel();
		}
	}

	async function toggleRecording() {
		if (isRecording) {
			stopRecording();
		} else {
			startRecording();
		}
	}

	async function startRecording() {
		if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
			alert('ບຣາວເຊີຂອງທ່ານບໍ່ຮອງຮັບການອັດສຽງ (Microphone)');
			return;
		}
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			audioChunks = [];
			mediaRecorder = new MediaRecorder(stream);
			mediaRecorder.ondataavailable = (e) => {
				if (e.data.size > 0) audioChunks.push(e.data);
			};
			mediaRecorder.onstop = () => {
				const blob = new Blob(audioChunks, { type: 'audio/webm' });
				if (recordedAudioUrl) URL.revokeObjectURL(recordedAudioUrl);
				recordedAudioUrl = URL.createObjectURL(blob);
				stream.getTracks().forEach((track) => track.stop());
			};
			mediaRecorder.start();
			isRecording = true;
			recordingTime = 0;
			recordInterval = setInterval(() => {
				recordingTime++;
			}, 1000);
		} catch (err) {
			console.error('Mic access denied:', err);
			alert('ກະລຸນາອະນຸຍາດການນຳໃຊ້ໄມໂຄຣໂຟນ (Microphone Permission)');
		}
	}

	function stopRecording() {
		if (mediaRecorder && mediaRecorder.state !== 'inactive') {
			mediaRecorder.stop();
		}
		isRecording = false;
		if (recordInterval) clearInterval(recordInterval);
	}

	onDestroy(() => {
		stopAutoPlay();
		stopRecording();
		if (recordedAudioUrl) URL.revokeObjectURL(recordedAudioUrl);
	});
</script>

<div class="conversation-view flex flex-col gap-6">
	<!-- Top Header Card -->
	<div
		class="rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-red-700 via-red-800 to-amber-900 text-white shadow-md"
	>
		<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
			<div>
				<div class="flex items-center gap-2 mb-1">
					<span class="text-2xl">💬</span>
					<h2 class="text-2xl font-bold">ບົດສົນທະນາພາສາຈີນ (情景对话)</h2>
				</div>
				<p class="text-white/85 text-sm max-w-xl leading-relaxed">
					ຝຶກເວົ້າ ແລະ ຟັງພາສາຈີນໃນຊີວິດປະຈຳວັນ, ພ້ອມພິນອິນ, ຄຳແປພາສາລາວ, ລະບົບອອກສຽງອັດຕະໂນມັດ ແລະ
					ໂໝດຝຶກສວມບົດບາດ (Role-play).
				</p>
			</div>
			<div class="flex items-center gap-2 flex-wrap">
				<button
					type="button"
					class="px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer {showPinyin
						? 'bg-white text-red-800 border-white'
						: 'bg-white/15 text-white border-white/30 hover:bg-white/25'}"
					onclick={() => (showPinyin = !showPinyin)}
				>
					{showPinyin ? '✓ ພິນອິນ' : '✗ ພິນອິນ'}
				</button>
				<button
					type="button"
					class="px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer {showLao
						? 'bg-white text-red-800 border-white'
						: 'bg-white/15 text-white border-white/30 hover:bg-white/25'}"
					onclick={() => (showLao = !showLao)}
				>
					{showLao ? '✓ ຄຳແປລາວ' : '✗ ຄຳແປລາວ'}
				</button>
			</div>
		</div>

		<!-- Category Filter Chips -->
		<div class="flex items-center gap-2 overflow-x-auto pt-4 mt-2 border-t border-white/20">
			<span class="text-xs text-white/70 whitespace-nowrap">ໝວດໝູ່:</span>
			{#each categories as cat (cat)}
				<button
					type="button"
					class="px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors cursor-pointer {selectedCategory ===
					cat
						? 'bg-amber-300 text-red-950 font-bold shadow-xs'
						: 'bg-white/15 text-white hover:bg-white/30'}"
					onclick={() => (selectedCategory = cat)}
				>
					{cat}
				</button>
			{/each}
		</div>
	</div>

	<!-- Main Layout: List Selector + Conversation Board -->
	<div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
		<!-- Left: Conversation Selector List -->
		<div class="lg:col-span-4 flex flex-col gap-2.5">
			<div class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">
				ເລືອກບົດສົນທະນາ ({filteredConversations.length} ບົດ)
			</div>
			<div class="space-y-2 max-h-[560px] overflow-y-auto pr-1">
				{#each filteredConversations as item (item.id)}
					<button
						type="button"
						class="w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-1 {selectedConv.id ===
						item.id
							? 'bg-amber-50/90 border-amber-300 shadow-sm ring-2 ring-red-700/20'
							: 'bg-white border-slate-200/80 hover:bg-orange-50/50 hover:border-orange-200'}"
						onclick={() => {
							stopAutoPlay();
							selectedConv = item;
						}}
					>
						<div class="flex items-center justify-between gap-2">
							<span class="font-bold text-slate-900 text-sm leading-tight">{item.titleCn}</span>
							<span
								class="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-semibold shrink-0"
							>
								HSK {item.level}
							</span>
						</div>
						<div class="text-xs text-blue-600 font-medium">{item.titlePinyin}</div>
						<div class="text-xs text-slate-600 leading-snug">{item.titleLao}</div>
					</button>
				{/each}
			</div>
		</div>

		<!-- Right: Conversation Active Board -->
		<div class="lg:col-span-8 flex flex-col gap-4">
			<div class="bg-white rounded-2xl border border-orange-200/80 shadow-sm p-4 sm:p-6">
				<!-- Header of Active Conversation -->
				<div
					class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100"
				>
					<div>
						<div class="flex items-center gap-2">
							<h3 class="text-xl font-bold text-red-800">{selectedConv.titleCn}</h3>
							<span
								class="text-xs px-2.5 py-0.5 rounded-full bg-orange-100 text-red-700 font-semibold"
							>
								HSK {selectedConv.level}
							</span>
						</div>
						<div class="text-sm text-blue-600 font-medium mt-0.5">
							{selectedConv.titlePinyin} ·
							<span class="text-slate-600">{selectedConv.titleLao}</span>
						</div>
						<p class="text-xs text-slate-400 mt-1">
							💡 ສະຖານະການ: {selectedConv.description}
						</p>
					</div>

					<!-- Dialogue Action Buttons -->
					<div class="flex items-center gap-2 shrink-0 flex-wrap">
						<button
							type="button"
							class="px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs {isAutoPlaying
								? 'bg-amber-400 text-red-950 hover:bg-amber-500'
								: 'bg-red-700 text-white hover:bg-red-800'}"
							onclick={startAutoPlay}
						>
							{#if isAutoPlaying}
								<span>⏸️ ຢຸດຫຼິ້ນ</span>
							{:else}
								<span>▶️ ຫຼິ້ນທັງໝົດ</span>
							{/if}
						</button>
					</div>
				</div>

				<!-- Role Play Switcher Bar -->
				<div
					class="my-3 py-2 px-3 rounded-xl bg-orange-50/70 border border-orange-100 flex flex-wrap items-center justify-between gap-2"
				>
					<div class="flex items-center gap-1.5 text-xs text-slate-700">
						<span class="font-bold">🎭 ໂໝດຝຶກເວົ້າ (Role-play):</span>
						<span class="text-slate-500 text-[11px]">ເລືອກຕົວລະຄອນທີ່ຢາກຝຶກ</span>
					</div>
					<div class="flex items-center gap-1">
						<button
							type="button"
							class="px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer {rolePlaySpeaker ===
							null
								? 'bg-red-700 text-white font-bold'
								: 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}"
							onclick={() => (rolePlaySpeaker = null)}
						>
							ທັງໝົດ
						</button>
						<button
							type="button"
							class="px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer {rolePlaySpeaker ===
							'A'
								? 'bg-blue-600 text-white font-bold'
								: 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}"
							onclick={() => (rolePlaySpeaker = 'A')}
						>
							ຂ້ອຍເປັນ A 👨
						</button>
						<button
							type="button"
							class="px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer {rolePlaySpeaker ===
							'B'
								? 'bg-emerald-600 text-white font-bold'
								: 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}"
							onclick={() => (rolePlaySpeaker = 'B')}
						>
							ຂ້ອຍເປັນ B 👩
						</button>
					</div>
				</div>

				<!-- Chat / Dialogue Bubbles -->
				<div class="space-y-4 my-5">
					{#each selectedConv.lines as line, idx (line.cn + '-' + idx)}
						{@const isUserRole = rolePlaySpeaker !== null && rolePlaySpeaker === line.speaker}
						{@const isHighlight = playingLineIdx === idx}
						<div
							class="flex items-start gap-3 transition-all {line.speaker === 'A'
								? 'flex-row'
								: 'flex-row-reverse'}"
						>
							<!-- Avatar -->
							<div
								class="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 shadow-xs border {line.speaker ===
								'A'
									? 'bg-blue-50 border-blue-200'
									: 'bg-emerald-50 border-emerald-200'}"
							>
								{line.avatar}
							</div>

							<!-- Bubble Card -->
							<div
								class="max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 transition-all shadow-xs border {isHighlight
									? 'ring-2 ring-red-600 scale-[1.01]'
									: ''} {line.speaker === 'A'
									? isUserRole
										? 'bg-blue-100/80 border-blue-300 text-blue-950'
										: 'bg-slate-50 border-slate-200/90 text-slate-900'
									: isUserRole
										? 'bg-emerald-100/80 border-emerald-300 text-emerald-950'
										: 'bg-orange-50/80 border-orange-200/90 text-slate-900'}"
							>
								<!-- Speaker Name + Sound button -->
								<div class="flex items-center justify-between gap-2 mb-1">
									<div class="flex items-center gap-1.5">
										<span class="text-xs font-bold opacity-80">{line.speakerName}</span>
										{#if isUserRole}
											<span
												class="text-[10px] px-1.5 py-0.2 rounded-full bg-red-600 text-white font-bold"
											>
												ຕາເຈົ້າເວົ້າ! 🎯
											</span>
										{/if}
									</div>
									<button
										type="button"
										class="p-1 rounded-md hover:bg-black/5 text-slate-500 hover:text-red-700 text-xs transition-colors cursor-pointer"
										title="ຟັງສຽງ"
										onclick={() => playLine(idx)}
									>
										🔊
									</button>
								</div>

								<!-- Chinese Hanzi -->
								<div class="text-base sm:text-lg font-medium leading-relaxed">
									{line.cn}
								</div>

								<!-- Pinyin -->
								{#if showPinyin}
									<div class="text-xs sm:text-sm text-blue-600 font-medium mt-0.5 leading-snug">
										{line.pinyin}
									</div>
								{/if}

								<!-- Lao Meaning -->
								{#if showLao}
									<div
										class="text-xs sm:text-sm text-slate-600 mt-1 pt-1 border-t border-black/5 leading-relaxed"
									>
										{line.lao}
									</div>
								{/if}
							</div>
						</div>
					{/each}
				</div>

				<!-- Voice Practice & Recording Bar -->
				<div
					class="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-amber-50/50 p-3 rounded-xl"
				>
					<div class="text-xs text-slate-700 flex items-center gap-2">
						<span class="text-base">🎙️</span>
						<span
							><b>ຝຶກອັດສຽງເວົ້າຂອງຕົນເອງ:</b> ອັດສຽງແລ້ວເປີດຟັງເພື່ອທຽບກັບສຳນຽງເຈົ້າຂອງພາສາ</span
						>
					</div>

					<div class="flex items-center gap-2">
						<button
							type="button"
							class="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs {isRecording
								? 'bg-red-600 text-white animate-pulse'
								: 'bg-white border border-slate-300 text-slate-700 hover:bg-red-50 hover:text-red-700 hover:border-red-300'}"
							onclick={toggleRecording}
						>
							{#if isRecording}
								<span>⏹️ ຢຸດອັດສຽງ ({recordingTime}s)</span>
							{:else}
								<span>🔴 ເລີ່ມອັດສຽງ</span>
							{/if}
						</button>

						{#if recordedAudioUrl}
							<audio src={recordedAudioUrl} controls class="h-8 max-w-48"></audio>
						{/if}
					</div>
				</div>

				<!-- Key Vocabularies of the Conversation -->
				{#if selectedConv.vocab && selectedConv.vocab.length > 0}
					<div class="mt-5 pt-4 border-t border-slate-100">
						<div class="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
							<span>📚</span> <span>ຄຳສັບສຳຄັນໃນບົດສົນທະນານີ້:</span>
						</div>
						<div class="flex flex-wrap gap-2">
							{#each selectedConv.vocab as v (v.word)}
								<div
									class="px-2.5 py-1.5 rounded-lg bg-orange-50 border border-orange-200/80 text-xs flex items-center gap-1.5 shadow-2xs"
								>
									<span class="font-bold text-slate-900">{v.word}</span>
									<span class="text-blue-600 font-medium">({v.pinyin})</span>
									<span class="text-slate-600">={v.lao}</span>
									<button
										type="button"
										class="text-[11px] text-slate-400 hover:text-red-700 cursor-pointer"
										title="ອອກສຽງ"
										onclick={() => speakText(v.word)}
									>
										🔊
									</button>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
