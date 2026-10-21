<script lang="ts">
  import { ui } from '../lib/state.svelte'
  const keys = [
    ['click', 'anything: files, tabs, folds, links'],
    ['drag the slider', 'shift the focus between software engineering and AI agents'],
    ['/ or Ctrl+K', 'search everything (jobs, projects, skills)'],
    ['j / k', 'scroll'],
    ['gg / G', 'top / bottom'],
    ['zR / zM', 'expand all / collapse all'],
    ['- / =', 'focus toward software engineering / AI agents'],
    ['1 … 7, H / L', 'switch file'],
    ['t', 'cycle theme'],
    [':focus ai|swe|0-100', 'set the focus'],
    [':e skills', 'open a file'],
    [':lens java', 'skills through a lens (ai, java, python, infra…)'],
    [':find kafka', 'search'],
    [':cv', 'download my CV as a PDF'],
    [':email', 'write me an email'],
    ['Tab, ↑ / ↓', 'complete a command, command history'],
    [':theme latte', 'kanagawa, catppuccin, latte'],
    ['Esc', 'close'],
  ]
  let dialog: HTMLDialogElement
  $effect(() => { dialog.showModal() })
</script>

<dialog bind:this={dialog} onclose={() => (ui.help = false)} onclick={e => e.target === dialog && dialog.close()} aria-label="Keybindings">
  <h2>:help keybindings</h2>
  <dl>
    {#each keys as [k, v]}<dt>{k}</dt><dd>{v}</dd>{/each}
  </dl>
  <p>You can share the current view: the link in the address bar keeps your focus setting and open file.</p>
  <button onclick={() => dialog.close()}>close [Esc]</button>
</dialog>

<style>
  dialog {
    background: var(--bg-alt); color: var(--fg); border: 1px solid var(--accent); border-radius: 4px;
    padding: 1em 2ch; max-width: min(70ch, 92vw); font: inherit;
  }
  dialog::backdrop { background: #0008; }
  h2 { margin: 0 0 0.8em; color: var(--accent); font-size: 1em; }
  dl { display: grid; grid-template-columns: max-content 1fr; gap: 0.25em 3ch; margin: 0; }
  dt { color: var(--yellow); }
  dd { margin: 0; color: var(--fg); }
  p { color: var(--dim); font-size: 0.9em; }
  button { all: unset; cursor: pointer; color: var(--accent); }
  button:focus-visible { outline: 1px solid var(--accent); }
  @media (max-width: 500px) { dl { grid-template-columns: 1fr; } dd { margin-bottom: 0.4em; } }
</style>
