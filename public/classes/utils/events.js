export function stopEvent(event) {
  event.preventDefault()
  event.stopPropagation()
  return false
}
