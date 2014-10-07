'use strict';

/* Controllers */

angular.module('streamApp').
    controller('NavCtrl', function ($rootScope, $scope, $location, Auth) {
        $scope.user = Auth.user;
        $scope.userRoles = Auth.userRoles;
        $scope.accessLevels = Auth.accessLevels;

        $scope.logout = function () {
            Auth.logout(function () {
                $location.path('/');
            }, function () {
                $rootScope.error = "Failed to logout";
            });
        };
    }).
    controller('LoginCtrl', function ($log, $rootScope, $scope, $location, $window, Auth) {
        $scope.rememberme = true;
        $scope.login = function () {
            Auth.login({
                    email: $scope.email,
                    password: $scope.password,
                    rememberme: $scope.rememberme
                },
                function (res) {
                    $log.log('Successful logged in user, and got response: ' + JSON.stringify(res));
                    $location.path('/');
                    $location.replace();
                },
                function (err) {
                    $rootScope.error = err;
                });
        };
        $scope.loginOauth = function (provider) {
            $window.location.href = '/auth/' + provider;
        };
    }).
    controller('RegisterCtrl', function ($state, $rootScope, $scope, $location, Auth) {
        $scope.role = Auth.userRoles.user;
        $scope.userRoles = Auth.userRoles;

        $scope.register = function () {
            Auth.register({
                    email: $scope.email,
                    username: $scope.username,
                    password: $scope.password,
                    role: $scope.role
                },
                function () {
                    $location.path('/');
                },
                function (err) {
                    $rootScope.error = err;
                });
        };
    }).
    controller('AdminCtrl', function ($rootScope, $scope, Users, Auth) {
        $scope.loading = true;
        $scope.userRoles = Auth.userRoles;

        Users.getAll(function (res) {
            $scope.users = res;
            $scope.loading = false;
        }, function (err) {
            $rootScope.error = "Failed to fetch users.";
            $scope.loading = false;
        });

    });
