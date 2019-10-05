'use strict';
downloadApp.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: '/App/Templates/downloadlist.html',
            controller: "DownloadController as downloadList"
        })
        .state('login', {
            url: '/login',
            templateUrl: '/App/Templates/login.html',
            controller: "LoginController as loginform"
        });
});

downloadApp.run(function ($rootScope, $state) {
    $rootScope.$on('$stateChangeStart', function (e, toState) {
        var isAuthenticated = Boolean(sessionStorage.getItem('isAuthenticated'));
        var isLogin = toState.name === "login";
        var isExpired = new Date() > new Date(sessionStorage.getItem('exp'));
        if (isLogin) {
            return;
        }
        // redirect when not authenticated, or token expired
        if (isAuthenticated !== true || isExpired) {
            sessionStorage.clear();
            e.preventDefault(); // stop current execution
            $state.go('login'); // go to login
        }
    });
});