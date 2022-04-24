import { createComponentInstance, setupComponents } from "./components"
import { ShapeFlags } from "../shared/ShapeFlags"
import { Fragment, Text } from "./vnode"
import { createAppAPI } from "./createApp"
import { effect } from "../reactivity/effect"
import { EMPTY_OBJ } from "../shared"

export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText
  } = options

  function render(vnode, container) {
    // patch
    patch(null, vnode, container, null, null)
  }

  // n1 -> 老的
  // n2 -> 新的
  function patch(n1, n2, container, parentComponent, anchor) {
    // ShapeFlags
    // vnode -> flag
    // 判断vnode是 element 和 component 类型\

    const { type, shapeFlag } = n2

    // Fragment -> 只渲染 children
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent, anchor)
        break
      case Text:
        processText(n1, n2, container)
        break
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) { // element
          processElement(n1, n2, container, parentComponent, anchor)
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) { // STATEFUL_COMPONENT
          // 处理组件
          processComponent(n1, n2, container, parentComponent, anchor)
        }
        break
    }
  }

  function processText(n1, n2:any, container:any) {
    const { children } = n2
    const textNode = (n2.el = document.createTextNode(children))
    container.append(textNode)
  }

  function processFragment(n1, n2:any, container:any, parentComponent, anchor) {
    // Implement
    mountChildren(n2.children, container, parentComponent, anchor)    
  }

  function processElement(n1, n2: any, container: any, parentComponent, anchor) {
    if (!n1) {
      mountElement(n2, container, parentComponent, anchor)
    } else {
      patchElement(n1, n2, container, parentComponent, anchor)
    }
  }

  function patchElement(n1, n2, container, parentComponent, anchor) {
    console.log("patchElement");
    console.log("n1", n1);
    console.log("n2", n2);

    // props
    // children
    const oldProps = n1.props || EMPTY_OBJ
    const newProps = n2.props || EMPTY_OBJ

    const el = (n2.el = n1.el)

    patchChildren(n1, n2, el, parentComponent, anchor)
    patchProps(el, oldProps, newProps)
  }

  function patchChildren(n1, n2, container, parentComponent, anchor) {
    const prevShapeFlag = n1.shapeFlag
    const c1 = n1.children
    const { shapeFlag } = n2
    const c2 = n2.children

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // children
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 1. 把老的 children 清空
        unmountChildren(n1.children)
        // 2. 设置 text
        // hostSetElementText(container, c2)
      }
      // text
      if (c1 !== c2) {
        hostSetElementText(container, c2)
      }
    } else {
      // new array
      if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(container, "")
        mountChildren(c2, container, parentComponent, anchor)
      } else {
        // array diff array
        patchKeyedChildren(c1, c2, container, parentComponent, anchor)
      }
    }
  }

  function patchKeyedChildren(c1, c2, container, parentComponent, parentAnchor) {
    let i = 0
    const l2 = c2.length
    let e1 = c1.length - 1
    let e2 = l2 - 1

    function isSomeVNodeType(n1, n2) {
      // type
      // key
      return n1.type === n2.type && n1.key === n2.key
    }

    // 左侧
    while (i <= e1 && i <= e2) {
      const n1 = c1[i]
      const n2 = c2[i]
      if (isSomeVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor)
      } else {
        break
      }
      i++
    }

    // 右侧
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1]
      const n2 = c2[e2]
      if (isSomeVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor)
      } else {
        break
      }
      e1--
      e2--
    }

    // 3. 新的比老的多 创建
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1
        const anchor = nextPos < l2 ? c2[nextPos].el : null
        while(i <= e2) {
          patch(null, c2[i], container, parentComponent, anchor)
          i++
        }
      }
    } else if (i > e2) { // 4. 老的比新的多 删除
      while (i <= e1) {
        hostRemove(c1[i].el)
        i++
      }
    }
  }

  function unmountChildren(children) {
    for (let i = 0; i < children.length; i++) {
      const el = children[i].el
      // remove
      hostRemove(el)
    }
  }
  
  function patchProps(el, oldProps, newProps) {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        const prevProp = oldProps[key]
        const nextProp = newProps[key]
  
        if (prevProp !== nextProp) {
          hostPatchProp(el, key, prevProp, nextProp)
        }
      }
  
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!(key in newProps)) {
            hostPatchProp(el, key, oldProps[key], null)
          }
        }
      }
    }
  }

  function mountElement(vnode: any, container: any, parentComponent, anchor) {
    // vnode -> element - div

    // canvas -> new Element
    const el = (vnode.el = hostCreateElement(vnode.type))
    
    // string array
    const { children, shapeFlag } = vnode
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // text_children
      el.textContent = children
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      // array_children
      mountChildren(vnode.children, el, parentComponent, anchor)
    }

    // props
    const { props } = vnode
    for (const key in props) {
      const val = props[key]

      hostPatchProp(el, key, null, val)
    }

    // container.append(el)

    // canvas -> addChild()
    hostInsert(el, container)
  }

  function mountChildren(children, container, parentComponent, anchor) {
    children.forEach((v) => {
      patch(null, v, container, parentComponent, anchor)
    })
  }

  function processComponent(n1, n2: any, container: any, parentComponent, anchor) {
    mountComponent(n2, container, parentComponent, anchor)
  }

  function mountComponent(initialVNode: any, container: any, parentComponent, anchor) {
    const instance = createComponentInstance(initialVNode, parentComponent)
    setupComponents(instance)
    setupRenderEffect(instance, initialVNode, container, anchor)
  }

  function setupRenderEffect(instance: any, initialVNode: any, container: any, anchor) {
    effect(() => {
      if (!instance.isMounted) {
        // init
        console.log("init");
        const { proxy } = instance
        const subTree = (instance.subTree = instance.render.call(proxy))
        console.log(subTree);
        // vnode -> patch
        // vnode -> element -> mountElement
        patch(null, subTree, container, instance, anchor)
    
        // element -> mount
        initialVNode.el = subTree.el

        instance.isMounted = true
      } else {
        // update
        console.log("update");
        const { proxy } = instance
        const subTree = instance.render.call(proxy)
        const preSubTree = instance.subTree
        instance.subTree = subTree

        patch(preSubTree, subTree, container, instance, anchor)
      }
    })
  }

  return {
    createApp: createAppAPI(render)
  }
}