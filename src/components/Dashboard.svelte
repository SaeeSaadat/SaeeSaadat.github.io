<script lang="ts">
  import { about } from '../content'
  import { drawAscii } from '../lib/ascii'
  import { ui, CV_URL, CV_NAME, type BufId } from '../lib/state.svelte'
  import FocusDial from './FocusDial.svelte'

  let { go }: { go: (b: BufId, focus?: number) => void } = $props()
  let canvas: HTMLCanvasElement
  let ready = $state(false)
  // As tall as the screen comfortably allows on desktop; width-limited on phones (portrait is 3:4)
  const mobile = matchMedia('(max-width: 700px)').matches
  const height = mobile ? Math.min(innerWidth - 32, 300) / 0.75 : Math.min(620, innerHeight * 0.74, innerWidth * 0.38)
  $effect(() => {
    document.fonts.ready
      .then(() => drawAscii(canvas, `${import.meta.env.BASE_URL}photo-small.jpg`, mobile ? 72 : 96, height))
      .then(() => (ready = true))
      .catch(() => {})
  })

  const paths = [
    { key: 'a', label: 'Hiring for AI agents', hint: 'multi-agent systems, MCP servers, agent tooling', focus: 1 },
    { key: 'e', label: 'Hiring for software engineering', hint: 'Java, Python, system design, cloud, high-traffic services', focus: 0 },
    { key: 'f', label: 'Show me everything', hint: 'balanced view of all experience', focus: 0.5 },
  ]
</script>

<div class="dash">
  <canvas bind:this={canvas} class="ascii" class:ready role="img" aria-label="ASCII art portrait of {about.name}"></canvas>

  <div class="side">
    <h1>{about.name}</h1>
    <p class="title">{about.title} <span class="dim">·</span> software engineering & AI agents <span class="dim">·</span> {about.location}</p>

    <p class="ask">What are you hiring for?</p>
    <ul class="menu">
      {#each paths as p}
        <li>
          <button onclick={() => go('experience', p.focus)}>
            <span class="key">[{p.key}]</span>
            <span class="label">{p.label}</span>
            <span class="hint">{p.hint}</span>
          </button>
        </li>
      {/each}
    </ul>

    <a class="cv" href={CV_URL} download={CV_NAME}>
      <span class="key">[d]</span>
      <span class="label">Download my CV</span>
      <span class="pdf">PDF</span>
    </a>

    <p class="ask">Or fine-tune it yourself:</p>
    <div class="dialrow"><FocusDial /></div>
    <p class="note">The whole site re-ranks as you drag: relevant work rises and lights up, the rest fades.</p>

    <ul class="menu small">
      <li><button onclick={() => go('readme')}><span class="key">[r]</span> README.md</button></li>
      <li><button onclick={() => go('skills')}><span class="key">[s]</span> skills.lua</button></li>
      <li><button onclick={() => go('contact')}><span class="key">[c]</span> contact.sh</button></li>
      <li><button onclick={() => (ui.help = true)}><span class="key">[?]</span> keybindings</button></li>
    </ul>
  </div>
</div>

<style>
  .dash {
    display: flex; flex-wrap: wrap; gap: 2rem 4ch; align-items: center; justify-content: center;
    min-height: 100%; padding: 1.5rem 0;
  }
  .ascii { background: var(--ascii-bg); border-radius: 6px; visibility: hidden; }
  .ascii.ready { visibility: visible; animation: reveal 1.4s steps(40) both; }
  @keyframes reveal { from { clip-path: inset(0 0 100% 0); } to { clip-path: inset(0 0 0 0); } }
  .side { flex: 1 1 20rem; max-width: 62ch; min-width: 0; }
  .ascii { flex: none; }
  h1 { margin: 0; font-size: 2rem; color: var(--fg); letter-spacing: -0.02em; }
  h1::before { content: '~/'; color: var(--dim); font-weight: 400; }
  .title { color: var(--blue); margin: 0.3em 0 1.6em; }
  .dim { color: var(--dim); }
  .ask { color: var(--dim); margin: 1.2em 0 0.4em; }
  .ask::before { content: '-- '; }
  .menu { list-style: none; margin: 0; padding: 0; }
  .menu button {
    all: unset; box-sizing: border-box; display: grid; grid-template-columns: 3ch 1fr; gap: 0 1.5ch; width: 100%;
    padding: 0.35em 1ch; cursor: pointer; border-left: 2px solid transparent;
  }
  .menu button:hover, .menu button:focus-visible { background: var(--bg-hl); border-left-color: var(--accent); }
  .key { color: var(--accent); font-weight: 700; }
  .label { color: var(--fg); font-weight: 700; }
  .hint { color: var(--dim); grid-column: 2; font-size: 0.9em; }
  .small { display: flex; flex-wrap: wrap; margin-top: 1.4em; }
  .small button { display: flex; gap: 1ch; padding: 0.2em 1ch; color: var(--fg); }
  .cv {
    display: inline-flex; align-items: center; gap: 1.5ch; margin: 0.9em 0 0 0; padding: 0.45em 1.2ch;
    border: 1px dashed var(--accent); border-radius: 4px; text-decoration: none; color: var(--fg);
  }
  .cv:hover, .cv:focus-visible { background: var(--bg-hl); border-style: solid; color: var(--fg); }
  .pdf { font-size: 0.75em; color: var(--bg); background: var(--accent); padding: 0 0.6ch; border-radius: 3px; font-weight: 700; }
  .dialrow { padding: 0.3em 1ch; max-width: 52ch; }
  @media (max-width: 760px) {
    .dash { padding: 1rem 0 2rem; gap: 1.2rem; }
    .side { width: 100%; }
    h1 { font-size: 1.6rem; }
    .title { margin-bottom: 1em; }
    .menu button { padding: 0.55em 1ch; }
    .cv { display: flex; }
  }
  .note { color: var(--dim); font-size: 0.85em; margin: 0.2em 0 0; padding-left: 1ch; }
</style>
