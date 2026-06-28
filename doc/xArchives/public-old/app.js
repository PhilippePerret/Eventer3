// window.onkeydown = function(ev){
//   console.log("onkeydown", ev)
// }
// window.onkeyup = function(ev){
//   console.log("onkeyup", ev)
// }
// window.onkeypress = function(ev){
//   console.log("onkeypress", ev)
// }
window.addEventListener('error', event => console.error(event.error))
// console.log("-> app.js")
import App from './classes/App.js'

new App().start()
