import { useState, useEffect, useDebugValue } from "react";

// 方便重用 hook 逻辑、与测试
export const usePizzaOfTheDay = () => {
  // 这也相当于函数顶部，state 相对于是当前函数
  const [pizzaOfTheDay, setPizzaOfTheDay] = useState(null);

  // 这个用于 react dev tool 显示自定义的 hook
  useDebugValue(pizzaOfTheDay ? `${pizzaOfTheDay.name}` : "Loading...");

  useEffect(() => {
    async function fetchPizzaOfTheDay() {
      const response = await fetch("/api/pizza-of-the-day");
      const data = await response.json();
      setPizzaOfTheDay(data);
    }

    fetchPizzaOfTheDay();
  }, []);

  return pizzaOfTheDay;
};
