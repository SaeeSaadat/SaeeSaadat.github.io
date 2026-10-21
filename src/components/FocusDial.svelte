<script lang="ts">
  import { ui } from '../lib/state.svelte'
  // compact: the status bar version
  let { compact = false } = $props()
  let pct = $derived(Math.round(ui.focus * 100))
</script>

<label class="dial" class:compact style:--p="{pct}%">
  <span class="end se" class:on={ui.focus <= 0.5}>{compact ? 'SWE' : 'Software Engineering'}</span>
  <input
    type="range" min="0" max="100" step="5" value={pct}
    oninput={e => (ui.focus = +e.currentTarget.value / 100)}
    aria-label="Focus between software engineering and AI agent development"
    aria-valuetext="{100 - pct}% software engineering, {pct}% AI agents"
  />
  <span class="end ai" class:on={ui.focus >= 0.5}>{compact ? 'AI' : 'AI Agents'}</span>
</label>

<style>
  .dial { display: flex; align-items: center; gap: 1.5ch; cursor: pointer; width: 100%; font-family: var(--mono); }
  .end { color: var(--dim); transition: color 0.2s; white-space: nowrap; font-weight: 700; }
  .se.on { color: var(--se); }
  .ai.on { color: var(--ai); }
  input { appearance: none; flex: 1; min-width: 8rem; height: 2.2rem; margin: 0; background: transparent; cursor: grab; }
  input:active { cursor: grabbing; }
  input::-webkit-slider-runnable-track {
    height: 8px; border-radius: 4px;
    background: linear-gradient(90deg, var(--se), var(--ai));
  }
  input::-moz-range-track { height: 8px; border-radius: 4px; background: linear-gradient(90deg, var(--se), var(--ai)); }
  input::-webkit-slider-thumb {
    appearance: none; width: 1.6rem; height: 1.6rem; margin-top: calc(4px - 0.8rem); border-radius: 50%;
    background: var(--fg); border: 4px solid var(--bg); box-shadow: 0 0 0 2px var(--fg), 0 2px 10px #0006;
    transition: transform 0.15s;
  }
  input::-moz-range-thumb {
    width: 1.6rem; height: 1.6rem; border-radius: 50%; background: var(--fg);
    border: 4px solid var(--bg); box-shadow: 0 0 0 2px var(--fg);
  }
  input:hover::-webkit-slider-thumb, input:active::-webkit-slider-thumb { transform: scale(1.15); }
  input:focus-visible { outline: 2px solid var(--accent); outline-offset: 4px; border-radius: 4px; }

  /* When the dial itself is narrow (phones, tight columns): labels on one row, full-width slider under them */
  .dial:not(.compact) { container-type: inline-size; flex-wrap: wrap; justify-content: space-between; }
  @container (max-width: 30rem) {
    input { order: 3; flex-basis: 100%; min-width: 0; }
    .end { font-size: 0.85rem; }
  }

  .compact { width: auto; gap: 1ch; font-size: 0.9em; }
  .compact input { flex: none; width: 12rem; min-width: 0; height: 1.4rem; }
  .compact input::-webkit-slider-runnable-track { height: 5px; }
  .compact input::-moz-range-track { height: 5px; }
  .compact input::-webkit-slider-thumb { width: 1rem; height: 1rem; margin-top: calc(2.5px - 0.5rem); border-width: 2px; }
  .compact input::-moz-range-thumb { width: 1rem; height: 1rem; border-width: 2px; }
</style>
