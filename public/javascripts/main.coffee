
# 前端应用内部API
LbsApp =
  api: {}

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
  pos = new AMap.LngLat lng, lat
  map.setZoomAndCenter zoom, pos

# 兼容定位
LbsApp.getCurrency = (map, geo) ->
  # 默认坐标
  lng = 126.642464
  lat = 45.756967
  accuracy = Infinity

  thirdPardApi = new Promise (resolve) ->
    map.plugin 'AMap.Geolocation', () ->
      geolocation = new AMap.Geolocation
        enableHighAccuracy: yes
        timeout: 6000
        convert: yes
        zoomToAccuracy: yes
      map.addControl geolocation

      # 第三方API定位
      AMap.event.addListener geolocation, 'complete', (e) ->
        lng = e.position.getLng()
        lat = e.position.getLat()
        accuracy = e.accuracy
        resolve lng: lng, lat: lat, accuracy: accuracy

      # 使用默认坐标定位
      AMap.event.addListener geolocation, "error", (e) ->
        console.error e.info
        resolve lng: lng, lat: lat, accuracy: accuracy

      geolocation.getCurrentPosition()

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

# example: (获取当前位置附近的分享)
#
# LbsApp
#   .getNearBy 162.232, 56.122
#   .then (data) ->
#     # 服务器响应的JSON数据
#     # data => { success: true, posts: [...] }
#     # 或 { error: true }
#     if data.success
#       # 执行后续任务, 如绘制地图
#       ...
#     else
#       # 转交给catch处理
#       throw new Error 'error'
#   .catch (err) ->
#     # 处理所有错误
#     console.error err

# 发布新分享
LbsApp.api.createPost = (form) ->
  formdata = new FormData form
  fetch "/post",
    method: 'POST'
    body: formdata
    credentials: 'same-origin'
  .then (res) -> rescb res

# 获取某一地理位置附近分享
LbsApp.api.getNearBy = (lng, lat, distance=1000, limit=200) ->
  fetch "/api/near?lng=#{lng}&lat=#{lat}&distance=#{distance}&limit=#{limit}"
  .then (res) -> rescb res

# 获取单个分享
LbsApp.api.getPost = (postId) ->
  fetch "/post?postId=#{postId}"
  .then (res) -> rescb res

# 获取个人地图
LbsApp.api.getUserMap = (username) ->
  fetch "/map?user=#{username}"
  .then (res) -> rescb res

# 访问控制API #

# 用户注册
LbsApp.api.login = (user) ->
  fetch "/login",
    method: 'POST'
    headers:
      'Accept': 'application/json'
      'Content-Type': 'application/json'
    body: JSON.stringify user
    credentials: 'same-origin'
  .then (res) -> rescb res

# 用户登录
LbsApp.api.registy = (user) ->
  fetch "/registy",
    method: 'POST'
    headers:
      'Accept': 'application/json'
      'Content-Type': 'application/json'
    body: JSON.stringify user
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
    { lng, lat, accuracy } = pos
    console.info info(lng, lat, accuracy)
    # 重置地图中心点
    LbsApp.mapInitialize map, lng, lat, 13
    # 获取附近1000米内的50条分享
    LbsApp.api.getNearBy lng, lat, 1000, 50
  .then (data) ->
    if data.success
      callback null, data.posts
  .catch (err) ->
    console.error err
    callback err

# 入口 & 初始化 #
window.onload = (e) ->

  # 创建地图对象
  map = LbsApp.map = new AMap.Map "map"
  # 地理位置对象
  geo = LbsApp.geo = new Geo timeout: 1000

  # 定位到当前位置
  LbsApp.setCurrentLocation map, geo, (err, posts) ->
    if err?
      console.error err
    # TODO: 绘制标记
    else
      console.log posts

  # 模态框
  $('#post-btn').click (e) ->
    $('#new-post')
      .modal
        blurring: true
        onApprove: () ->
          $('#loader').addClass "active"
          setTimeout () ->
            $('#new-post').modal 'hide'
            $('#loader').removeClass "active"
          , 3000
          off
      .modal 'show'

  # 提交
  # $('#submit').submit (e) ->
  #   e.preventDefault()
  #   $('#loader').addClass "active"
  #   setTimeout () ->
  #     $('#new-post').modal 'hide'
  #     $('#loader').removeClass "active"
  #   , 3000
    # postNewInfo document.querySelector "#post-data"
    # .then (res) ->
    #   if res.ok
    #     res.json().then (data) ->
    #       $('#new-post').modal 'hide'
    #       $('#loader').removeClass "active"
    # .catch (err) ->
    #   # error


window.LbsApp = LbsApp
