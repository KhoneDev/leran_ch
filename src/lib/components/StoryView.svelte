<script lang="ts">
	import { onDestroy } from 'svelte';
	import { STORIES, type StoryItem } from '$lib/data/stories';

	let selectedStory = $state<StoryItem>(STORIES[0]);
	let selectedLevel = $state<number | 'all'>('all');
	let showPinyin = $state(true);
	let showLao = $state(true);

	// Audio reading states
	let playingParaIdx = $state<number | null>(null);
	let isPlayingAll = $state(false);
	let playToken = 0;

	// Comprehension Quiz state
	let userAnswers = $state<Record<number, number>>({});
	let showQuizResults = $state(false);

	const filteredStories = $derived(
		selectedLevel === 'all' ? STORIES : STORIES.filter((s) => s.level === selectedLevel)
	);

	function speakText(text: string, onEnd?: () => void) {
		if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
			onEnd?.();
			return;
		}
		window.speechSynthesis.cancel();
		const u = new SpeechSynthesisUtterance(text);
		u.lang = 'zh-CN';
		u.rate = 0.82;
		u.onend = () => onEnd?.();
		u.onerror = () => onEnd?.();
		window.speechSynthesis.speak(u);
	}

	function playParagraph(idx: number) {
		stopPlay();
		playingParaIdx = idx;
		speakText(selectedStory.paragraphs[idx].cn, () => {
			if (playingParaIdx === idx) playingParaIdx = null;
		});
	}

	async function playAllStory() {
		if (isPlayingAll) {
			stopPlay();
			return;
		}
		isPlayingAll = true;
		const token = ++playToken;

		for (let i = 0; i < selectedStory.paragraphs.length; i++) {
			if (playToken !== token) break;
			playingParaIdx = i;
			await new Promise<void>((resolve) => {
				speakText(selectedStory.paragraphs[i].cn, () => resolve());
			});
			if (playToken !== token) break;
			await new Promise((r) => setTimeout(r, 650));
		}

		if (playToken === token) {
			isPlayingAll = false;
			playingParaIdx = null;
		}
	}

	function stopPlay() {
		playToken++;
		isPlayingAll = false;
		playingParaIdx = null;
		if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
			window.speechSynthesis.cancel();
		}
	}

	function selectAnswer(qIdx: number, optIdx: number) {
		if (showQuizResults) return;
		userAnswers[qIdx] = optIdx;
	}

	function submitQuiz() {
		showQuizResults = true;
	}

	function resetQuiz() {
		userAnswers = {};
		showQuizResults = false;
	}

	function onSelectStory(story: StoryItem) {
		stopPlay();
		selectedStory = story;
		resetQuiz();
	}

	onDestroy(() => {
		stopPlay();
	});
</script>

<div class="story-view flex flex-col gap-6">
	<!-- Top Banner -->
	<div
		class="rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-amber-700 via-orange-800 to-red-900 text-white shadow-md"
	>
		<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
			<div>
				<div class="flex items-center gap-2 mb-1">
					<span class="text-2xl">📖</span>
					<h2 class="text-2xl font-bold">ບົດເລື່ອງ ແລະ ນິທານພາສາຈີນ (短文与故事)</h2>
				</div>
				<p class="text-white/85 text-sm max-w-xl leading-relaxed">
					ຝຶກອ່ານ ແລະ ຟັງບົດຄວາມພາສາຈີນທີ່ຈັດຕາມລະດັບ HSK, ພ້ອມພິນອິນ, ແປລາວ,
					ລະບົບອ່ານອອກສຽງອັດຕະໂນມັດ ແລະ ແບບທົດສອບຄວາມເຂົ້າໃຈ.
				</p>
			</div>
			<div class="flex items-center gap-2 flex-wrap">
				<button
					type="button"
					class="px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer {showPinyin
						? 'bg-white text-orange-900 border-white'
						: 'bg-white/15 text-white border-white/30 hover:bg-white/25'}"
					onclick={() => (showPinyin = !showPinyin)}
				>
					{showPinyin ? '✓ ພິນອິນ' : '✗ ພິນອິນ'}
				</button>
				<button
					type="button"
					class="px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer {showLao
						? 'bg-white text-orange-900 border-white'
						: 'bg-white/15 text-white border-white/30 hover:bg-white/25'}"
					onclick={() => (showLao = !showLao)}
				>
					{showLao ? '✓ ຄຳແປລາວ' : '✗ ຄຳແປລາວ'}
				</button>
			</div>
		</div>

		<!-- Level filter chips -->
		<div class="flex items-center gap-2 overflow-x-auto pt-4 mt-2 border-t border-white/20">
			<span class="text-xs text-white/70 whitespace-nowrap">ລະດັບ:</span>
			{#each [{ id: 'all', label: 'ທຸກລະດັບ' }, { id: 1, label: 'HSK 1 (ງ່າຍ)' }, { id: 2, label: 'HSK 2' }, { id: 3, label: 'HSK 3' }] as lv (lv.id)}
				<button
					type="button"
					class="px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors cursor-pointer {selectedLevel ===
					lv.id
						? 'bg-amber-300 text-orange-950 font-bold shadow-xs'
						: 'bg-white/15 text-white hover:bg-white/30'}"
					onclick={() => (selectedLevel = lv.id as number | 'all')}
				>
					{lv.label}
				</button>
			{/each}
		</div>
	</div>

	<!-- Main Layout -->
	<div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
		<!-- Left: Stories Selector -->
		<div class="lg:col-span-4 flex flex-col gap-2.5">
			<div class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">
				ເລືອກບົດເລື່ອງ ({filteredStories.length} ບົດ)
			</div>
			<div class="space-y-2 max-h-[580px] overflow-y-auto pr-1">
				{#each filteredStories as item (item.id)}
					<button
						type="button"
						class="w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-1 {selectedStory.id ===
						item.id
							? 'bg-amber-50/90 border-amber-300 shadow-sm ring-2 ring-orange-600/20'
							: 'bg-white border-slate-200/80 hover:bg-orange-50/50 hover:border-orange-200'}"
						onclick={() => onSelectStory(item)}
					>
						<div class="flex items-center justify-between gap-2">
							<span class="font-bold text-slate-900 text-sm">{item.titleCn}</span>
							<span
								class="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 font-semibold shrink-0"
							>
								HSK {item.level}
							</span>
						</div>
						<div class="text-xs text-blue-600 font-medium">{item.titlePinyin}</div>
						<div class="text-xs text-slate-700">{item.titleLao}</div>
						<div class="text-[11px] text-slate-400 line-clamp-1">{item.summaryLao}</div>
					</button>
				{/each}
			</div>
		</div>

		<!-- Right: Active Story Reader -->
		<div class="lg:col-span-8 flex flex-col gap-5">
			<article class="bg-white rounded-2xl border border-orange-200/80 shadow-sm p-5 sm:p-7">
				<!-- Story Title & Controls -->
				<div class="pb-4 border-b border-slate-100 flex items-start justify-between gap-3">
					<div>
						<div class="flex items-center gap-2">
							<h3 class="text-2xl font-bold text-red-800">{selectedStory.titleCn}</h3>
							<span
								class="text-xs px-2.5 py-0.5 rounded-full bg-orange-100 text-red-700 font-semibold"
							>
								HSK {selectedStory.level}
							</span>
						</div>
						<div class="text-sm text-blue-600 font-medium mt-0.5">
							{selectedStory.titlePinyin}
						</div>
						<div class="text-sm font-semibold text-slate-700 mt-0.5">
							{selectedStory.titleLao}
						</div>
					</div>

					<button
						type="button"
						class="px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0 {isPlayingAll
							? 'bg-amber-400 text-red-950 hover:bg-amber-500'
							: 'bg-red-700 text-white hover:bg-red-800'}"
						onclick={playAllStory}
					>
						{#if isPlayingAll}
							<span>⏸️ ຢຸດອ່ານ</span>
						{:else}
							<span>🔊 ອ່ານທັງໝົດ</span>
						{/if}
					</button>
				</div>

				<!-- Story Content (Paragraph by paragraph) -->
				<div class="space-y-4 my-6">
					{#each selectedStory.paragraphs as p, idx (p.cn + '-' + idx)}
						{@const isHighlight = playingParaIdx === idx}
						<div
							class="p-3.5 rounded-xl transition-all border {isHighlight
								? 'bg-amber-100/70 border-amber-300 ring-2 ring-red-600/30 shadow-xs'
								: 'bg-slate-50/60 border-slate-100 hover:bg-orange-50/40'}"
						>
							<div class="flex items-start justify-between gap-2">
								<div class="flex-1">
									<!-- Chinese Hanzi -->
									<p class="text-lg sm:text-xl font-medium text-slate-900 leading-relaxed">
										{p.cn}
									</p>

									<!-- Pinyin -->
									{#if showPinyin}
										<p class="text-xs sm:text-sm text-blue-600 font-medium mt-1 leading-snug">
											{p.pinyin}
										</p>
									{/if}

									<!-- Lao Meaning -->
									{#if showLao}
										<p
											class="text-xs sm:text-sm text-slate-600 mt-1.5 pt-1 border-t border-black/5 leading-relaxed"
										>
											{p.lao}
										</p>
									{/if}
								</div>

								<button
									type="button"
									class="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-amber-100 text-xs text-slate-600 cursor-pointer shrink-0 transition-colors"
									title="ອ່ານວັກນີ້"
									onclick={() => playParagraph(idx)}
								>
									🔊
								</button>
							</div>
						</div>
					{/each}
				</div>

				<!-- Key Vocabularies -->
				{#if selectedStory.vocab && selectedStory.vocab.length > 0}
					<div class="mt-6 pt-5 border-t border-slate-200">
						<div class="text-xs font-bold text-slate-700 mb-2.5 flex items-center gap-1.5">
							<span>📚</span> <span>ຄຳສັບຫຼັກໃນບົດເລື່ອງ:</span>
						</div>
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
							{#each selectedStory.vocab as v (v.word)}
								<div
									class="p-2.5 rounded-xl bg-orange-50/80 border border-orange-200/80 flex items-center justify-between text-xs"
								>
									<div>
										<span class="font-bold text-slate-900 text-sm">{v.word}</span>
										<span class="text-blue-600 ml-1">({v.pinyin})</span>
										<div class="text-slate-600 mt-0.5">{v.lao}</div>
									</div>
									<button
										type="button"
										class="p-1 rounded text-slate-400 hover:text-red-700 cursor-pointer"
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

				<!-- Comprehension Questions (ແບບທົດສອບຄວາມເຂົ້າໃຈ) -->
				{#if selectedStory.questions && selectedStory.questions.length > 0}
					<div class="mt-8 pt-6 border-t-2 border-dashed border-orange-200">
						<div class="flex items-center justify-between gap-2 mb-4">
							<div class="flex items-center gap-2">
								<span class="text-xl">✍️</span>
								<h4 class="font-bold text-base text-slate-900">
									ຄຳຖາມທົດສອບຄວາມເຂົ້າໃຈ (阅读理解测试)
								</h4>
							</div>
							{#if showQuizResults}
								<button
									type="button"
									class="text-xs font-semibold text-red-700 hover:underline cursor-pointer"
									onclick={resetQuiz}
								>
									🔄 ເຮັດໃໝ່
								</button>
							{/if}
						</div>

						<div class="space-y-4">
							{#each selectedStory.questions as q, qIdx (q.q)}
								<div class="p-4 rounded-xl bg-slate-50 border border-slate-200/90 text-sm">
									<div class="font-bold text-slate-900 mb-2.5">
										{qIdx + 1}. {q.q}
									</div>

									<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
										{#each q.options as opt, optIdx (opt)}
											{@const isSelected = userAnswers[qIdx] === optIdx}
											{@const isCorrect = q.answer === optIdx}
											<button
												type="button"
												class="w-full text-left p-2.5 rounded-lg border text-xs sm:text-sm font-medium transition-all cursor-pointer {showQuizResults
													? isCorrect
														? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
														: isSelected
															? 'bg-red-100 border-red-300 text-red-900 line-through'
															: 'bg-white border-slate-200 opacity-60'
													: isSelected
														? 'bg-amber-100 border-amber-400 text-red-900 font-bold shadow-2xs'
														: 'bg-white border-slate-200 hover:bg-orange-50'}"
												onclick={() => selectAnswer(qIdx, optIdx)}
											>
												<span class="mr-1.5 opacity-70">{String.fromCharCode(65 + optIdx)}.</span>
												{opt}
											</button>
										{/each}
									</div>

									{#if showQuizResults}
										<div class="mt-2.5 p-2 rounded-lg bg-white border border-slate-200 text-xs">
											<span class="font-bold text-slate-700">ຄຳອະທິບາຍ:</span>
											<span class="text-slate-600 ml-1">{q.explanation}</span>
										</div>
									{/if}
								</div>
							{/each}
						</div>

						{#if !showQuizResults}
							<div class="mt-4 text-center">
								<button
									type="button"
									class="px-6 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-sm shadow-sm transition-colors cursor-pointer"
									onclick={submitQuiz}
								>
									ກວດຄຳຕອບ
								</button>
							</div>
						{/if}
					</div>
				{/if}
			</article>
		</div>
	</div>
</div>
