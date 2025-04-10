const Pizza = (props) => {
  return React.createElement("div", {}, [
    React.createElement(
      "h1", // tag
      {}, // 属性，可以是 null
      props.name // 子元素，可以是数组
    ),
    React.createElement("p", {}, props.description),
  ]);
};

// 不要做耗时操作，会调用很多次，不要改状态，pure function
const App = () => {
  return React.createElement("div", {}, [
    React.createElement("h1", {}, "Padre Gino's"),
    React.createElement(Pizza, {
      name: "The Pepperoni Pizza",
      description: "Mozzarella Cheese, Pepperoni",
    }),
    React.createElement(Pizza, {
      name: "The Hawaiian Pizza",
      description: "Sliced Ham, Pineapple, Mozzarella Cheese",
    }),
    React.createElement(Pizza, {
      name: "The Big Meat Pizza",
      description: "Bacon, Pepperoni, Italian Sausage, Chorizo Sausage",
    }),
  ]);
};

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(React.createElement(App));
