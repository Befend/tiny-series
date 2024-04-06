let taskId = 1

function workLoop(deadline) {
	taskId++
	let shouldYield = false
	while (!shouldYield) {
		console.log(`Task ${taskId} is running`)
		shouldYield = deadline.timeRemaining() < 1
	}

	requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)
