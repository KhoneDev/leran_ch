// Merges data/hsk1-6.json -> static/vocab.json + Fuse.js search index
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Fuse from 'fuse.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(here, '..', 'data');
const outFile = path.join(here, '..', 'static', 'vocab.json');

const LEVELS = [1, 2, 3, 4, 5, 6];

const all = [];
for (const level of LEVELS) {
	const file = path.join(dataDir, `hsk${level}.json`);
	if (!fs.existsSync(file)) {
		console.warn(`⚠ hsk${level}.json not found, skipping`);
		continue;
	}
	const rows = JSON.parse(fs.readFileSync(file, 'utf8'));
	console.log(`HSK ${level}: ${rows.length} words`);
	all.push(...rows);
}

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(all));
console.log(`✓ Wrote ${all.length} total words -> ${path.relative(process.cwd(), outFile)}`);

// Fuse.js fuzzy-search index over ALL levels (fetched lazily by the app when the user searches)
const FUSE_KEYS = ['word', 'pinyin', 'thai', 'q', 'q.cn', 'q.th'];
const FUSE_OPTIONS = { keys: FUSE_KEYS, threshold: 0.4, includeScore: true };
const indexFile = path.join(path.dirname(outFile), 'vocab.index.json');
const index = Fuse.createIndex(FUSE_KEYS, all, FUSE_OPTIONS).toJSON();
fs.writeFileSync(indexFile, JSON.stringify(index));
console.log(`✓ Wrote search index -> ${path.relative(process.cwd(), indexFile)}`);
