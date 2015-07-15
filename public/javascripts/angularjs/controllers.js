'use strict';

/* Controllers */

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
    marker.setTitle(post.text);
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
        LbsApp.api.getNearBy(lng, lat, 5000, 100)
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
              return LbsApp.api.getNearBy(pos.lng, pos.lat, 5000, 100);
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
    document.querySelector("#logout").style.display = 'inherit';
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
    }
  })
});
