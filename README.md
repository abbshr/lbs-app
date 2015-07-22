# 昊哥走天下

这是一款基于位置信息服务(LBS)的Web社交应用, 集陌陌,无秘,地图,旅行于一体的乱炖应用.

"昊哥走天下"属于B/S架构的Web应用, 因此需要服务器支持.

# 屏幕截图
![a](https://raw.githubusercontent.com/abbshr/lbs-app/master/public/images/a.png)

![b](https://raw.githubusercontent.com/abbshr/lbs-app/master/public/images/b.png)

![c](https://raw.githubusercontent.com/abbshr/lbs-app/master/public/images/c.png)

![d](https://raw.githubusercontent.com/abbshr/lbs-app/master/public/images/d.png)

![e](https://raw.githubusercontent.com/abbshr/lbs-app/master/public/images/e.png)


# 关键字

Promise, ES6, RethinkDB, fetch, geolocation, getUserMedia, CoffeeScript, Angular.js, SemanticUI

# TODO

+ 增加个人中心
+ 增加分享回复
+ 查看个人地图时屏幕中心定位到点集中心
+ 对叠加点增加分散查看功能
+ 在个人地图的路线上添加方向箭头
+ 修复图片显示问题
+ 使用RethinkDB changeFeed刷新地图数据

# Log

+ 修复定位标记叠加bug
+ 修复定位到当前时放缩级别跳跃bug

## 服务器部署

```sh
# 安装libcap依赖以允许普通用户使用1024以下的端口 (Ubuntu)
sudo apt-get install libcap2 libcap2-bin
# (OSX/Unix)
git clone git@github.com:Castaglia/MacOSX-authbind.git
cd MacOSX-authbind
make && sudo make install

# 允许node使用1024以下端口 (Linux)
sudo setcap cap_net_bind_service=+ep /usr/local/bin/iojs
# (Unix/OSX)
sudo touch /etc/authbind/byport/80
sudo chown $USER /etc/authbind/byport/80
sudo chmod 755 /etc/authbind/byport/80

# 安装rethinkdb

# clone repo
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

# 启动服务器 (Linux)
npm start
# (Unix/OSX)
authbind npm start
```
