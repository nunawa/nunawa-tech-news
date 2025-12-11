// @ts-check

import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://news.nunawa.net',
	vite: {
		// @ts-expect-error
		plugins: [tailwindcss()],
	},
	output: 'static',
	build: {
		format: 'file',
	},
});
