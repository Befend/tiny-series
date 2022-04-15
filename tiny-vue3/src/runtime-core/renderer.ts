import { createComponentInstance, setupComponents } from "./components"

export function render(vnode, container) {
  // patch
  // 
  patch(vnode, container)
}

function patch(vnode, container) {
  // ShapeFlags
  // vnode -> flag
  // 判断vnode是 element 和 component 类型
  // element
  const { shapeFlag } = vnode
  if (shapeFlag & shapeFlag.ELEMENT) {
    processElement(vnode, container)
    // STATEFUL_COMPONENT
  } else if (shapeFlag & shapeFlag.STATEFUL_COMPONENT) {
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
  const { children, shapeFlag } = vnode
  if (shapeFlag & shapeFlag.TEXT_CHILDREN) {
    // text_children
    el.textContent = children
  } else if (shapeFlag & shapeFlag.ARRAY_CHILDREN) {
    // array_children
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