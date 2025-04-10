import { useState, Fragment } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Cat from "./Cat"; // 引入 Cat 组件

// 自己定义的组件必须要大写，用来区分浏览器自带标签(小写)
function Greeting() {
  const name = "John";

  /* 在这里 comment 不需要用括号包住 */
  {
    /* The result will be Hello John*/
  }
  // 这里不能用 class，因为 class 是 js 关键字，只能用 className
  // name 用括号包住，可以使用 js 的东西，例如变量
  return <h1 className="title">Hello {name}</h1>;
}

function Greeting2() {
  const name = "John";

  return (
    <Fragment>
      {" "}
      {/*必须要有且只有一个父标签。也可以用 div */}
      <h1>Hello {name}</h1>
      <p>Nice to meet you.</p>
    </Fragment>
  );
}

function Greeting3() {
  const name = "John";

  return (
    <>
      {" "}
      {/* 相当于 Fragment 缩写 */}
      <h1>Hello {name}</h1>
      <p>Nice to meet you.</p>
    </>
  );
}

function Greeting4(props) {
  console.log(props);
  // props.name = "1"; // props 是不可变的，不能重新赋值
  return <h1>Hi {props.name}!</h1>;
}

function Greeting5({ name }) {
  return <h1>Hi {name}</h1>;
}

function Greeting6({ isLoggedIn }) {
  if (isLoggedIn) {
    return <h1>Welcome back!</h1>;
  }
  return <h1>Please sign in</h1>;
}

function Greeting7({ isLoggedIn }) {
  return <h1>{isLoggedIn ? "Welcome back!" : "Please sign in."}</h1>;
}

function Notification({ message }) {
  return <div>{message && <p>{message}</p>}</div>;
}

// 解构对象并且赋值
function DeveloperCard({ name, age, country }) {
  return (
    <div className="developer-card">
      <h1>Developer: {name}</h1>
      <p>Age: {age}</p>
      <p>Country: {country}</p>
    </div>
  );
}

function FruitList() {
  const fruits = ["Apple", "Banana", "Cherry", "Date"];
  return (
    <ul>
      {fruits.map((fruit) => (
        <li>{fruit}</li>
      ))}
    </ul>
  );
}

function FruitList2() {
  const fruits = ["Apple", "Banana", "Cherry", "Date"];
  return (
    <ul>
      {/* 唯一的key有助于 react 识别item，优化渲染 */}
      {fruits.map((fruit, index) => (
        <li key={`${fruit}-${index}`}>{fruit}</li>
      ))}
    </ul>
  );
}

function UserList() {
  const users = [
    { id: "user-001-employee", name: "Alice", email: "alice@example.com" },
    { id: "user-002-employee", name: "Bob", email: "bob@example.com" },
    { id: "user-003-employee", name: "John", email: "john@example.com" },
  ];
  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
}

function Button({ buttonText }) {
  // 用 obj 来声明 css，而不是 string
  const defaultStyles = {
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "10px 20px",
    // fontSize 而不是 font-size
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  };

  return <button style={defaultStyles}>{buttonText}</button>;
}

function Button2({ buttonText }) {
  return (
    <button
      // 直接用 obj
      style={{
        fontSize: "20px",
        background: "#007BFF",
        color: "white",
      }}
    >
      {buttonText}
    </button>
  );
}
function App() {
  const [count, setCount] = useState(0);
  const developerObj = {
    name: "Alice",
    age: 30,
    country: "USA",
  };

  return (
    <>
      <div>
        <Greeting /> {/* /> is required。(在这里 comment 一定要用括号包住) */}
        <Greeting2 />
        <Greeting3 />
        <Greeting4 name="custom" />
        <Greeting5 name="custom2" />
        <Greeting6 isLoggedIn={true} />
        <Greeting6 isLoggedIn={false} />
        <Greeting7 isLoggedIn={true} />
        <Notification />
        <Notification message={"watch out"} />
        {/* 解构对象 */}
        <DeveloperCard {...developerObj} />
        <FruitList />
        <FruitList2 />
        <UserList />
        <Button buttonText={"button"} />
        <Button2 buttonText={"button"} />
        <Cat /> {/* 使用导入的 Cat 组件 */}
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
  );
}

export default App;
