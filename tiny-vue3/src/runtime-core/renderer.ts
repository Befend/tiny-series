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
  console.log(vnode.type);

  if (typeof vnode.type === 'string') {
    processElement(vnode, container)
  } else {
    // 处理组件
    processComponent(vnode, container)
  }
}

function processElement(vnode: any, container: any) {
  mountElement(vnode, container)
}

function mountElement(vnode: any, container: any) {
  // vnode -> element - div
  const el = (vnode.el = document.createElement(vnode.type))
  
  // string array
  const { children } = vnode
  if (typeof children === "string") {
    el.textContent = children
  } else if (Array.isArray(children)) {
    // vnode
    mountChildren(vnode, el)
  }

  // props
  const { props } = vnode
  for (const key in props) {
    const val = props[key]
    el.setAttribute(key, val)
  }

  container.append(el)
}

function mountChildren(vnode, container) {
  vnode.children.forEach((v) => {
    patch(v, container)
  })
}

function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container)
}

function mountComponent(initialVNode: any, container: any) {
  const instance = createComponentInstance(initialVNode)
  setupComponents(instance)
  setupRenderEffect(instance, initialVNode, container)
}

function setupRenderEffect(instance: any, initialVNode: any, container: any) {
  const { proxy } = instance
  const subTree = instance.render.call(proxy)
  
  // vnode -> patch
  // vnode -> element -> mountElement
  patch(subTree, container)

  // element -> mount
  initialVNode.el = subTree.el
}