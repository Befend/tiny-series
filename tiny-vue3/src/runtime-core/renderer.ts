import { createComponentInstance, setupComponents } from "./components"

export function render(vnode, container) {
  // patch
  // 
  patch(vnode, container)
}

function patch(vnode, container) {
  // TODO 判断vnode是不是一个element 
  // 如果是element, 处理element
  // 思考题： 如何区分element 和 component 类型呢？
  // processElement(vnode, container)

  // 处理组件
  processComponent(vnode, container)
}

function processElement(vnode: any, container: any) {

}

function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container)
}

function mountComponent(vnode: any, container: any) {
  const instance = createComponentInstance(vnode)
  setupComponents(instance)
  setupRenderEffect(instance, container)
}

function setupRenderEffect(instance: any, container: any) {
  const subTree = instance.render()
  
  // vnode -> patch
  // vnode -> element -> mountElement
  patch(subTree, container)
}