import { createComponentInstance, setupComponents } from "./components"
import { ShapeFlags } from "../shared/ShapeFlags"
import { Fragment, Text } from "./vnode"

export function render(vnode, container) {
  // patch
  patch(vnode, container, null)
}

function patch(vnode, container, parentComponent) {
  // ShapeFlags
  // vnode -> flag
  // 判断vnode是 element 和 component 类型\

  const { type, shapeFlag } = vnode

  // Fragment -> 只渲染 children
  switch (type) {
    case Fragment:
      processFragment(vnode, container, parentComponent)
      break
    case Text:
      processText(vnode, container)
      break
    default:
      if (shapeFlag & ShapeFlags.ELEMENT) { // element
        processElement(vnode, container, parentComponent)
      } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) { // STATEFUL_COMPONENT
        // 处理组件
        processComponent(vnode, container, parentComponent)
      }
      break
  }
}

function processText(vnode:any, container:any) {
  const { children } = vnode
  const textNode = (vnode.el = document.createTextNode(children))
  container.append(textNode)
}

function processFragment(vnode:any, container:any, parentComponent) {
  // Implement
  mountChildren(vnode, container, parentComponent)    
}

function processElement(vnode: any, container: any, parentComponent) {
  mountElement(vnode, container, parentComponent)
}

function mountElement(vnode: any, container: any, parentComponent) {
  // vnode -> element - div
  const el = (vnode.el = document.createElement(vnode.type))
  
  // string array
  const { children, shapeFlag } = vnode
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    // text_children
    el.textContent = children
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    // array_children
    mountChildren(vnode, el, parentComponent)
  }

  // props
  const { props } = vnode
  for (const key in props) {
    const val = props[key]
    // 具体的 click -> 通用
    // on + Event name -> onMousedown
    const isOn = (key:string) => /^on[A-Z]/.test(key)
    if (isOn(key)) {
      const event = key.slice(2).toLowerCase()
      el.addEventListener(event, val)
    } else {
      el.setAttribute(key, val)
    }
  }

  container.append(el)
}

function mountChildren(vnode, container, parentComponent) {
  vnode.children.forEach((v) => {
    patch(v, container, parentComponent)
  })
}

function processComponent(vnode: any, container: any, parentComponent) {
  mountComponent(vnode, container, parentComponent)
}

function mountComponent(initialVNode: any, container: any, parentComponent) {
  const instance = createComponentInstance(initialVNode, parentComponent)
  setupComponents(instance)
  setupRenderEffect(instance, initialVNode, container)
}

function setupRenderEffect(instance: any, initialVNode: any, container: any) {
  const { proxy } = instance
  const subTree = instance.render.call(proxy)
  
  // vnode -> patch
  // vnode -> element -> mountElement
  patch(subTree, container, instance)

  // element -> mount
  initialVNode.el = subTree.el
}