import { h } from "../../lib/tiny-vue3.esm.js"

export const App = {
  // .vue
  // <template></template>
  // render
  render() {
    // ui
    return h(
      "div",
      {
        id: "root",
        class: ["red", "test"]
      },
      // "hi, " + this.msg
      // string
      // "hi, tiny-vue3"

      // array
      [h("p", { class: "red"}, "hi"), h("p", { class: "blue"}, "tiny-vue3")]
    )
  },
  setup() {
    // 可参考composition api

    return {
      msg: "mini-vue"
    }
  }
}