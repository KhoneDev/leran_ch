import fs from 'node:fs';
import path from 'node:path';

if (fs.existsSync('build')) {
	// Ensure Cloudflare _headers is present in build directory
	const staticHeaders = path.join('static', '_headers');
	const buildHeaders = path.join('build', '_headers');
	if (fs.existsSync(staticHeaders) && !fs.existsSync(buildHeaders)) {
		fs.copyFileSync(staticHeaders, buildHeaders);
	}

	// Remove any stale _redirects that cause Cloudflare API code 100324 loop
	const buildRedirects = path.join('build', '_redirects');
	if (fs.existsSync(buildRedirects)) {
		fs.unlinkSync(buildRedirects);
	}

	// Replicate to public directory as a failsafe for multi-platform hosting (Vercel, etc.)
	fs.cpSync('build', 'public', { recursive: true });
	console.log('✓ Verified build output & copied build -> public (Cloudflare ready)');
}
