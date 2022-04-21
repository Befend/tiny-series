
import { createApp } from "../../lib/tiny-vue3.esm.js"
import { App } from "./App.js"

const rootContainer = document.querySelector("#app")
// vue3
createApp(App).mount(rootContainer)