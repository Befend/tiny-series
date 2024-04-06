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
				return typeof child === "string" ? createTextNode(child) : child
			}),
		},
	}
}

function render(el, container) {
	nextWorkUnit = {
		dom: container,
		props: {
			children: [el],
		},
	}
}

function createDom(type) {
	return type === "TEXT_ELEMENT"
		? document.createTextNode("")
		: document.createElement(type)
}

function updateProps(dom, props) {
	Object.keys(props).forEach((key) => {
		if (key !== "children") {
			dom[key] = props[key]
		}
	})
}

function initChildren(fiber) {
	const children = fiber.props.children
	let prevChild = null
	children.forEach((child, index) => {
		const newFiber = {
			type: child.type,
			props: child.props,
			parent: fiber,
			child: null,
			sibling: null,
		}

		if (index === 0) {
			fiber.child = newFiber
		} else {
			prevChild.sibling = newFiber
		}
		prevChild = newFiber
	})
}

function findParentSibling(fiber) {
	if (!fiber?.parent || fiber.parent?.sibling) {
		return fiber.parent?.sibling
	}

	return findParentSibling(fiber.parent)
}

function preformOfWorkUnit(fiber) {
	// 1、创建dom
	if (!fiber.dom) {
		const dom = (fiber.dom = createDom(fiber.type))
		fiber.parent.dom.append(dom)

		// 2、设置 props，需要把children属性排除
		updateProps(dom, fiber.props)
	}

	// 3、将vdom转换为链表结构
	initChildren(fiber)

	if (fiber.child) {
		return fiber.child
	}

	if (fiber.sibling) {
		return fiber.sibling
	}

	return fiber.parent?.sibling || findParentSibling(fiber)
}

let nextWorkUnit = null
function workLoop(deadline) {
	let shouldYield = false

	while (!shouldYield && nextWorkUnit) {
		// dom 渲染
		nextWorkUnit = preformOfWorkUnit(nextWorkUnit)
		shouldYield = deadline.timeRemaining() < 1
	}

	requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

export default {
	createElement,
	render,
}
