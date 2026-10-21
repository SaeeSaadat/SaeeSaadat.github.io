export const BUFFERS = [
  { id: 'dashboard', name: 'dashboard', icon: '◆' },
  { id: 'readme', name: 'README.md', icon: '#' },
  { id: 'experience', name: 'experience.md', icon: '#' },
  { id: 'projects', name: 'projects.md', icon: '#' },
  { id: 'skills', name: 'skills.lua', icon: '☾' },
  { id: 'education', name: 'education.md', icon: '#' },
  { id: 'contact', name: 'contact.sh', icon: '$' },
] as const
export type BufId = (typeof BUFFERS)[number]['id']
export const THEMES = ['kanagawa', 'catppuccin', 'latte'] as const

const read = (k: string) => { try { return localStorage.getItem(k) } catch { return null } }
export const save = (k: string, v: string) => { try { localStorage.setItem(k, v) } catch {} }

const params = new URLSearchParams(location.search)
const q = params.get('focus')
const hash = location.hash.slice(1)

export const ui = $state({
  focus: q != null && !isNaN(+q) ? Math.min(100, Math.max(0, +q)) / 100 : 0.5,
  buf: (BUFFERS.some(b => b.id === hash) ? hash : 'dashboard') as BufId,
  theme: (THEMES as readonly string[]).includes(read('theme') ?? '') ? read('theme')! : 'kanagawa',
  folds: {} as Record<string, boolean>,
  lens: params.get('lens') ?? '', // skills page category, '' = all
  tree: false, // mobile drawer
  sidebar: true, // desktop file tree
  help: false,
  finder: null as string | null, // open finder with this starting query
  flash: '', // bullet text to highlight after jumping to it
  message: '',
})

export const CV_URL = `${import.meta.env.BASE_URL}cv.pdf`
export const CV_NAME = 'Saee-Saadat-CV.pdf'
export function downloadCv() {
  Object.assign(document.createElement('a'), { href: CV_URL, download: CV_NAME }).click()
}
