<script lang="ts">
  import { tick } from 'svelte'
  import { about, education, experience, projects, skills } from './content'
  import { match, summaryKey } from './lib/relevance'
  import { ui, save, BUFFERS, THEMES, CV_URL, CV_NAME, downloadCv, type BufId } from './lib/state.svelte'
  import Dashboard from './components/Dashboard.svelte'
  import Card from './components/Card.svelte'
  import FocusDial from './components/FocusDial.svelte'
  import Skills from './components/Skills.svelte'
  import Help from './components/Help.svelte'
  import Finder from './components/Finder.svelte'

  const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const range = (a: { start: string; end: string }) => `${a.start} – ${a.end}`

  let main: HTMLElement
  let pos = $state('Top')
  let cmd = $state<string | null>(null)
  let cmdInput = $state<HTMLInputElement>()
  let pending = '' // first key of two-key commands (gg, zR, zM)

  let buf = $derived(BUFFERS.find(b => b.id === ui.buf)!)
  let pct = $derived(Math.round(ui.focus * 100))
  let leaning = $derived(pct < 35 ? 'software engineering' : pct > 65 ? 'AI agent development' : 'a mix of both')

  // Keep URL and theme in sync so a tuned view can be shared as a link
  $effect(() => {
    const u = new URL(location.href)
    u.searchParams.set('focus', String(pct))
    if (ui.lens && ui.buf === 'skills') u.searchParams.set('lens', ui.lens)
    else u.searchParams.delete('lens')
    u.hash = ui.buf === 'dashboard' ? '' : ui.buf
    // New page = new history entry (so Back works); focus/lens tweaks just update the current one
    if (u.hash !== location.hash) history.pushState(null, '', u)
    else history.replaceState(null, '', u)
  })
  // Keep the active tab visible in the (horizontally scrolling) tab bar on narrow screens
  $effect(() => {
    void ui.buf
    tick().then(() => document.querySelector('.tab.active')?.scrollIntoView({ inline: 'nearest', block: 'nearest' }))
  })
  $effect(() => {
    document.documentElement.dataset.theme = ui.theme
    save('theme', ui.theme)
  })

  async function go(b: BufId, focus?: number, anchor?: string) {
    if (focus != null) ui.focus = focus
    ui.buf = b
    ui.tree = false
    if (anchor) ui.folds[anchor] = true
    await tick()
    if (anchor) document.getElementById(anchor)?.scrollIntoView({ block: 'start', behavior: 'smooth' })
    else main.scrollTop = 0
  }

  // ☰ opens the drawer on phones and collapses the sidebar on desktop
  const narrow = matchMedia('(max-width: 760px)')
  let mobile = $state(narrow.matches)
  narrow.addEventListener('change', e => (mobile = e.matches))
  const toggleTree = () => (mobile ? (ui.tree = !ui.tree) : (ui.sidebar = !ui.sidebar))

  const setAllFolds = (open: boolean) =>
    [...experience.map(e => slug(e.company)), ...projects.map(p => slug(p.name))].forEach(id => (ui.folds[id] = open))
  const cycleTheme = () => (ui.theme = THEMES[(THEMES.indexOf(ui.theme as any) + 1) % THEMES.length])

  function onScroll() {
    const max = main.scrollHeight - main.clientHeight
    pos = max <= 0 ? 'All' : main.scrollTop <= 0 ? 'Top' : main.scrollTop >= max - 1 ? 'Bot' : `${Math.round((main.scrollTop / max) * 100)}%`
  }

  type Cmd = { name: string; alias?: string[]; args?: () => string[]; hint?: string; desc: string; run: (arg: string) => void }
  const COMMANDS: Cmd[] = [
    { name: 'find', alias: ['grep', 'search'], hint: '<text>', desc: "search everything I've worked on", run: a => (ui.finder = a) },
    {
      name: 'focus', alias: ['f'], args: () => ['ai', 'swe', '50'], desc: 'tune the page: ai, swe or 0-100',
      run: a => {
        const v = a === 'ai' ? 100 : ['se', 'swe', 'software', 'backend'].includes(a) ? 0 : +a
        if (isNaN(v) || a === '') ui.message = 'Usage: :focus ai | swe | 0-100'
        else ui.focus = Math.min(100, Math.max(0, v)) / 100
      },
    },
    {
      name: 'lens', args: () => skills.lenses.map(l => l.id), desc: 'see my skills through a lens',
      run: a => {
        const l = skills.lenses.find(l => l.id === a || l.name.toLowerCase().startsWith(a))
        if (!l || !a) ui.message = `Lenses: ${skills.lenses.map(l => l.id).join(', ')}`
        else { ui.lens = l.id; ui.focus = l.focus; go('skills') }
      },
    },
    {
      name: 'e', alias: ['edit', 'open'], args: () => BUFFERS.map(b => b.name), desc: 'open a file',
      run: a => {
        const b = BUFFERS.find(b => b.name.toLowerCase().startsWith(a) || b.id.startsWith(a))
        if (b && a) go(b.id)
        else ui.message = `E212: Can't open file "${a}"`
      },
    },
    {
      name: 'theme', alias: ['colorscheme'], args: () => [...THEMES], desc: 'switch colour theme',
      run: a => {
        if ((THEMES as readonly string[]).includes(a)) ui.theme = a
        else ui.message = `Themes: ${THEMES.join(', ')}`
      },
    },
    { name: 'cv', alias: ['pdf', 'resume'], desc: 'download my CV as a PDF', run: downloadCv },
    { name: 'email', alias: ['mail', 'hire'], desc: 'write me an email', run: () => (location.href = `mailto:${about.email}`) },
    { name: 'help', alias: ['h'], desc: 'all keybindings', run: () => (ui.help = true) },
    { name: 'q', alias: ['q!', 'wq', 'quit'], desc: 'quit', run: () => (ui.message = 'You can check out any time you like, but you can never leave. Try :email') },
  ]
  const findCmd = (n: string) => COMMANDS.find(c => c.name === n || c.alias?.includes(n))

  function runCmd(raw: string) {
    const [c, ...rest] = raw.trim().split(/\s+/)
    ui.message = ''
    if (!c) return
    const command = findCmd(c)
    if (command) command.run(rest.join(' ').toLowerCase())
    else ui.message = `E492: Not an editor command: ${raw}`
  }

  // Wildmenu: matching commands while typing the name, then that command's arguments
  type Sug = { label: string; hint?: string; desc?: string; value: string; needsArg: boolean }
  let suggestions = $derived.by((): Sug[] => {
    if (cmd === null) return []
    const sp = cmd.indexOf(' ')
    if (sp < 0)
      return COMMANDS.filter(c => [c.name, ...(c.alias ?? [])].some(n => n.startsWith(cmd!))).map(c => ({
        label: c.name, hint: c.args ? c.args().join(' | ') : c.hint, desc: c.desc, value: c.name, needsArg: !!(c.args || c.hint),
      }))
    const c = findCmd(cmd.slice(0, sp))
    const a = cmd.slice(sp + 1).toLowerCase()
    return (c?.args?.() ?? []).filter(x => x.toLowerCase().startsWith(a)).map(x => ({ label: x, value: `${c!.name} ${x}`, needsArg: false }))
  })

  const cmdHistory: string[] = []
  let histAt = 0

  async function openCmd(text = '') {
    cmd = text
    histAt = cmdHistory.length
    await tick()
    cmdInput?.focus()
  }

  function submit(text: string) {
    if (text.trim()) cmdHistory.push(text.trim())
    cmd = null
    runCmd(text)
  }

  function pickSuggestion(s: Sug) {
    if (s.needsArg) openCmd(`${s.value} `)
    else submit(s.value)
  }

  function onKey(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); ui.finder = ''; return }
    if (cmd !== null || ui.finder !== null || e.metaKey || e.ctrlKey || e.altKey) return
    if ((e.target as HTMLElement).matches('input')) return
    const k = e.key
    if (k === 'Escape') { ui.help = false; ui.tree = false; ui.message = ''; return }
    if (ui.help) return
    const two = pending + k
    pending = ''
    const step = (d: number) => (ui.focus = Math.min(1, Math.max(0, Math.round(ui.focus * 20 + d) / 20)))
    const actions: Record<string, () => void> = {
      ':': () => openCmd(),
      '/': () => (ui.finder = ''),
      '?': () => (ui.help = true),
      j: () => main.scrollBy({ top: 80 }),
      k: () => main.scrollBy({ top: -80 }),
      gg: () => (main.scrollTop = 0),
      G: () => (main.scrollTop = main.scrollHeight),
      zR: () => setAllFolds(true),
      zM: () => setAllFolds(false),
      '-': () => step(-1),
      '=': () => step(1),
      '+': () => step(1),
      t: cycleTheme,
      H: () => go(BUFFERS[(BUFFERS.indexOf(buf) + BUFFERS.length - 1) % BUFFERS.length].id),
      L: () => go(BUFFERS[(BUFFERS.indexOf(buf) + 1) % BUFFERS.length].id),
    }
    BUFFERS.forEach((b, i) => (actions[String(i + 1)] = () => go(b.id)))
    if (ui.buf === 'dashboard') {
      Object.assign(actions, {
        a: () => go('experience', 1), e: () => go('experience', 0), f: () => go('experience', 0.5),
        r: () => go('readme'), s: () => go('skills'), c: () => go('contact'), d: downloadCv,
      })
    }
    const act = actions[two] ?? actions[k]
    if (act) { e.preventDefault(); act() }
    else if (k === 'g' || k === 'z') pending = k
  }

  function onCmdKey(e: KeyboardEvent) {
    if (e.key === 'Escape') cmd = null
    else if (e.key === 'Enter') {
      e.preventDefault() // else this Enter also clicks the button a newly opened dialog focuses (closed :help instantly)
      submit(cmd ?? '')
    }
    else if (e.key === 'Tab' && suggestions[0]) {
      e.preventDefault()
      cmd = suggestions[0].needsArg ? `${suggestions[0].value} ` : suggestions[0].value
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
      histAt = Math.max(0, Math.min(cmdHistory.length, histAt + (e.key === 'ArrowUp' ? -1 : 1)))
      cmd = cmdHistory[histAt] ?? ''
    }
  }
</script>

<svelte:window
  onkeydown={onKey}
  onhashchange={() => {
    const h = location.hash.slice(1) || 'dashboard'
    if (BUFFERS.some(b => b.id === h)) go(h as BufId)
  }}
/>

<div class="editor" class:nosidebar={!ui.sidebar}>
  <nav class="bufferline" aria-label="Open files">
    <button class="burger" onclick={toggleTree} aria-label="Toggle file tree" aria-expanded={mobile ? ui.tree : ui.sidebar}>☰</button>
    {#each BUFFERS as b, i}
      <button class="tab" class:active={b.id === ui.buf} onclick={() => go(b.id)} aria-current={b.id === ui.buf ? 'page' : undefined}>
        <span class="num">{i + 1}</span> <span class="icon">{b.icon}</span> {b.name}
      </button>
    {/each}
    <button class="search" onclick={() => (ui.finder = '')} aria-label="Search the CV">⌕ Search <kbd>/</kbd></button>
  </nav>

  {#if ui.tree}<button class="scrim" onclick={() => (ui.tree = false)} aria-label="Close file tree"></button>{/if}
  <aside class="tree" class:open={ui.tree} aria-label="File tree">
    <div class="root">~/saee</div>
    <ul>
      {#each BUFFERS as b}
        <li>
          <button class:active={b.id === ui.buf} onclick={() => go(b.id)}>
            <span class="icon">{b.icon}</span> {b.name}
          </button>
          {#if b.id === 'experience' || b.id === 'projects'}
            <ul>
              {#each b.id === 'experience' ? experience.map(x => [x.company, x.bullets] as const) : projects.map(x => [x.name, x.bullets] as const) as [name, bs]}
                {@const m = match(bs, ui.focus)}
                <li>
                  <button class="child" onclick={() => go(b.id, undefined, slug(name))} title="{m}% match">
                    <span class="meter" style:--m="{m}%"></span>{name}
                  </button>
                </li>
              {/each}
            </ul>
          {/if}
        </li>
      {/each}
    </ul>
  </aside>

  <main bind:this={main} onscroll={onScroll} class="buffer" class:dash={ui.buf === 'dashboard'} tabindex="-1">
    {#if ui.buf === 'dashboard'}
      <Dashboard {go} />
    {:else}
      {#if ui.buf !== 'contact' && ui.buf !== 'education'}
        <div class="focusbar">
          <div class="fb-label">
            <span class="file">{buf.icon} {buf.name}</span>
            <span>Showing my work for <b>{leaning}</b>. Drag to change.</span>
          </div>
          <FocusDial />
        </div>
      {/if}

      <div class="page">
        {#if ui.buf === 'readme'}
          <header class="hero">
            <figure class="photo">
              <img src="{import.meta.env.BASE_URL}portrait.jpg" alt="Portrait of {about.name}" width="480" height="480" />
              <figcaption>saee.jpg</figcaption>
            </figure>
            <div>
              <h1>{about.name}</h1>
              <p class="sub">{about.title} · {about.location}</p>
              <p class="herolinks">
                <a class="btn" href={CV_URL} download={CV_NAME}>↓ Download CV</a>
                <button class="btn ghost" onclick={() => go('contact')}>Contact</button>
              </p>
            </div>
          </header>
          <p class="summary">{about.summary[summaryKey(ui.focus)]}</p>
          <div class="facts">
            <div>
              <h2 class="section"><span>##</span> Languages</h2>
              {#each about.languages as l}<p class="fact"><b>{l.language}</b> <span class="dim">{l.cefr} · {l.label}</span></p>{/each}
            </div>
            <div>
              <h2 class="section"><span>##</span> Interests</h2>
              <p class="chips">{#each about.interests.professional as i}<span>{i}</span>{/each}</p>
              <p class="dim small">Off the keyboard: {about.interests.personal.join(', ')}</p>
            </div>
          </div>
          <p class="next"><button class="btn" onclick={() => go('experience')}>Experience →</button> <button class="btn ghost" onclick={() => go('skills')}>Skills →</button></p>
        {:else if ui.buf === 'experience' || ui.buf === 'projects'}
          <div class="pagehead">
            <h1 class="section"><span>#</span> {ui.buf === 'experience' ? 'Experience' : 'Projects'}</h1>
            <div class="headtools">
              <span class="legend"><i class="sw se"></i> software eng. <i class="sw ai"></i> AI agents</span>
              <button class="link" onclick={() => setAllFolds(true)}>Expand all</button>
              <button class="link" onclick={() => setAllFolds(false)}>Collapse all</button>
            </div>
          </div>
          {#if ui.buf === 'experience'}
            {#each experience as e (e.company)}
              <Card id={slug(e.company)} title={e.company} role={e.role} when={range(e)} where={e.location} note={e.notes} bullets={e.bullets} />
            {/each}
          {:else}
            {#each projects as p (p.name)}
              <Card id={slug(p.name)} title={p.name} role={p.tech} when={p.period} bullets={p.bullets} />
            {/each}
          {/if}
        {:else if ui.buf === 'skills'}
          <h1 class="section"><span>#</span> Skills</h1>
          <Skills />
        {:else if ui.buf === 'education'}
          <h1 class="section"><span>#</span> Education</h1>
          {#each education.degrees as d}
            <article class="edu">
              <div>
                <h3>{d.degree}</h3>
                <p class="role">{d.institution}</p>
                {#if d.notes}<p class="dim">{d.notes}</p>{/if}
              </div>
              <div class="edu-meta">
                <span>{range(d)}</span>
                {#if d.location}<span>{d.location}</span>{/if}
                {#if d.gpa}<span class="gpa">GPA {d.gpa}</span>{/if}
              </div>
            </article>
          {/each}
          <h2 class="section"><span>##</span> Certifications</h2>
          {#each education.certifications as c}
            <p class="cert">
              {#if c.url}<a href={c.url} target="_blank" rel="noopener">{c.name}</a>{:else}<b>{c.name}</b>{/if}
              <span class="dim">· {c.issuer}, {c.date}</span>
            </p>
          {/each}
        {:else if ui.buf === 'contact'}
          <h1 class="section"><span>#</span> Contact</h1>
          <pre class="shell"><span class="c">#!/usr/bin/env bash</span>
<span class="c"># Say hi. Every value below is clickable.</span>

<span class="k">email</span>=<a href="mailto:{about.email}">"{about.email}"</a>
<span class="k">github</span>=<a href={about.github} target="_blank" rel="noopener">"{about.github.replace('https://', '')}"</a>
<span class="k">linkedin</span>=<a href={about.linkedin} target="_blank" rel="noopener">"{about.linkedin.replace('https://', '')}"</a>
<span class="k">location</span>=<span class="s">"{about.location}"</span></pre>
          <p class="next"><a class="btn" href="mailto:{about.email}?subject=Hello%20Saee">Email me</a> <a class="btn ghost" href={CV_URL} download={CV_NAME}>↓ Download CV</a> <a class="btn ghost" href={about.linkedin} target="_blank" rel="noopener">LinkedIn</a></p>
        {/if}
      </div>
    {/if}
  </main>

  <footer class="statusline">
    <span class="mode" class:cmdmode={cmd !== null}>{cmd !== null ? 'COMMAND' : 'NORMAL'}</span>
    <span class="sfile"><span class="icon">{buf.icon}</span> {buf.name}</span>
    <span class="spacer"></span>
    {#if ui.buf === 'dashboard' || ui.buf === 'contact' || ui.buf === 'education'}<span class="sdial"><FocusDial compact /></span>{/if}
    <button class="sbtn" onclick={() => (ui.help = true)}>? help</button>
    <button class="sbtn" onclick={cycleTheme} title="Change theme">◐ {ui.theme}</button>
    <span class="pos">{pos}</span>
  </footer>

  <div class="cmdline">
    {#if cmd !== null && suggestions.length}
      <ul class="wildmenu" role="listbox" aria-label="Commands">
        {#each suggestions as s}
          <li>
            <button onmousedown={e => e.preventDefault()} onclick={() => pickSuggestion(s)}>
              <span class="wname" class:arg={s.value.includes(' ')}>{s.label}</span>
              {#if s.hint}<span class="whint">{s.hint}</span>{/if}
              {#if s.desc}<span class="wdesc">{s.desc}</span>{/if}
            </button>
          </li>
        {/each}
      </ul>
    {/if}
    {#if cmd !== null}
      <span>:</span><input bind:this={cmdInput} bind:value={cmd} onkeydown={onCmdKey} onblur={() => (cmd = null)} aria-label="Command" spellcheck="false" autocomplete="off" />
    {:else if ui.message}
      <span class="msg">{ui.message}</span>
    {:else}
      <button class="hintbtn" onclick={() => openCmd()}>Type <b>:</b> for commands, <b>/</b> to search, <b>?</b> for keys — or click here.</button>
    {/if}
  </div>
</div>

{#if ui.help}<Help />{/if}
{#if ui.finder !== null}<Finder {go} query={ui.finder} />{/if}

<style>
  .editor {
    display: grid; height: 100dvh; font-family: var(--mono);
    grid-template: 'bar bar' auto 'tree main' 1fr 'status status' auto 'cmd cmd' auto / 30ch 1fr;
  }
  button { font: inherit; color: inherit; }
  .bufferline { grid-area: bar; display: flex; overflow-x: auto; background: var(--bg-alt); scrollbar-width: none; font-size: 0.9rem; }
  .bufferline button { all: unset; cursor: pointer; padding: 0.45em 1.5ch; white-space: nowrap; color: var(--dim); border-right: 1px solid var(--border); }
  .bufferline button:hover { color: var(--fg); }
  .bufferline button:focus-visible { outline: 1px solid var(--accent); outline-offset: -1px; }
  .tab.active { background: var(--bg); color: var(--fg); box-shadow: inset 0 2px 0 var(--accent); }
  .num { color: var(--dim); font-size: 0.8em; }
  .icon { color: var(--accent); }
  .bufferline .burger { color: var(--fg); padding: 0.45em 1.4ch; position: sticky; left: 0; z-index: 1; background: var(--bg-alt); }
  .nosidebar { grid-template-columns: 0 1fr; }
  .scrim { display: none; }
  .nosidebar .tree { visibility: hidden; }

  .tree { grid-area: tree; background: var(--bg-alt); overflow-y: auto; padding: 0.8em 0; border-right: 1px solid var(--border); font-size: 0.9rem; }
  .root { color: var(--blue); font-weight: 700; padding: 0 1.5ch 0.5em; }
  .tree ul { list-style: none; margin: 0; padding: 0; }
  .tree ul ul { padding-left: 2ch; border-left: 1px solid var(--border); margin-left: 2ch; }
  .tree button { all: unset; box-sizing: border-box; display: block; width: 100%; padding: 0.2em 1.5ch; cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .tree button:hover, .tree button:focus-visible { background: var(--bg-hl); }
  .tree button.active { color: var(--yellow); background: var(--bg-hl); }
  .tree .child { color: var(--dim); font-size: 0.92em; padding-left: 1ch; }
  .tree .child:hover { color: var(--fg); }
  .meter {
    display: inline-block; width: 3ch; height: 0.45em; margin-right: 1ch; vertical-align: middle; border-radius: 2px;
    background: linear-gradient(90deg, var(--green) var(--m), var(--border) var(--m)); transition: background 0.3s;
  }

  .buffer { grid-area: main; overflow-y: auto; outline: none; font-family: var(--sans); }
  .buffer.dash { padding: 0 2ch; font-family: var(--mono); }
  .focusbar {
    position: sticky; top: 0; z-index: 2; display: grid; grid-template-columns: minmax(0, 1fr) minmax(22rem, 1.3fr);
    align-items: center; gap: 0.5rem 2.5rem; padding: 0.9rem 2.5rem;
    background: color-mix(in srgb, var(--bg) 88%, transparent); backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--border);
  }
  .fb-label { display: flex; flex-direction: column; gap: 0.15rem; font-size: 0.9rem; color: var(--fg-soft); }
  .fb-label .file { font: 0.8rem var(--mono); color: var(--dim); }
  .fb-label b { color: var(--fg); }
  .page { max-width: 58rem; padding: 2rem 2.5rem 5rem; }

  .pagehead { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 0.5rem 2rem; margin-bottom: 1.2rem; }
  .pagehead h1 { margin: 0; }
  .headtools { display: flex; flex-wrap: wrap; align-items: center; gap: 1.2rem; font: 0.82rem var(--mono); color: var(--dim); }
  .legend { display: inline-flex; align-items: center; gap: 0.4rem; }
  .sw { display: inline-block; width: 0.8rem; height: 3px; border-radius: 2px; margin-left: 0.4rem; }
  .sw.se { background: var(--se); }
  .sw.ai { background: var(--ai); }
  .link { all: unset; cursor: pointer; color: var(--blue); }
  .link:hover, .link:focus-visible { color: var(--accent); text-decoration: underline; }

  .hero { display: flex; align-items: center; gap: 2.2rem; margin-bottom: 2rem; }
  .photo { margin: 0; flex: none; position: relative; }
  .photo img {
    display: block; width: 9.5rem; height: 9.5rem; object-fit: cover; border-radius: 14px;
    border: 1px solid var(--border); box-shadow: 6px 6px 0 color-mix(in srgb, var(--accent) 55%, transparent);
    filter: saturate(0.9); transition: transform 0.3s, box-shadow 0.3s, filter 0.3s;
  }
  .photo:hover img { transform: translate(-2px, -2px); box-shadow: 9px 9px 0 color-mix(in srgb, var(--accent) 70%, transparent); filter: none; }
  .photo figcaption { position: absolute; left: 0.5rem; bottom: -1.6rem; font: 0.72rem var(--mono); color: var(--dim); }
  .photo figcaption::before { content: '└ '; color: var(--border); }
  .herolinks { display: flex; flex-wrap: wrap; gap: 0.6rem; margin: 0; }
  .hero .sub { margin-bottom: 1.1rem; }
  .hero h1 { margin: 0; font: 700 2.4rem/1.15 var(--mono); color: var(--fg); letter-spacing: -0.02em; }
  .hero h1::before { content: '~/'; color: var(--dim); font-weight: 400; }
  .sub { margin: 0.4rem 0 1.6rem; color: var(--blue); font-family: var(--mono); }
  .summary { font-size: 1.15rem; line-height: 1.75; max-width: 46rem; margin: 0 0 2.2rem; padding-left: 1.2rem; border-left: 3px solid var(--accent); }
  .facts { display: grid; grid-template-columns: 1fr 2fr; gap: 2rem; }
  .fact { margin: 0.3rem 0; }
  .chips { display: flex; flex-wrap: wrap; gap: 0.4rem; margin: 0 0 0.8rem; }
  .chips span { font-size: 0.85rem; padding: 0.2rem 0.65rem; border-radius: 999px; background: var(--bg-hl); }
  .small { font-size: 0.9rem; }
  .next { margin-top: 2.5rem; display: flex; gap: 0.8rem; flex-wrap: wrap; }
  .btn {
    all: unset; cursor: pointer; font: 700 0.9rem var(--mono); padding: 0.6rem 1.1rem; border-radius: 6px;
    background: var(--accent); color: var(--bg); text-decoration: none;
  }
  .btn.ghost { background: transparent; color: var(--accent); box-shadow: inset 0 0 0 1px var(--accent); }
  .btn:hover { filter: brightness(1.1); }
  .btn:focus-visible { outline: 2px solid var(--fg); outline-offset: 2px; }

  .edu { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 0.5rem 2rem; padding: 1.3rem 1.5rem; margin-bottom: 1rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: 10px; }
  .edu > div:first-child { flex: 1 1 24rem; }
  .edu h3 { margin: 0; font: 700 1.15rem var(--mono); color: var(--yellow); }
  .edu .role { margin: 0.2rem 0 0.4rem; color: var(--blue); font-weight: 600; }
  .edu .dim { margin: 0.5rem 0 0; font-size: 0.92rem; }
  .edu-meta { display: flex; flex-direction: column; align-items: flex-end; font: 0.85rem/1.7 var(--mono); color: var(--dim); }
  .gpa { color: var(--green); }
  .cert { margin: 0.4rem 0; }

  .shell { font: 1rem/1.8 var(--mono); background: var(--bg-card); border: 1px solid var(--border); border-radius: 10px; padding: 1.3rem 1.5rem; overflow-x: auto; }
  .shell .c { color: var(--dim); font-style: italic; }
  .shell .k { color: var(--accent); }
  .shell .s, .shell a { color: var(--green); }

  .statusline { grid-area: status; display: flex; align-items: center; gap: 1.5ch; background: var(--bg-alt); font-size: 0.85rem; }
  .mode { background: var(--accent); color: var(--bg); font-weight: 700; padding: 0.2em 1.5ch; }
  .mode.cmdmode { background: var(--yellow); }
  .sfile { color: var(--fg); }
  .spacer { flex: 1; }
  .sbtn { all: unset; cursor: pointer; color: var(--dim); padding: 0 0.5ch; }
  .sbtn:hover, .sbtn:focus-visible { color: var(--fg); }
  .pos { background: var(--blue); color: var(--bg); padding: 0.2em 1.5ch; min-width: 4ch; text-align: center; }
  .cmdline { grid-area: cmd; display: flex; padding: 0.2em 1ch; min-height: 1.6em; font-size: 0.85rem; position: relative; }
  .wildmenu {
    position: absolute; bottom: 100%; left: 0; right: 0; z-index: 4; list-style: none; margin: 0; padding: 0.3rem 0;
    background: var(--bg-alt); border-top: 1px solid var(--accent); max-height: 50dvh; overflow-y: auto;
  }
  .wildmenu button { all: unset; box-sizing: border-box; cursor: pointer; display: flex; flex-wrap: wrap; gap: 0 1.5ch; width: 100%; padding: 0.3rem 1.5ch; }
  .wildmenu button:hover { background: var(--bg-hl); }
  .wname { color: var(--accent); font-weight: 700; min-width: 7ch; }
  .wname:not(.arg)::before { content: ':'; color: var(--dim); }
  .whint { color: var(--yellow); }
  .wdesc { color: var(--dim); }
  .search { margin-left: auto; }
  .bufferline .search { color: var(--fg); border-right: 0; border-left: 1px solid var(--border); position: sticky; right: 0; background: var(--bg-alt); }
  kbd { font: inherit; color: var(--accent); border: 1px solid var(--border); border-radius: 3px; padding: 0 0.4ch; margin-left: 0.5ch; }
  .cmdline input { all: unset; flex: 1; caret-color: var(--fg); }
  .msg { color: var(--yellow); }
  .hintbtn { all: unset; cursor: pointer; color: var(--dim); }
  .hintbtn b { color: var(--accent); }

  @media (max-width: 900px) {
    .focusbar { grid-template-columns: 1fr; padding: 0.7rem 1.2rem; }
  }
  @media (max-width: 760px) {
    .editor, .nosidebar { grid-template: 'bar' auto 'main' 1fr 'status' auto 'cmd' auto / 1fr; }
    .nosidebar .tree { visibility: visible; }
    .tree { position: fixed; inset: 2.2em auto 3.5em 0; width: min(32ch, 85vw); z-index: 5; transform: translateX(-105%); transition: transform 0.2s; box-shadow: 4px 0 20px #0006; }
    .tree.open { transform: none; }
    .scrim { all: unset; display: block; position: fixed; inset: 0; z-index: 4; background: #0007; }
    .sfile, .pos, .cmdline { display: none; }
    .sdial { display: none; }
    .page { padding: 1.4rem 1rem 4rem; }
    .bufferline { font-size: 0.82rem; }
    .shell { white-space: pre-wrap; overflow-wrap: anywhere; font-size: 0.9rem; padding: 1rem; }
    .num { display: none; }
    .search kbd { display: none; }
    .pagehead { margin-bottom: 0.8rem; }
    .legend { display: none; }
    h1.section, :global(h1.section) { font-size: 1.35rem; }
    .fb-label { display: none; }
    .focusbar { padding: 0.5rem 1rem 0.3rem; }
    .facts { grid-template-columns: 1fr; }
    .edu-meta { align-items: flex-start; }
    .hero h1 { font-size: 1.8rem; }
    .hero { flex-direction: column; align-items: flex-start; gap: 2.4rem; }
    .photo img { width: 7.5rem; height: 7.5rem; }
  }
</style>
