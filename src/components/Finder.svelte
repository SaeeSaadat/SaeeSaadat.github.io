<script lang="ts">
  import { tick } from 'svelte'
  import { education, experience, projects, skills } from '../content'
  import { ui, BUFFERS, type BufId } from '../lib/state.svelte'

  let { go, query = '' }: { go: (b: BufId, focus?: number, anchor?: string) => void; query?: string } = $props()

  type Item = { kind: string; title: string; text: string; open: () => void }
  const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const flash = (text: string) => {
    ui.flash = text
    setTimeout(() => ui.flash === text && (ui.flash = ''), 2500)
  }
  const bullet = (kind: string, buf: BufId, title: string) => (b: { text: string }) => ({
    kind, title, text: b.text, open: () => { flash(b.text); go(buf, undefined, slug(title)) },
  })
  const lensItems: Item[] = skills.lenses.map(l => ({
    kind: 'lens', title: l.name, text: l.blurb, open: () => { ui.lens = l.id; ui.focus = l.focus; go('skills') },
  }))
  const fileItems: Item[] = BUFFERS.map(b => ({ kind: 'file', title: b.name, text: '', open: () => go(b.id) }))
  const items: Item[] = [
    ...experience.flatMap(e => e.bullets.map(bullet('job', 'experience', e.company))),
    ...projects.flatMap(p => p.bullets.map(bullet('project', 'projects', p.name))),
    ...skills.core.map(c => ({ kind: 'skill', title: c.name, text: c.where, open: () => go('skills') })),
    ...skills.groups.flatMap(g => g.items.map(i => ({ kind: 'skill', title: i, text: g.name, open: () => go('skills') }))),
    ...education.publications.map(p => ({
      kind: 'paper', title: p.title, text: `${p.venue}${p.award ? ` · ${p.award}` : ''}`, open: () => go('education'),
    })),
    ...lensItems,
    ...fileItems,
  ]

  let q = $state(query)
  let sel = $state(0)
  let input: HTMLInputElement
  let list: HTMLElement
  let dialog: HTMLDialogElement

  let words = $derived(q.toLowerCase().split(/\s+/).filter(Boolean))
  let results = $derived.by(() => {
    if (!words.length) return [...lensItems, ...fileItems]
    const hit = items.filter(it => words.every(w => `${it.title} ${it.text}`.toLowerCase().includes(w)))
    // Title matches first (skills, lenses), then the rest in CV order
    return hit.sort((a, b) => +words.some(w => b.title.toLowerCase().includes(w)) - +words.some(w => a.title.toLowerCase().includes(w))).slice(0, 50)
  })
  let re = $derived(words.length ? new RegExp(`(${words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi') : null)

  $effect(() => { void q; sel = 0 })
  $effect(() => {
    dialog.showModal()
    input.focus()
  })

  function choose(it: Item | undefined) {
    if (!it) return
    dialog.close()
    it.open()
  }

  async function move(d: number) {
    sel = (sel + d + results.length) % Math.max(1, results.length)
    await tick()
    list.querySelector('.sel')?.scrollIntoView({ block: 'nearest' })
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === 'ArrowDown' || (e.ctrlKey && e.key === 'n')) { e.preventDefault(); move(1) }
    else if (e.key === 'ArrowUp' || (e.ctrlKey && e.key === 'p')) { e.preventDefault(); move(-1) }
    else if (e.key === 'Enter') { e.preventDefault(); choose(results[sel]) }
  }
</script>

{#snippet marked(text: string)}{#if re}{#each text.split(re) as part, i}{#if i % 2}<mark>{part}</mark>{:else}{part}{/if}{/each}{:else}{text}{/if}{/snippet}

<dialog bind:this={dialog} onclose={() => (ui.finder = null)} onclick={e => e.target === dialog && dialog.close()} aria-label="Search the CV">
  <div class="top">
    <span class="title">Find in Saee's CV</span>
    <span class="count">{results.length} {words.length ? 'matches' : 'suggestions'}</span>
  </div>
  <label class="prompt">
    <span>&gt;</span>
    <input bind:this={input} bind:value={q} onkeydown={onKey} placeholder="kafka, agents, kubernetes, team…" spellcheck="false" autocomplete="off" aria-label="Search" />
  </label>
  <ul bind:this={list} role="listbox" aria-label="Results">
    {#each results as it, i}
      <li role="option" aria-selected={i === sel} class:sel={i === sel} onmouseenter={() => (sel = i)}>
        <button onclick={() => choose(it)}>
          <span class="kind {it.kind}">{it.kind}</span>
          <span class="body">
            <strong>{@render marked(it.title)}</strong>
            {#if it.text}<span class="text">{@render marked(it.text)}</span>{/if}
          </span>
        </button>
      </li>
    {:else}
      <li class="empty">Nothing matches "{q}". Try a technology, like <i>python</i> or <i>terraform</i>.</li>
    {/each}
  </ul>
  <div class="foot">↑↓ move · Enter open · Esc close</div>
</dialog>

<style>
  dialog {
    width: min(48rem, 94vw); max-height: min(36rem, 80dvh); padding: 0; display: flex; flex-direction: column;
    background: var(--bg-alt); color: var(--fg); border: 1px solid var(--accent); border-radius: 8px;
    font-family: var(--mono); margin-top: 10vh;
  }
  dialog::backdrop { background: #0009; }
  .top { display: flex; justify-content: space-between; padding: 0.6rem 1rem 0; font-size: 0.8rem; }
  .title { color: var(--accent); font-weight: 700; }
  .count { color: var(--dim); }
  .prompt { display: flex; gap: 0.7rem; align-items: center; padding: 0.6rem 1rem; border-bottom: 1px solid var(--border); }
  .prompt span { color: var(--accent); font-weight: 700; }
  .prompt input { all: unset; flex: 1; font-size: 1.05rem; caret-color: var(--accent); }
  .prompt input::placeholder { color: var(--dim); }
  ul { list-style: none; margin: 0; padding: 0.3rem 0; overflow-y: auto; flex: 1; }
  li button {
    all: unset; box-sizing: border-box; cursor: pointer; display: grid; grid-template-columns: 5.5rem 1fr; gap: 0.8rem;
    width: 100%; padding: 0.5rem 1rem; border-left: 2px solid transparent;
  }
  li.sel button { background: var(--bg-hl); border-left-color: var(--accent); }
  .kind { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--dim); padding-top: 0.15rem; }
  .kind.job, .kind.project { color: var(--yellow); }
  .kind.skill { color: var(--se); }
  .kind.lens { color: var(--accent); }
  .kind.file { color: var(--blue); }
  .kind.paper { color: var(--green); }
  .body { display: flex; flex-direction: column; min-width: 0; }
  strong { font-size: 0.9rem; }
  .text { font: 0.9rem/1.5 var(--sans); color: var(--fg-soft); }
  mark { background: color-mix(in srgb, var(--yellow) 35%, transparent); color: inherit; border-radius: 2px; }
  .empty { padding: 1rem; color: var(--dim); font-size: 0.9rem; }
  .foot { padding: 0.45rem 1rem; border-top: 1px solid var(--border); font-size: 0.75rem; color: var(--dim); }
  @media (max-width: 600px) { li button { grid-template-columns: 1fr; gap: 0.1rem; } dialog { margin-top: 4vh; } }
</style>
