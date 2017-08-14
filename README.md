# flexible-practice
基于手淘移动端布局方案的实践

flexible + gulp postCSS


代码审查  压缩  souceMap watch 定制化构建工具

不要fork 请点start 笔芯

## 项目配置

git clone https://github.com/MaYing929/flexible-practice.git

cd flexible-practice

根目录下 运行



  ```
  npm install (-d)   安装项目依赖

  npm run start      启动node服务器

  gulp               编译 压缩 css 会将/src/*.css编译到 /dest/*.css
                     将 px 自动转换为 rem

  ```

  ```
   cd  servercfg.json
   修改root根目录路径至你本地文件目录

  ```

  提示：server running at port:8000   

  浏览器中打开 localhost（本机IP）:8000

  根据需要访问服务器文件 一般可在src目录下找到



## 如何写？

在src下新建html 与 css

参考 example.html   example.css

flexible建议font-size不用rem

css需要这么写

  ```
  .title-txt{
    font-size: 28px; /*px*/
    color: #000;
  }

  ```

后缀带  /*px*/ 是提示插件此行不转义


example.html 引入css文件 引入生成之后的css即可 可选 css 与 min.css
<!-- 像这样 -->
```
<link rel="stylesheet" href="/dest/example.css" type="text/css" />

```
