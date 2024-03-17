# 实现`createElement`和`render`函数

### 前言

最近参加了 [崔效瑞老师](https://space.bilibili.com/175301983) 的 7 天 mini-react 训练营，虽然每天工作很忙，但还是抽出一两个小时跟进学习，坚持了 7 天，还是得给坚持到最后的自己点个赞！

虽然之前没有接触过 React 的源码，但是通过学习任务的拆分，将复杂模块的任务拆分成一个个小任务，小步走实现，再逐步优化代码。

时间虽短，内容却不少。先开始浅浅地记录下我的学习成果，先起个好头，希望今年能顺利更新完这个系列，给 2024 的自己先立第一个 flag！！

在这 7 天的 mini-react 训练营中，我学到了：

- [x] 实现`createElement`和`render`函数
- [x] 实现`任务调度器requestIdleCallback`
- [x] 实现简易的`fiber`
- [x] 实现`functionComponent`
- [x] 实现`事件绑定`
- [x] 实现`props`
- [x] 实现`diff更新`
- [x] 实现`useState`
- [x] 实现`useEffect`

话不多说，进入今天的主题，先开始`React的初始化`，实现`createElement`和`render`函数

### createElement 函数

`createElement` 函数是用于创建虚拟 DOM 元素的函数。它通常被 JSX 编译器所使用，用来将 JSX 语法转换为对 `React.createElement` 的调用。

```js
function createTextNode(text) {
	return {
		type: "TEXT_ELEMENT",
		props: {
			nodeValue: text,
			children: [],
		},
	}
}

function createElement(type, props, ...children) {
	return {
		type,
		props: {
			...props,
			children: children.map((child) => {
				const isTextNode =
					typeof child === "string" || typeof child === "number"
				return isTextNode ? createTextNode(child) : child
			}),
		},
	}
}
```

`createElement` 函数接受三个参数：`type` 表示元素的类型（例如 `'div'`），`props` 表示元素的属性（例如 `{ className: 'my-class' }`），以及 `children` 表示元素的子元素。在实现中，它返回一个包含 `type` 和 `props` 属性的对象。

为了处理文本节点，我们还定义了 `createTextNode` 函数，它创建一个特殊的类型为 `'TEXT_ELEMENT'` 的对象，用于表示文本节点。

在实际使用中，React 会递归地处理这些虚拟 DOM 对象，最终将它们转换为实际的 DOM 元素并渲染到页面上。

```
注意： 上述代码只是一个简化版的实现，真实的 React 源码中应该更加复杂，并包含更多的功能和优化。
```

### render 函数

`render` 函数是 React 中用于将虚拟 DOM 渲染到实际 DOM 的核心函数。

```js
function render(el, container) {
	const dom =
		el.type === "TEXT_ELEMENT"
			? document.createTextNode("")
			: document.createElement(el.type)

	// id class
	Object.keys(el.props).forEach((key) => {
		if (key !== "children") {
			dom[key] = el.props[key]
		}
	})
	const children = el.props.children
	children.forEach((child) => {
		render(child, dom)
	})
	container.append(dom)
}
```

`render` 函数接受两个参数：`element` 表示要渲染的虚拟 DOM 元素，`container` 表示要渲染到的实际 DOM 容器。  
首先，根据虚拟 DOM 的类型创建对应的实际 DOM 元素（文本节点和普通元素分别处理）。然后，将虚拟 DOM 元素的属性设置到实际 DOM 元素上，遍历子元素并递归调用 `render` 函数。最后，将创建好的实际 DOM 元素添加到容器中。

### 导出 render 函数

在`ReactDom`文件导出`render`函数之后， 调用`ReactDOM.createRoot(element).render` 函数。这样，就可以使用 React 的渲染功能了。

```js
import React from "./React.js"
const ReactDOM = {
	createRoot(container) {
		return {
			render(App) {
				React.render(App, container)
			},
		}
	},
}

export default ReactDOM
```

### 示例解析

#### 简单的渲染代码

```jsx
function App() {
	return (
		<div>
			hello world, my mini react!
			<div>befend</div>
		</div>
	)
}

export default App
```

#### 节点创建的过程内容

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb58b3c985b747e9a1686bc2bb806f13~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=600&h=362&s=34665&e=png&b=fdfafa)

#### 渲染结果

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/84da0e33191b4472bf2a5a8495a8214a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=987&h=382&s=40593&e=png&b=ffffff)

### 小结

- `createElement`  和  `render`  是 React 中用于构建和渲染界面的核心函数。
- 通常，`createElement`  函数用于创建虚拟 DOM 元素，通常由 JSX 编译器转换 JSX 语法时调用。而  `render`  函数将虚拟 DOM 渲染到实际 DOM。

总的来说，`createElement` 用于创建虚拟 DOM 元素，而 `render` 用于将这些虚拟 DOM 元素渲染到实际 DOM 中，从而构建用户界面。

仓库传送门： [https://github.com/Befend/mini-react](https://github.com/Befend/mini-react)
