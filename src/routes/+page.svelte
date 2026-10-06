<script lang="ts">
	import Fuse from 'fuse.js';
	import { onMount } from 'svelte';
	import type { VocabEntry } from '$lib/data/vocab';
	import StrokeOrderCard from '$lib/components/StrokeOrderCard.svelte';
	import StrokeOrderModal from '$lib/components/StrokeOrderModal.svelte';
	import ConversationView from '$lib/components/ConversationView.svelte';
	import StoryView from '$lib/components/StoryView.svelte';
	import HskkView from '$lib/components/HskkView.svelte';

	const { data } = $props<{ data: { initialVocab: VocabEntry[] } }>();

	type VocabItem = VocabEntry;

	const VIEWS = [
		{ id: 'table', icon: '📋', label: 'ຕາຕະລາງຄຳສັບ' },
		{ id: 'flash', icon: '🃏', label: 'ບັດຄຳສັບ' },
		{ id: 'quiz', icon: '✅', label: 'ແບບທົດສອບ' },
		{ id: 'conversation', icon: '💬', label: 'ບົດສົນທະນາ' },
		{ id: 'story', icon: '📖', label: 'ບົດເລື່ອງ' },
		{ id: 'hskk', icon: '🎙️', label: 'ສອບ HSKK' },
		{ id: 'stroke', icon: '✍️', label: 'ລຳດັບຂີດ' },
		{ id: 'az', icon: '🔤', label: 'ລຽງຕາມພິນອິນ' }
	] as const;
	type ViewId = (typeof VIEWS)[number]['id'];

	const LEVEL_NAMES = ['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6'];
	const LEVEL_COUNTS = [300, 200, 500, 1000, 1600, 1800];
	const TOTAL_COUNT = 5400;

	const LEVEL_HEADER_CLS =
		'px-4 py-2 rounded-full bg-white/15 text-white hover:bg-white/30 transition-colors text-sm whitespace-nowrap cursor-pointer';
	const LEVEL_DRAWER_CLS =
		'px-4 py-2 rounded-full bg-orange-100 text-red-800 hover:bg-amber-200 border border-orange-200 transition-colors text-sm whitespace-nowrap cursor-pointer';

	let view = $state<ViewId>('table');
	let drawerOpen = $state(false);
	let currentLevel = $state(1);
	let loadingLevel = $state(false);
	let query = $state('');
	let searchQuery = $state(''); // debounced – used for actual filtering

	// Level-based vocabulary cache: HSK 1 is preloaded via SSR/prerender for instant paint
	let extraLevels = $state<Record<number, VocabEntry[]>>({});

	async function selectLevel(level: number) {
		currentLevel = level;
		if (level === 1) return;
		if (!extraLevels[level]) {
			loadingLevel = true;
			try {
				const res = await fetch(`/data/hsk${level}.json`);
				if (res.ok) {
					extraLevels[level] = await res.json();
				}
			} catch (err) {
				console.error('Failed to load level', level, err);
			} finally {
				loadingLevel = false;
			}
		}
	}

	interface BeforeInstallPromptEvent extends Event {
		prompt: () => Promise<void>;
		userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
	}

	onMount(() => {
		// Gently prefetch only HSK 2 after 6s idle time; other levels load on-demand when clicked
		const prefetchTimer = setTimeout(async () => {
			if (!extraLevels[2]) {
				try {
					const res = await fetch('/data/hsk2.json');
					if (res.ok) extraLevels[2] = await res.json();
				} catch {
					/* ignore prefetch failure */
				}
			}
		}, 6000);

		// PWA install prompt listener
		const handleBeforeInstall = (e: Event) => {
			e.preventDefault();
			deferredPrompt = e as BeforeInstallPromptEvent;
			canInstallPWA = true;
		};
		const handleAppInstalled = () => {
			canInstallPWA = false;
			deferredPrompt = null;
		};

		if (typeof window !== 'undefined') {
			window.addEventListener('beforeinstallprompt', handleBeforeInstall);
			window.addEventListener('appinstalled', handleAppInstalled);
		}

		return () => {
			clearTimeout(prefetchTimer);
			if (typeof window !== 'undefined') {
				window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
				window.removeEventListener('appinstalled', handleAppInstalled);
			}
		};
	});

	// -------- PWA install prompt --------
	let deferredPrompt = $state<BeforeInstallPromptEvent | null>(null);
	let canInstallPWA = $state(false);

	async function installPWA() {
		if (!deferredPrompt) return;
		await deferredPrompt.prompt();
		const { outcome } = await deferredPrompt.userChoice;
		if (outcome === 'accepted') {
			canInstallPWA = false;
		}
		deferredPrompt = null;
	}

	const byLevel = $derived(
		currentLevel === 1 ? data.initialVocab : (extraLevels[currentLevel] ?? [])
	);

	// Debounce: wait 150 ms after last keystroke before searching
	$effect(() => {
		const q = query;
		const t = setTimeout(() => {
			searchQuery = q;
			const trimmed = q.trim();
			if (trimmed) {
				ensureIndex().then(() => runSearch(trimmed));
			} else {
				searchResults = null;
				searchTotal = 0;
				searchPending = false;
			}
		}, 150);
		return () => clearTimeout(t);
	});

	// -------- pinned search bar (table view) --------
	let headerEl: HTMLElement | null = $state(null);
	let searchBarEl: HTMLElement | null = $state(null);

	function applyLockOffsets() {
		if (typeof window === 'undefined') return;
		const h = headerEl?.offsetHeight ?? 0;
		const s = view === 'table' ? (searchBarEl?.offsetHeight ?? 0) : 0;
		document.documentElement.style.setProperty('--hdr-h', `${h}px`);
		document.documentElement.style.setProperty('--search-h', `${s}px`);
	}

	$effect(() => {
		void view;
		if (typeof window === 'undefined') return;
		const frame = requestAnimationFrame(() => applyLockOffsets());
		window.addEventListener('resize', applyLockOffsets);
		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener('resize', applyLockOffsets);
		};
	});

	$effect(() => {
		// Lock body scroll while the mobile drawer is open.
		if (typeof document !== 'undefined') {
			if (drawerOpen) document.body.classList.add('overflow-hidden');
			else document.body.classList.remove('overflow-hidden');
		}
	});

	function exParts(v: VocabItem): { icon: string; cn: string; th: string }[] {
		const out: { icon: string; cn: string; th: string }[] = [];
		for (const [icon, field] of [
			['💬', 'q'],
			['📝', 'a']
		] as const) {
			const e = v[field];
			if (e && typeof e === 'object') {
				if (e.cn || e.th) out.push({ icon, cn: e.cn || '', th: e.th || '' });
			} else if (typeof e === 'string' && e.trim()) {
				out.push({ icon, cn: e.trim(), th: '' });
			}
		}
		return out;
	}

	// Fuse.js fuzzy search
	const FUSE_OPTIONS = {
		keys: ['word', 'pinyin', 'thai', 'q', 'q.cn', 'q.th'],
		threshold: 0.4,
		includeScore: true
	};

	let allIndex = $state<unknown>(null);
	let allVocab = $state<VocabEntry[] | null>(null);
	let indexLoading = $state(false);
	let searchResults = $state<VocabItem[] | null>(null);
	let searchTotal = $state(0);
	let searchPending = $state(false);
	let queryId = 0;
	let worker: Worker | null = null;

	async function ensureIndex() {
		if (allIndex && allVocab) return;
		if (indexLoading) return;
		indexLoading = true;
		try {
			const [indexRes, vocabRes] = await Promise.all([
				allIndex ? Promise.resolve(null) : fetch('/vocab.index.json'),
				allVocab ? Promise.resolve(null) : fetch('/vocab.json')
			]);

			if (indexRes) allIndex = await indexRes.json();
			if (vocabRes) allVocab = await vocabRes.json();

			const w = getWorker();
			if (w && allVocab && allIndex) {
				w.postMessage({ type: 'init', vocab: allVocab, index: allIndex });
			}
		} catch (err) {
			console.error('Failed to load search data', err);
		} finally {
			indexLoading = false;
		}
	}

	function getWorker(): Worker | null {
		if (worker) return worker;
		if (typeof Worker === 'undefined') return null;
		worker = new Worker(new URL('$lib/search-worker.ts', import.meta.url), { type: 'module' });
		worker.onmessage = (e: MessageEvent) => {
			const { id, items, total } = e.data as {
				id: number;
				items: VocabItem[];
				total: number;
			};
			if (id !== queryId) return;
			searchResults = items;
			searchTotal = total;
			searchPending = false;
		};
		return worker;
	}

	function runSearch(q: string) {
		const id = ++queryId;
		searchResults = null;
		searchTotal = 0;
		searchPending = true;
		const w = getWorker();
		if (w && allIndex) {
			w.postMessage({ type: 'search', id, q, limit: MAX_ROWS });
			return;
		}
		if (allIndex && allVocab) {
			const fuse = new Fuse<VocabEntry>(allVocab, FUSE_OPTIONS, Fuse.parseIndex(allIndex as never));
			const res = fuse.search(q);
			searchResults = res.slice(0, MAX_ROWS).map((r) => r.item);
			searchTotal = res.length;
			searchPending = false;
		}
	}

	const MAX_ROWS = 300;
	const tableRows = $derived.by(() => {
		const q = searchQuery.trim();
		if (!q) return byLevel.slice(0, MAX_ROWS);
		return searchResults ?? [];
	});

	const totalMatches = $derived.by(() => {
		const q = searchQuery.trim();
		if (!q) return byLevel.length;
		return searchTotal;
	});

	// ---------- flashcards ----------
	let flashOrder = $state<VocabItem[]>([]);
	let flashIdx = $state(0);
	let flipped = $state(false);

	$effect(() => {
		flashOrder = [...byLevel];
		flashIdx = 0;
		flipped = false;
		quizRunning = false;
	});

	const flashCard = $derived(flashOrder[flashIdx]);
	const flashExamples = $derived(flashCard ? exParts(flashCard) : []);

	function flashPrev() {
		if (flashOrder.length === 0) return;
		flashIdx = (flashIdx - 1 + flashOrder.length) % flashOrder.length;
		flipped = false;
	}
	function flashNext() {
		if (flashOrder.length === 0) return;
		flashIdx = (flashIdx + 1) % flashOrder.length;
		flipped = false;
	}
	function flashShuffle() {
		if (flashOrder.length === 0) return;
		const arr = [...flashOrder];
		for (let i = arr.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			const t = arr[i];
			arr[i] = arr[j];
			arr[j] = t;
		}
		flashOrder = arr;
		flashIdx = 0;
		flipped = false;
	}

	// ---------- quiz ----------
	type QuizQ = { correct: VocabItem; options: VocabItem[] };
	let quizN = $state(10);
	let quizRunning = $state(false);
	let questions = $state<QuizQ[]>([]);
	let qi = $state(0);
	let score = $state(0);
	let answered = $state(false);
	let lastPick = $state<VocabItem | null>(null);

	const quizQ = $derived(questions[qi]);
	const isLast = $derived(answered && qi === questions.length - 1);

	function pickDistractors(correct: VocabItem, pool: VocabItem[]): VocabItem[] {
		const opts = [correct];
		let guard = 0;
		while (opts.length < Math.min(4, pool.length) && guard++ < 500) {
			const cand = pool[Math.floor(Math.random() * pool.length)];
			if (cand && cand.no !== correct.no && !opts.includes(cand)) opts.push(cand);
		}
		for (let i = opts.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			const t = opts[i];
			opts[i] = opts[j];
			opts[j] = t;
		}
		return opts;
	}

	function startQuiz() {
		const pool = [...byLevel];
		for (let i = pool.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			const t = pool[i];
			pool[i] = pool[j];
			pool[j] = t;
		}
		const qs: QuizQ[] = [];
		for (let k = 0; k < Math.min(quizN, pool.length); k++) {
			qs.push({ correct: pool[k], options: pickDistractors(pool[k], pool) });
		}
		questions = qs;
		qi = 0;
		score = 0;
		answered = false;
		lastPick = null;
		quizRunning = true;
	}

	function answer(correct: VocabItem, options: VocabItem[], pick: VocabItem) {
		if (answered) return;
		answered = true;
		lastPick = pick;
		if (pick.no === correct.no) score++;
	}

	function optClass(o: VocabItem): string {
		const base =
			'text-left px-4 py-3 rounded-xl border-2 border-orange-200 bg-white hover:border-red-700 transition-colors cursor-pointer';
		if (!answered || !quizQ) return base;
		if (o.no === quizQ.correct.no) return base + ' correct';
		if (o === lastPick) return base + ' wrong';
		return base;
	}

	const finalMsg = $derived(
		score === questions.length
			? '🏆 ຍອດຢ້ຽມຫຼາຍ! ຜ່ານທັງໝົດເລີຍ'
			: score >= questions.length * 0.7
				? '👍 ເກັ່ງຫຼາຍ ລອງອີກຄັ້ງເພື່ອຄະແນນເຕັມ!'
				: '💪 ຝຶກອີກໜ້ອຍໜຶ່ງເດີ ກັບໄປເບິ່ງບັດຄຳສັບກ່ອນໄດ້!'
	);

	function nextQuestion() {
		qi++;
		answered = false;
		lastPick = null;
	}

	// ---------- A-Z ----------
	const azGroups = $derived.by(() => {
		const groups: Record<string, VocabItem[]> = {};
		for (const v of byLevel) {
			let ch = v.pinyin.charAt(0).toLowerCase();
			if (!/^[a-z]$/.test(ch)) ch = '#';
			(groups[ch] ??= []).push(v);
		}
		return Object.keys(groups)
			.sort()
			.map((letter) => ({ letter, items: groups[letter] }));
	});

	// ---------- speech + keyboard ----------
	function speak(text: string) {
		if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
		window.speechSynthesis.cancel();
		const u = new SpeechSynthesisUtterance(text);
		u.lang = 'zh-CN';
		u.rate = 0.85;
		window.speechSynthesis.speak(u);
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			drawerOpen = false;
			return;
		}
		if (view !== 'flash' || flashOrder.length === 0) return;
		if (e.key === 'ArrowRight') flashNext();
		if (e.key === 'ArrowLeft') flashPrev();
		if (e.key === ' ') {
			e.preventDefault();
			flipped = !flipped;
		}
	}

	// ---------- stroke order state ----------
	let modalVocab = $state<VocabEntry | null>(null);
	let strokeModalOpen = $state(false);

	function openStrokeModal(v: VocabEntry) {
		modalVocab = v;
		strokeModalOpen = true;
	}

	function closeStrokeModal() {
		strokeModalOpen = false;
	}

	let strokeWord = $state('结婚');
	let strokeInput = $state('结婚');
	let selectedStrokeItem = $state<VocabItem | null>(null);

	function updateStrokeWord(val: string) {
		const trimmed = val.trim();
		if (!trimmed) return;
		strokeWord = trimmed;
		const match =
			byLevel.find((v: VocabItem) => v.word === trimmed) ||
			(allVocab?.find((v: VocabItem) => v.word === trimmed) ?? null);
		selectedStrokeItem = match;
	}

	function selectStrokeItem(item: VocabItem) {
		selectedStrokeItem = item;
		strokeWord = item.word;
		strokeInput = item.word;
	}

	const quickStrokeSuggestions = $derived(byLevel.slice(0, 18));
</script>

<svelte:head>
	<title>ຄຳສັບພາສາຈີນ HSK 1-6 (汉语词汇 HSK 新3.0)</title>
	<meta
		name="description"
		content="ລວມຄຳສັບພາສາຈີນ HSK 1-6 ຄົບ 5,400 ຄຳ ພ້ອມພິນອິນ ຄຳແປ ຕົວຢ່າງປະໂຫຍກ ບັດຄຳສັບ ແລະ ແບບທົດສອບ"
	/>
</svelte:head>

<svelte:window onkeydown={onKeydown} />

<header
	bind:this={headerEl}
	class="sticky top-0 z-30 bg-gradient-to-br from-red-700 to-red-800 text-white px-4 pt-4 pb-0 text-center shadow-lg"
>
	<div class="flex items-center justify-between gap-2 max-w-5xl mx-auto">
		<button
			aria-label="ເປີດເມນູ"
			class="md:hidden shrink-0 w-10 h-10 rounded-xl bg-white/15 hover:bg-white/30 text-xl leading-none transition-colors cursor-pointer"
			onclick={() => (drawerOpen = true)}>☰</button
		>
		<div class="flex-1 min-w-0">
			<div class="flex items-center justify-center gap-2">
				<h1 class="text-lg sm:text-2xl font-bold tracking-wide">📖 ຄຳສັບພາສາຈີນ HSK 1-6</h1>
				{#if canInstallPWA}
					<button
						class="hidden sm:inline-flex px-2.5 py-1 rounded-full bg-amber-400 hover:bg-amber-300 text-red-950 font-bold text-xs shadow-sm transition-all items-center gap-1 cursor-pointer"
						onclick={installPWA}
					>
						📲 ຕິດຕັ້ງແອັບ
					</button>
				{/if}
			</div>
			<div class="text-xs sm:text-sm opacity-85 mt-0.5">
				<span class="mr-2">汉语词汇 HSK 新3.0 1-6</span>ບັດຄຳສັບ · ແບບທົດສອບ · ຄົ້ນຫາ
			</div>
		</div>
		{#if canInstallPWA}
			<button
				aria-label="ຕິດຕັ້ງແອັບ"
				class="md:hidden shrink-0 px-2.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-red-950 font-bold text-xs shadow-sm transition-all flex items-center gap-1 cursor-pointer"
				onclick={installPWA}
			>
				📲 ຕິດຕັ້ງ
			</button>
		{:else}
			<span class="md:hidden shrink-0 w-10"></span>
		{/if}
	</div>
	<nav class="tabs hidden md:flex flex-wrap justify-center gap-1 mt-4">
		{#each VIEWS as v (v.id)}
			<button
				class="px-3 sm:px-5 py-2.5 text-sm rounded-t-lg bg-white/15 text-white hover:bg-white/30 transition-colors cursor-pointer {view ===
				v.id
					? 'active'
					: ''}"
				onclick={() => (view = v.id)}>{v.icon} {v.label}</button
			>
		{/each}
	</nav>
	<div
		id="level-nav"
		class="level-nav hidden md:flex flex-wrap justify-center gap-2 mt-4 pb-5 px-1"
	>
		{#each LEVEL_NAMES as name, i (i)}
			<button
				class="{LEVEL_HEADER_CLS} {currentLevel === i + 1 ? 'selected' : ''}"
				onclick={() => selectLevel(i + 1)}
				>{name} <span class="opacity-80 text-xs">({LEVEL_COUNTS[i]} ຄຳ)</span></button
			>
		{/each}
	</div>
</header>

<!-- ============ MOBILE LEFT DRAWER ============ -->
<button
	type="button"
	aria-label="ປິດເມນູ"
	class="block fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden {drawerOpen
		? 'opacity-100 pointer-events-auto'
		: 'opacity-0 pointer-events-none'}"
	onclick={() => (drawerOpen = false)}
></button>
<aside
	aria-label="ເມນູຫຼັກ"
	class="fixed inset-y-0 left-0 z-50 flex flex-col w-72 max-w-[85%] bg-white shadow-2xl transition-transform duration-300 md:hidden {drawerOpen
		? 'translate-x-0'
		: '-translate-x-full'}"
>
	<div class="flex items-center justify-between px-4 py-4 bg-red-700 text-white">
		<div class="font-bold text-lg">📖 ເມນູ</div>
		<button
			aria-label="ປິດເມນູ"
			class="w-9 h-9 rounded-lg bg-white/15 hover:bg-white/30 transition-colors cursor-pointer"
			onclick={() => (drawerOpen = false)}>✕</button
		>
	</div>
	<div class="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
		{#if canInstallPWA}
			<div class="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col gap-2">
				<div class="text-xs text-amber-900 font-medium">
					📲 ຕິດຕັ້ງແອັບລົງໜ້າຈໍຫຼັກ (PWA) ເພື່ອໃຊ້ງານແບບ Offline ໄດ້ສະດວກ
				</div>
				<button
					class="w-full py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs transition-colors cursor-pointer text-center"
					onclick={installPWA}
				>
					ຕິດຕັ້ງແອັບດຽວນີ້
				</button>
			</div>
		{/if}
		<div>
			<div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">ໂໝດ</div>
			<nav id="drawer-nav" class="flex flex-col gap-1.5">
				{#each VIEWS as v (v.id)}
					<button
						class="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-slate-700 hover:bg-orange-100 font-medium transition-colors cursor-pointer {view ===
						v.id
							? 'active'
							: ''}"
						onclick={() => {
							view = v.id;
							drawerOpen = false;
						}}>{v.icon} {v.label}</button
					>
				{/each}
			</nav>
		</div>
		<div>
			<div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">ລະດັບ HSK</div>
			<div id="level-nav-drawer" class="flex flex-wrap gap-2">
				{#each LEVEL_NAMES as name, i (i)}
					<button
						class="{LEVEL_DRAWER_CLS} {currentLevel === i + 1 ? 'selected' : ''}"
						onclick={() => {
							selectLevel(i + 1);
							drawerOpen = false;
						}}>{name} <span class="opacity-80 text-xs">({LEVEL_COUNTS[i]} ຄຳ)</span></button
					>
				{/each}
			</div>
		</div>
	</div>
	<div class="p-4 text-xs text-slate-400 border-t border-orange-100">
		ຄຳສັບພາສາຈີນ HSK 新3.0 1–6 · ທັງໝົດ {TOTAL_COUNT.toLocaleString()} ຄຳ
	</div>
</aside>

<main class="max-w-5xl mx-auto px-4 py-6 pb-16">
	{#if loadingLevel}
		<div class="flex items-center justify-center py-12 text-slate-500 gap-3">
			<span
				class="inline-block w-6 h-6 border-3 border-red-700 border-t-transparent rounded-full animate-spin"
			></span>
			<span class="text-base font-medium">ກຳລັງໂຫຼດຂໍ້ມູນ HSK {currentLevel}...</span>
		</div>
	{:else if view === 'table'}
		<!-- ================= TABLE ================= -->
		<section id="view-table" class="view active">
			<div
				bind:this={searchBarEl}
				class="sticky z-20 -mx-4 bg-orange-50 px-4 pt-3 pb-2 shadow-[0_2px_6px_-4px_rgba(0,0,0,0.3)]"
				style="top: var(--hdr-h, 0px)"
			>
				<input
					type="text"
					placeholder="ຄົ້ນຫາ: ຄຳສັບຈີນ / ພິນອິນ / ຄວາມໝາຍ ເຊັ່ນ 爱, ài, ຮັກ"
					class="w-full px-4 py-2.5 rounded-lg border-2 border-orange-200 bg-white text-base focus:border-red-700 focus:outline-none"
					bind:value={query}
				/>
				<div class="result-count text-sm text-slate-500 mt-1.5">
					{#if searchQuery.trim() && (indexLoading || searchPending)}
						ກຳລັງຄົ້ນຫາ…
					{:else if totalMatches > MAX_ROWS}
						ພົບ {totalMatches.toLocaleString()} ຄຳ · ສະແດງ {MAX_ROWS} ລາຍການທຳອິດ
					{:else}
						ພົບ {totalMatches.toLocaleString()} ຄຳ
					{/if}
				</div>
			</div>
			<div class="rounded-2xl shadow-sm border border-orange-200/80 bg-white overflow-hidden mt-3">
				<div class="overflow-x-auto">
					<table class="w-full text-sm">
						<thead class="hidden sm:table-header-group">
							<tr class="bg-red-700 text-white">
								<th class="text-left px-3.5 py-3 whitespace-nowrap font-semibold">#</th>
								<th class="text-left px-3.5 py-3 whitespace-nowrap font-semibold">ຄຳສັບ</th>
								<th class="text-left px-3.5 py-3 whitespace-nowrap font-semibold">ພິນອິນ</th>
								<th class="text-left px-3.5 py-3 whitespace-nowrap font-semibold">ຄວາມໝາຍ</th>
								<th
									class="hidden lg:table-cell text-left px-3.5 py-3 whitespace-nowrap font-semibold"
									>ຕົວຢ່າງປະໂຫຍກ</th
								>
							</tr>
						</thead>
						<tbody>
							{#each tableRows as v (v.level + '-' + v.no + '-' + v.word)}
								<!-- ================= MOBILE PHONE VIEW (< sm) ================= -->
								<tr class="sm:hidden border-b border-orange-100 hover:bg-orange-50/50">
									<td colspan="5" class="p-3">
										<!-- Top row: Word, Pinyin, HSK badge, and Actions -->
										<div class="flex items-center justify-between gap-2">
											<div class="flex items-baseline gap-2 flex-wrap">
												<span class="text-xl font-bold text-slate-900">{v.word}</span>
												<span class="text-sm font-semibold text-blue-600">{v.pinyin}</span>
												<span
													class="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-100 text-red-700 font-semibold"
												>
													HSK {v.level}
												</span>
											</div>
											<div class="flex items-center gap-1 shrink-0">
												<button
													type="button"
													class="px-2 py-1 rounded-lg bg-orange-100 hover:bg-amber-300 text-xs text-slate-800 transition-colors cursor-pointer"
													title="ອອກສຽງ"
													onclick={() => speak(v.word)}>🔊</button
												>
												<button
													type="button"
													class="px-2 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-medium transition-colors cursor-pointer"
													title="ເບິ່ງລຳດັບຂີດ"
													onclick={() => openStrokeModal(v)}>✍️ ຂີດ</button
												>
											</div>
										</div>

										<!-- Middle row: Meaning (ຄວາມໝາຍ) -->
										<div class="mt-1.5 text-sm font-medium text-slate-800 leading-snug">
											{v.thai}
										</div>

										<!-- Bottom row: Example sentences (ຕົວຢ່າງປະໂຫຍກ) full width underneath -->
										{#if exParts(v).length > 0}
											<div class="mt-2 space-y-1.5">
												{#each exParts(v) as e (e.cn)}
													<div
														class="rounded-xl bg-orange-50/90 border border-orange-200/70 p-2.5 text-xs shadow-2xs flex items-start justify-between gap-2"
													>
														<div class="flex-1 leading-relaxed">
															<span class="font-bold text-slate-900">{e.icon} {e.cn}</span>
															{#if e.th}
																<div class="text-slate-600 mt-0.5 pl-4 text-[11px] leading-relaxed">
																	{e.th}
																</div>
															{/if}
														</div>
														<button
															type="button"
															class="px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-slate-700 text-xs shrink-0 transition-colors cursor-pointer"
															title="ອອກສຽງປະໂຫຍກ"
															onclick={() => speak(e.cn)}>🔊</button
														>
													</div>
												{/each}
											</div>
										{/if}
									</td>
								</tr>

								<!-- ================= TABLET & DESKTOP VIEW (>= sm) ================= -->
								<tr class="hidden sm:table-row hover:bg-orange-100/60">
									<td
										class="px-3 py-2.5 border-b border-orange-100 align-top text-slate-400 whitespace-nowrap text-xs"
										>{v.no}</td
									>
									<td
										class="px-3 py-2.5 border-b border-orange-100 align-top text-lg whitespace-nowrap font-medium"
										>{v.word}
										<span
											class="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-orange-100 text-red-700 align-middle whitespace-nowrap"
											>HSK {v.level}</span
										>
										<button
											class="speak ml-1 px-1.5 py-0.5 rounded bg-orange-100 hover:bg-amber-300 text-xs align-middle cursor-pointer"
											title="ອອກສຽງ"
											onclick={() => speak(v.word)}>🔊</button
										>
										<button
											class="stroke-btn ml-1 px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs align-middle cursor-pointer"
											title="ເບິ່ງລຳດັບຂີດ (Stroke Order)"
											onclick={() => openStrokeModal(v)}>✍️</button
										></td
									>
									<td
										class="px-3 py-2.5 border-b border-orange-100 align-top text-slate-500 whitespace-nowrap text-sm"
										>{v.pinyin}</td
									>
									<td
										class="px-3 py-2.5 border-b border-orange-100 align-top font-medium text-slate-800"
										>{v.thai}</td
									>
									<td class="hidden lg:table-cell px-3 py-2.5 border-b border-orange-100 align-top">
										{#each exParts(v) as e (e.cn)}
											<div class="text-xs text-slate-600 mt-1 first:mt-0 flex items-start gap-1.5">
												<span class="shrink-0">{e.icon}</span>
												<div class="flex-1 leading-snug">
													<span class="font-medium text-slate-800">{e.cn}</span>
													{#if e.th}
														<span class="text-slate-500 ml-1">({e.th})</span>
													{/if}
												</div>
												<button
													type="button"
													class="px-1 py-0.5 rounded hover:bg-orange-100 text-[11px] text-slate-400 hover:text-red-700 cursor-pointer shrink-0"
													title="ອອກສຽງປະໂຫຍກ"
													onclick={() => speak(e.cn)}>🔊</button
												>
											</div>
										{/each}
									</td>
								</tr>

								<!-- Tablet sub-row for example sentences (< lg) -->
								{#if exParts(v).length > 0}
									<tr class="hidden sm:table-row lg:hidden bg-orange-50/40">
										<td colspan="4" class="px-3 py-1.5 pb-2.5 border-b border-orange-100">
											{#each exParts(v) as e (e.cn)}
												<div
													class="rounded-lg bg-orange-50/90 border border-orange-200/70 p-2 text-xs flex items-center justify-between gap-2"
												>
													<div class="flex items-center gap-1.5 flex-wrap">
														<span class="shrink-0">{e.icon}</span>
														<span class="font-bold text-slate-900">{e.cn}</span>
														{#if e.th}
															<span class="text-slate-600">({e.th})</span>
														{/if}
													</div>
													<button
														type="button"
														class="px-1.5 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-slate-700 text-[11px] shrink-0 cursor-pointer"
														title="ອອກສຽງປະໂຫຍກ"
														onclick={() => speak(e.cn)}>🔊</button
													>
												</div>
											{/each}
										</td>
									</tr>
								{/if}
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</section>
	{:else if view === 'flash'}
		<!-- ================= FLASHCARDS ================= -->
		<section id="view-flash" class="view active">
			{#if flashOrder.length > 0}
				<div class="flex flex-col items-center">
					<div
						class="card3d w-full max-w-md h-64 sm:h-72 cursor-pointer"
						class:flipped
						role="button"
						tabindex="0"
						aria-label="ພິກບັດຄຳ"
						onclick={() => (flipped = !flipped)}
						onkeydown={(e) => {
							if (e.key === ' ' || e.key === 'Enter') {
								e.preventDefault();
								e.stopPropagation();
								flipped = !flipped;
							}
						}}
					>
						<div class="card-inner">
							<div
								class="card-face rounded-2xl flex flex-col items-center justify-center p-6 text-center shadow-xl bg-white border-2 border-amber-400"
							>
								<div class="text-5xl font-bold text-red-700">{flashCard?.word ?? ''}</div>
								<div class="mt-4 text-sm text-slate-400">👆 ແຕະເພື່ອເບິ່ງຄຳຕອບ</div>
							</div>
							<div
								class="card-face card-back rounded-2xl flex flex-col items-center justify-center p-6 text-center shadow-xl bg-gradient-to-br from-red-700 to-red-800 text-white"
							>
								<div class="text-4xl font-bold">{flashCard?.word ?? ''}</div>
								<div class="mt-1 text-2xl text-amber-400">{flashCard?.pinyin ?? ''}</div>
								<div class="mt-2 text-xl">{flashCard?.thai ?? ''}</div>
								{#if flashExamples.length > 0}
									<div class="mt-4 text-sm leading-relaxed opacity-95 space-y-1">
										{#each flashExamples as e (e.cn)}
											<div>{e.icon} {e.cn} = {e.th}</div>
										{/each}
									</div>
								{/if}
								<button
									type="button"
									class="mt-3 text-xs text-amber-200 underline hover:text-white cursor-pointer"
									onclick={(e) => {
										e.stopPropagation();
										if (flashCard) openStrokeModal(flashCard);
									}}>✍️ ເບິ່ງວິທີຂຽນລຳດັບຂີດ</button
								>
							</div>
						</div>
					</div>
					<div class="flex flex-wrap justify-center gap-3 mt-5">
						<button
							class="px-4 py-2.5 rounded-lg bg-white text-red-700 border-2 border-red-700 hover:bg-red-50 transition-colors cursor-pointer"
							onclick={flashPrev}>⬅ ກ່ອນໜ້າ</button
						>
						<button
							class="px-4 py-2.5 rounded-lg bg-red-700 text-white hover:brightness-110 transition-colors cursor-pointer"
							onclick={flashShuffle}>🔀 ສຸ່ມ</button
						>
						<button
							class="px-4 py-2.5 rounded-lg bg-red-700 text-white hover:brightness-110 transition-colors cursor-pointer"
							onclick={() => flashCard && speak(flashCard.word)}>🔊 ອ່ານອອກສຽງ</button
						>
						<button
							class="px-4 py-2.5 rounded-lg bg-blue-50 text-blue-700 border-2 border-blue-600 hover:bg-blue-100 transition-colors cursor-pointer"
							onclick={() => flashCard && openStrokeModal(flashCard)}>✍️ ເບິ່ງລຳດັບຂີດ</button
						>
						<button
							class="px-4 py-2.5 rounded-lg bg-white text-red-700 border-2 border-red-700 hover:bg-red-50 transition-colors cursor-pointer"
							onclick={flashNext}>ຖັດໄປ ➡</button
						>
					</div>
					<div class="flash-progress mt-3 text-sm text-slate-500">
						ບັດທີ {flashIdx + 1} / {flashOrder.length}
					</div>
				</div>
			{/if}
		</section>
	{:else if view === 'quiz'}
		<!-- ================= QUIZ ================= -->
		<section id="view-quiz" class="view active">
			<div class="quiz-box max-w-xl mx-auto bg-white rounded-2xl shadow-md p-5 sm:p-8">
				{#if !quizRunning}
					<div id="quiz-setup" class="text-center">
						<h2 class="text-2xl font-bold text-red-700">🎯 ແບບທົດສອບຄຳສັບ HSK {currentLevel}</h2>
						<p class="mt-2 text-sm text-slate-500">ເບິ່ງຄວາມໝາຍ ແລ້ວເລືອກຄຳສັບຈີນທີ່ຖືກຕ້ອງ</p>
						<div class="qcount flex flex-wrap justify-center gap-2 mt-4">
							{#each [10, 20, 50] as n (n)}
								<button
									class="px-4 py-2 rounded-lg border-2 border-orange-200 bg-white text-sm hover:border-red-700 transition-colors cursor-pointer {quizN ===
									n
										? 'selected'
										: ''}"
									onclick={() => (quizN = n)}>{n} ຂໍ້</button
								>
							{/each}
						</div>
						<button
							class="mt-6 px-8 py-3 rounded-xl bg-red-700 text-white text-lg font-semibold hover:brightness-110 transition-colors cursor-pointer"
							onclick={startQuiz}>ເລີ່ມເຮັດແບບທົດສອບ</button
						>
					</div>
				{:else}
					<div id="quiz-run">
						<div class="quiz-progress text-sm text-slate-500 mb-3">
							ຂໍ້ {qi + 1} / {questions.length} · ຄະແນນ {score}
						</div>
						<div class="quiz-q text-xl font-medium mb-1">
							ຄຳແປ: <b>{quizQ?.correct.thai}</b>
							<div class="text-sm text-slate-500">({quizQ?.correct.pinyin})</div>
						</div>
						<div class="quiz-options flex flex-col gap-2.5 mt-5" id="quiz-options">
							{#each quizQ?.options ?? [] as o, i (o.no + '-' + i)}
								<button
									class={optClass(o)}
									disabled={answered}
									onclick={() => quizQ && answer(quizQ.correct, quizQ.options, o)}
									>{o.word} ({o.pinyin})</button
								>
							{/each}
						</div>
						{#if answered}
							<div class="quiz-result mt-5 p-4 rounded-xl bg-orange-100 text-center">
								<div class="big text-2xl font-bold text-red-700">
									{#if isLast}
										ຈົບແລ້ວ! ໄດ້ {score} / {questions.length} ຄະແນນ
									{:else}
										{lastPick?.no === quizQ?.correct.no ? '✓ ຖືກຕ້ອງ!' : '✗ ຜິດ'}
									{/if}
								</div>
								<div class="text-sm text-slate-600 mt-1">
									{#if isLast}
										{finalMsg}
									{:else}
										ຄຳຕອບທີ່ຖືກ: {quizQ?.correct.word} ({quizQ?.correct.pinyin}) = {quizQ?.correct
											.thai}
										{#if quizQ && exParts(quizQ.correct).length > 0}
											<div class="mt-2.5 max-w-sm mx-auto text-left space-y-1">
												{#each exParts(quizQ.correct) as e (e.cn)}
													<div
														class="bg-white/80 rounded-lg p-2 text-xs text-slate-700 border border-orange-200/60 flex items-center justify-between gap-1"
													>
														<div>
															<span>{e.icon}</span> <b>{e.cn}</b>
															{#if e.th}<span class="text-slate-500 ml-1">({e.th})</span>{/if}
														</div>
														<button
															type="button"
															class="text-xs text-slate-400 hover:text-red-700 cursor-pointer"
															onclick={() => speak(e.cn)}>🔊</button
														>
													</div>
												{/each}
											</div>
										{/if}
									{/if}
								</div>
							</div>
						{/if}
						{#if answered && !isLast}
							<button
								class="quiz-next block mx-auto mt-5 px-6 py-2.5 rounded-lg bg-red-700 text-white hover:brightness-110 transition-colors cursor-pointer"
								onclick={nextQuestion}>ຂໍ້ຖັດໄປ ➡</button
							>
						{/if}
						{#if isLast}
							<button
								class="quiz-restart block mx-auto mt-5 px-6 py-2.5 rounded-lg bg-red-700 text-white hover:brightness-110 transition-colors cursor-pointer"
								onclick={() => (quizRunning = false)}>🔄 ເຮັດໃໝ່</button
							>
						{/if}
					</div>
				{/if}
			</div>
		</section>
	{:else if view === 'stroke'}
		<!-- ================= STROKE ORDER ================= -->
		<section id="view-stroke" class="view active">
			<div class="max-w-2xl mx-auto flex flex-col gap-6">
				<!-- Search / Custom Word Input -->
				<div class="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200">
					<label for="stroke-search" class="block text-sm font-semibold text-slate-700 mb-1.5">
						🔍 ພິມ ຫຼື ຄົ້ນຫາຕົວອັກສອນຈີນເພື່ອເບິ່ງລຳດັບຂີດ:
					</label>
					<div class="flex gap-2">
						<input
							id="stroke-search"
							type="text"
							placeholder="ພິມຄຳສັບຈີນ ເຊັ່ນ 结婚, 爱, 学习, 你好..."
							class="flex-1 px-4 py-2.5 rounded-xl border-2 border-orange-200 bg-white text-base focus:border-red-700 focus:outline-none"
							bind:value={strokeInput}
							onkeydown={(e) => e.key === 'Enter' && updateStrokeWord(strokeInput)}
						/>
						<button
							class="px-5 py-2.5 rounded-xl bg-red-700 text-white font-medium hover:brightness-110 transition-colors cursor-pointer"
							onclick={() => updateStrokeWord(strokeInput)}
						>
							ເບິ່ງຂີດ
						</button>
					</div>

					<!-- Popular / Quick chips for current level -->
					<div class="mt-3.5">
						<div class="text-xs text-slate-400 mb-1.5">ຄຳສັບແນະນຳໃນ HSK {currentLevel}:</div>
						<div class="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
							{#each quickStrokeSuggestions as item (item.word)}
								<button
									class="px-2.5 py-1 rounded-lg text-xs border border-orange-100 bg-orange-50/70 hover:bg-amber-100 text-slate-700 hover:text-red-800 transition-colors cursor-pointer {selectedStrokeItem?.word ===
									item.word
										? 'bg-amber-200 border-amber-300 font-bold text-red-900'
										: ''}"
									onclick={() => selectStrokeItem(item)}
								>
									{item.word} <span class="opacity-70 text-[10px]">{item.pinyin}</span>
								</button>
							{/each}
						</div>
					</div>
				</div>

				<!-- Stroke Order Card (Matches user screenshot) -->
				<StrokeOrderCard
					word={selectedStrokeItem ? selectedStrokeItem.word : strokeWord}
					pinyin={selectedStrokeItem?.pinyin}
					thai={selectedStrokeItem?.thai}
					level={selectedStrokeItem?.level ?? currentLevel}
					examples={selectedStrokeItem ? exParts(selectedStrokeItem) : []}
					autoPlay={true}
				/>
			</div>
		</section>
	{:else if view === 'conversation'}
		<!-- ================= CONVERSATION ================= -->
		<section id="view-conversation" class="view active">
			<ConversationView />
		</section>
	{:else if view === 'story'}
		<!-- ================= STORY ================= -->
		<section id="view-story" class="view active">
			<StoryView />
		</section>
	{:else if view === 'hskk'}
		<!-- ================= HSKK SPEAKING EXAM ================= -->
		<section id="view-hskk" class="view active">
			<HskkView />
		</section>
	{:else if view === 'az'}
		<!-- ================= A-Z ================= -->
		<section id="view-az" class="view active">
			<div class="letter-nav flex flex-wrap gap-1.5 mb-5">
				{#each azGroups as g (g.letter)}
					<a
						href="#letter-{g.letter}"
						class="min-w-8 text-center px-2 py-1.5 rounded-lg bg-white border-2 border-orange-200 font-semibold hover:border-red-700 hover:text-red-700 transition-colors"
						>{g.letter.toUpperCase()}</a
					>
				{/each}
			</div>
			{#each azGroups as g (g.letter)}
				<div class="letter-section mb-6" id="letter-{g.letter}">
					<h2 class="inline-block px-3.5 py-1 rounded-lg bg-red-700 text-white font-semibold mb-2">
						{g.letter.toUpperCase()} ({g.items.length} ຄຳ)
					</h2>
					<ul>
						{#each g.items as v (v.level + '-' + v.no + '-' + v.word)}
							<li
								class="flex flex-col sm:flex-row sm:items-baseline sm:gap-3 gap-1 px-3 py-2 bg-white rounded-lg mb-1 border-b border-orange-100"
							>
								<div class="flex items-center gap-1.5 min-w-24">
									<span class="text-lg font-medium">{v.word}</span>
									<button
										class="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs cursor-pointer"
										title="ເບິ່ງລຳດັບຂີດ"
										onclick={() => openStrokeModal(v)}>✍️</button
									>
								</div>
								<span class="text-slate-500 min-w-24 text-sm">{v.pinyin}</span>
								<div class="flex-1">
									<span class="text-slate-700 font-medium">{v.thai}</span>
									{#if exParts(v).length > 0}
										<div class="mt-1 flex flex-wrap gap-1.5">
											{#each exParts(v) as e (e.cn)}
												<div
													class="text-xs text-slate-600 bg-orange-50/80 rounded px-2 py-0.5 border border-orange-100 inline-flex items-center gap-1"
												>
													<span>{e.icon} <b>{e.cn}</b></span>
													{#if e.th}<span class="text-slate-400">({e.th})</span>{/if}
													<button
														type="button"
														class="text-[11px] text-slate-400 hover:text-red-700 cursor-pointer"
														title="ອອກສຽງ"
														onclick={() => speak(e.cn)}>🔊</button
													>
												</div>
											{/each}
										</div>
									{/if}
								</div>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</section>
	{/if}
</main>

<footer class="text-center text-slate-400 text-sm py-5">
	ຂໍ້ມູນຈາກ Google Sheets · ຄຳສັບພາສາຈີນ HSK 新3.0 1-6 ພ້ອມພິນອິນ ແລະ ຄຳແປ
</footer>

<!-- Stroke Order Modal -->
<StrokeOrderModal item={modalVocab} open={strokeModalOpen} onclose={closeStrokeModal} />
