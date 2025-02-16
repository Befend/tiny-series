# 实现`任务调度器requestIdleCallback`和简易的`Fiber`

---

theme: z-blue
highlight: a11y-dark

---

### 前言

回顾上节，我们实现了[`createElement`和`render`函数](https://juejin.cn/post/7326093660705128460)。

接下来我们继续来聊聊如何实现`任务调度器requestIdleCallback`和简易的`Fiber`。

如果需要渲染的 dom 树太大，就会导致浏览器卡顿，这是由于 JavaScript 是单线程执行的，因此我们需要利用`requestIdleCallback`方法，来让浏览器在空闲的时候渲染。

如下代码所示：

```js
let i = 0;
// 当数值过大时，会造成浏览器的卡顿
while (i < 1000000000000) {
  // 假如递归多个dom生成
  i++;
}
```

### `requestIdleCallback` 方法

[**`window.requestIdleCallback()`**](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback)方法插入一个函数，这个函数将在浏览器空闲时期被调用。这使开发者能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，如动画和输入响应。

其目的是为了解决当任务需要长时间占用主进程，导致更高优先级任务(如动画或事件任务)，无法及时响应，而带来的页面丢帧(卡死)情况。

简单理解就是，在一帧的空闲时间里安排回调执行的方法。

那么浏览器的一帧都包括哪些呢？

- 用户的交互
- JavaScript 脚本执行
- 开始帧
- `requestAnimationFrame`(rAF)的调用
- 布局计算
- 页面重绘

具体如下图所示：

![c7885e81d59849868445d3c0b37d655d~tplv-k3u1fbpfcp-zoom-in-crop-mark_1512_0_0_0.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d4157d62272d448985534f4072e07133~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1512&h=492&s=252446&e=png&b=faf0eb)

### `requestIdleCallback` 执行时机

在完成一帧中的输入处理、渲染和合成之后，线程会进入空闲时期（idle period），直到下一帧开始，或者队列中的任务被激活，又或者收到了用户新的输入。requestIdleCallback 定义的回调就是在这段空闲时期执行：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/16670e20845843369f611cfd6207d14a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=737&h=139&s=19307&e=png&a=1&b=cde0f1)
此类空闲期会在活动动画和屏幕更新期间频繁出现，但通常非常短(比如：在 60Hz 的设备下小于 16ms)

另一个空闲期的例子就是当用户代理空闲且没有发生屏幕更新时，浏览器其实处于空闲状态。这时候用户代理可能没有即将到来的任务来限制空闲期的结束。为了避免不可预测的任务（例如处理用户输入）中造成用户可感知的延迟，这些空闲周期的长度应限制为最大值[50ms](https://www.w3.org/TR/requestidlecallback/#why50)。一旦空闲期结束，用户代理可以安排另一个空闲期（如果它仍然空闲），使后台工作能够在较长的空闲时间内继续进行：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dcea367449f147d0bae3957575ff6f38~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=670&h=173&s=19545&e=png&a=1&b=fff1cc)

### `requestIdleCallback`的第二参数

由于`requestIdleCallback`利用的是帧的空闲时间，所以有可能出现浏览器一直处于繁忙状态，导致回调一直无法执行，那这时候就需要在调用`requestIdleCallback`的时候传递第二个配置参数`timeout`了。

- 使用 `timeout` 参数可以保证你的代码按时执行，但是 `requestIdleCallback` 本意就是在浏览器的空闲时间调用的，使用 `timeout` 就会强行执行，和 `requestIdleCallback` 的设计初衷就会互相矛盾，所以最好是让浏览器自己决定何时调用。
- 另一方面检查超时也会产生一些额外开销，该 api 调用频率也会增加

```js
// 无超时，一般打印值为 49/50 ms
function work(deadline) {
  console.log(`当前帧剩余时间: ${deadline.timeRemaining()}`);
  requestIdleCallback(work);
}
requestIdleCallback(work);

// =====================================================================
// 有超时，打印值就不怎么固定了
function work(deadline) {
  console.log(`当前帧剩余时间: ${deadline.timeRemaining()}`);
  requestIdleCallback(work, { timeout: 1500 });
}
requestIdleCallback(work, { timeout: 1500 });
```

### React 中的任务调度

```js
let taskId = 1;
function workLoop(deadline) {
  taskId++;
  let shouldYeild = false;
  while (!shouldYeild) {
    console.log(`taskId: ${taskId} run task. runtime: ${deadline.timeRemaining()}`);
    shouldYeild = deadline.timeRemaining() < 100;
  }
  requestIdleCallback(workLoop);
}
// React 核心调度算法模拟实现了 requestIdleCallback
// requestIdleCallback就是浏览器提供给我们用来判断这个时机的api，
// 它会在浏览器的空闲时间来执行传给它的回调函数。
// 另外如果指定了超时时间，会在超时后的下一帧强制执行
requestIdleCallback(workLoop);
```

### 实现简易的`Fiber`

`React Fiber` 是对 `React` 核心算法的一次彻底重构。旧版的 `React` 使用的是`“Stack Reconciler”`，它会在一次更新中同步地遍历整个组件树，这样的方式对于大型应用来说，可能会导致卡顿和不流畅的用户体验。而 `Fiber` 则采用了一种增量式的更新方式，使得渲染过程可以被中断和恢复，从而提升性能和响应速度。
在 `Fiber` 架构中，每个组件对应一个 `Fiber` 节点。这些 `Fiber` 节点构成了一个链表结构，每个节点都包含了该组件的状态、更新队列以及指向子组件、兄弟组件和父组件的指针。通过这种结构，React 可以灵活地遍历和操作组件树。

```js
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
```

### 小结

仓库传送门： [https://github.com/Befend/tiny-series/tree/master/tiny-react/class02]()

### 参考

- [MDN 的 requestIdleCallback](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback)

### 系列文章

- [实现`createElement`和`render`函数](https://juejin.cn/post/7326093660705128460)
