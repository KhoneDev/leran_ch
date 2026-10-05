// Converts the "HSK1 新 3.0" … "hsk6新" tabs of a downloaded Google Sheets .xlsx
// into data/hsk1.csv … data/hsk6.csv in the schema the app pipeline expects:
//   No.,Word,Pinyin,แปลไทย,ประโยคสำเร็จรูปใช้งาน
// Usage: node scripts/import-xlsx.mjs <path-to-workbook.xlsx>
// The "คำเชื่อม" (conjunctions) tab is not a HSK level list and is skipped.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const xlsxPath = process.argv[2];
if (!xlsxPath || !fs.existsSync(xlsxPath)) {
	console.error('Usage: node scripts/import-xlsx.mjs <path-to-workbook.xlsx>');
	process.exit(1);
}
const here = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(here, '..', 'data');

// ---------- minimal xlsx (zip) reader ----------
const buf = fs.readFileSync(xlsxPath);
let eocd = -1;
for (let i = buf.length - 22; i >= 0; i--) {
	if (buf.readUInt32LE(i) === 0x06054b50) {
		eocd = i;
		break;
	}
}
if (eocd < 0) throw new Error('not a zip file (no end-of-central-directory)');
const cdCount = buf.readUInt16LE(eocd + 10);
let p = buf.readUInt32LE(eocd + 16);
const entries = [];
for (let n = 0; n < cdCount; n++) {
	if (buf.readUInt32LE(p) !== 0x02014b50) throw new Error('bad central directory');
	const method = buf.readUInt16LE(p + 10);
	const csize = buf.readUInt32LE(p + 20);
	const nlen = buf.readUInt16LE(p + 28);
	const elen = buf.readUInt16LE(p + 30);
	const clen = buf.readUInt16LE(p + 32);
	const lho = buf.readUInt32LE(p + 42);
	const name = buf.subarray(p + 46, p + 46 + nlen).toString('utf8');
	entries.push({ name, method, csize, lho });
	p += 46 + nlen + elen + clen;
}
const get = (name) => {
	const e = entries.find((x) => x.name === name);
	if (!e) return null;
	const nlen = buf.readUInt16LE(e.lho + 26);
	const elen = buf.readUInt16LE(e.lho + 28);
	const start = e.lho + 30 + nlen + elen;
	const data = buf.subarray(start, start + e.csize);
	return e.method === 0 ? data : zlib.inflateRawSync(data);
};

const xml = (name) => get(name)?.toString('utf8');

// sheet order/names from workbook.xml
const wbXml = xml('xl/workbook.xml');
const relsXml = xml('xl/_rels/workbook.xml.rels');
const relMap = {};
for (const m of relsXml.matchAll(/<Relationship\b[^>]*>/g)) {
	const id = /Id="([^"]*)"/.exec(m[0])?.[1];
	const target = /Target="([^"]*)"/.exec(m[0])?.[1];
	if (id && target) relMap[id] = target.startsWith('/') ? target.slice(1) : 'xl/' + target;
}
const sheets = [...wbXml.matchAll(/<sheet\b[^>]*\/>/g)].map((m) => {
	const tag = m[0];
	return { name: /name="([^"]*)"/.exec(tag)?.[1], rid: /r:id="([^"]*)"/.exec(tag)?.[1] };
});

// shared strings table
const shared = [];
{
	const sst = get('xl/sharedStrings.xml');
	if (sst) {
		for (const m of sst.toString('utf8').matchAll(/<si>([\s\S]*?)<\/si>/g)) {
			let s = '';
			for (const t of m[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)) s += t[1];
			s = s
				.replaceAll('&amp;', '&')
				.replaceAll('&lt;', '<')
				.replaceAll('&gt;', '>')
				.replaceAll('&quot;', '"')
				.replaceAll('&apos;', "'");
			shared.push(s);
		}
	}
}
function cellValue(body) {
	// body = the full <c ...>...</c> tag content
	const t = /<c\b[^>]*\bt="([^"]*)"/.exec(body)?.[1];
	const v = /<v>([^<]*)<\/v>/.exec(body)?.[1];
	if (t === 's') return shared[Number(v ?? 0)] ?? '';
	if (t === 'inlineStr') {
		const m = /<is>([\s\S]*?)<\/is>/.exec(body);
		if (!m) return '';
		let s = '';
		for (const t of m[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)) s += t[1];
		return s;
	}
	return v ?? '';
}
const colIndex = (L) => L.split('').reduce((a, ch) => a * 26 + (ch.charCodeAt(0) - 64), 0);

function sheetRows(xmlStr) {
	const sd = /<sheetData>([\s\S]*?)<\/sheetData>/.exec(xmlStr)?.[1] ?? '';
	const out = [];
	for (const rm of sd.matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/g)) {
		const byCol = {};
		for (const cm of rm[1].matchAll(/<c\b[^>]*?(?:\/>|>([\s\S]*?)<\/c>)/g)) {
			const tag = cm[0].slice(0, cm[0].indexOf('>'));
			const r = /r="([A-Z]+)/.exec(tag)?.[1];
			if (!r) continue;
			const full = cm[1] !== undefined ? `${tag}>${cm[1]}</c>` : tag;
			byCol[colIndex(r)] = cellValue(full);
		}
		const idxs = Object.keys(byCol).map(Number);
		if (idxs.length === 0) continue;
		const arr = [];
		for (let i = 1; i <= Math.max(...idxs); i++) arr.push(byCol[i] ?? '');
		out.push(arr);
	}
	return out;
}

const csvEscape = (f) => (/[",\r\n]/.test(f) ? '"' + f.replaceAll('"', '""') + '"' : f);
const num = (s) => (/^\d+\.0$/.test(s) ? s.slice(0, -2) : s);

// tabs 0..5 -> levels 1..6 (tab 6 = คำเชื่อม connectors, skipped)
const HEADER = ['No.', 'Word', 'Pinyin', 'แปลไทย', 'ประโยคสำเร็จรูปใช้งาน'];
for (let level = 1; level <= 6; level++) {
	const sheet = sheets[level - 1];
	if (!sheet) continue;
	const rows = sheetRows(xml(relMap[sheet.rid]));
	// skip header row, drop fully-empty rows
	const data = rows.filter((r, i) => i > 0 && r.some((f) => f.trim() !== ''));
	const lines = data.map((r, i) => {
		const no = r[0] !== undefined && r[0].trim() !== '' ? num(r[0].trim()) : String(i + 1);
		const word = (r[1] ?? '').trim();
		const pinyin = (r[2] ?? '').trim();
		// HSK 1-5 tabs: columns are No., Word, Pinyin, แปลไทย, ประโยคสำเร็จรูปใช้งาน.
		// The hsk6新 tab instead has No., Word, Pinyin, Part of Speech, Translation,
		// so use its English translation as the meaning and leave examples empty.
		const isLevel6 = level === 6;
		const meaning = isLevel6 ? (r[4] ?? '').trim() : (r[3] ?? '').trim();
		const example = isLevel6 ? '' : (r[4] ?? '').trim();
		return [no, word, pinyin, meaning, example];
	});
	const csv = HEADER.join(',') + '\n' + lines.map((r) => r.map(csvEscape).join(',')).join('\n');
	fs.writeFileSync(path.join(dataDir, `hsk${level}.csv`), csv);
	const words = lines.map((r) => r[1]);
	console.log(
		`HSK ${level}: ${lines.length} rows (${new Set(words).size} unique words) <- tab "${sheet.name}"`
	);
}
console.log(`Wrote data/hsk1.csv … data/hsk6.csv in ${dataDir}`);
