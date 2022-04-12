import { createComponentInstance, setupComponents } from "./components"

export function render(vnode, container) {
  // patch
  // 
  patch(vnode, container)
}

function patch(vnode, container) {
  // 判断是不是 element
  // 处理组件
  processComponent(vnode, container)

  // TODO 处理element
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