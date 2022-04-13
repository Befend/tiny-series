import { h } from '../../lib/tiny-vue3.esm.js';
export const App = {
  // .vue
  // <template></template>
  // render
  render() {
    // ui
    return h("div", "hi, " + this.msg)
  },
  setup() {
    // 可参考composition api

    return {
      msg: "mini-vue"
    }
  }
}