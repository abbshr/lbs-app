
info = (lng, lat, accuracy) ->
  "当前位置: (#{lng}, #{lat}), 精确度: #{accuracy}\n"

mapInitialize = (mapContainerId, lng, lat, zoom) ->
  pos = new AMap.LngLat lng, lat
  map = new AMap.Map mapContainerId
    view: new AMap.View2D
      center: pos
      zoom: zoom
      rotation: 0
    ,
    lang: "zh_cn"

postNewInfo = (form) ->
  formdata = new FormData form
  fetch "/post", method: 'POST', body: formdata

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

  @geo = new Geo
  # 定位到当前位置
  @geo.getCurrent (pos) ->
    # 初始化地图图层
    mapInitialize "map", pos.longitude, pos.latitude, 13
    console.log info(pos.longitude, pos.latitude, pos.accuracy)
