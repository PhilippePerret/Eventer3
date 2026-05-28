window.addEventListener('error', event => console.error(event.error))
console.log("-> app.js")
import App from './classes/App.js'

new App().start()
