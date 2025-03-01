# 实现统一提交和 FunctionComponent

### 前言

回顾上一节，我们通过实现任务调度器 `requestIdleCallback` 利用了空余时间去完成每个 task。
通过`Firber`结构，`React` 可以灵活地遍历和操作组件树。

但是，这种方式存在一个问题，就是当中途没有空余时间时，用户可能会看到渲染一半的 dom。我们可以采用统一提交的方式去解决这个问题，先处理链表，最后再统一添加到屏幕中。

### 统一提交

其本质就是**将 DOM 的挂载操作统一放到最后执行，一次性完成所有 DOM 的挂载**。这种方式可以有效解决因某个 DOM 挂载时出现动画或任务插入导致的页面显示不完整问题，提升用户体验。

#### 实现思路

##### 1. **创建挂载函数**

    将挂载DOM的内容抽取到一个新的函数`commitWork(fiber)`中，用于挂载单个DOM节点。

```js
// 提交任务
function commitWork(fiber) {
  if (!fiber) return;
  let fiberParent = fiber.parent;
  // ...
}
```

##### 2. **遍历 fiber 架构**

通过`commitWork`遍历 fiber 树，递归挂载所有节点。

```js
// 提交任务
function commitWork(fiber) {
  if (!fiber) return;
  let fiberParent = fiber.parent;
  // 递归挂载所有节点
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }
  if (fiber.dom) {
    fiberParent.dom.append(fiber.dom);
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}
```

##### 3.**统一提交入口**

提供一个总的入口函数`commitRoot`，在函数中调用`commitWork`完成所有 DOM 的挂载。

```js
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
```

#### 优势

- `统一提交`的处理可以在页面渲染前完成所有 DOM 的挂载，避免用户看到不完整的页面内容。
- 通过一次性挂载所有 DOM，减少了浏览器重绘和重排的次数，提高页面渲染性能。

### FunctionComponent

自 `React 16.8` 引入 `Hooks` 以来，`函数式组件（FunctionComponent）`彻底改变了 `React` 开发的格局。Function Component 就是以 Function 的形式创建的 React 组件。它不再是简单的无状态组件，而是通过 `Hooks` 机制融合了**状态管理**、**生命周期和副作用处理**，成为 `React` 官方推荐的组件开发范式。

#### 实现流程图解

```js
1. 调用函数组件 (props) → 生成 JSX
   |
2. 转换为 React Element（虚拟 DOM 节点）
   |
3. 调和阶段（Reconciliation）：
   - 创建/更新 Fiber 节点
   - 处理 Hooks，记录状态和副作用到 Fiber
   |
4. Diff 算法 → 生成更新计划
   |
5. 提交阶段（Commit）：
   - 更新 DOM
   - 执行副作用（useEffect）
```

#### 实现思路

##### 1. 在处理 Firbe 节点时，判断节点的类型，区分函数组件和原生组件，分别处理。

```js
/**
 * 执行当前工作单元的工作
 * @param {*} fiber
 */
function performWorkOfUnit(fiber) {
  // 判断节点是否为函数组件
  const isFunctionComponent = typeof fiber.type === "function";
  if (isFunctionComponent) {
    // 函数组件
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }
  //...
}
function updateFunctionComponent(fiber) {...}
function updateHostComponent(fiber) {...}
```

##### 2. 递归生成链表结构

-
- 采用深度优先遍历：优先处理子节点，再兄弟节点，最后回溯父节点。
- **流程**：子节点 → 兄弟节点 → 叔节点（父节点的兄弟），符合 Fiber 遍历顺序。

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/e69416fc65464cdfbd17b3a90c275052~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bGx5ran5ZCs6bm_6bij:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzQ5MTcwNDY2MzE5MDYwNSJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1740915958&x-orig-sign=KGVNud1kRvFdc%2BPrTYLrDd29JQ8%3D)

```js
function performWorkOfUnit(fiber) {
  // 判断节点是否为函数类型
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
```

#### 优势

`React` 通过 `函数直接调用`、`Fiber 架构的状态管理` 和 `Hooks 的链表顺序追踪`，实现了`函数组件`的轻量化与高效更新。相较于类组件，函数组件避免了实例化开销，更契合 React 的声明式设计理念，同时 `Hooks` 提供了灵活的状态与副作用管理能力。

### 小结

- 本文主要实现将组件树转换为 `Fiber` 链表，通过迭代方式分步处理每个节点，实现可中断的渲染过程。
- 实现了简易的`统一提交`和`FunctionComponent`的实现思路，省略了 `props`的特殊处理、`DOM` 创建细节和复杂子结构支持。
- 展示了任务分片和链表构建的核心思想，但实际应用中需处理更多`边界情况`和`React`特性。

### 系列文章

- [实现`createElement`和`render`函数](https://juejin.cn/post/7326093660705128460)
- [实现`任务调度器requestIdleCallback`和简易的`Fiber`](https://juejin.cn/post/7471968780866338843)
