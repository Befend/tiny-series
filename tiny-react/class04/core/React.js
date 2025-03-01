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
        const isTextNode = typeof child === "string" || typeof child === "number";
        return isTextNode ? createTextNode(child) : child;
      }),
    },
  };
}

//  下一个工作单元 (fiber结构)
let nextUnitOfWork = null;
let root = null;

function render(el, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [el],
    },
  };
  root = nextUnitOfWork;
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

function initChildren(fiber, children) {
  // const children = fiber.props.children
  let prevFiber = null;
  children.forEach((child, index) => {
    const newFiber = {
      type: typeof child.type === "object" ? child.type.type : child.type,
      props: typeof child.type === "object" ? child.type.props : child.props,
      child: null,
      parent: fiber,
      sibling: null,
      dom: null,
    };

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevFiber.sibling = newFiber;
    }

    prevFiber = newFiber;
  });
}

function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)];
  // 3. 转换链表，设置好指针
  initChildren(fiber, children);
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    // 1. 创建dom
    const dom = (fiber.dom = createDom(fiber.type));
    // 2. 处理props
    updateProps(dom, fiber.props);
  }

  const children = fiber.props.children;
  // 3. 转换链表，设置好指针
  initChildren(fiber, children);
}

/**
 * 执行当前工作单元的工作
 * @param {*} fiber
 */
function performWorkOfUnit(fiber) {
  const isFunctionComponent = typeof fiber.type === "function";
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  // 4. 返回下一个要执行的任务
  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;
    nextFiber = nextFiber.parent;
  }
}

//  任务调度
function workLoop(deadline) {
  //  是否中断
  let shouldYeild = false;
  while (!shouldYeild && nextUnitOfWork) {
    nextUnitOfWork = performWorkOfUnit(nextUnitOfWork);
    shouldYeild = deadline.timeRemaining() < 1;
  }
  // 统一提交
  if (!nextUnitOfWork && root) {
    console.log(root);
    commitRoot();
  }
  //  任务放到下次执行
  requestIdleCallback(workLoop);
}

function commitRoot() {
  // 统一提交任务
  commitWork(root.child);
  root = null;
}

// 提交任务
function commitWork(fiber) {
  if (!fiber) return;
  let fiberParent = fiber.parent;
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }
  if (fiber.dom) {
    fiberParent.dom.append(fiber.dom);
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

//  开启任务调度
requestIdleCallback(workLoop);

const React = {
  render,
  createElement,
};

export default React;
