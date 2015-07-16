'use strict';

/* Controllers */
var polyline;
function drawMarkers(map, posts) {
  var markers= [];

  posts.forEach(function (post) {
    var markerPosition = new AMap.LngLat(post.lng, post.lat);
    var marker = new AMap.Marker({
      //基点位置
      position:markerPosition,
      //marker图标，直接传递地址url
      icon:"http://developer.amap.com/wp-content/uploads/2014/06/marker.png",
      //相对于基点的位置
      offset:{x:-8, y:-34}
    });
    marker.setTitle(post.time);
    AMap.event.addListener(marker,'click',function(){
       infoWindow.open(map,marker.getPosition());
     });
     //实例化信息窗体
    var infoWindow = new AMap.InfoWindow({
        isCustom:true,  //使用自定义窗体
        content:createInfoWindow(`${post.location}<span style="font-size:11px;color:#F00;"></span>`,`<img src='http://tpc.googlesyndication.com/simgad/5843493769827749134' style='position:relative;float:left;margin:0 5px 5px 0;'>地址：${post.location}<br/><br/>${post.text}`),
        offset:new AMap.Pixel(16, -45)//-113, -140
      });

    //构建自定义信息窗体
    function createInfoWindow(title,content){
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
      map.clearInfoWindow();
    }
    markers.push(marker);
  });

  if (LbsApp.cluster) {
    LbsApp.cluster.setMap(null);
  }
  map.plugin(["AMap.MarkerClusterer"],function(){
    LbsApp.cluster = new AMap.MarkerClusterer(map,markers);
  });
}



function MyDrawMarkers(map, posts) {
  var markers= [];

  posts.forEach(function (post) {
    var markerPosition = new AMap.LngLat(post.lng, post.lat);
    var marker = new AMap.Marker({
      //基点位置
      position:markerPosition,
      //marker图标，直接传递地址url
      icon:"http://developer.amap.com/wp-content/uploads/2014/06/marker.png",
      //相对于基点的位置
      offset:{x:-8, y:-34}
    });
    marker.setTitle(post.text);
    marker.setContent(post.time);
    AMap.event.addListener(marker,'click',function(){
       infoWindow.open(map,marker.getPosition());
     });
     //实例化信息窗体
    var infoWindow = new AMap.InfoWindow({
        isCustom:true,  //使用自定义窗体
        content:createInfoWindow(`${post.time}<span style="font-size:11px;color:#F00;"></span>`,`<img src='http://tpc.googlesyndication.com/simgad/5843493769827749134' style='position:relative;float:left;margin:0 5px 5px 0;'>地址：${post.location}<br/><br/>${post.text}`),
        offset:new AMap.Pixel(16, -45)//-113, -140
      });

    //构建自定义信息窗体
    function createInfoWindow(title,content){
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
      map.clearInfoWindow();
    }
    markers.push(marker);
  });

  if (LbsApp.cluster) {
    LbsApp.cluster.setMap(null);
  }
  map.plugin(["AMap.MarkerClusterer"],function(){
    LbsApp.cluster = new AMap.MarkerClusterer(map,markers);
  });
}


var mapControllers = angular.module('mapControllers', []);

mapControllers.controller('HomeCtrl', ['$scope', '$http',function($scope, $http) {
    // $http.get('http://localhost:3000/db').success(function(data) {
    //   $scope.infos = data;

    //});
	$scope.infos = [
	    {
	        "age": 0,
	        "id": "motorola-xoom-with-wi-fi",
	        "imageUrl": "img/phones/motorola-xoom-with-wi-fi.0.jpg",
	        "name": "Motorola XOOM\u2122 with Wi-Fi",
	        "snippet": "The Next, Next Generation\r\n\r\nExperience the future with Motorola XOOM with Wi-Fi, the world's first tablet powered by Android 3.0 (Honeycomb)."
	    },
	    {
	        "age": 1,
	        "id": "motorola-xoom",
	        "imageUrl": "img/phones/motorola-xoom.0.jpg",
	        "name": "MOTOROLA XOOM\u2122",
	        "snippet": "The Next, Next Generation\n\nExperience the future with MOTOROLA XOOM, the world's first tablet powered by Android 3.0 (Honeycomb)."
	    },
	    {
	        "age": 2,
	        "carrier": "AT&T",
	        "id": "motorola-atrix-4g",
	        "imageUrl": "img/phones/motorola-atrix-4g.0.jpg",
	        "name": "MOTOROLA ATRIX\u2122 4G",
	        "snippet": "MOTOROLA ATRIX 4G the world's most powerful smartphone."
	    },
	    {
	        "age": 3,
	        "id": "dell-streak-7",
	        "imageUrl": "img/phones/dell-streak-7.0.jpg",
	        "name": "Dell Streak 7",
	        "snippet": "Introducing Dell\u2122 Streak 7. Share photos, videos and movies together. It\u2019s small enough to carry around, big enough to gather around."
	    },
	    {
	        "age": 4,
	        "carrier": "Cellular South",
	        "id": "samsung-gem",
	        "imageUrl": "img/phones/samsung-gem.0.jpg",
	        "name": "Samsung Gem\u2122",
	        "snippet": "The Samsung Gem\u2122 brings you everything that you would expect and more from a touch display smart phone \u2013 more apps, more features and a more affordable price."
	    },
	    {
	        "age": 5,
	        "carrier": "Dell",
	        "id": "dell-venue",
	        "imageUrl": "img/phones/dell-venue.0.jpg",
	        "name": "Dell Venue",
	        "snippet": "The Dell Venue; Your Personal Express Lane to Everything"
	    }
	];
    	$scope.orderProp = 'age';
  }]);

mapControllers.controller('InitLoadCtrl', ['$scope', '$http',function($scope, $http) {
    $('#current').click(function (e) {
      LbsApp.setCurrentLocation(LbsApp.map, LbsApp.geo, function (err, posts) {
        drawMarkers(LbsApp.map, posts);
      });
    }).click();
    $('#my-map').click(function (e) {
      console.log("aaa");
      LbsApp.api.getUserMap()
      .then(function (res) {
        console.log(res);
        var map = res.map.sort(function (a, b) {
          var atime = new Date(a.time);
          var btime = new Date(b.time);
          return atime.getTime() - btime.getTime();
        });
        console.log(map);
        function addLine() {
      		   var lineArr = new Array();//创建线覆盖物节点坐标数组
             for (var i = 0; i < map.length; i++) {
               lineArr.push(new AMap.LngLat(map[i].lng, map[i].lat));
             }
            polyline = new AMap.Polyline({
      			   path:lineArr, //设置线覆盖物路径
      			   strokeColor:"#3366FF", //线颜色
      			   strokeOpacity:1, //线透明度
      			   strokeWeight:5, //线宽
      			   strokeStyle:"solid", //线样式
      			   strokeDasharray:[10,5] //补充线样式
      		   });
      		   polyline.setMap(LbsApp.map);
		    }
        MyDrawMarkers(LbsApp.map, res.map);
        addLine();
      });
    });
}]);

mapControllers.controller('SearchCtrl', ['$scope', '$http',function($scope, $http) {
    $('#search').submit(function (e) {
      e.preventDefault();
      // LbsApp.setCurrentLocation(LbsApp.map, LbsApp.geo, function (err, posts) {
      //   drawMarkers(LbsApp.map, posts);
      // });
      (function placeSearch(){
		    var MSearch;
		    AMap.service(["AMap.PlaceSearch"], function() {
		        MSearch = new AMap.PlaceSearch({ //构造地点查询类
		            pageSize:10,
		            pageIndex:1,
		            city:"021" //城市
		        });
		        //关键字查询
		        MSearch.search(document.querySelector('#go').value, function(status, result){
		        	if(status === 'complete' && result.info === 'OK'){
		        		geocoder_CallBack(result);
		        	}
		        });
		    });
		})();
    function geocoder_CallBack(data){
		    var geo = data.poiList.pois[0].location
		    var lng = geo.lng;
        var lat = geo.lat;
        LbsApp.api.getNearBy(lng, lat)
        .then(function (res) {
          console.log(res);
          LbsApp.mapInitialize(LbsApp.map, lng, lat, 13);
          drawMarkers(LbsApp.map, res.posts);
        });
      return false;
    }
    }).click();
}]);


mapControllers.controller('AddmsgCtrl', ['$scope', '$http',function($scope, $http) {
      // $http.get('http://localhost:3000/db').success(function(data) {
      //   $scope.infos = data;

      //});
      $scope.newMsg={};
      LbsApp.getCurrency(LbsApp.map, LbsApp.geo).then(function(pos){
        $scope.newMsg.posNum = pos;

        var lnglatXY = new AMap.LngLat(pos.lng, pos.lat);
    		(function () {
    		    var MGeocoder;
    		    //加载地理编码插件
    		    AMap.service(["AMap.Geocoder"], function() {
    		        MGeocoder = new AMap.Geocoder({
    		            radius: 1000,
    		            extensions: "all"
    		        });
    		        //逆地理编码
    		        MGeocoder.getAddress(lnglatXY, function(status, result){
    		        	if(status === 'complete' && result.info === 'OK'){
    		        		geocoder_CallBack(result);
    		        	}
    		        });
    		    });
          })();
          function geocoder_CallBack(data) {
        		    var address;
        		    //返回地址描述
        		    address = data.regeocode.formattedAddress;
                $scope.newMsg.address = address;
          }
      });


      $('#post-btn').click(function(e) {
        $('#new-post').modal({
          blurring: true,
          onApprove: function() {
            $('#loader').addClass("active");
            LbsApp.api.createPost(document.querySelector("#post-data"))
            .then(function (data) {
              if (data.success) {
                $('#new-post').modal('hide');
                $('#loader').removeClass("active");
                // draw
                return LbsApp.getCurrency(LbsApp.map, LbsApp.geo)
              }
            })
            .then(function (pos) {
              return LbsApp.api.getNearBy(pos.lng, pos.lat);
            })
            .then(function (res) {
              drawMarkers(LbsApp.map, res.posts);
            });
            return false;
          }
        }).modal('show');
      });
}]);



mapControllers.controller('registryCtrl', ['$scope', '$http', function($scope, $http) {
  if (localStorage['has-been-login'] == '1') {
    document.querySelector("#regis").style.display = 'none';
  } else {
    document.querySelector("#logout").style.display = 'none';
  }
  $('#regis').click(function(e) {
    $('#regist').modal({
        blurring: true,
        onApprove: function () {
          $('#registry-loader').addClass("active");
          LbsApp.api.registy(document.querySelector("#form-regis"))
          .then(function (res) {
            if (res.success) {
              //
              $('#regist').modal('hide');
              $('#registry-loader').removeClass("active");
            } else {
              $('#registry-loader').removeClass("active");
              console.log(res);
            }
          })
          return false;
        }
    }).modal('show');
  });
}]);

mapControllers.controller('loginCtrl', ['$scope', '$http', function($scope, $http) {
  if (localStorage['has-been-login'] == '1') {
    document.querySelector("#login").style.display = 'none';
  }
  $('#login').click(function(e) {
    $('#login-mod').modal({
        blurring: true,
        onApprove: function () {
          $('#login-loader').addClass("active");
          LbsApp.api.login(document.querySelector("#form-login"))
          .then(function (res) {
            if (res.success) {
              //
              $('#login-mod').modal('hide');
              $('#login-loader').removeClass("active");
              document.querySelector("#logout").style.display = 'inherit';
              document.querySelector("#regis").style.display = 'none';
              document.querySelector("#login").style.display = 'none';
              localStorage['has-been-login'] = 1
            } else {
              $('#login-loader').removeClass("active");
              console.log(res);
            }
          })
          return false;
        }
    }).modal('show');
  });
}]);



$('#logout').click(function(e) {
  LbsApp.api.logout().then(function (res) {
    if (res.success) {
      document.querySelector("#logout").style.display = 'none';
      document.querySelector("#regis").style.display = 'inherit';
      document.querySelector("#login").style.display = 'inherit';
      localStorage['has-been-login'] = 0
      console.log(polyline);
      polyline.setMap(null);
      LbsApp.setCurrentLocation(LbsApp.map, LbsApp.geo, function (err, posts) {
        drawMarkers(LbsApp.map, posts);
      $('#login-loader').addClass("active");
      setTimeOut($('#login-loader').removeClass("active"), 1000);
      });
    }
  })
});
