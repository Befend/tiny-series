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

const React = {
	render,
	createElement,
}

export default React
