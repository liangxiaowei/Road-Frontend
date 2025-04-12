import Pizza from "./Pizza";
import { useState } from "react";

export default function Order() {
  // select 下拉选择会触发 react 更新 UI, 但是每次都会运行这个函数渲染， pizzaType 一直不变，所以每次都是一样，选了等于没选。
  // const pizzaType = "pepperoni";
  // const pizzaSize = "M";

  // 所以要用 useState 来记录状态。不要把 hooks 放在 if、for 里。和 hooks 的运行顺序有关。
  const [pizzaType, setPizzaType] = useState("pepperoni");
  const [pizzaSize, setPizzaSize] = useState("M");

  return (
    <div className="order">
      <h2>Create Order</h2>
      <form>
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
              <option value="pepperoni">The Pepperoni Pizza</option>
              <option value="hawaiian">The Hawaiian Pizza</option>
              <option value="big_meat">The Big Meat Pizza</option>
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
        <div className="order-pizza">
          <Pizza
            name="Pepperoni"
            description="Mozzarella Cheese, Pepperoni"
            image="/public/pizzas/pepperoni.webp"
          />
          <p>$13.37</p>
        </div>
      </form>
    </div>
  );
}
