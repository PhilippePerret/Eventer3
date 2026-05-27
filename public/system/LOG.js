export default class LOG {

  static level = 0

  static on(level = 1) {
    this.level = level
  }

  static off() {
    this.level = 0
  }

  static m(...args) {

    if (this.level === 0) return

    let messageLevel   = 1
    let message        = null
    let messagePayload = []

    if (typeof args[0] === 'number') {
      messageLevel = args[0]
      message = args[1]
      messagePayload = args.slice(2)
    } else {
      message = args[0]
      messagePayload = args.slice(1)
    }

    if (messageLevel > this.level) return

    const prefix = `[LOG ${messageLevel}]`

    if (messagePayload.length === 0) {
      console.log(prefix, message)
      return

    }

    console.log(prefix, message, ...messagePayload)

  }

}