'use strict';

/* Controllers */

function drawMarkers(map, posts, isTimeMap) {
  var markers = posts.map(function (post) {
    //构建信息窗体中显示的内容
	  var info = [];
		info.push(`<div><div style=\"padding:0px 0px 0px 4px;\"><b>${post.user.username}</b>`);
		info.push(`时间: ${post.time}`);
    info.push(`地点: ${post.location}`);
    if (post.image)
      info.push(`<img src="${URL.createObjectURL(new Blob(post.image.data))}" />`);
		info.push(`${post.text}</div></div>`);

		var infoWindow = new AMap.InfoWindow({
			content:info.join("<br/>")  //使用默认信息窗体框样式，显示信息内容
		});

    var marker = new AMap.Marker({
      //基点位置
      position: new AMap.LngLat(post.lng, post.lat),
      //marker图标，直接传递地址url
      icon:"http://developer.amap.com/wp-content/uploads/2014/06/marker.png",
      //相对于基点的位置
      offset:{x:-8, y:-34}
    });

    if (isTimeMap)
      marker.setContent(post.time);

    marker.setTitle(post.text);
    AMap.event.addListener(marker,'click',function(){
      infoWindow.open(map, marker.getPosition());
    });

    return marker;
  });

  if (LbsApp.cluster) {
    LbsApp.cluster.setMap(null);
  }

  map.plugin(["AMap.MarkerClusterer"],function(){
    LbsApp.cluster = new AMap.MarkerClusterer(map,markers);
  });
}


var mapControllers = angular.module('mapControllers', []);


mapControllers.controller('infoCtrl', ['$rootScope', '$scope', 'notificationService', function ($rootScope, $scope, notificationService) {
  $('.ui.message').hide();
}]);

mapControllers.controller('headerCtrl', ['$scope', function ($scope) {
  if (localStorage['has-been-login'] == '1') {
    $("#registry-btn").hide();
    $("#login-btn").hide();
  } else {
    $('#map-btn').hide();
    $('#post-btn').hide();
    $("#logout-btn").hide();
  }
}]);

mapControllers.controller('mapCtrl', ['$scope', 'notificationService', function ($scope, notificationService) {
  $('.amap-geo').remove();
  $('.amap-logo').remove();
  $('.amap-copyright').remove();
  LbsApp.map.setFeatures(['bg', 'point', 'building']);
  LbsApp.map.setMapStyle('fresh');
  $('#current-btn')
  .popup({
    on: 'hover',
    inline   : true,
    hoverable: true,
    position : 'bottom center',
    delay: {
      show: 20,
      hide: 50
    }
  })
  .click(function (e) {
    LbsApp.setCurrentLocation(LbsApp.map, LbsApp.geo, function (err, posts) {
      if (err) {
        console.error("当前位置定位失败", err);
        notificationService.notify('error', "当前位置定位失败", err.message);
      } else {
        drawMarkers(LbsApp.map, posts);
      }
    });
  }).click();

  $('#map-btn').click(function (e) {
    LbsApp.api.getUserMap()
    .then(function (res) {
      if (res.success) {
        res.map = res.map || [];
        return res.map.sort(function (a, b) {
          var atime = new Date(a.time);
          var btime = new Date(b.time);
          return atime.getTime() - btime.getTime();
        });
      } else {
        throw new Error(res.error);
      }
    })
    .then(function (map) {
      drawMarkers(LbsApp.map, map);
      LbsApp.polyline = new AMap.Polyline({
        path: map.map(function (post) {
          return new AMap.LngLat(post.lng, post.lat);
        }), //设置线覆盖物路径
        strokeColor:"#3366FF", //线颜色
        strokeOpacity:1, //线透明度
        strokeWeight:5, //线宽
        strokeStyle:"solid", //线样式
        strokeDasharray:[10,5] //补充线样式
      });
      LbsApp.polyline.setMap(LbsApp.map);
    })
    .catch(function (err) {
      console.error("获取个人地图失败", err.message);
      notificationService.notify('error', "获取个人地图失败", err.message);
    });
  });
}]);

mapControllers.controller('SearchCtrl', ['$scope', 'notificationService', function ($scope, notificationService) {
  AMap.service(["AMap.PlaceSearch"], function() {
    var MSearch = new AMap.PlaceSearch({ //构造地点查询类
      pageSize:10,
      pageIndex:1,
      city:"021" //城市
    });

    $('#form-search').submit(function (e) {
      e.preventDefault();

      //关键字查询
      MSearch.search(document.querySelector('#location').value, function (status, result) {
        if (status === 'complete' && result.info === 'OK') {
          var geo = result.poiList.pois[0].location
    	    var lng = geo.lng;
          var lat = geo.lat;

          LbsApp.api.getNearBy(lng, lat)
          .then(function (res) {
            if (res.success) {
              LbsApp.mapInitialize(LbsApp.map, lng, lat, 13);
              drawMarkers(LbsApp.map, res.posts);
            } else {
              throw new Error(res.error);
            }
          })
          .catch(function (err) {
            console.error("无法获取该地点周边分享", err);
            notificationService.notify('yellow', "无法获取该地点周边分享", err.message);
          });
        } else {
          console.error("地点查询失败", result);
          notificationService.notify('error', "地点查询失败", '无此地点');
        }
      });
    });

    $('#search').click(function (e) {
      $('#form-search').submit();
    });
  });
}]);


mapControllers.controller('postCtrl', ['$scope', 'notificationService', function ($scope, notificationService) {

  $scope.newMsg={};

  $('#file-btn').click(function (e) {
    $('#bin').click();
  });

  $('#bin').change(function (e) {
    // TODO: 生成缩略图
    // TODO: 处理文件
    e.target.files;
  });

  $('#post-btn').click(function(e) {
    LbsApp.getCurrency(LbsApp.map, LbsApp.geo)
    .then(function(pos){
      var lnglatXY = new AMap.LngLat(pos.lng, pos.lat);
      $scope.newMsg.posNum = pos;
      //加载地理编码插件
      return new Promise(function(resolve, reject) {
        AMap.service(["AMap.Geocoder"], function() {
          var MGeocoder = new AMap.Geocoder({ radius: 1000, extensions: "all"});
          //逆地理编码
          MGeocoder.getAddress(lnglatXY, function(status, result){
            if (status === 'complete' && result.info === 'OK') {
              resolve(result.regeocode.formattedAddress);
            } else {
              reject(result);
            }
          });
        });
      });
    })
    .then(function (address) {
      $scope.newMsg.address = address;
      $('#post-module').modal({
        blurring: true,
        onApprove: function() {
          $('#form-post').parent().addClass('loading');
          LbsApp.api.createPost($("#form-post")[0])
          .then(function (res) {
            $('#post-module').modal('hide');
            $('#form-post').parent().removeClass('loading');
            if (res.success) {
              $('#form-post')[0].reset();
              return LbsApp.api.getNearBy($scope.newMsg.posNum.lng, $scope.newMsg.posNum.lat);
            } else {
              throw new Error(res.error);
            }
          })
          .then(function (res) {
            drawMarkers(LbsApp.map, res.posts);
          })
          .catch(function (err) {
            notificationService.notify('error', "发布失败", err.message);
            console.error("发布失败", err);
          });
          return false;
        }
      }).modal('show');
    })
    .catch(function (err) {
      console.error("无法在地图上定位当前位置", err);
      notificationService.notify('error', "无法在地图上定位当前位置", err);
    });
  });
}]);



mapControllers.controller('registryCtrl', ['$scope', 'notificationService', function ($scope, notificationService) {

  $('#registry-btn').click(function(e) {
    $('#registry-module').modal({
      blurring: true,
      onApprove: function () {
        $('#registry-loader').addClass("active");
        LbsApp.api.registy(document.querySelector("#form-registry"))
        .then(function (res) {
          if (res.success) {
            notificationService.notify('positive', "注册成功", '请登录以执行后续操作');
          } else {
            console.error("注册失败", res.error);
            notificationService.notify('error', "注册失败", res.error);
          }
          $('#registry-loader').removeClass("active");
          $('#registry-module').modal('hide');
        });
        return false;
      }
    }).modal('show');
  });
}]);

mapControllers.controller('loginCtrl', ['$scope', 'notificationService', function ($scope, notificationService) {

  $('#login-btn').click(function(e) {
    $('#login-module').modal({
        blurring: true,
        onApprove: function () {
          $('#login-loader').addClass("active");
          LbsApp.api.login(document.querySelector("#form-login"))
          .then(function (res) {
            if (res.success) {
              $('#map-btn').show();
              $('#post-btn').show();
              $("#logout-btn").show();
              $("#registry-btn").hide();
              $("#login-btn").hide();
              localStorage['has-been-login'] = 1
              $('#current-btn').click();
            } else {
              console.error("登录失败:", res.error);
              notificationService.notify('error', "登录失败", res.error);
            }
            $('#login-module').modal('hide');
            $('#login-loader').removeClass("active");
          });
          return false;
        }
    }).modal('show');
  });
}]);

mapControllers.controller('logoutCtrl', ['$scope', 'notificationService', function ($scope, notificationService) {

  $('#logout-btn').click(function(e) {
    $('#logout-module').modal({
        blurring: true,
        onShow: function () {
          LbsApp.api.logout()
          .then(function (res) {
            $('#logout-module').modal('hide');
            if (res.success) {
              $('#map-btn').hide();
              $('#post-btn').hide();
              $("#logout-btn").hide();
              $("#registry-btn").show();
              $("#login-btn").show();
              localStorage['has-been-login'] = 0;
              LbsApp.polyline && LbsApp.polyline.setMap(null);
              $('#current-btn').click();
            } else {
              console.error("注销失败", res.error);
              notificationService.notify('error', "注销失败", res.error);
            }
          });
          return false;
        }
    }).modal('show');
  });
}]);
