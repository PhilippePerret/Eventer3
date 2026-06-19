export default class Notification {
  static show(message, { duration = Math.max(2000, message.length * 90) } = {}) {
    const el = document.querySelector('#notification')
    if (!el) return
    el.textContent = message
    el.classList.remove('hidden')
    clearTimeout(Notification._timer)
    Notification._timer = setTimeout(() => el.classList.add('hidden'), duration)
  }
}
