'use strict';

// Declare app level module which depends on filters, and services
angular.module('streamApp', [
    'ngCookies',
    'ui.router',
    'ui.bootstrap',
    'restangular'
]).config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

    var access = routingConfig.accessLevels;

    // Public routes
    $stateProvider
        .state('public', {
            abstract: true,
            template: "<ui-view/>",
            data: {
                access: access.public
            }
        }).state('public.home', {
            url: '/',
            templateUrl: '/home'
        })
        .state('public.404', {
            url: '/404/',
            templateUrl: '404'
        })
        .state('public.stream',{
            url:'/stream/:streamId',
            templateUrl:'/partials/stream',
            controller:'StreamingCtrl'
        })
        .state('public.publishing',{
            url:'/publishing',
            templateUrl:'/partials/publishing'
        });

    // Anonymous routes
    $stateProvider
        .state('anon', {
            abstract: true,
            template: "<ui-view></ui-view>",
            data: {
                access: access.anon
            }
        })
        .state('anon.login', {
            url: '/login/',
            templateUrl: '/partials/auth/login',
            controller: 'LoginCtrl'
        })
        .state('anon.register', {
            url: '/register/',
            templateUrl: '/partials/auth/register',
            controller: 'RegisterCtrl'
        });

    // Regular user routes
    $stateProvider
        .state('user', {
            abstract: true,
            template: "<ui-view/>",
            data: {
                access: access.user
            }
        })
        .state('user.private', {
            abstract: true,
            url: '/private/',
            templateUrl: '/partials/private/layout'

        })
        .state('user.private.streams', {
            url: '',
            templateUrl: '/partials/private/streams',
            controller: 'StreamCtrl'
        })

    // Admin routes
    $stateProvider
        .state('admin', {
            abstract: true,
            template: "<ui-view/>",
            data: {
                access: access.admin
            }
        });


    $urlRouterProvider.otherwise('/404');

    // FIX for trailing slashes. Gracefully "borrowed" from https://github.com/angular-ui/ui-router/issues/50
    $urlRouterProvider.rule(function ($injector, $location) {
        if ($location.protocol() === 'file')
            return;

        var path = $location.path()
        // Note: misnomer. This returns a query object, not a search string
            , search = $location.search()
            , params
            ;

        // check to see if the path already ends in '/'
        if (path[path.length - 1] === '/') {
            return;
        }

        // If there was no search string / query params, return with a `/`
        if (Object.keys(search).length === 0) {
            return path + '/';
        }

        // Otherwise build the search string and return a `/?` prefix
        params = [];
        angular.forEach(search, function (v, k) {
            params.push(k + '=' + v);
        });
        return path + '/?' + params.join('&');
    });

    $locationProvider.html5Mode(true);

    $httpProvider.interceptors.push(function ($q, $location) {
        return {
            'responseError': function (response) {
                if (response.status === 401 || response.status === 403) {
                    $location.path('/login');
                }
                return $q.reject(response);
            }
        };
    });

}])
    .run(['$log', '$rootScope', '$state', 'Auth', function ($log, $rootScope, $state, Auth) {
        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
            if (!('data' in toState) || !('access' in toState.data)) {
                $rootScope.error = "Access undefined for this state";
                event.preventDefault();
            }
            $log.log('State change started from ' + JSON.stringify(fromState) + ' to ' + JSON.stringify(toState));
            if (!Auth.authorize(toState.data.access)) {
                event.preventDefault();
                if (fromState.url === '^') {
                    if (Auth.isLoggedIn()) {
                        $rootScope.error = "Seems like you tried accessing a route you don't have access to...";
                        $state.go('public.home');
                    } else {
                        $rootScope.error = "Seems like you tried accessing a route you don't have access to...";
                        $state.go('anon.login');
                    }
                }
            }
        });

    }]);