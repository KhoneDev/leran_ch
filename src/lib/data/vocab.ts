// Type definitions for vocabulary entries.
// Data is loaded at runtime from /vocab.json (see src/routes/+page.ts).
export type VocabEntry = {
	no: number;
	level: number;
	word: string;
	pinyin: string;
	thai: string;
	q: string | { cn: string; th: string };
	a: string | { cn: string; th: string };
};
