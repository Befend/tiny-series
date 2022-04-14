import { h } from "../../lib/tiny-vue3.esm.js"

export const App = {
  // .vue
  // <template></template>
  // render
  render() {
    // ui
    window.self = this
    return h(
      "div",
      {
        id: "root",
        class: ["red", "test"]
      },
      // setupState
      // this.$el -> get root element
      "hi, " + this.msg
      // string
      // "hi, tiny-vue3"

      // array
      // [h("p", { class: "red"}, "hi"), h("p", { class: "blue"}, "tiny-vue3")]
    )
  },
  setup() {
    // 可参考composition api

    return {
      msg: "tiny-vue3"
    }
  }
}