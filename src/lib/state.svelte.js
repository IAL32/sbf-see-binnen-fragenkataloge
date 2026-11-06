import DATA from '../data/questions.json';

export const ALL = DATA;
export const LABEL = {
	B: 'Basis',
	S: 'See',
	N: 'See-Navigation',
	I: 'Binnen',
	G: 'Binnen Segeln'
};
export const DOT = {
	B: 'bg-slate-400',
	S: 'bg-sky-500',
	N: 'bg-teal-500',
	I: 'bg-emerald-500',
	G: 'bg-violet-500'
};
export const FILTERS = [
	['exam', 'See + Binnen Motor'],
	['basis', 'Basis 1–72 (beide Scheine)'],
	['see', 'See-spezifisch'],
	['nav', 'See-Navigation'],
	['binnen', 'Binnen-spezifisch'],
	['segeln', 'Binnen unter Segel'],
	['all', 'Alle Fragen'],
	['marked', 'Markiert (unsicher)'],
	['weak', 'Schwach (Wiederholen)'],
	['unseen', 'Noch nicht gesehen']
];
export const MASTERED_BOX = 4;
export const MAX_BOX = 5;

const load = (k, d) => {
	try {
		const v = localStorage.getItem(k);
		return v ? JSON.parse(v) : d;
	} catch {
		return d;
	}
};
const save = (k, v) => {
	try {
		localStorage.setItem(k, JSON.stringify(v));
	} catch {
		/* storage unavailable */
	}
};

export const ui = $state({ view: 'study', filter: 'exam', search: '' });
export const settings = $state({ en: true, theme: 'auto', ...load('sbf-settings', {}) });
export const marked = $state(Object.fromEntries(load('sbf-marked', []).map((id) => [id, true])));
// progress[id] = { box: 0..5, seen, right }
export const progress = $state(load('sbf-progress', {}));

export function applyTheme() {
	const r = document.documentElement;
	if (settings.theme === 'auto') r.removeAttribute('data-theme');
	else r.setAttribute('data-theme', settings.theme);
}
export function cycleTheme() {
	settings.theme = { auto: 'light', light: 'dark', dark: 'auto' }[settings.theme];
	save('sbf-settings', settings);
	applyTheme();
}
export function toggleEn() {
	settings.en = !settings.en;
	save('sbf-settings', settings);
}
export function toggleMark(id) {
	if (marked[id]) delete marked[id];
	else marked[id] = true;
	save('sbf-marked', Object.keys(marked));
}
export function record(id, ok) {
	const p = progress[id] ?? { box: 0, seen: 0, right: 0 };
	p.seen++;
	if (ok) {
		p.right++;
		p.box = Math.min(p.box + 1, MAX_BOX);
	} else p.box = 1;
	progress[id] = p;
	save('sbf-progress', progress);
	if (!ok) {
		marked[id] = true;
		save('sbf-marked', Object.keys(marked));
	}
}
export function resetProgress() {
	for (const k of Object.keys(progress)) delete progress[k];
	save('sbf-progress', progress);
}

export function inFilter(q, f) {
	const p = progress[q.id];
	switch (f) {
		case 'all':
			return true;
		case 'exam':
			return q.sec !== 'G';
		case 'basis':
			return q.sec === 'B';
		case 'see':
			return q.sec === 'S';
		case 'nav':
			return q.sec === 'N';
		case 'binnen':
			return q.sec === 'I';
		case 'segeln':
			return q.sec === 'G';
		case 'marked':
			return !!marked[q.id];
		case 'weak':
			return !!p && p.box <= 1;
		case 'unseen':
			return !p;
	}
	return true;
}

/** Questions matching the current filter; quiz excludes free-text navigation questions. */
export function pool(forQuiz = false) {
	return ALL.filter((q) => inFilter(q, ui.filter) && !(forQuiz && q.sec === 'N'));
}

export function shuffle(a) {
	a = a.slice();
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

export function searchText(q) {
	return `${q.q} ${q.a.join(' ')} ${q.qe} ${q.ae} ${q.we.join(' ')}`.toLowerCase();
}
