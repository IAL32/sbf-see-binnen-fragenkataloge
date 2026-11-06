<script>
	import { marked, toggleMark } from './state.svelte.js';
	let { id } = $props();
</script>

<button
	class="cursor-pointer rounded-full border px-3 py-1 text-sm transition-colors {marked[id]
		? 'border-warn bg-warn-bg'
		: 'border-line text-muted hover:border-muted'}"
	aria-pressed={!!marked[id]}
	onclick={() => toggleMark(id)}>
	{marked[id] ? '★ Markiert' : '☆ Unsicher'}
</button>
