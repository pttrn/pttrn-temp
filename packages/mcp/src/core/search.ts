const STOP_WORDS = new Set(['a', 'an', 'the', 'of', 'to', 'for', 'and', 'or', 'with', 'in', 'on', 'that', 'is']);

/** Lowercase letters and digits only, so `date-picker`, `Date Picker` and `DatePicker` compare equal. */
export function squash(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function words(text: string): string[] {
    return text
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter(Boolean);
}

/** Drops a plural `s` so `dates` finds `date`. */
function stem(word: string): string {
    return word.length > 3 && word.endsWith('s') ? word.slice(0, -1) : word;
}

export type Searchable = { name: string; text: string };

/**
 * Scores how well a query matches an item. A whole-name match beats a name that starts with or contains the query, and
 * those beat words that only appear in the description.
 */
export function score(query: string, item: Searchable): number {
    const name = squash(item.name);
    const squashed = squash(query);
    if (!squashed) return 0;

    let total = 0;
    if (name === squashed) total += 100;
    else if (name.startsWith(squashed)) total += 60;
    else if (name.includes(squashed)) total += 40;

    const bodyWords = new Set(words(item.text).map(stem));
    for (const raw of words(query)) {
        if (STOP_WORDS.has(raw)) continue;
        const word = stem(raw);
        if (name.includes(word)) total += 15;
        if (bodyWords.has(word)) total += 5;
        else if (word.length >= 4 && [...bodyWords].some((w) => w.startsWith(word))) total += 2;
    }
    return total;
}

/** Items that match the query, best first. */
export function rank<T>(query: string, items: T[], toSearchable: (item: T) => Searchable, limit: number): T[] {
    return items
        .map((item) => ({ item, points: score(query, toSearchable(item)) }))
        .filter((entry) => entry.points > 0)
        .sort((a, b) => b.points - a.points)
        .slice(0, limit)
        .map((entry) => entry.item);
}

function distance(a: string, b: string): number {
    const row = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
        let previous = row[0];
        row[0] = i;
        for (let j = 1; j <= b.length; j++) {
            const current = row[j];
            row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
            previous = current;
        }
    }
    return row[b.length];
}

/** The names closest to a mistyped one, for "did you mean". */
export function closest(name: string, candidates: string[], limit = 3): string[] {
    const target = squash(name);
    const allowed = Math.max(2, Math.floor(target.length / 3));
    return candidates
        .map((candidate) => {
            const squashed = squash(candidate);
            const near = squashed.includes(target) || target.includes(squashed);
            return { candidate, gap: near ? 0 : distance(target, squashed) };
        })
        .filter((entry) => entry.gap <= allowed)
        .sort((a, b) => a.gap - b.gap || a.candidate.localeCompare(b.candidate))
        .slice(0, limit)
        .map((entry) => entry.candidate);
}
