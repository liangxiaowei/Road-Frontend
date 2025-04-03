import { useState, Fragment } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Cat from "./Cat"; // 引入 Cat 组件



// 自己定义的组件必须要大写，用来区分浏览器自带标签(小写)
function Greeting() {
  const name = "John"

  /* 在这里 comment 不需要用括号包住 */
  {/* The result will be Hello John*/}
  // 这里不能用 class，因为 class 是 js 关键字，只能用 className 
  // name 用括号包住，可以使用 js 的东西，例如变量
  return <h1 className="title">Hello {name}</h1>;
}

function Greeting2() {
  const name = "John"

  
  return (
    <Fragment> { /*必须要有且只有一个父标签。也可以用 div */ }
      <h1>Hello {name}</h1>
      <p>Nice to meet you.</p>
    </Fragment>
  );
}

function Greeting3() {
  const name = "John"

  
  return (
    <> { /* 相当于 Fragment 缩写 */ }
      <h1>Hello {name}</h1>
      <p>Nice to meet you.</p>
    </>
  );
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <Greeting /> {/* /> is required。(在这里 comment 一定要用括号包住) */}
        <Greeting2 />
        <Greeting3 />
        <Cat />  {/* 使用导入的 Cat 组件 */}
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
