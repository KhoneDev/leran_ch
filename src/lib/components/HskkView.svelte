<script lang="ts">
	import { onDestroy } from 'svelte';
	import { HSKK_DATA, type HskkLevelData, type HskkQuestion } from '$lib/data/hskk';

	type LevelKey = 'primary' | 'intermediate' | 'advanced';
	let selectedLevelKey = $state<LevelKey>('primary');
	const currentLevelData = $derived<HskkLevelData>(HSKK_DATA[selectedLevelKey]);

	let activePart = $state<number>(1);
	let activeQuestionIdx = $state<number>(0);
	let showModelAnswer = $state<boolean>(false);

	// Timers
	let prepRemaining = $state<number>(0);
	let answerRemaining = $state<number>(0);
	let timerInterval: NodeJS.Timeout | null = null;
	let timerPhase = $state<'idle' | 'prep' | 'answering'>('idle');

	// Voice Recording
	let mediaRecorder: MediaRecorder | null = null;
	let audioChunks: Blob[] = [];
	let isRecording = $state<boolean>(false);
	let recordedAudioUrl = $state<string | null>(null);

	// Filter questions by active part
	const partQuestions = $derived<HskkQuestion[]>(
		currentLevelData.questions.filter((q) => q.partNumber === activePart)
	);

	const currentQuestion = $derived<HskkQuestion | undefined>(
		partQuestions[activeQuestionIdx] ?? partQuestions[0]
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
		u.onend = () => onEnd?.();
		u.onerror = () => onEnd?.();
		window.speechSynthesis.speak(u);
	}

	function playPromptAudio() {
		if (!currentQuestion) return;
		speakText(currentQuestion.audioPrompt);
	}

	function startExamTimer() {
		stopExamTimer();
		if (!currentQuestion) return;

		// Play prompt audio first
		playPromptAudio();

		if (currentQuestion.prepTimeSec > 0) {
			timerPhase = 'prep';
			prepRemaining = currentQuestion.prepTimeSec;
			timerInterval = setInterval(() => {
				prepRemaining--;
				if (prepRemaining <= 0) {
					clearInterval(timerInterval!);
					startAnsweringTimer();
				}
			}, 1000);
		} else {
			startAnsweringTimer();
		}
	}

	function startAnsweringTimer() {
		if (!currentQuestion) return;
		timerPhase = 'answering';
		answerRemaining = currentQuestion.answerTimeSec;

		// Optionally auto-start voice recorder
		startRecording();

		timerInterval = setInterval(() => {
			answerRemaining--;
			if (answerRemaining <= 0) {
				stopExamTimer();
			}
		}, 1000);
	}

	function stopExamTimer() {
		if (timerInterval) {
			clearInterval(timerInterval);
			timerInterval = null;
		}
		timerPhase = 'idle';
		if (isRecording) {
			stopRecording();
		}
	}

	async function startRecording() {
		if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
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
		} catch (err) {
			console.error('Microphone error:', err);
		}
	}

	function stopRecording() {
		if (mediaRecorder && mediaRecorder.state !== 'inactive') {
			mediaRecorder.stop();
		}
		isRecording = false;
	}

	function selectPart(partNum: number) {
		stopExamTimer();
		activePart = partNum;
		activeQuestionIdx = 0;
		showModelAnswer = false;
	}

	function selectQuestion(idx: number) {
		stopExamTimer();
		activeQuestionIdx = idx;
		showModelAnswer = false;
	}

	function selectLevel(lvl: LevelKey) {
		stopExamTimer();
		selectedLevelKey = lvl;
		activePart = 1;
		activeQuestionIdx = 0;
		showModelAnswer = false;
	}

	onDestroy(() => {
		stopExamTimer();
		if (recordedAudioUrl) URL.revokeObjectURL(recordedAudioUrl);
	});
</script>

<div class="hskk-view flex flex-col gap-6">
	<!-- Top Banner -->
	<div
		class="rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-red-700 via-rose-800 to-amber-900 text-white shadow-md"
	>
		<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
			<div>
				<div class="flex items-center gap-2 mb-1">
					<span class="text-2xl">🎙️</span>
					<h2 class="text-2xl font-bold">ຈຳລອງການສອບປາກເປົ່າ HSKK (汉语水平口语考试)</h2>
				</div>
				<p class="text-white/85 text-sm max-w-xl leading-relaxed">
					ຝຶກສອບເວົ້າພາສາຈີນຕາມຮູບແບບມາດຕະຖານສາກົນ, ລະບົບຈັບເວລາກຽມຕົວ ແລະ ເວົ້າຕອບຈິງ,
					ອັດສຽງຕົນເອງເພື່ອຟັງຄືນ, ພ້ອມແນວທາງຄຳຕອບຕົວຢ່າງ ແລະ ເກນການໃຫ້ຄະແນນ.
				</p>
			</div>

			<!-- Level Switcher -->
			<div class="flex items-center gap-2 flex-wrap">
				{#each [{ key: 'primary', label: '初级 ລະດັບຕົ້ນ' }, { key: 'intermediate', label: '中级 ລະດັບກາງ' }, { key: 'advanced', label: '高级 ລະດັບສູງ' }] as item (item.key)}
					<button
						type="button"
						class="px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer {selectedLevelKey ===
						item.key
							? 'bg-amber-300 text-red-950 border-amber-300 shadow-sm'
							: 'bg-white/15 text-white border-white/30 hover:bg-white/25'}"
						onclick={() => selectLevel(item.key as LevelKey)}
					>
						{item.label}
					</button>
				{/each}
			</div>
		</div>

		<!-- Level Info Summary Bar -->
		<div
			class="mt-4 pt-3.5 border-t border-white/20 flex flex-wrap items-center gap-4 text-xs text-white/90"
		>
			<div>
				🎯 <b>ເປົ້າໝາຍ:</b>
				{currentLevelData.targetHsk}
			</div>
			<div>
				⏱️ <b>ເວລາສອບ:</b> ປະມານ {currentLevelData.totalTimeMin} ນາທີ
			</div>
			<div>
				🏆 <b>ເກນຄະແນນຜ່ານ:</b>
				{currentLevelData.passingScore} / 100 ຄະແນນ
			</div>
		</div>
	</div>

	<!-- Exam Parts Tabs -->
	<div class="flex items-center gap-2 overflow-x-auto pb-1">
		{#each currentLevelData.parts as part (part.partNumber)}
			<button
				type="button"
				class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer whitespace-nowrap {activePart ===
				part.partNumber
					? 'bg-red-700 text-white border-red-700 shadow-xs ring-2 ring-red-700/20'
					: 'bg-white border-slate-200 text-slate-700 hover:bg-orange-50 hover:border-orange-200'}"
				onclick={() => selectPart(part.partNumber)}
			>
				{part.titleLao}
			</button>
		{/each}
	</div>

	<!-- Main Exam Simulator Card -->
	{#if currentQuestion}
		<div class="bg-white rounded-2xl border border-orange-200/80 shadow-sm p-5 sm:p-7">
			<!-- Header of question: Part info & Question switcher -->
			<div
				class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100"
			>
				<div>
					<div class="flex items-center gap-2">
						<span class="text-xs px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 font-bold">
							{currentQuestion.partTitleCn}
						</span>
						<span class="text-xs font-semibold text-slate-500">
							ຂໍ້ທີ {activeQuestionIdx + 1} / {partQuestions.length}
						</span>
					</div>
					<div class="text-sm font-bold text-slate-800 mt-1">
						{currentQuestion.instructionLao}
					</div>
				</div>

				<!-- Question navigation buttons -->
				<div class="flex items-center gap-1.5 shrink-0">
					{#each partQuestions as q, idx (q.id)}
						<button
							type="button"
							class="w-8 h-8 rounded-lg text-xs font-bold transition-colors cursor-pointer {activeQuestionIdx ===
							idx
								? 'bg-red-700 text-white'
								: 'bg-slate-100 hover:bg-orange-100 text-slate-700'}"
							onclick={() => selectQuestion(idx)}
						>
							{idx + 1}
						</button>
					{/each}
				</div>
			</div>

			<!-- Question Prompt Box -->
			<div
				class="my-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50/60 border border-orange-200"
			>
				<div class="flex items-start justify-between gap-3">
					<div class="flex-1">
						<div class="text-xs font-bold text-red-800 mb-1">📢 ສຽງຄຳຖາມ / ຫົວຂໍ້ການສອບ:</div>
						<!-- Chinese Prompt -->
						<div class="text-xl sm:text-2xl font-bold text-slate-900 leading-relaxed">
							{currentQuestion.promptCn}
						</div>
						<!-- Pinyin -->
						<div class="text-sm text-blue-600 font-medium mt-1 leading-snug">
							{currentQuestion.promptPinyin}
						</div>
						<!-- Lao translation -->
						<div class="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
							{currentQuestion.promptLao}
						</div>
					</div>

					<!-- Play sound button -->
					<button
						type="button"
						class="p-2.5 rounded-xl bg-red-700 text-white hover:bg-red-800 transition-colors shadow-xs cursor-pointer shrink-0"
						title="ຟັງສຽງຄຳຖາມ"
						onclick={playPromptAudio}
					>
						🔊 ຟັງສຽງ
					</button>
				</div>
			</div>

			<!-- Live Countdown Timer & Voice Recorder Bar -->
			<div
				class="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col gap-4"
			>
				<div
					class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200/70 pb-3"
				>
					<div>
						<div class="text-xs font-bold text-slate-700">⏱️ ສະຖານະການສອບ:</div>
						<div class="text-sm font-semibold mt-0.5">
							{#if timerPhase === 'prep'}
								<span class="text-amber-600">⏳ ເວລາກຽມຕົວ: {prepRemaining} ວິນາທີ</span>
							{:else if timerPhase === 'answering'}
								<span class="text-red-600 animate-pulse"
									>🔴 ເວລາຕອບ/ອັດສຽງ: {answerRemaining} ວິນາທີ</span
								>
							{:else}
								<span class="text-slate-500">ກົດ "ເລີ່ມສອບຂໍ້ນີ້" ເພື່ອຈັບເວລາຕາມມາດຕະຖານ HSKK</span
								>
							{/if}
						</div>
					</div>

					<div class="flex items-center gap-2">
						{#if timerPhase === 'idle'}
							<button
								type="button"
								class="px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer shadow-sm"
								onclick={startExamTimer}
							>
								▶️ ເລີ່ມສອບຂໍ້ນີ້
							</button>
						{:else}
							<button
								type="button"
								class="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer shadow-sm"
								onclick={stopExamTimer}
							>
								⏹️ ຢຸດການສອບ
							</button>
						{/if}
					</div>
				</div>

				<!-- Spoken Audio Playback (User's answer) -->
				<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
					<div class="text-xs text-slate-600">
						🎙️ <b>ສຽງທີ່ເຈົ້າຕອບ:</b>
						{#if isRecording}
							<span class="text-red-600 font-bold ml-1 animate-pulse"
								>ກຳລັງອັດສຽງເວົ້າຂອງເຈົ້າ...</span
							>
						{:else if recordedAudioUrl}
							<span class="text-emerald-700 font-bold ml-1">ອັດສຽງແລ້ວ! ສາມາດກົດຟັງໄດ້ລຸ່ມນີ້</span>
						{:else}
							<span class="text-slate-400 ml-1">(ຍັງບໍ່ທັນມີສຽງອັດ)</span>
						{/if}
					</div>

					{#if recordedAudioUrl}
						<audio src={recordedAudioUrl} controls class="h-8 max-w-56"></audio>
					{/if}
				</div>
			</div>

			<!-- Model Answer & Scoring Tips Section -->
			<div class="mt-6 pt-5 border-t border-slate-100">
				<div class="flex items-center justify-between gap-2 mb-3">
					<button
						type="button"
						class="px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 {showModelAnswer
							? 'bg-amber-100 text-red-900 border-amber-300'
							: 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}"
						onclick={() => (showModelAnswer = !showModelAnswer)}
					>
						<span
							>{showModelAnswer ? '🙈 ເຊື່ອງແນວທາງຄຳຕອບ' : '💡 ເບິ່ງຄຳຕອບຕົວຢ່າງ (参考答案)'}</span
						>
					</button>

					{#if showModelAnswer}
						<button
							type="button"
							class="text-xs text-red-700 hover:underline cursor-pointer flex items-center gap-1"
							onclick={() => speakText(currentQuestion.modelAnswerCn)}
						>
							🔊 ຟັງສຽງຄຳຕອບຕົວຢ່າງ
						</button>
					{/if}
				</div>

				{#if showModelAnswer}
					<div
						class="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/90 text-sm space-y-3 animate-in fade-in duration-200"
					>
						<div>
							<div class="text-xs font-bold text-red-800 mb-1">
								📝 ຄຳຕອບຕົວຢ່າງມາດຕະຖານ (Chinese):
							</div>
							<div class="text-base sm:text-lg font-medium text-slate-900 leading-relaxed">
								{currentQuestion.modelAnswerCn}
							</div>
							<div class="text-xs sm:text-sm text-blue-600 font-medium mt-1">
								{currentQuestion.modelAnswerPinyin}
							</div>
						</div>

						<div class="pt-2 border-t border-amber-200/60">
							<div class="text-xs font-bold text-slate-700 mb-1">🇱🇦 ຄຳແປພາສາລາວ:</div>
							<div class="text-xs sm:text-sm text-slate-700 leading-relaxed">
								{currentQuestion.modelAnswerLao}
							</div>
						</div>

						<div class="pt-2 border-t border-amber-200/60">
							<div class="text-xs font-bold text-emerald-800 mb-0.5">
								🎯 ເທັກນິກການຕອບໃຫ້ໄດ້ຄະແນນດີ:
							</div>
							<div class="text-xs text-slate-600 leading-relaxed">
								{currentQuestion.tipsLao}
							</div>
						</div>
					</div>
				{/if}
			</div>

			<!-- Self Evaluation Checklist -->
			<div class="mt-6 pt-5 border-t border-slate-100">
				<div class="text-xs font-bold text-slate-600 mb-2">
					📋 ເກນການປະເມີນຕົນເອງຕາມມາດຕະຖານ HSKK:
				</div>
				<div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
					<div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
						<b>1. ການອອກສຽງ (Pronunciation):</b> ພະຍັນຊະນະ, ສະຫຼະ ແລະ ວັນນະຍຸດ 4 ສຽງຊັດເຈນ.
					</div>
					<div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
						<b>2. ຄວາມຄ່ອງແຄ້ວ (Fluency):</b> ເວົ້າຢ່າງຕໍ່ເນື່ອງ, ບໍ່ຕິດຂັດດົນເກີນໄປ.
					</div>
					<div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
						<b>3. ເນື້ອໃນ ແລະ ໄວຍາກອນ (Grammar):</b> ຕອບກົງປະເດັນ, ໃຊ້ໂຄງສ້າງປະໂຫຍກຖືກຕ້ອງ.
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
