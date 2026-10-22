// Shapes for the files in src/content. Add a file to experience/ or projects/ and it shows up automatically.
//
// tags drive the focus dial: "ai" counts toward AI agents; backend, java, python, performance,
// cloud, devops and security count toward software engineering; leadership gets a small bonus everywhere.
// importance: high always surfaces, low only when it matches the focus.
export type Importance = 'high' | 'medium' | 'low'
export type Bullet = { text: string; tags?: string[]; importance?: Importance }

export type Experience = {
  order: number // position in the list, 1 = top
  company: string
  role: string
  type?: string
  start?: string
  end?: string
  location?: string
  notes?: string
  badges?: string[] // shown as pills next to the title, e.g. "Entrepreneurship"
  bullets: Bullet[]
}

export type Project = {
  order: number
  name: string
  tech?: string
  period?: string
  tags?: string[]
  badges?: string[]
  bullets: Bullet[]
}

export type About = {
  name: string
  title: string
  location: string
  email: string
  linkedin: string
  github: string
  summary: { default: string; software_and_ai: string; ai_focused: string; startup_focused?: string }
  languages: { language: string; cefr: string; label: string }[]
  interests: { professional: string[]; personal: string[] }
}

export type Education = {
  degrees: { institution: string; degree: string; start: string; end: string; location?: string; gpa?: string; notes?: string }[]
  certifications: { name: string; issuer: string; date: string; url?: string }[]
  publications: { title: string; authors: string; venue: string; year: string; url: string; award?: string; summary?: string }[]
}

export type Track = 'ai' | 'se' | 'both' | 'other'
export type Lens = {
  id: string
  name: string
  focus: number // where the focus dial jumps when this lens is picked (0 = SWE, 1 = AI)
  blurb: string
  skills: string[] // exact names from core tiles or group items; checked at startup
  keywords: string[] // matched against experience and project bullets to find the proof (and highlighted)
  tags?: string[] // bullets with any of these tags count as proof too
}
export type Skills = {
  core: { name: string; track: Track; where: string }[]
  groups: { name: string; track: Track; items: string[] }[]
  lenses: Lens[]
}
