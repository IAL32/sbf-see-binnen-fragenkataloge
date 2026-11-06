<script>
	import { ui, pool, settings, searchText, progress } from './state.svelte.js';
	import Figures from './Figures.svelte';
	import Badge from './Badge.svelte';
	import MarkButton from './MarkButton.svelte';

	const PAGE = 40;
	let limit = $state(PAGE);
	let term = $derived(ui.search.trim().toLowerCase());
	let list = $derived.by(() => {
		const p = pool();
		if (!term) return p;
		if (/^\d+$/.test(term)) return p.filter((q) => String(q.n) === term);
		return p.filter((q) => searchText(q).includes(term));
	});
	$effect(() => {
		list;
		limit = PAGE;
	});
</script>

<div class="mb-3 flex items-center gap-3">
	<input
		type="search"
		bind:value={ui.search}
		placeholder="Suchen: Deutsch, English oder Fragennummer"
		class="min-w-0 flex-1 rounded-xl border border-line bg-surface px-4 py-2.5" />
	<span class="text-sm whitespace-nowrap text-muted">{list.length} Fragen</span>
</div>

{#each list.slice(0, limit) as q (q.id)}
	{@const p = progress[q.id]}
	<article class="mb-3 rounded-2xl border border-line bg-surface p-4 shadow-sm">
		<div class="flex items-center justify-between gap-2">
			<Badge {q} />
			<div class="flex items-center gap-2">
				{#if p}<span class="text-xs text-muted" title="Lernstufe">Stufe {p.box}/5</span>{/if}
				<MarkButton id={q.id} />
			</div>
		</div>
		<p class="mt-3 font-bold">{q.q}</p>
		{#if settings.en}<p class="mt-1 text-[0.95rem] text-muted">{q.qe}</p>{/if}
		<Figures {q} />
		{#if q.sec === 'N'}
			<p class="mt-3 text-sm text-muted">
				In der Prüfung auf der Übungskarte D49 (Freitext, keine Auswahl).
			</p>
		{:else}
			<div class="mt-3 rounded-r-xl border-l-4 border-good bg-good-bg px-3 py-2">
				<p>{q.a[0]}</p>
				{#if settings.en}<p class="mt-1 text-sm text-muted">{q.ae}</p>{/if}
			</div>
			<details class="mt-2 text-[0.92rem]">
				<summary class="cursor-pointer text-muted">Falsche Antworten</summary>
				<ol type="a" start="2" class="mt-2 list-[lower-alpha] space-y-2 pl-6">
					{#each q.a.slice(1) as a, i}
						<li>
							{a}
							{#if settings.en}<span class="block text-sm text-muted">{q.we[i]}</span>{/if}
						</li>
					{/each}
				</ol>
			</details>
		{/if}
	</article>
{:else}
	<p class="py-12 text-center text-muted">
		{ui.filter === 'marked'
			? 'Noch nichts markiert. Falsch beantwortete Quizfragen landen automatisch hier.'
			: ui.filter === 'weak'
				? 'Keine schwachen Fragen – starte ein Quiz, um Fortschritt zu sammeln.'
				: 'Keine Frage gefunden.'}
	</p>
{/each}

{#if limit < list.length}
	<div class="py-4 text-center">
		<button
			class="cursor-pointer rounded-full bg-brand px-6 py-2.5 font-bold text-brand-ink"
			onclick={() => (limit += PAGE)}>
			Mehr anzeigen ({list.length - limit})
		</button>
	</div>
{/if}
