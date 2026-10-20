import fs from 'node:fs';
import path from 'node:path';

if (fs.existsSync('build')) {
	// Ensure Cloudflare Pages _headers & _redirects are present
	const staticHeaders = path.join('static', '_headers');
	const buildHeaders = path.join('build', '_headers');
	if (fs.existsSync(staticHeaders) && !fs.existsSync(buildHeaders)) {
		fs.copyFileSync(staticHeaders, buildHeaders);
	}

	const staticRedirects = path.join('static', '_redirects');
	const buildRedirects = path.join('build', '_redirects');
	if (fs.existsSync(staticRedirects) && !fs.existsSync(buildRedirects)) {
		fs.copyFileSync(staticRedirects, buildRedirects);
	}

	// Also replicate to public directory as a failsafe for multi-platform hosting (Vercel, etc.)
	fs.cpSync('build', 'public', { recursive: true });
	console.log('✓ Verified build output & copied build -> public (Cloudflare & Vercel ready)');
}
