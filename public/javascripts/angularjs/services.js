'use strict';

var notificationService = mapApp.service('notificationService', ['$rootScope', function ($rootScope) {
  var ref = null;
  var className = '';
  this.notify = function (type, title, content) {
    clearTimeout(ref);
    $('.ui.message').fadeIn()
    .removeClass(className).addClass(type).children()
    .first().text(title)
    .next().text(content);
    ref = setTimeout(function () {
      $('.ui.message').fadeOut();
    }, 3000);
    className = type;
  };
}]);
