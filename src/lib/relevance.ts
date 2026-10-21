// focus: 0 = software engineering, 1 = AI agents
import type { Bullet, Track } from './types'

export const BACKEND = ['backend', 'java', 'python', 'performance', 'cloud', 'devops', 'security']
const IMPORTANCE: Record<string, number> = { high: 0.3, medium: 0.15, low: 0 }
export const DIM_BELOW = 0.5

export function score(b: Bullet, focus: number): number {
  const t = b.tags ?? []
  const ai = t.includes('ai') ? 1 : 0
  const n = t.filter(x => BACKEND.includes(x)).length
  const be = n === 0 ? 0 : n === 1 ? 0.9 : 1 // two backend tags (e.g. backend + performance) edge out one
  const lead = t.includes('leadership') ? 0.1 : 0
  // A bullet tagged for both sides counts only its stronger side, so it can't outrank single-sided work everywhere.
  // Divided by the best fit possible at this focus, so at 50/50 strong work on either side is a full match.
  const raw = ai && be ? Math.max(focus, (1 - focus) * be) : focus * ai + (1 - focus) * be
  const fit = raw / Math.max(focus, 1 - focus)
  return fit + lead + (IMPORTANCE[b.importance ?? 'low'] ?? 0)
}

// Indexes of the n best bullets, kept in original order
export function top(bullets: Bullet[], focus: number, n = 2): number[] {
  return bullets
    .map((b, i) => [score(b, focus), i] as const)
    .sort((a, b) => b[0] - a[0])
    .slice(0, n)
    .map(([, i]) => i)
    .sort((a, b) => a - b)
}

// 0..100, average of the two best bullets scaled to the best possible score
export function match(bullets: Bullet[], focus: number): number {
  const best = top(bullets, focus).map(i => score(bullets[i], focus))
  const avg = best.reduce((a, b) => a + b, 0) / (best.length || 1)
  return Math.round(Math.min(1, avg / 1.3) * 100)
}

export function trackWeight(track: Track, focus: number): number {
  return track === 'ai' ? focus : track === 'se' ? 1 - focus : track === 'both' ? 0.75 : 0.2
}

// Which side a bullet leans to, for colouring
export const lean = (b: Bullet): 'ai' | 'se' | '' =>
  b.tags?.includes('ai') ? 'ai' : b.tags?.some(t => BACKEND.includes(t)) ? 'se' : ''

export function summaryKey(focus: number): 'default' | 'software_and_ai' | 'ai_focused' {
  return focus > 0.66 ? 'ai_focused' : focus < 0.34 ? 'default' : 'software_and_ai'
}

// Self-check: an agent bullet must win at full AI focus, a perf bullet at full SE focus
const agent = { text: 'agents', tags: ['ai', 'leadership'], importance: 'high' }
const perf = { text: 'delivery', tags: ['backend', 'performance'], importance: 'high' }
console.assert(score(agent, 1) > score(perf, 1), 'relevance: AI focus should favour agent work')
console.assert(score(perf, 0) > score(agent, 0), 'relevance: SE focus should favour engineering work')
const mixed = { text: 'agent lead', tags: ['ai', 'leadership', 'backend'], importance: 'high' }
const course = { text: 'course', tags: ['ai', 'leadership', 'devops'], importance: 'medium' }
console.assert(score(perf, 0.3) > score(course, 0.3), 'relevance: leaning SE should rank engineering over AI side work')
console.assert(score(mixed, 1) > score(perf, 1), 'relevance: mixed agent bullet should win at AI focus')
console.assert(match([perf, perf], 0.5) === match([perf, perf], 0), 'relevance: balanced focus should not penalise one-sided work')
