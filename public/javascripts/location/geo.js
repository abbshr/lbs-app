// Generated by CoffeeScript 1.9.3
(function() {
  var Geo;

  Geo = (function() {
    function Geo(options) {
      var base;
      this.options = options != null ? options : {};
      if ((base = this.options).timeout == null) {
        base.timeout = Infinity;
      }
      this.location = navigator.geolocation;
    }

    Geo.prototype.watch = function(callback) {
      return this.location.watchPosition(function(pos) {
        return callback(null, pos.coords);
      }, function(err) {
        return callback(err);
      }, this.options);
    };

    Geo.prototype.stop = function(handle) {
      this.location.clearWatch(handle);
      return this;
    };

    Geo.prototype.getCurrent = function(callback) {
      return this.location.getCurrentPosition(function(pos) {
        return callback(null, pos.coords);
      }, function(err) {
        return callback(err);
      }, this.options);
    };

    Geo.prototype.enableHighAccuracy = function(enable) {
      this.options.enableHighAccuracy = !!enable;
      return this;
    };

    return Geo;

  })();

  window.Geo = Geo;

}).call(this);
