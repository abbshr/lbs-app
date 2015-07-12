
class Geo
  constructor: (@options) ->
    @options?.timeout = 6000
    @location = navigator.geolocation

  watch: (callback) ->
    @location.watchPosition (pos) ->
      callback pos.coords
    , @options

  stop: (handle) ->
    @location.clearWatch handle
    this

  getCurrent: (callback) ->
    @location.getCurrentPosition (pos) ->
      callback pos.coords
    , @options

  enableHighAccuracy: (enable) ->
    @options.enableHighAccuracy = !!enable
    this

window.Geo = Geo
