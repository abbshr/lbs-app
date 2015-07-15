// Generated by CoffeeScript 1.9.3
(function() {
  var LbsApp, info, rescb;

  LbsApp = {
    api: {},
    map: new AMap.Map("map"),
    geo: new Geo({
      timeout: 1000
    })
  };

  info = function(lng, lat, accuracy) {
    return "当前位置: (" + lng + ", " + lat + "), 精确度: " + accuracy + "m\n";
  };

  rescb = function(res) {
    if (res.ok) {
      return res.json();
    } else {
      throw new Error(res.status);
    }
  };

  LbsApp.mapInitialize = function(map, lng, lat, zoom) {
    var pos;
    pos = new AMap.LngLat(lng, lat);
    return map.setZoomAndCenter(zoom, pos);
  };

  LbsApp.getCurrency = function(map, geo) {
    var accuracy, lat, lng, thirdPardApi;
    lng = 126.642464;
    lat = 45.756967;
    accuracy = Infinity;
    thirdPardApi = new Promise(function(resolve) {
      return map.plugin('AMap.Geolocation', function() {
        var geolocation;
        geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,
          timeout: 6000,
          convert: true,
          zoomToAccuracy: true
        });
        map.addControl(geolocation);
        AMap.event.addListener(geolocation, 'complete', function(e) {
          lng = e.position.getLng();
          lat = e.position.getLat();
          accuracy = e.accuracy;
          return resolve({
            lng: lng,
            lat: lat,
            accuracy: accuracy
          });
        });
        AMap.event.addListener(geolocation, "error", function(e) {
          console.error(e.info);
          return resolve({
            lng: lng,
            lat: lat,
            accuracy: accuracy
          });
        });
        return geolocation.getCurrentPosition();
      });
    });
    return new Promise(function(resolve, reject) {
      return geo.getCurrent(function(err, pos) {
        if (err != null) {
          console.log(err);
          return resolve(thirdPardApi);
        } else {
          lng = pos.longitude;
          lat = pos.latitude;
          accuracy = pos.accuracy;
          return resolve({
            lng: lng,
            lat: lat,
            accuracy: accuracy
          });
        }
      });
    });
  };

  LbsApp.api.createPost = function(form) {
    return fetch("/api/post", {
      method: 'POST',
      body: new FormData(form),
      credentials: 'same-origin'
    }).then(function(res) {
      return rescb(res);
    });
  };

  LbsApp.api.getNearBy = function(lng, lat, distance, limit) {
    if (distance == null) {
      distance = 1000;
    }
    if (limit == null) {
      limit = 200;
    }
    return fetch("/api/near?lng=" + lng + "&lat=" + lat + "&distance=" + distance + "&limit=" + limit).then(function(res) {
      return rescb(res);
    });
  };

  LbsApp.api.getPost = function(postId) {
    return fetch("/api/post?postId=" + postId).then(function(res) {
      return rescb(res);
    });
  };

  LbsApp.api.getUserMap = function(username) {
    return fetch("/api/map?user=" + username).then(function(res) {
      return rescb(res);
    });
  };

  LbsApp.api.login = function(form) {
    return fetch("/login", {
      method: 'POST',
      body: new FormData(form),
      credentials: 'same-origin'
    }).then(function(res) {
      return rescb(res);
    });
  };

  LbsApp.api.registy = function(form) {
    return fetch("/registy", {
      method: 'POST',
      body: new FormData(form),
      credentials: 'same-origin'
    }).then(function(res) {
      return rescb(res);
    });
  };

  LbsApp.api.logout = function() {
    return fetch("/logout", {
      credentials: 'same-origin'
    }).then(function(res) {
      return rescb(res);
    });
  };

  LbsApp.setCurrentLocation = function(map, geo, callback) {
    return this.getCurrency(map, geo).then(function(pos) {
      var accuracy, lat, lng;
      console.log(pos);
      lng = pos.lng, lat = pos.lat, accuracy = pos.accuracy;
      console.info(info(lng, lat, accuracy));
      LbsApp.mapInitialize(map, lng, lat, 13);
      return LbsApp.api.getNearBy(lng, lat, 1000, 50);
    }).then(function(data) {
      console.log(data);
      if (data.success) {
        return callback(null, data.posts);
      }
    })["catch"](function(err) {
      console.log(err);
      return callback(err);
    });
  };

  window.LbsApp = LbsApp;

}).call(this);
