
# 前端应用内部API


# debug information
window.info = (lng, lat, accuracy) ->
  "当前位置: (#{lng}, #{lat}), 精确度: #{accuracy}m\n"

# 设置地图中心点与放缩级别
window.mapInitialize = (map, lng, lat, zoom) ->
  pos = new AMap.LngLat lng, lat
  map.setZoomAndCenter zoom, pos

# 兼容定位
window.getCurrency = (map, geo, callback) ->
  # 默认坐标
  lng = 126.642464
  lat = 45.756967
  accuracy = Infinity

  geo.getCurrent (err, pos) ->
    if err?
      console.log err
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
          mapInitialize map, lng, lat, 13
          callback lng, lat
          console.info info(lng, lat, accuracy)
        # 使用默认坐标定位
        AMap.event.addListener geolocation, "error", (e) ->
          console.error e.info
          mapInitialize map, lng, lat, 13
          callback lng, lat
          console.info info(lng, lat, accuracy)
        geolocation.getCurrentPosition()
    else
      # 使用原生API精准定位
      lng = pos.longitude
      lat = pos.latitude
      accuracy = pos.accuracy
      mapInitialize map, lng, lat, 13
      callback lng, lat
      console.info info(lng, lat, accuracy)

# 发布新分享
window.postNewInfo = (form) ->
  formdata = new FormData form
  fetch "/post", method: 'POST', body: formdata

# 入口
window.onload = (e) ->

  # 打开模态框
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

  # 创建地图对象
  @map = new AMap.Map "map"
  # 地理位置对象
  @geo = new Geo timeout: 1000
  # 定位到当前位置
  getCurrency @map, @geo, (lng, lat) ->
    # 默认值
    distance = 1000
    limit = 100
    # 获取当前位置附近posts
    fetch "/api/near?lng=#{lng}&lat=#{lat}&distance=#{distance}&limit=#{limit}"
    .then (res) ->
      if res.ok
        res.json().then (res) ->
          if res.success
            # TODO: 在地图上绘制这些点
            console.log res.posts
          else
            console.error res.error
    .catch (err) ->
      console.error err
