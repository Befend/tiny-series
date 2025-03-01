# 实现`FunctionComponent`

### 前言

回顾上一节，我们通过实现任务调度器 `requestIdleCallback` 利用了空余时间去完成每个 task。这种方式存在一个问题，当中途没有空余时间时，用户可能会看到渲染一半的 dom。

我们可以采用统一提交的方式去解决这个问题，先处理链表，最后再统一添加到屏幕中。

### FunctionComponent

自 `React 16.8` 引入 `Hooks` 以来，`函数式组件（FunctionComponent）`彻底改变了 `React` 开发的格局。它不再是简单的无状态组件，而是通过 `Hooks` 机制融合了**状态管理**、**生命周期和副作用处理**，成为 `React` 官方推荐的组件开发范式。

### 实现流程图解

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

### 总结

`React` 通过 `函数直接调用`、`Fiber 架构的状态管理` 和 `Hooks 的链表顺序追踪`，实现了`函数组件`的轻量化与高效更新。相较于类组件，函数组件避免了实例化开销，更契合 React 的声明式设计理念，同时 `Hooks` 提供了灵活的状态与副作用管理能力。

### 系列文章

- [实现`createElement`和`render`函数](https://juejin.cn/post/7326093660705128460)
- [实现`任务调度器requestIdleCallback`和简易的`Fiber`](https://juejin.cn/post/7471968780866338843)
