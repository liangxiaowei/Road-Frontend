import Pizza from "./Pizza";
import { useState, useEffect, useContext } from "react";
import Cart from "./Cart";
import { CartContext } from "./contexts";

const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function Order() {
  // select 下拉选择会触发 react 更新 UI, 但是每次都会运行这个函数渲染， pizzaType 一直不变，所以每次都是一样，选了等于没选。
  // const pizzaType = "pepperoni";
  // const pizzaSize = "M";

  // 所以要用 useState 来记录状态。不要把 hooks 放在 if、for 里。和 hooks 的运行顺序有关。
  const [pizzaType, setPizzaType] = useState("pepperoni"); // 当前选中的 pizza
  const [pizzaSize, setPizzaSize] = useState("M");

  const [pizzaTypes, setPizzaTypes] = useState([]); // pizza 选择列表
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useContext(CartContext);

  async function checkout() {
    setLoading(true);

    await fetch("/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cart,
      }),
    });

    setCart([]);
    setLoading(false);
  }

  let price, selectedPizza;
  if (!loading) {
    selectedPizza = pizzaTypes.find((pizza) => pizzaType === pizza.id);
    price = intl.format(
      selectedPizza.sizes ? selectedPizza.sizes[pizzaSize] : "",
    );
  }

  // 如果什么都不加，每次渲染都会触发 effect。而 fetchPizzaTypes 里面调用了 setPizzaTypes 会触发渲染，所以会一直死循环渲染。
  // useEffect(() => {
  //   fetchPizzaTypes();
  // });

  // 如果加一个 pizzaSize，每次选择 pizza 大小，就会触发 effect
  // useEffect(() => {
  //   fetchPizzaTypes();
  // }, [pizzaSize]);

  // 如果加一个空数组 []，只会触发一次。第二个参数是 where you declare your data dependencies。
  useEffect(() => {
    fetchPizzaTypes();
  }, []);

  // You can't make the function provided to useEffect async.会报错
  // useEffect(async () => {
  //   await fetchPizzaTypes();
  // }, []);

  async function fetchPizzaTypes() {
    // await new Promise((resolve) => setTimeout(resolve, 3000)); // remove this later, just to show you the loading state

    const pizzasRes = await fetch("/api/pizzas");
    const pizzasJson = await pizzasRes.json();
    setPizzaTypes(pizzasJson);
    setLoading(false);
  }

  return (
    <div className="order-page">
      <div className="order">
        <h2>Create Order</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setCart([
              ...cart,
              { pizza: selectedPizza, size: pizzaSize, price },
            ]);
          }}
        >
          <div>
            <div>
              <label htmlFor="pizza-type">Pizza Type</label>
              <select
                name="pizza-type"
                value={pizzaType}
                onChange={(e) =>
                  setPizzaType(e.target.value)
                } /*setPizzaType 会触发 react rerender*/
              >
                {pizzaTypes.map((pizza) => (
                  <option key={pizza.id} value={pizza.id}>
                    {pizza.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="pizza-size">Pizza Size</label>
              <div>
                {/* 因为 event 冒泡，也可以只在父元素这里用 onChange={(e) => setPizzaSize(e.target.value)}。Another side note: event bubbling in React works just like you would expect. In theory you can have mega event handler in React but the lint rules and React's dev tools get noisy about it if you do it that way so I tend to just follow their recommendation.*/}
                <span>
                  <input
                    checked={pizzaSize === "S"}
                    type="radio"
                    name="pizza-size"
                    value="S"
                    id="pizza-s"
                    onChange={(e) => setPizzaSize(e.target.value)}
                  />
                  <label htmlFor="pizza-s">Small</label>
                </span>
                <span>
                  <input
                    checked={pizzaSize === "M"}
                    type="radio"
                    name="pizza-size"
                    value="M"
                    id="pizza-m"
                    onChange={(e) => setPizzaSize(e.target.value)}
                  />
                  <label htmlFor="pizza-m">Medium</label>
                </span>
                <span>
                  <input
                    checked={pizzaSize === "L"}
                    type="radio"
                    name="pizza-size"
                    value="L"
                    id="pizza-l"
                    onChange={(e) => setPizzaSize(e.target.value)}
                  />
                  <label htmlFor="pizza-l">Large</label>
                </span>
              </div>
            </div>
            <button type="submit">Add to Cart</button>
          </div>
          {loading ? (
            <h3>Loading...</h3>
          ) : (
            <div className="order-pizza">
              <Pizza
                name={selectedPizza.name}
                description={selectedPizza.description}
                image={selectedPizza.image}
              />
              <p>{price}</p>
            </div>
          )}
        </form>
      </div>
      {loading ? <h2>LOADING …</h2> : <Cart checkout={checkout} cart={cart} />}
    </div>
  );
}
