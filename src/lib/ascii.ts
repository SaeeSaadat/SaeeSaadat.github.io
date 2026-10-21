const RAMP = ' .:-=+*#%@'

// Draws an image as coloured ASCII onto a canvas: bright pixels get dense characters,
// each character keeps its pixel's colour (brightened to read on a dark panel).
export async function drawAscii(canvas: HTMLCanvasElement, src: string, cols: number, height: number) {
  const img = new Image()
  img.src = src
  await img.decode()
  const rows = Math.round(((cols * img.height) / img.width) * 0.6) // cell is 0.6em wide, 1em tall
  const ctx = Object.assign(document.createElement('canvas'), { width: cols, height: rows })
    .getContext('2d', { willReadFrequently: true })!
  ctx.drawImage(img, 0, 0, cols, rows)
  const px = ctx.getImageData(0, 0, cols, rows).data

  const lum: number[] = []
  for (let i = 0; i < px.length; i += 4) lum.push(0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2])
  // Everything up to the brightest backdrop pixel goes blank (sampled on the top and side edges, above the shoulders)
  const edge = lum.filter((_, i) => i < lum.length * 0.6 && (i < cols || i % cols === 0 || i % cols === cols - 1))
  const lo = [...edge].sort((a, b) => a - b)[Math.floor(edge.length * 0.95)] + 6
  const hi = [...lum].sort((a, b) => a - b)[Math.floor(lum.length * 0.99)]

  const cell = height / rows
  const dpr = devicePixelRatio || 1
  canvas.width = Math.round(cols * cell * 0.6 * dpr)
  canvas.height = Math.round(height * dpr)
  canvas.style.width = `${cols * cell * 0.6}px`
  canvas.style.height = `${height}px`
  const out = canvas.getContext('2d')!
  out.scale(dpr, dpr)
  out.font = `700 ${cell}px 'JetBrains Mono', monospace`
  out.textBaseline = 'top'

  lum.forEach((l, i) => {
    const v = Math.min(1, Math.max(0, (l - lo) / (hi - lo || 1))) ** 0.65
    if (v < 0.22) return // faint backdrop halo
    const ch = RAMP[Math.round(v * (RAMP.length - 1))]
    // Push saturation up (photo is muted), then lift so the brightest channel is at least 190
    const gray = lum[i]
    const [r, g, b] = [px[i * 4], px[i * 4 + 1], px[i * 4 + 2]].map(c => Math.max(0, gray + (c - gray) * 1.8))
    const k = Math.max(1, 190 / Math.max(r, g, b, 1))
    out.fillStyle = `rgb(${Math.min(255, r * k)},${Math.min(255, g * k)},${Math.min(255, b * k)})`
    out.fillText(ch, (i % cols) * cell * 0.6, Math.floor(i / cols) * cell)
  })
}
