'use strict';

/* Controllers */

//构建自定义信息窗体
function createInfoWindow (title, content) {
  var info = document.createElement("div");
  info.className = "info";

  //可以通过下面的方式修改自定义窗体的宽高
  //info.style.width = "400px";

  // 定义顶部标题
  var top = document.createElement("div");
  var titleD = document.createElement("div");
  var closeX = document.createElement("img");
  top.className = "info-top";
  titleD.innerHTML = title;
  closeX.src = "http://webapi.amap.com/images/close2.gif";
  closeX.onclick = closeInfoWindow;

  top.appendChild(titleD);
  top.appendChild(closeX);
  info.appendChild(top);


  // 定义中部内容
  var middle = document.createElement("div");
  middle.className = "info-middle";
  middle.style.backgroundColor='white';
  middle.innerHTML = content;
  info.appendChild(middle);

  // 定义底部内容
  var bottom = document.createElement("div");
  bottom.className = "info-bottom";
  bottom.style.position = 'relative';
  bottom.style.top = '0px';
  bottom.style.margin = '0 auto';
  var sharp = document.createElement("img");
  sharp.src = "http://webapi.amap.com/images/sharp.png";
  bottom.appendChild(sharp);
  info.appendChild(bottom);
  return info;
}

//关闭信息窗体
function closeInfoWindow(){
  LbsApp.map.clearInfoWindow();
}

function drawMarkers(map, posts, isTimeMap) {
  var markers = posts.map(function (post) {
    //实例化信息窗体
    var infoWindow = new AMap.InfoWindow({
      isCustom:true,  //使用自定义窗体
      content:createInfoWindow(`${post.time}<span style="font-size:11px;color:#F00;"></span>`,`<img src='http://tpc.googlesyndication.com/simgad/5843493769827749134' style='position:relative;float:left;margin:0 5px 5px 0;'>地址：${post.location}<br/><br/>${post.text}`),
      offset:new AMap.Pixel(16, -45)//-113, -140
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

mapControllers.controller('InitLoadCtrl', ['$scope', '$http', function ($scope, $http) {
  $('.amap-geo').remove();
  $('#current-btn').click(function (e) {
    LbsApp.setCurrentLocation(LbsApp.map, LbsApp.geo, function (err, posts) {
      if (err) {
        console.error("当前位置定位失败", err);
      } else {
        drawMarkers(LbsApp.map, posts);
      }
    });
  }).click();

  $('#map-btn').click(function (e) {
    LbsApp.api.getUserMap()
    .then(function (res) {
      if (res.success) {
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
      drawMarkers(LbsApp.map, map, true);
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
      console.error("获取个人地图失败", err);
    });
  });
}]);

mapControllers.controller('SearchCtrl', ['$scope', '$http', function ($scope, $http) {
  AMap.service(["AMap.PlaceSearch"], function() {
    var MSearch = new AMap.PlaceSearch({ //构造地点查询类
      pageSize:10,
      pageIndex:1,
      city:"021" //城市
    });

    $('#form-search').submit(function (e) {
      e.preventDefault();

      //关键字查询
      MSearch.search(document.querySelector('#go').value, function (status, result) {
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
          });
        } else {
          console.error("地点查询失败", result);
        }
      });


    }).click();
  });
}]);


mapControllers.controller('postCtrl', ['$scope', '$http', function ($scope, $http) {

  $scope.newMsg={};
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
  })
  .catch(function (err) {
    console.error("无法在地图上定位当前位置", err);
  });


  $('#post-btn').click(function(e) {
    $('#post-module').modal({
      blurring: true,
      onApprove: function() {
        $('#post-loader').addClass("active");
        LbsApp.api.createPost(document.querySelector("#form-post"))
        .then(function (res) {
          if (res.success) {
            $('#post-module').modal('hide');
            $('#post-loader').removeClass("active");
            return LbsApp.getCurrency(LbsApp.map, LbsApp.geo)
          } else {
            $('#post-loader').removeClass("active");
            throw new Error(res.error);
          }
        })
        .then(function (pos) {
          return LbsApp.api.getNearBy(pos.lng, pos.lat);
        })
        .then(function (res) {
          drawMarkers(LbsApp.map, res.posts);
        })
        .catch(function (err) {
          console.error("发布失败", err);
        });
        return false;
      }
    }).modal('show');
  });
}]);



mapControllers.controller('registryCtrl', ['$scope', '$http', function ($scope, $http) {
  if (localStorage['has-been-login'] == '1') {
    document.querySelector("#registry-btn").style.display = 'none';
  } else {
    document.querySelector("#logout-btn").style.display = 'none';
  }
  $('#registry-btn').click(function(e) {
    $('#registry-module').modal({
      blurring: true,
      onApprove: function () {
        $('#registry-loader').addClass("active");
        LbsApp.api.registy(document.querySelector("#form-registry"))
        .then(function (res) {
          if (res.success)
            $('#registry-module').modal('hide');
          else
            console.error("注册失败", res.error);
          $('#registry-loader').removeClass("active");
        });
        return false;
      }
    }).modal('show');
  });
}]);

mapControllers.controller('loginCtrl', ['$scope', '$http', function ($scope, $http) {
  if (localStorage['has-been-login'] == '1') {
    document.querySelector("#login-btn").style.display = 'none';
  }
  $('#login-btn').click(function(e) {
    $('#login-module').modal({
        blurring: true,
        onApprove: function () {
          $('#login-loader').addClass("active");
          LbsApp.api.login(document.querySelector("#form-login"))
          .then(function (res) {
            if (res.success) {
              $('#login-module').modal('hide');
              $('#login-loader').removeClass("active");
              document.querySelector("#logout-btn").style.display = 'inherit';
              document.querySelector("#registry-btn").style.display = 'none';
              document.querySelector("#login-btn").style.display = 'none';
              localStorage['has-been-login'] = 1
            } else {
              $('#login-loader').removeClass("active");
              console.error("登录失败:", res);
            }
          });
          return false;
        }
    }).modal('show');
  });
}]);

mapControllers.controller('logoutCtrl', ['$scope', '$http', function ($scope, $http) {
  if (localStorage['has-been-login'] == '0') {
    document.querySelector("#logout-btn").style.display = 'none';
  }

  $('#logout-btn').click(function(e) {
    $('#logout-module').modal({
        blurring: true,
        onShow: function () {
          $('#logout-loader').addClass("active");
          LbsApp.api.logout()
          .then(function (res) {
            if (res.success) {
              localStorage['has-been-login'] = 0;
              LbsApp.polyline && LbsApp.polyline.setMap(null);
              LbsApp.setCurrentLocation(LbsApp.map, LbsApp.geo, function (err, posts) {
                document.querySelector("#logout-btn").style.display = 'none';
                document.querySelector("#registry-btn").style.display = 'inherit';
                document.querySelector("#login-btn").style.display = 'inherit';
                $('#logout-module').modal('hide');
                drawMarkers(LbsApp.map, posts);
              });
            }
            $('#logout-loader').removeClass("active");
          })
          .catch(function (err) {
            console.error("注销失败", err);
          });
          return false;
        }
    }).modal('show');
  });
}]);
