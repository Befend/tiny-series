import React from "./core/React.js";
// const App = React.createElement("div", { id: "app" }, "hello world, my mini react!");

function Counter({num}) {
  return <div>count:{num}</div>
}

function CounterContainer() {
  return <Counter num={10}></Counter>
}

function App() {
  return (
    <div>
      hello world, my mini react!
      <Counter num={20}></Counter>
      <CounterContainer></CounterContainer>
      <div>befend</div>
    </div>
  )
}

export default App;