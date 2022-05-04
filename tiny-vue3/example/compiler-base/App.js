import { ref } from "../../lib/tiny-vue3.esm.js";

export const App = {
  name: "App",
  template: `<div>hi, {{message}}, {{count}}</div>`,
  setup() {
    const count = (window.count = ref(1));
    return {
      count,
      message: 'tiny-vue3'
    };
  },
};
