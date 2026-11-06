<script>
	import confetti from 'canvas-confetti';
	import { pool, progress, record, settings, shuffle, ui } from './state.svelte.js';
	import Figures from './Figures.svelte';
	import Badge from './Badge.svelte';
	import MarkButton from './MarkButton.svelte';

	let size = $state(20);
	let phase = $state('setup'); // setup | run | done
	let run = $state(null);
	let available = $derived(pool(true).length);

	function start() {
		// Weighted by Leitner box: new / weak questions come up first, with some randomness.
		const order = pool(true)
			.map((q) => ({ q, k: (progress[q.id]?.box ?? 0) + Math.random() * 1.6 }))
			.sort((a, b) => a.k - b.k)
			.slice(0, size || undefined)
			.map((x) => x.q);
		if (!order.length) return;
		run = { order, i: 0, right: 0, picked: null, opts: shuffle([0, 1, 2, 3]), wrong: [] };
		phase = 'run';
	}
	let q = $derived(run?.order[run.i]);
	function pick(o) {
		if (run.picked !== null) return;
		run.picked = o;
		const ok = o === 0;
		if (ok) run.right++;
		else run.wrong.push(q);
		record(q.id, ok);
	}
	function next() {
		if (run.picked === null) return;
		if (run.i + 1 >= run.order.length) {
			phase = 'done';
			if (run.right / run.order.length >= 0.8)
				confetti({ particleCount: 140, spread: 80, origin: { y: 0.3 } });
			return;
		}
		run.i++;
		run.picked = null;
		run.opts = shuffle([0, 1, 2, 3]);
		window.scrollTo({ top: 0 });
	}
	function onkey(e) {
		if (phase !== 'run' || e.metaKey || e.ctrlKey || e.target.matches?.('input,select')) return;
		if (run.picked === null && /^[1-4]$/.test(e.key)) pick(run.opts[+e.key - 1]);
		else if (run.picked !== null && ['Enter', ' ', 'ArrowRight'].includes(e.key)) {
			e.preventDefault();
			next();
		}
	}
	$effect(() => {
		ui.filter;
		phase = 'setup';
	});
</script>

<svelte:window onkeydown={onkey} />

{#if phase === 'setup'}
	<section class="rounded-2xl border border-line bg-surface p-6 text-center shadow-sm">
		<h2 class="text-xl font-bold">Quiz starten</h2>
		<p class="mt-1 text-muted">
			{available} Fragen im gewählten Set. Schwache und neue Fragen kommen zuerst; die Antworten werden
			gemischt.
		</p>
		<div class="mt-5 flex flex-wrap justify-center gap-2" role="group" aria-label="Anzahl Fragen">
			{#each [10, 20, 30, 0] as n}
				<button
					class="cursor-pointer rounded-full border-2 px-4 py-1.5 font-bold {size === n
						? 'border-brand bg-brand text-brand-ink'
						: 'border-line'}"
					aria-pressed={size === n}
					onclick={() => (size = n)}>
					{n || 'Alle'}
				</button>
			{/each}
		</div>
		<button
			class="mt-6 cursor-pointer rounded-full bg-brand px-8 py-3 font-bold text-brand-ink disabled:opacity-40"
			disabled={!available}
			onclick={start}>
			Los geht’s
		</button>
		<p class="mt-4 text-xs text-muted">Tasten: 1–4 antworten · Enter = weiter</p>
	</section>
{:else if phase === 'run'}
	<div class="mb-3 flex items-center gap-3 text-sm text-muted">
		<span class="whitespace-nowrap">Frage {run.i + 1}/{run.order.length}</span>
		<div class="h-2 flex-1 overflow-hidden rounded-full bg-line">
			<div class="h-full bg-brand transition-all" style="width:{(run.i / run.order.length) * 100}%">
			</div>
		</div>
		<span class="whitespace-nowrap">✓ {run.right}</span>
	</div>
	<article class="rounded-2xl border border-line bg-surface p-4 shadow-sm">
		<div class="flex items-center justify-between gap-2"><Badge {q} /><MarkButton id={q.id} /></div>
		<p class="mt-3 text-lg font-bold">{q.q}</p>
		{#if q.full}{:else}<Figures {q} />{/if}
		<ul class="mt-4 grid gap-2.5">
			{#each run.opts as o, idx}
				{@const right = run.picked !== null && o === 0}
				{@const wrong = run.picked === o && o !== 0}
				<li>
					<button
						class="flex w-full cursor-pointer gap-3 rounded-xl border-2 px-3 py-3 text-left disabled:cursor-default
						{right
							? 'border-good bg-good-bg'
							: wrong
								? 'border-bad bg-bad-bg'
								: 'border-line bg-bg hover:border-muted'}"
						disabled={run.picked !== null}
						onclick={() => pick(o)}>
						<span
							class="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-surface text-xs font-bold">
							{right ? '✓' : wrong ? '✗' : idx + 1}
						</span>
						<span>
							{o === 0 ? q.a[0] : q.a[o]}
							{#if run.picked !== null && settings.en}
								<span class="mt-1 block text-sm text-muted">{o === 0 ? q.ae : q.we[o - 1]}</span>
							{/if}
						</span>
					</button>
				</li>
			{/each}
		</ul>
		{#if run.picked !== null}
			{#if q.full}<Figures {q} />{/if}
			{#if settings.en}<p class="mt-3 text-sm text-muted">{q.qe}</p>{/if}
			<button
				class="mt-4 w-full cursor-pointer rounded-full bg-brand px-6 py-3 font-bold text-brand-ink sm:w-auto"
				onclick={next}>
				{run.i + 1 >= run.order.length ? 'Ergebnis' : 'Weiter →'}
			</button>
		{/if}
	</article>
{:else}
	{@const pct = Math.round((run.right / run.order.length) * 100)}
	<section class="rounded-2xl border border-line bg-surface p-6 text-center shadow-sm">
		<p class="text-5xl font-bold">{pct}%</p>
		<p class="mt-1 text-muted">{run.right} von {run.order.length} richtig</p>
		{#if run.wrong.length}
			<p class="mt-3 text-sm">
				{run.wrong.length} falsche Fragen wurden markiert. Wiederhole sie mit dem Filter „Markiert“ oder
				„Schwach“.
			</p>
		{/if}
		<div class="mt-6 flex flex-wrap justify-center gap-3">
			<button
				class="cursor-pointer rounded-full bg-brand px-6 py-2.5 font-bold text-brand-ink"
				onclick={start}>
				Neue Runde
			</button>
			<button
				class="cursor-pointer rounded-full border-2 border-line px-6 py-2.5 font-bold"
				onclick={() => (phase = 'setup')}>
				Einstellungen
			</button>
		</div>
	</section>
{/if}
