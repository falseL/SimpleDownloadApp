downloadApp.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: '/App/Test/downloadlist.html',
            controller: "DownloadCtrl as downloadList"
        })
        .state('login', {
            url: '/login',
            templateUrl: '/App/Test/login.html',
            controller: "LoginController as loginform"
        })
});