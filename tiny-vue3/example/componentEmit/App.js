import { h } from "../../lib/tiny-vue3.esm.js"
import { Foo } from "./Foo.js"

export const App = {
  name: "App",
  render() {
    // emit
    return h("div", {}, [h("div", {}, "App"), h(Foo, {
      // on + Event
      onAdd(a, b) {
        console.log("Add", a, b);
      },
      // add-foo -> addFoo
      onAddFoo() {
        console.log("onAddFoo");
      }
    })])
  },
  setup() {
    return {
    }
  }
}