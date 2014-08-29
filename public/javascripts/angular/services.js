'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('streamApp').
    factory(
    'Auth', function ($http, $cookieStore, $log) {
        $log.log('Entering Auth service');
        var accessLevels = routingConfig.accessLevels
            , userRoles = routingConfig.userRoles
            , currentUser = $cookieStore.get('user') || { username: '', role: userRoles.public };

        $cookieStore.remove('user');

        function changeUser(user) {
            angular.extend(currentUser, user);
        }

        return {
            authorize: function (accessLevel, role) {
                if (role === undefined) {
                    role = currentUser.role;
                }

                return accessLevel.bitMask & role.bitMask;
            },
            isLoggedIn: function (user) {
                if (user === undefined) {
                    user = currentUser;
                }
                return user.role.title === userRoles.user.title || user.role.title === userRoles.admin.title;
            },
            register: function (user, success, error) {
                $log.log('Registering user with details: ' + JSON.stringify(user));
                $http.post('/auth/register', user).success(function (res) {
                    changeUser(res);
                    success();
                }).error(error);
            },
            login: function (user, success, error) {
                $http.post('/auth/login', user).success(function (user) {
                    changeUser(user);
                    success(user);
                }).error(error);
            },
            logout: function (success, error) {
                $http.post('/logout').success(function () {
                    changeUser({
                        username: '',
                        role: userRoles.public
                    });
                    success();
                }).error(error);
            },
            accessLevels: accessLevels,
            userRoles: userRoles,
            user: currentUser
        };
    }
).factory('Users', function ($http) {
        return {
            getAll: function (success, error) {
                $http.get('/users').success(success).error(error);
            }
        };
    });
