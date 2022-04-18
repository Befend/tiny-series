import { h, getCurrentInstance } from "../../lib/tiny-vue3.esm.js"

export const Foo = {
  name: "Foo",
  render() {
    return h("div", {}, "foo")
  },
  setup() {
    const instance = getCurrentInstance()
    console.log("App:", instance);
    return {}
  }
}