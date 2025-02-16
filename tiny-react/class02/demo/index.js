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
