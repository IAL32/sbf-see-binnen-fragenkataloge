<script>
	let { q } = $props();
	const base = import.meta.env.BASE_URL;
</script>

{#if q.imgs.length}
	<div class="my-3 space-y-2 overflow-x-auto rounded-xl border border-line bg-white p-2">
		{#each q.imgs as src}
			<img
				class="mx-auto block h-auto max-w-full"
				loading="lazy"
				src={base + src}
				alt="Abbildung zu Frage {q.n}" />
		{/each}
	</div>
{/if}
