function createTextNode(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        return typeof child === "string" ? createTextNode(child) : child;
      }),
    },
  };
}

//  下一个工作单元 (fiber结构)
let nextUnitOfWork = null;

//  开启任务调度
requestIdleCallback(workLoop);

function render(el, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [el],
    },
  };
  // const dom =
  // 	el.type === "TEXT_ELEMENT"
  // 		? document.createTextNode("")
  // 		: document.createElement(el.type)
  // // id class
  // Object.keys(el.props).forEach((key) => {
  // 	if (key !== "children") {
  // 		dom[key] = el.props[key]
  // 	}
  // })
  // const children = el.props.children
  // children.forEach((child) => {
  // 	render(child, dom)
  // })
  // container.append(dom)
}

//  任务调度
function workLoop(deadline) {
  //  是否中断
  let shouldYeild = false;
  while (!shouldYeild && nextUnitOfWork) {
    nextUnitOfWork = performWorkOfUnit(nextUnitOfWork);
    shouldYeild = deadline.timeRemaining() < 1;
  }
  //  任务放到下次执行
  requestIdleCallback(workLoop);
}

function createDom(type) {
  return type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(type);
}

function updateProps(dom, props) {
  Object.keys(props).forEach((key) => {
    if (key !== "children") {
      dom[key] = props[key];
    }
  });
}

function initChildren(fiber) {
  let prevFiber = null;
  fiber.props.children.forEach((child, index) => {
    const nextFiber = {
      type: typeof child.type === "object" ? child.type.type : child.type,
      props: typeof child.type === "object" ? child.type.props : child.props,
      child: null,
      parent: fiber,
      sibling: null,
      dom: null,
    };

    if (index === 0) {
      fiber.child = nextFiber;
    } else {
      prevFiber.sibling = nextFiber;
    }

    prevFiber = child.type;
  });
}

/**
 * 执行当前工作单元的工作
 * @param {*} fiber
 */
function performWorkOfUnit(fiber) {
  if (!fiber.dom) {
    // 1. 创建dom
    const dom = createDom(fiber.type);
    fiber.dom = dom;
    // 插入节点
    fiber.parent.dom.append(dom);

    // 2. 处理props
    updateProps(dom, fiber.props);
  }

  // 3. 转换链表，设置好指针
  initChildren(fiber);

  // 4. 返回下一个要执行的任务
  if (fiber.child) {
    return fiber.child;
  }

  if (fiber.sibling) {
    return fiber.sibling;
  }
  return fiber.parent?.sibling;
}

const React = {
  render,
  createElement,
};

export default React;
