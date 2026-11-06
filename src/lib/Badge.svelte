<script>
	import { LABEL, DOT } from './state.svelte.js';
	let { q } = $props();
</script>

<span class="inline-flex items-center gap-1.5 rounded-full bg-bg px-2.5 py-0.5 text-xs text-ink">
	<span class="size-2 rounded-full {DOT[q.sec]}"></span>{LABEL[q.sec]}
	<span class="font-bold text-muted">#{q.n}</span>
</span>
