<script lang="ts">
  import type { Bullet } from '../lib/types'
  import { ui } from '../lib/state.svelte'
  import { score, top, match, lean, DIM_BELOW } from '../lib/relevance'

  let { id, title, role = '', when = '', where = '', note = '', bullets }:
    { id: string; title: string; role?: string; when?: string; where?: string; note?: string; bullets: Bullet[] } = $props()

  let open = $derived(!!ui.folds[id])
  let best = $derived(top(bullets, ui.focus))
  let pct = $derived(match(bullets, ui.focus))
  let rest = $derived(bullets.map((_, i) => i).filter(i => !best.includes(i)))
  const toggle = () => (ui.folds[id] = !open)
</script>

<article {id} class="card" class:cold={pct < 50}>
  <header>
    <div class="titles">
      <h3>{title}</h3>
      {#if role}<p class="role">{role}</p>{/if}
    </div>
    <div class="meta">
      {#if when}<span>{when}</span>{/if}
      {#if where}<span>{where}</span>{/if}
    </div>
  </header>

  <div class="match" title="How well this matches the current focus">
    <span class="meter"><span style:width="{pct}%"></span></span>
    <span class="pct">{pct}% match</span>
  </div>

  <ul class="bullets">
    {#each best as i (i)}
      <li class={lean(bullets[i])} class:flash={ui.flash === bullets[i].text}>{bullets[i].text}</li>
    {/each}
  </ul>

  {#if open}
    {#if note}<p class="note">{note}</p>{/if}
    <ul class="bullets more">
      {#each rest as i (i)}
        <li class={lean(bullets[i])} class:faded={score(bullets[i], ui.focus) < DIM_BELOW} class:flash={ui.flash === bullets[i].text}>{bullets[i].text}</li>
      {/each}
    </ul>
  {/if}

  {#if rest.length || note}
    <button class="toggle" onclick={toggle} aria-expanded={open}>
      {open ? '▴ Show less' : `▾ ${rest.length} more ${rest.length === 1 ? 'detail' : 'details'}`}
    </button>
  {/if}
</article>

<style>
  .card {
    background: var(--bg-card); border: 1px solid var(--border); border-radius: 10px;
    padding: 1.4rem 1.6rem 1.1rem; margin-bottom: 1.25rem; transition: opacity 0.3s, border-color 0.3s;
    scroll-margin-top: 7rem;
  }
  .card:hover { border-color: var(--dim); }
  .cold { opacity: 0.72; }
  header { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 0.4rem 2rem; }
  h3 { margin: 0; font: 700 1.3rem/1.3 var(--mono); color: var(--yellow); }
  .role { margin: 0.2rem 0 0; color: var(--blue); font-weight: 600; }
  .meta { display: flex; flex-direction: column; align-items: flex-end; font: 0.85rem/1.6 var(--mono); color: var(--dim); }
  .match { display: flex; align-items: center; gap: 0.8rem; margin: 0.9rem 0 0.6rem; font: 0.8rem var(--mono); color: var(--dim); }
  .meter { width: 7rem; height: 6px; border-radius: 3px; background: var(--border); overflow: hidden; }
  .meter span { display: block; height: 100%; background: linear-gradient(90deg, var(--se), var(--ai)); transition: width 0.3s; }
  .bullets { list-style: none; margin: 0; padding: 0; }
  li {
    position: relative; padding: 0.35rem 0 0.35rem 1.1rem; margin: 0.15rem 0;
    border-left: 3px solid var(--border); transition: opacity 0.25s;
  }
  li.ai { border-left-color: var(--ai); }
  li.se { border-left-color: var(--se); }
  .more li { color: var(--fg-soft); }
  li.faded { opacity: 0.6; }
  li.flash { animation: flash 2.4s ease-out; opacity: 1; }
  @keyframes flash { 0%, 40% { background: color-mix(in srgb, var(--yellow) 28%, transparent); } 100% { background: transparent; } }
  .note { margin: 0.8rem 0 0.4rem; color: var(--dim); font-size: 0.92rem; }
  .toggle {
    all: unset; cursor: pointer; margin-top: 0.7rem; font: 0.85rem var(--mono); color: var(--accent);
    padding: 0.2rem 0.5rem; margin-left: -0.5rem; border-radius: 4px;
  }
  .toggle:hover { background: var(--bg-hl); }
  .toggle:focus-visible { outline: 2px solid var(--accent); }
  @media (max-width: 760px) {
    .card { padding: 1.1rem 1.1rem 0.9rem; }
    .meta { align-items: flex-start; }
  }
</style>
