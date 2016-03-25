var admin_settings = angular.module('dk-admin', ['ngRoute', 'ngAnimate']);
admin_settings.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider
    .when('/feed', {
      templateUrl: '/templates/admin-feed.html',
      controller: 'feedCtrl',
      controllerAs: 'feed',
    })
    .when('/user', {
      templateUrl: '/templates/admin-user.html',
      controller: 'userCtrl',
      controllerAs: 'user',
    })
    .otherwise({redirectTo: "/feed"});
      // $locationProvider.html5Mode(true);
    }])
.controller('mainCtrl', function($scope, $http, showAlert) {
  $scope.tip = showAlert;
  $scope.delFeed = function(_id) {
    console.log("in delete feed");
    $http.delete('/admin/feed', {params: {id: _id}}).
      success(function(data, status) {
        console.log("del suc");
        if(status > 400 || data.status == -1) {
          $scope.tip.setMessage("Delete feed FAIL", "danger");
        }
        console.log($scope.feeds);
        if(data.status == 1) {
          $scope.tip.setMessage("Delete feed SUCCESS", "success"); 
          for (var i = 0; i < $scope.feeds.length; i++) {
            if($scope.feeds[i]._id == _id) {
              $scope.feeds.splice(i, 1);
              break;
            }
          }
        }
      }).
      error(function(data, status) {
        console.log("del fail");
        $scope.tip.setMessage("Delete feed FAIL", "success"); 
      });
  }
  $scope.delUser = function(_id) {
    $http.delete('/admin/user', {params: {id: _id}}).
      success(function(data, status) {
        if(status > 400 || data.status == -1) {
          $scope.tip.setMessage("Delete user FAIL", "danger");
        }
        if(data.status == 1) {
          $scope.tip.setMessage("Delete user SUCCESS", "success"); 
          $scope.users = $scope.users.slice($scope.users.indexOf(_id), 1);
        }
      }).
      error(function(data, status) {
        $scope.tip.setMessage("Delete user FAIL", "success"); 
      });
  }
})
.controller('userformCtrl', function($scope, $http){
  $scope.adduser = function(isValid) {
    if(!isValid) {
      $scope.tip.setMessage("BAD INPUT", "danger");
      return 
    }
    var username = $scope.user_username,
      passwd = $scope.user_passwd,
      permission = $scope.user_permission;
    $http.post('/admin/user/add', {username: username, passwd: passwd, permission: permission,}).
      success(function(data, status) {
        if(status > 400 || data.status == -1) {
          $scope.tip.setMessage("Add user FAIL", "danger");
        }
        if(data.status == 1) {
          $scope.tip.setMessage("Add user SUCCESS", "success"); 
        }
      }).
      error(function(data, status) {
        $scope.tip.setMessage("Add user FAIL", "danger");
      });
      $scope.user_username=null;
      $scope.user_passwd=null;
      $scope.user_permission=null;
  };
})
.controller('feedformCtrl', function($scope, $http, $window){
  $scope.addfeed = function(isValid) {
    // console.log(isValid);
    if(!isValid) {
      $scope.tip.setMessage("BAD INPUT", "danger");
      return 
    }
    // console.log("test1");
    $http.post('/admin/feed/add', {content: $scope.feed_content}).
      success(function(data, status) {
        // console.log("feed suc");
        // console.log(data);
        if(status > 400 || data.status == -1) {
          $scope.tip.setMessage("Add feed FAIL", "danger");
        }
        if(data.status == 1) {
          $scope.tip.setMessage("Add feed SUCCESS", "success"); 
        }
      }).
      error(function(data, status) {
        console.log("feed fail");
        $scope.tip.setMessage("Add feed FAIL", "danger");
      });
      $scope.feed_content=null;
  };
})
.controller('userCtrl', 
  function($scope, $http, $window) {
    $http.get('/admin/user/get?all=1&username=null').
    success(function(data, status) {
      if(status > 400 || data.status == -1) {
        $scope.tip.setMessage("Get user FAIL", "danger");
      }
      var _users = data.data;
      if(angular.isArray(_users) === true) {
        $scope.users = _users;
      } else {
        $scope.users = [];
      }
    }).
    error(function(data, status) {
      console.log("call fail");
      if(status > 400) {
        $scope.tip.setMessage("Get user FAIL", "danger");
      }
    });
  }
).
controller('feedCtrl', 
  function($scope, $http, $window) {
    $http.get('/admin/feed/get').
    success(function(data, status) {
      if(status > 400 || data.status == -1) {
        $scope.tip.setMessage("Get feed FAIL", "danger");
      }
      var _feeds = data.data;
      if(angular.isArray(_feeds) === true) {
        $scope.feeds = _feeds;
      } else {
        $scope.feeds = [];
      }
    }).
    error(function(data, status) {
      if(status > 400) {
        $scope.tip.setMessage("Get feed FAIL", "danger");
      }
    });
  }
);

admin_settings.factory('showAlert', function($timeout) {
  return {
    message: null,
    type: null,
    setMessage: function(msg, type) {
      this.message = msg;
      this.type = type;
      var _self = this;
      $timeout(function(){
        _self.clear();
      }, 2000);
    },
    clear: function() {
      this.message = null;
      this.type = null;
    }
  }
})