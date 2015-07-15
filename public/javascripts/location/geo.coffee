
class Geo
  constructor: (@options={}) ->
    @options.timeout ?= Infinity
    @location = navigator.geolocation

  watch: (callback) ->
    @location.watchPosition (pos) ->
      callback null, pos.coords
    , (err) ->
      callback err
    , @options

  stop: (handle) ->
    @location.clearWatch handle
    this

  getCurrent: (callback) ->
    @location.getCurrentPosition (pos) ->
      callback null, pos.coords
    , (err) ->
      callback err
    , @options

  enableHighAccuracy: (enable) ->
    @options.enableHighAccuracy = !!enable
    this

window.Geo = Geo
