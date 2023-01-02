import { h } from "../../dist/tiny-vue3.esm.js"

export const Foo = {
  setup(props) {
    // 1. 在setup中接收props
    // props.count
    console.log(props);

    // 3. props不可修改 shallow readonly
    props.count++
    console.log(props);
  },
  render() {
    // 2. 在render中可以访问props的属性
    return h("div", {}, "foo:" + this.count)
  }
}