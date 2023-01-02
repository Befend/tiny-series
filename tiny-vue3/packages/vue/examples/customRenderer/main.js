import { createRenderer } from "../../dist/tiny-vue3.esm.js"
import { App } from "./App.js"

console.log(PIXI);
const game = new PIXI.Application({
  width: 500,
  height: 500
})
document.body.append(game.view)
const renderer = createRenderer({
  createElement(type) {
    const rect = new PIXI.Graphics()
    rect.beginFill(0xff0000)
    rect.drawRect(0, 0, 100, 100)
    rect.endFill()
    return rect
  },
  patchProp(el, key, val) {
    el[key] = val
  },
  insert(el, parent) {
    parent.addChild(el)
  }
})
// const rootContainer = document.querySelector("#app")
// // vue3
renderer.createApp(App).mount(game.stage)