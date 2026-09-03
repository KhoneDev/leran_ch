import type { VocabEntry } from '$lib/data/vocab';

export const load = async ({ fetch }) => {
	const vocab = await fetch('/vocab.json').then((r) => r.json() as Promise<VocabEntry[]>);
	return { vocab };
};