import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';

// Served from the root of https://sbfbinnen.adct.it (custom domain), so base is '/'.
export default defineConfig({
	base: '/',
	plugins: [tailwindcss(), svelte()]
});
