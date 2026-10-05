// Fuse.js fuzzy search runs here (Web Worker) so typing never blocks the UI.
// FUSE_OPTIONS keys must stay in sync with scripts/build-vocab.mjs and +page.svelte.
import Fuse from 'fuse.js';
import type { VocabEntry } from '$lib/data/vocab';

const FUSE_OPTIONS = {
	keys: ['word', 'pinyin', 'thai', 'q', 'q.cn', 'q.th'],
	threshold: 0.4,
	includeScore: true
};

type WorkerMsg =
	| { type: 'init'; vocab: VocabEntry[]; index: unknown }
	| { type: 'search'; id: number; q: string; limit: number };

type Reply = { id: number; items: VocabEntry[]; total: number };

const ctx = self as unknown as {
	onmessage: ((e: MessageEvent<WorkerMsg>) => void) | null;
	postMessage: (data: Reply) => void;
};

let fuse: Fuse<VocabEntry> | null = null;

ctx.onmessage = (e: MessageEvent<WorkerMsg>) => {
	const msg = e.data;
	if (msg.type === 'init') {
		fuse = new Fuse(msg.vocab, FUSE_OPTIONS, Fuse.parseIndex(msg.index as never));
		return;
	}
	if (msg.type === 'search' && fuse) {
		const res = fuse.search(msg.q);
		ctx.postMessage({
			id: msg.id,
			items: res.slice(0, msg.limit).map((r) => r.item),
			total: res.length
		});
	}
};
