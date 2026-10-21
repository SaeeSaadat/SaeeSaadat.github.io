<script lang="ts">
  import { flip } from 'svelte/animate'
  import { slide } from 'svelte/transition'
  import { skills, experience, projects } from '../content'
  import { ui } from '../lib/state.svelte'
  import { trackWeight } from '../lib/relevance'

  const known = new Set([...skills.core.map(c => c.name), ...skills.groups.flatMap(g => g.items)])
  for (const l of skills.lenses)
    for (const s of l.skills) console.assert(known.has(s), `skills.ts: lens "${l.id}" names unknown skill "${s}"`)

  // Every bullet on the site, with where it came from
  const sources = [
    ...experience.flatMap(e => e.bullets.map(b => ({ from: e.company, ...b }))),
    ...projects.flatMap(p => p.bullets.map(b => ({ from: p.name, ...b }))),
  ]
  const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  let lens = $derived(skills.lenses.find(l => l.id === ui.lens))
  let hits = $derived(new Set(lens?.skills ?? []))
  let showAll = $state(false)
  // Whole words starting with a keyword, e.g. "secur" marks "security"
  let re = $derived(lens ? new RegExp(`\\b((?:${lens.keywords.map(esc).join('|')})[\\w-]*)`, 'gi') : null)
  let proof = $derived(
    lens ? sources.filter(s => s.text.search(re!) >= 0 || s.tags?.some(t => lens!.tags?.includes(t))) : [],
  )

  function pick(id: string) {
    const l = skills.lenses.find(l => l.id === id)
    ui.lens = ui.lens === id || !l ? '' : id
    showAll = false
    if (ui.lens && l) ui.focus = l.focus
  }

  // Lens hits first, then by how well the track fits the focus dial
  const order = <T extends { track: any }>(xs: T[], hit: (x: T) => number) =>
    xs.map((x, i) => ({ x, i, h: hit(x), w: trackWeight(x.track, ui.focus) }))
      .sort((a, b) => b.h - a.h || b.w - a.w || a.i - b.i)

  let core = $derived(order(skills.core, c => (hits.has(c.name) ? 1 : 0)))
  let groups = $derived(order(skills.groups, g => g.items.filter(i => hits.has(i)).length))
  const label = { ai: 'AI agents', se: 'Software eng.', both: 'Core', other: 'Also' }
</script>

<div class="lenses" role="group" aria-label="Skill categories">
  <span class="lens-label">Look through a lens:</span>
  <button class:on={!lens} aria-pressed={!lens} onclick={() => pick('')}>All skills</button>
  {#each skills.lenses as l}
    <button class:on={lens?.id === l.id} aria-pressed={lens?.id === l.id} onclick={() => pick(l.id)}>{l.name}</button>
  {/each}
</div>

{#if lens}
  {#key lens.id}
    <section class="proof" transition:slide={{ duration: 200 }}>
      <h2>{lens.name}</h2>
      <p class="blurb">{lens.blurb}</p>
      <h3>Where I've done it <span>({proof.length})</span></h3>
      <ul>
        {#each showAll ? proof : proof.slice(0, 4) as p}
          <li>
            <span class="from">{p.from}</span>
            <span>{#each p.text.split(re!) as part, i}{#if i % 2}<mark>{part}</mark>{:else}{part}{/if}{/each}</span>
          </li>
        {/each}
      </ul>
      {#if proof.length > 4}
        <button class="more" onclick={() => (showAll = !showAll)}>{showAll ? '▴ Show less' : `▾ Show all ${proof.length}`}</button>
      {/if}
    </section>
  {/key}
{/if}

<section>
  <h2 class="section"><span>##</span> Headline skills</h2>
  <div class="tiles">
    {#each core as { x, w } (x.name)}
      {@const hit = hits.has(x.name)}
      <div class="tile {x.track}" class:hit class:faded={lens ? !hit : w < 0.4} class:hot={!lens && w > 0.6} animate:flip={{ duration: 350 }}>
        <span class="track">{label[x.track]}</span>
        <strong>{x.name}</strong>
        <span class="where">{x.where}</span>
      </div>
    {/each}
  </div>
</section>

<section>
  <h2 class="section"><span>##</span> Full toolbox</h2>
  <div class="groups">
    {#each groups as { x, h, w } (x.name)}
      <div class="group {x.track}" class:faded={lens ? h === 0 : w < 0.4} animate:flip={{ duration: 350 }}>
        <h3>{x.name}</h3>
        <ul>{#each x.items as it}<li class:hit={hits.has(it)} class:off={lens && !hits.has(it)}>{it}</li>{/each}</ul>
      </div>
    {/each}
  </div>
</section>

<style>
  section { margin-bottom: 2.5rem; }
  .lenses { display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; margin: -0.4rem 0 1.8rem; }
  .lens-label { font: 0.85rem var(--mono); color: var(--dim); margin-right: 0.3rem; }
  .lenses button {
    all: unset; cursor: pointer; font: 600 0.88rem var(--mono); padding: 0.45rem 0.9rem; border-radius: 999px;
    border: 1px solid var(--border); color: var(--fg-soft); transition: background 0.15s, color 0.15s, border-color 0.15s;
  }
  .lenses button:hover { border-color: var(--accent); color: var(--fg); }
  .lenses button.on { background: var(--accent); border-color: var(--accent); color: var(--bg); }
  .lenses button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

  .proof {
    background: var(--bg-card); border: 1px solid var(--accent); border-radius: 10px; padding: 1.3rem 1.5rem 1rem;
  }
  .proof h2 { margin: 0; font: 700 1.25rem var(--mono); color: var(--accent); }
  .blurb { margin: 0.3rem 0 1.1rem; font-size: 1.05rem; }
  .proof h3 { margin: 0 0 0.5rem; font: 700 0.85rem var(--mono); color: var(--dim); text-transform: uppercase; letter-spacing: 0.06em; }
  .proof ul { list-style: none; margin: 0; padding: 0; }
  .proof li { display: grid; grid-template-columns: 11rem 1fr; gap: 1rem; padding: 0.55rem 0; border-top: 1px solid var(--border); }
  .from { font: 600 0.82rem/1.9 var(--mono); color: var(--yellow); }
  mark { background: color-mix(in srgb, var(--yellow) 30%, transparent); color: inherit; border-radius: 3px; padding: 0 2px; }
  .more { all: unset; cursor: pointer; margin-top: 0.4rem; font: 0.85rem var(--mono); color: var(--accent); }
  .more:focus-visible { outline: 2px solid var(--accent); }

  .tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr)); gap: 0.9rem; }
  .tile {
    display: flex; flex-direction: column; gap: 0.3rem; padding: 1rem 1.1rem;
    background: var(--bg-card); border: 1px solid var(--border); border-top: 3px solid var(--border); border-radius: 8px;
    transition: opacity 0.3s, border-color 0.3s, transform 0.3s;
  }
  .tile.ai { border-top-color: var(--ai); }
  .tile.se { border-top-color: var(--se); }
  .tile.both { border-top-color: var(--accent); }
  .tile.hot { transform: translateY(-2px); box-shadow: 0 6px 20px #0003; }
  .tile.hit { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent); }
  .tile strong { font: 700 1.1rem/1.3 var(--mono); color: var(--fg); }
  .track { font: 0.72rem var(--mono); text-transform: uppercase; letter-spacing: 0.08em; color: var(--dim); }
  .tile.ai .track { color: var(--ai); }
  .tile.se .track { color: var(--se); }
  .where { font-size: 0.9rem; color: var(--fg-soft); line-height: 1.45; }
  .faded { opacity: 0.4; }

  .groups { display: grid; grid-template-columns: repeat(auto-fill, minmax(19rem, 1fr)); gap: 0.9rem; }
  .group { padding: 1rem 1.1rem; border: 1px solid var(--border); border-radius: 8px; transition: opacity 0.3s; }
  .group h3 { margin: 0 0 0.7rem; font: 700 0.95rem var(--mono); color: var(--blue); }
  .group.ai h3 { color: var(--ai); }
  .group.se h3 { color: var(--se); }
  .group ul { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .group li {
    font-size: 0.85rem; padding: 0.2rem 0.6rem; border-radius: 999px; background: var(--bg-hl); color: var(--fg);
    transition: background 0.2s, color 0.2s, opacity 0.2s;
  }
  .group li.hit { background: var(--accent); color: var(--bg); font-weight: 600; }
  .group li.off { opacity: 0.45; }

  @media (max-width: 760px) {
    .lenses { flex-wrap: nowrap; overflow-x: auto; margin: -0.4rem -1rem 1.2rem; padding: 0 1rem 0.4rem; scrollbar-width: none; }
    .lenses button { flex: none; }
    .lens-label { display: none; }
    .proof { padding: 1rem; }
    .proof li { grid-template-columns: 1fr; gap: 0.1rem; }
  }
</style>
