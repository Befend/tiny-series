import { h } from "../../lib/tiny-vue3.esm.js"
import { Foo } from "./Foo.js"

export const App = {
  name: "App",
  // .vue
  // <template></template>
  // 必须要写 render
  render() {
    // ui
    window.self = this
    return h(
      "div", {
        id: "root",
        class: ["red", "test"],
        onClick() {
          console.log('click')
        },
        onMousedown() {
          console.log('mousedown')
        }
      },
      [h("div", {}, "hi," + this.msg), h(Foo, {
        count: 1
      })]
      // setupState
      // this.$el -> get root element
      // "hi, " + this.msg
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