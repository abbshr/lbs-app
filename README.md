# 昊哥走天下

这是一款基于位置信息服务(LBS)的Web社交应用, 集陌陌,无秘,地图,旅行于一体的乱炖应用.

"昊哥走天下"属于B/S架构的Web应用, 因此需要服务器支持.

# TODO

+ 调用设备照相机
+ 地图绘制标记与注释
+ 调整UI布局

## 服务器部署

RethinkDB
iojs
CoffeeScript
Angular.js
SemanticUI

```sh
git clone <this repo>
cd lbs-app

# 安装依赖
npm install
# 编译coffee源码
coffee -c ./

# 启动rethinkdb
rehinkdb

# 初始化数据库
./dbinit.coffee

# 启动服务器
npm start
```
