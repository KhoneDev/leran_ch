import type { VocabEntry } from '$lib/data/vocab';
import hsk1 from '../../data/hsk1.json';
import hsk2 from '../../data/hsk2.json';
import hsk3 from '../../data/hsk3.json';
import hsk4 from '../../data/hsk4.json';
import hsk5 from '../../data/hsk5.json';
import hsk6 from '../../data/hsk6.json';

// Data is statically imported so it is bundled into the server at build time.
// (Fetching `/vocab.json` at runtime during SSR does not work in serverless
// environments such as Vercel, where static files live outside the function.)
const vocab: VocabEntry[] = [
	...hsk1,
	...hsk2,
	...hsk3,
	...hsk4,
	...hsk5,
	...hsk6
] as VocabEntry[];

export const load = async () => {
	return { vocab };
};
