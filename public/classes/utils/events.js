export function StopEvent(event) {
  event.preventDefault()
  event.stopPropagation()
  return false
}
