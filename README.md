### dll

- install `yarn install`
  - update dll `yarn postinstall`

- dev `yarn dev`

- build `yarn build`


### 理解

`dll` 可以加快编译速度, 提高开发体验. 但我认为只适合在`开发环境`使用:
主要原因是 dll 里的内容不能被 `tree-shaking` 瘦身,
而且我不认为生产打包多花一些时间有太大的影响.


### loading

由于 SPA 的 js 文件一般都很大, 所以加载 js 时候提供 loading 能一定程度上提高用户体验,

但是有一个很严重的问题: js 在同步加载的时候会阻塞 `<svg>` `gif` 的动画, 你的 loading 看起来就像个傻子

自然而然想到使用 异步加载js的方式

---

我第一个方案是手动在 html 模板里 异步加载 js
```js

// 并行加载
Promise.all(
  htmlWebpackPlugin.options.files.js.map(js => loadScript(js.path))
)

// 串行加载
for await(js of htmlWebpackPlugin.options.files.js) {
  await loadScript(js.path);
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const js = document.createElement('SCRIPT');
    js.src = src;
    document.body.appendChild(js);
    js.onload = resolve;
    js.onerror = reject;
  })
}
```

### 这里2个显然的问题
  - 如果使用并行加载, 无法保证js执行顺序. (比如 entry 比 vendor 先加载完, 就会报找不到模块错误)
  - 假如使用串行加载, 显然加载时间就会成倍增加.
  - 及时单独把 entry 文件放到最后加载, 我觉得维护这个东西的成本还是太高, 因此放弃在 html 模板里手动加载的方式


```html
<app-root id="app-root">
  <div class="___loading-box">
    <svg width="64" height="64" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#ccc">
      <g fill="none" fill-rule="evenodd">
        <g transform="translate(1 1)" stroke-width="2">
          <circle stroke-opacity=".5" cx="18" cy="18" r="18" />
          <path d="M36 18c0-9.94-8.06-18-18-18">
            <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"
            />
          </path>
        </g>
      </g>
    </svg>
  </div>
</app-root>
```


### 动态 import

接下来就想到 利用动态import 的方案里,
以前 code split 都是在 路由层做的， 按页面级别做到按需加载
然后我萌生了一个邪恶的想法。
动态引入根组件
因此就出现了下面看起来有点奇怪的代码.

```js
// main.js
setTimeout(() => {
  import("./render");
}, 0);


// render.js
import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

ReactDOM.render(<App />, document.getElementById("app-root"));
```

这样 html 首次只会加载 `main.js` (虽然webpack 打包后会加入模块代码, 会增加到有2KB左右)
加载完 2KB 的 `main.js` 的时间应该是可以容忍的, 这个时候 loading 就可以动起来了.
然后 `main.js` 再异步按需并行加载其他 js 比如 vendor(160KB 我也就打包常用的一些库)

至此, 心满意足.

要说不足的话, 如果平白无故多出了 1个 http 请求, 必然也会有性能影响,
不过 react 现在一般都有 100多KB 的, 比较起来还是可以的.
