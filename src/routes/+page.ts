import type { VocabEntry } from '$lib/data/vocab';
import hsk1 from '../../data/hsk1.json';

export const prerender = true;

export const load = async () => {
	// Only load HSK 1 (300 words, ~50KB) on initial page load for instant hydration and 0ms freeze.
	// HSK 2-6 are lazy loaded on demand and prefetched in the background.
	return {
		initialVocab: hsk1 as VocabEntry[]
	};
};
