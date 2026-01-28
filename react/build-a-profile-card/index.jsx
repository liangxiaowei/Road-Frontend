// 组件的首字母必须要大写，小写的组件会被当作HTML标签处理
export function Card({ name, title, bio }) {
  return ( //分行的话，必须要加括号
    <>
      <div className="card"> {/* 这里的 div 为小写开头，所以会被当作 html 元素 */}
        <h1>{name}</h1>
        <p className="card-title">{title}</p>
        <p>{bio}</p>
      </div>
    </>
  );
}

export function App() {
  return (
    <div className="flex-container">
      <Card
        name="Mark"
        title="Frontend developer"
        bio="I like to work with different frontend technologies and play video games."
      />
      <Card
        name="Tiffany"
        title="Engineering manager"
        bio="I like to work with different frontend technologies and play video games."
      />
      <Card
        name="Doug"
        title="Backend developer"
        bio="I have been a software developer for over 20 years and I love working with Go and Rust."
      />
    </div>
  );
}
