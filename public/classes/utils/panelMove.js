const _offsets = new Map()

export function movePanel(el, direction) {
  if (!el) return
  if (!_offsets.has(el)) _offsets.set(el, { dx: 0, dy: 0 })
  const offset = _offsets.get(el)
  if (direction === 'ArrowDown')  offset.dy += 50
  if (direction === 'ArrowUp')    offset.dy -= 50
  if (direction === 'ArrowRight') offset.dx += 50
  if (direction === 'ArrowLeft')  offset.dx -= 50
  el.style.translate = `${offset.dx}px ${offset.dy}px`
}

export function movablePanelInner(container) {
  return container?.firstElementChild ?? container
}
