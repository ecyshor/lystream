'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('streamApp').
    factory(
    'Auth', function ($http, $cookieStore, $log) {
        var accessLevels = routingConfig.accessLevels
            , userRoles = routingConfig.userRoles
            , currentUser = $cookieStore.get('user') || { username: '', role: userRoles.public };
        $log.log('Auth service user: ' + JSON.stringify(currentUser));
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
                    $log.log('Registering successful for user. Recieved response ' + JSON.stringify(res));
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
                $http.post('/auth/logout').success(function () {
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
    }).factory('Users', function ($http) {
        return {
            getAll: function (success, error) {
            }
        };
    }).factory('User', function ($http, $log) {
        return {
            getStreams: function (success, error) {
                $log.info('Fetching streams for user');
                $http.get('/streams').success(success).error(error);
            },
            addStream: function (stream, success, error) {
                $log.log('Sending request for new stream with information ' + JSON.stringify(stream));
                $http.post('/streams', {'stream': stream}).success(function (res) {
                    $log.log('Created user stream :' + JSON.stringify(res));
                    success(res);
                }).error(error);
            }
        };
    });
