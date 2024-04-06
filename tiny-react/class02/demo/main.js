const el = document.createElement("div")

el.innerText = "Hello, World!"

let i = 0
// 当数值过大时，会造成浏览器的卡顿
while (i < 1000000000000) {
	i++
}
