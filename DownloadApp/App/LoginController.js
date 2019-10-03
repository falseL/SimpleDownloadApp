'use strict';
-
downloadApp
    .controller('LoginController', LoginController)
    .factory('LoginService', LoginService)
    .run(function ($rootScope, $state) {
        $rootScope.$on('$stateChangeStart', function (e, toState) {
            var isAuthenticated = Boolean(sessionStorage.getItem('isAuthenticated'));
            var isLogin = toState.name === "login";
            if (isLogin) {
                return;
            }
            // redirect only not authenticated
            if (isAuthenticated !== true) {
                e.preventDefault(); // stop current execution
                $state.go('login'); // go to login
            }
        });
    });


LoginController.$inject = ['$rootScope', '$stateParams', '$state', 'LoginService'];
function LoginController($rootScope, $stateParams, $state, LoginService) {
    var loginForm = this;
    loginForm.formSubmit = function () {
        var loginRequest = LoginService.login(loginForm.username, loginForm.password);
        loginRequest.then(function (response) {
            if (response.status == 200) {
                console.log(response.data);
                var now = new Date(); 
                sessionStorage.setItem("exp", new Date(now.getTime() + response.data.expires_in * 1000));
                sessionStorage.setItem("access_token", response.data.access_token);
                sessionStorage.setItem("isAuthenticated", true);
                loginForm.error = '';
                loginForm.username = '';
                loginForm.password = '';
                $state.transitionTo('home');
            }
            else {
                sessionStorage.setItem("isAuthenticated", false);
                sessionStorage.removeItem("access_token");
                loginForm.error = "Incorrect username/password !";
            }
        }).catch(function (e) {
            sessionStorage.setItem("isAuthenticated", false);
            sessionStorage.removeItem("access_token");
            loginForm.error = "Incorrect username/password !";
        });
        console.log(sessionStorage);
    };
}

LoginService.$inject = ['$http', 'ApiBasePath'];
function LoginService($http, ApiBasePath) {
    return {
        login: function (username, password) {
            var request = $http({
                url: ApiBasePath + 'token',
                method: 'POST',
                data: $.param({
                    grant_type: 'password',
                    username: username,
                    password: password
                }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            return request;
        }
    };
};

