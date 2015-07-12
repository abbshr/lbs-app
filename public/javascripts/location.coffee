
url = (lng, lat, distance, limit) ->
  "/api/near?lng=#{lng}&lat=#{lat}&distance=#{distance}&limit=#{limit}"

info = (lng, lat, accuracy) ->
  "当前位置: (#{lng}, #{lat}), 精确度: #{accuracy}\n"

geo = new Geo

window.onload = () ->
  geo.getCurrent (pos) ->
    initialize pos.longitude, pos.latitude
    console.log info(pos.longitude, pos.latitude, pos.accuracy)
    fetch url pos.longitude, pos.latitude, 2000, 100
    .then (res) ->
      if res.status is 200
        res.text().then (data) ->
          console.log data
    .catch (err) ->
      console.log err
