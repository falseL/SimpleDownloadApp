'use strict';

downloadApp
    .controller('LoginController', LoginController)
    .factory('LoginService', LoginService);

LoginController.$inject = ['$state', 'LoginService'];
function LoginController($state, LoginService) {
    var loginForm = this;
    loginForm.formSubmit = function () {
        var loginRequest = LoginService.login(loginForm.username, loginForm.password);
        loginRequest.then(function (response) {
            if (response.status == 200) {
                var now = new Date();
                // set token related values to sessionStorage
                sessionStorage.setItem("exp", new Date(now.getTime() + response.data.expires_in * 1000));
                sessionStorage.setItem("access_token", response.data.access_token);
                sessionStorage.setItem("isAuthenticated", true);
                loginForm.error = '';
                loginForm.username = '';
                loginForm.password = '';
                $state.transitionTo('home');
            }
            else {
                sessionStorage.clear();
                loginForm.error = "Incorrect username/password !";
            }
        }).catch(function (e) {
            sessionStorage.clear();
            loginForm.error = "Incorrect username/password !";
        });
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

