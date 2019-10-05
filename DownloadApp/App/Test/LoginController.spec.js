describe('Download Controller', () => {

    var ApiBasePath, $state, $rootScope, $scope, $httpBackend, LoginService, LoginController;
    beforeEach(module('DownloadApp'));

    beforeEach(inject(function ($injector) {
        ApiBasePath = $injector.get('ApiBasePath');
        $state = $injector.get('$state');
        $rootScope = $injector.get('$rootScope');
        $scope = $rootScope.$new();
        $httpBackend = $injector.get('$httpBackend');
        $controller = $injector.get('$controller');
        LoginController = $controller('LoginController', {
            $scope: $scope
        });
        LoginService = $injector.get('LoginService');
        $httpBackend.when('GET', '/App/Templates/login.html').respond({ response: 'login' });
        $httpBackend.when('GET', '/App/Templates/downloadlist.html').respond({ response: 'downloadlist' });
        $httpBackend.when('POST', ApiBasePath + 'token', (data) => {
            if (data === 'grant_type=password&username=correctUsername&password=correctPassword')
                return true
        }).respond({ response: 'success' });
        $httpBackend.when('POST', ApiBasePath + 'token', (data) => {
            if (data !== 'grant_type=password&username=correctUsername&password=correctPassword')
                return true
        }).respond({ response: 'fail' });
    }));

    it('login() should success with valid user credential', () => {
        // arrange
        var username = 'correctUsername';
        var password = 'correctPassword';
        // act
        var response = LoginService.login(username, password);
        // assert
        $httpBackend.flush();
        expect(response.$$state.value.data.response).toBe("success");
    });

    it('login() should fail with invalid user credential', () => {
        // arrange
        var username = 'correctUsername';
        var wrongPassword = 'wrongPassword';
        // act
        var response = LoginService.login(username, wrongPassword);
        // assert
        $httpBackend.flush();
        expect(response.$$state.value.data.response).toBe("fail");
    });

    it('login() should fail with invalid user credential', () => {
        // arrange
        var username = 'correctUsername';
        var wrongPassword = 'wrongPassword';
        // act
        var response = LoginService.login(username, wrongPassword);
        // assert
        $httpBackend.flush();
        expect(response.$$state.value.data.response).toBe("fail");
    });
});