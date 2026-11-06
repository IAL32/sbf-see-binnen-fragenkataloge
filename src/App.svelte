<script>
	import {
		FILTERS,
		applyTheme,
		cycleTheme,
		inFilter,
		ALL,
		settings,
		toggleEn,
		ui
	} from './lib/state.svelte.js';
	import Study from './lib/Study.svelte';
	import Quiz from './lib/Quiz.svelte';
	import Stats from './lib/Stats.svelte';

	const tabs = [
		['study', 'Lernen'],
		['quiz', 'Quiz'],
		['stats', 'Fortschritt']
	];
	const themeIcon = { auto: '◐', light: '☀', dark: '☾' };
	applyTheme();
</script>

<header
	class="sticky top-0 z-10 border-b border-line bg-surface/90 pt-[env(safe-area-inset-top)] backdrop-blur">
	<div class="mx-auto max-w-3xl px-4 py-3">
		<div class="flex items-center justify-between gap-3">
			<h1 class="text-lg font-bold tracking-tight">⚓ SBF See &amp; Binnen</h1>
			<div class="flex items-center gap-2 text-sm">
				<button
					class="cursor-pointer rounded-full border border-line px-3 py-1 {settings.en
						? 'bg-brand text-brand-ink'
						: 'text-muted'}"
					aria-pressed={settings.en}
					onclick={toggleEn}>EN</button>
				<button
					class="cursor-pointer rounded-full border border-line px-3 py-1"
					title="Theme: {settings.theme}"
					onclick={cycleTheme}>
					{themeIcon[settings.theme]}
				</button>
			</div>
		</div>
		<nav class="mt-3 flex gap-1 rounded-full bg-bg p-1" aria-label="Ansicht">
			{#each tabs as [id, label]}
				<button
					class="flex-1 cursor-pointer rounded-full py-1.5 text-sm font-bold {ui.view === id
						? 'bg-brand text-brand-ink'
						: 'text-muted'}"
					aria-pressed={ui.view === id}
					onclick={() => (ui.view = id)}>{label}</button>
			{/each}
		</nav>
		{#if ui.view !== 'stats'}
			<select
				bind:value={ui.filter}
				aria-label="Fragenset"
				class="mt-3 w-full rounded-xl border border-line bg-bg px-3 py-2 text-sm">
				{#each FILTERS as [id, label]}
					<option value={id}>{label} ({ALL.filter((q) => inFilter(q, id)).length})</option>
				{/each}
			</select>
		{/if}
	</div>
</header>

<main class="mx-auto max-w-3xl px-4 pt-4 pb-16">
	{#if ui.view === 'study'}<Study />{:else if ui.view === 'quiz'}<Quiz />{:else}<Stats />{/if}
	<p class="mt-8 text-center text-xs text-muted">
		Amtliche Fragenkataloge (gültig ab 1. Aug. 2023). In der Prüfung sind die Antworten gemischt.
	</p>
</main>
