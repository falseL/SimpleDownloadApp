describe('App module, routes', () => {

    var ApiBasePath = "";
    var $state, $rootScope, $scope, $httpBackend;

    beforeEach(module('DownloadApp'));

    beforeEach(inject(function ($injector) {
        ApiBasePath = $injector.get('ApiBasePath');
        $state = $injector.get('$state');
        $rootScope = $injector.get('$rootScope');
        $scope = $rootScope.$new();
        $httpBackend = $injector.get('$httpBackend');
        $httpBackend.when('GET', '/App/Templates/login.html').respond({ response: 'login' });
        $httpBackend.when('GET', '/App/Templates/downloadlist.html').respond({ response: 'downloadlist' });
    }));

    it('ApiBasePath should not be empty', () => {
        // assert
        expect(ApiBasePath).not.toBe("");
    })

    it('home should have a url of /home', function () {
        // act
        var homeUrl = $state.get('home').url;
        // assert
        expect(homeUrl).toBe('/home');
    });

    it('home should have a templateUrl under /App/Templates', function () {
        // act
        var templateUrl = $state.get('home').templateUrl;
        // assert
        expect(templateUrl).toMatch(new RegExp('/App/Templates/*'));
    });

    it("should direct to home", () => {
        // act
        $state.go("home");
        // assert
        expect($state.href('home')).toEqual("#!/home");
    });

    it('login should have a url of /login', function () {
        // act
        var homeUrl = $state.get('login').url;
        // assert
        expect(homeUrl).toBe('/login');
    });

    it('login should have a templateUrl under /App/Templates', function () {
        // act
        var templateUrl = $state.get('login').templateUrl;
        // assert
        expect(templateUrl).toMatch(new RegExp('/App/Templates/*'));
    });

    it("should direct to login", () => {
        // act
        $state.go("login");
        // assert
        expect($state.href('login')).toEqual("#!/login");
        $httpBackend.flush();
        expect($state.current.url).toEqual("/login");
    });

    it("should redirect to login without auth", () => {
        // act
        $state.go("home");
        // assert
        $httpBackend.flush();
        expect($state.current.url).toEqual("/login");
    });

    it("should redirect to login with auth", () => {
        // arrange
        var store = {isAuthenticated: true};
        spyOn(sessionStorage, 'getItem').and.callFake(function (key) {
          return store[key];
        });
        // act
        $state.go("home");
        // assert
        $httpBackend.flush();
        expect($state.current.url).toEqual("/home");
    });

    it("should redirect to home with valid auth", () => {
        // arrange
        var store = {isAuthenticated: true, exp:'Oct 04 2099 GMT-0400'};
        spyOn(sessionStorage, 'getItem').and.callFake(function (key) {
          return store[key];
        });
        // act
        $state.go("home");
        // assert
        $httpBackend.flush();
        expect($state.current.url).toEqual("/home");
    });

    it("should redirect to login with expired auth", () => {
        // arrange
        var store = {isAuthenticated: true, exp:'Oct 04 2019 GMT-0400'};
        spyOn(sessionStorage, 'getItem').and.callFake(function (key) {
          return store[key];
        });
        // act
        $state.go("home");
        // assert
        $httpBackend.flush();
        expect($state.current.url).toEqual("/login");
    });

});

