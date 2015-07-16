
# 前端应用内部API
LbsApp =
  api: {}
  # 创建地图对象
  map: new AMap.Map "map"
  # 地理位置对象
  geo: new Geo timeout: 1000

LbsApp.map.plugin 'AMap.Geolocation', () -> console.log '加载geolocation控件'

# debug information
info = (lng, lat, accuracy) ->
  "当前位置: (#{lng}, #{lat}), 精确度: #{accuracy}m\n"

# 统一res回调
rescb = (res) ->
  if res.ok
    res.json()
  else
    throw new Error res.status

# 设置地图中心点与放缩级别
LbsApp.mapInitialize = (map, lng, lat, zoom) ->
  map.setZoomAndCenter zoom, new AMap.LngLat(lng, lat)

# 兼容定位
LbsApp.getCurrency = (map, geo) ->
  # 默认坐标
  lng = 126.642464
  lat = 45.756967
  accuracy = Infinity

  @locationMarker ?= new AMap.Geolocation
    enableHighAccuracy: yes
    timeout: 6000
    convert: yes
    zoomToAccuracy: yes

  map.addControl @locationMarker

  thirdPardApi = new Promise (resolve) ->

    # 第三方API定位
    AMap.event.addListenerOnce LbsApp.locationMarker, 'complete', (e) ->
      lng = e.position.getLng()
      lat = e.position.getLat()
      accuracy = e.accuracy
      resolve lng: lng, lat: lat, accuracy: accuracy

    # 使用默认坐标定位
    AMap.event.addListenerOnce LbsApp.locationMarker, "error", (e) ->
      console.error e.info
      resolve lng: lng, lat: lat, accuracy: accuracy

    LbsApp.locationMarker.getCurrentPosition()

  new Promise (resolve, reject) ->
    geo.getCurrent (err, pos) ->
      if err?
        console.log err
        resolve thirdPardApi
      else
        # 使用原生API精准定位
        lng = pos.longitude
        lat = pos.latitude
        accuracy = pos.accuracy
        resolve lng: lng, lat: lat, accuracy: accuracy


# 核心功能API #

# 发布新分享
# form 格式(JSON):
# { lng(数字), lat(数字), location, text, image(可选) }
LbsApp.api.createPost = (form) ->
  fetch "/api/post",
    method: 'POST'
    body: new FormData form
    credentials: 'same-origin'
  .then (res) -> rescb res

# 获取某一地理位置附近分享
LbsApp.api.getNearBy = (lng, lat, distance=100000, limit=200) ->
  fetch "/api/near?lng=#{lng}&lat=#{lat}&distance=#{distance}&limit=#{limit}"
  .then (res) -> rescb res

# 获取单个分享
LbsApp.api.getPost = (postId) ->
  fetch "/api/post?postId=#{postId}"
  .then (res) -> rescb res

# 获取个人地图
LbsApp.api.getUserMap = (username) ->
  fetch "/api/map#{if username then "?user=#{username}" else ''}", credentials: 'same-origin'
  .then (res) -> rescb res

# 访问控制API #

# 用户登录
LbsApp.api.login = (form) ->
  fetch "/login",
    method: 'POST'
    body: new FormData form
    credentials: 'same-origin'
  .then (res) -> rescb res

# 用户注册
# user 格式(JSON):
# { username, password }
LbsApp.api.registy = (form) ->
  fetch "/registy",
    method: 'POST'
    body: new FormData form
    credentials: 'same-origin'
  .then (res) -> rescb res

# 用户注销
LbsApp.api.logout = () ->
  fetch "/logout", credentials: 'same-origin'
  .then (res) -> rescb res

# 地图中心定位到当前
LbsApp.setCurrentLocation = (map, geo, callback) ->
  @getCurrency map, geo
  .then (pos) ->
    console.log pos
    { lng, lat, accuracy } = pos
    console.info info(lng, lat, accuracy)
    # 重置地图中心点
    LbsApp.mapInitialize map, lng, lat, 13
    # 获取附近1000米内的50条分享
    LbsApp.api.getNearBy lng, lat
  .then (data) ->
    console.log data
    if data.success
      callback null, data.posts
  .catch (err) ->
    console.log err
    # console.error err
    callback err


window.LbsApp = LbsApp
