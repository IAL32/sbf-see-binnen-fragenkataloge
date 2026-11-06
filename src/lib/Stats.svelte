<script>
	import {
		ALL,
		LABEL,
		DOT,
		progress,
		marked,
		resetProgress,
		MASTERED_BOX
	} from './state.svelte.js';

	let rows = $derived(
		Object.keys(LABEL).map((sec) => {
			const qs = ALL.filter((q) => q.sec === sec);
			const seen = qs.filter((q) => progress[q.id]).length;
			const mastered = qs.filter((q) => (progress[q.id]?.box ?? 0) >= MASTERED_BOX).length;
			return { sec, total: qs.length, seen, mastered };
		})
	);
	let totals = $derived({
		total: ALL.length,
		seen: rows.reduce((a, r) => a + r.seen, 0),
		mastered: rows.reduce((a, r) => a + r.mastered, 0)
	});
	let answered = $derived(Object.values(progress).reduce((a, p) => a + p.seen, 0));
	let right = $derived(Object.values(progress).reduce((a, p) => a + p.right, 0));
	function reset() {
		if (confirm('Gesamten Lernfortschritt zurücksetzen? Markierungen bleiben erhalten.'))
			resetProgress();
	}
</script>

<section class="rounded-2xl border border-line bg-surface p-5 shadow-sm">
	<div class="grid grid-cols-3 gap-3 text-center">
		<div>
			<p class="text-3xl font-bold">{totals.mastered}</p>
			<p class="text-xs text-muted">sicher (Stufe ≥ {MASTERED_BOX})</p>
		</div>
		<div>
			<p class="text-3xl font-bold">{totals.seen}</p>
			<p class="text-xs text-muted">gesehen von {totals.total}</p>
		</div>
		<div>
			<p class="text-3xl font-bold">{answered ? Math.round((right / answered) * 100) : 0}%</p>
			<p class="text-xs text-muted">Trefferquote ({answered})</p>
		</div>
	</div>
	<div class="mt-6 space-y-4">
		{#each rows as r}
			<div>
				<div class="mb-1 flex justify-between text-sm">
					<span class="flex items-center gap-2"
						><span class="size-2.5 rounded-full {DOT[r.sec]}"></span>{LABEL[r.sec]}</span>
					<span class="text-muted">{r.mastered} / {r.total}</span>
				</div>
				<div class="relative h-3 overflow-hidden rounded-full bg-line">
					<div
						class="absolute inset-y-0 left-0 bg-warn/60"
						style="width:{(r.seen / r.total) * 100}%">
					</div>
					<div
						class="absolute inset-y-0 left-0 bg-good"
						style="width:{(r.mastered / r.total) * 100}%">
					</div>
				</div>
			</div>
		{/each}
	</div>
	<p class="mt-4 text-xs text-muted">
		Grün = sicher, gelb = gesehen. {Object.keys(marked).length} Fragen markiert. Der Fortschritt liegt
		nur in diesem Browser.
	</p>
	<button class="mt-4 cursor-pointer text-sm text-bad underline" onclick={reset}
		>Fortschritt zurücksetzen</button>
</section>
