import type { VocabEntry } from '$lib/data/vocab';

export const prerender = true;

export const load = async ({ fetch }) => {
	// Only load HSK 1 (300 words, ~50KB) on initial page load for instant hydration and 0ms freeze.
	// HSK 2-6 are lazy loaded on demand and prefetched in the background.
	const res = await fetch('/data/hsk1.json');
	const initialVocab = (await res.json()) as VocabEntry[];

	return {
		initialVocab
	};
};
