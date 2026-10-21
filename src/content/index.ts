import type { Experience, Project } from '../lib/types'
export { default as about } from './about'
export { default as education } from './education'
export { default as skills } from './skills'

const load = <T extends { order: number }>(mods: Record<string, { default: T }>) =>
  Object.values(mods).map(m => m.default).sort((a, b) => a.order - b.order)

export const experience = load<Experience>(import.meta.glob('./experience/*.ts', { eager: true }))
export const projects = load<Project>(import.meta.glob('./projects/*.ts', { eager: true }))
