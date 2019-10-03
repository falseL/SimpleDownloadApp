(function () {
    'use strict';

    var app = angular.module("DownloadApp")
        .config(RoutesConfig);

    console.log('test1');
    RoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];
    function RoutesConfig($stateProvider, $urlRouterProvider, $locationProvider) {
        console.log('test2')
        $urlRouterProvider.otherwise('/');
        $locationProvider.hashPrefix(''); 
        $stateProvider
        .state('home', {
            url: '/',
            template: '<p>this is a home template</p>'
        })
        .state('login', {
            url: '/login',
            templateUrl: 'Scripts/app/templates/login.template.html',
            controller: 'LoginCtrl'
        });
    }

    app.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    }]);

    app.config(['$qProvider', function ($qProvider) {
        $qProvider.errorOnUnhandledRejections(false);
    }]);

})();