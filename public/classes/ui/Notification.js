export default class Notification {
  static show(message, { duration = 2000 } = {}) {
    const el = document.querySelector('#notification')
    if (!el) return
    el.textContent = message
    el.classList.remove('hidden')
    clearTimeout(Notification._timer)
    Notification._timer = setTimeout(() => el.classList.add('hidden'), duration)
  }
}
