describe('Download Controller', () => {

    var $state, $rootScope, $scope, $httpBackend, DownloadService, store, $filter, DownloadController;
    beforeEach(module('DownloadApp'));

    beforeEach(inject(function ($injector) {
        $state = $injector.get('$state');
        $rootScope = $injector.get('$rootScope');
        $scope = $rootScope.$new();
        $httpBackend = $injector.get('$httpBackend');
        $controller = $injector.get('$controller');
        DownloadController = $controller('DownloadController', {
            $scope: $scope
        });
        DownloadService = $injector.get('DownloadService');
        $filter = $injector.get('$filter');
        $httpBackend.when('GET', '/App/Templates/login.html').respond({ response: 'login' });
        $httpBackend.when('GET', '/App/Templates/downloadlist.html').respond({ response: 'downloadlist' });
        $httpBackend.when('GET', '/api/Downloads', '', function (headers) {
            if (headers.Authorization === 'Bearer ValidToken')
                return true
        }).respond({ response: 'success' });
        $httpBackend.when('GET', '/api/Downloads', '', function (headers) {
            if (headers.Authorization !== 'Bearer ValidToken')
                return true
        }).respond({ response: 'fail' });
        spyOn(sessionStorage, 'getItem').and.callFake(function (key) {
            return store[key];
        });
        store = {isAuthenticated: false};
        spyOn(sessionStorage, 'clear');
    }));

    it('getItem should success with valid token', () => {
        // arrange
        store = { access_token: 'ValidToken' };
        // act
        var getItem = DownloadService.getDownloadItems();
        // assert
        $httpBackend.flush();
        expect(getItem.$$state.value.data.response).toBe("success");
    });

    it('getItem should fail with invalid token', () => {
        // arrange
        store = { access_token: 'InvalidToken' };
        // act
        var getItem = DownloadService.getDownloadItems();
        // assert
        $httpBackend.flush();
        expect(getItem.$$state.value.data.response).toBe("fail");
    });

    it('filesize filter', () => {
        // arrange
        var filterOutput = [];
        var testSizes = ['s', 0, 1024, 1048576, 1073741824, 1.1e+12, 1.13e+15];
        var expectOutput = ['-', '0 B', '1.0 kB', '1.0 MB', '1.0 GB', '1.0 TB', '1.0 PB'];
        // act
        for (var size of testSizes) {
            filterOutput.push($filter('filesize')(size));
        }

        // assert
        expect(filterOutput).toEqual(expectOutput);
    });

    it('search() with empty query should get all items', () => {
        // arrange
        DownloadController.items = [{ FileName: 'item1', FileType: 'type1' },{ FileName: 'item2', FileType: 'type2' }];
        DownloadController.foundItems;
        DownloadController.query = ""
        // act
        DownloadController.search();
        
        // assert
        expect(DownloadController.foundItems).toEqual(DownloadController.items);
    });

    it('search() with should search for names', () => {
        // arrange
        DownloadController.items = [{ FileName: 'item1', FileType: 'type1' },{ FileName: 'item2', FileType: 'type2' },{ FileName: 'veryDifferentName', FileType: 'veryDifferent1' }];
        DownloadController.foundItems;
        DownloadController.query = "item"
        var expectOutput = [{ FileName: 'item1', FileType: 'type1' },{ FileName: 'item2', FileType: 'type2' }];
        // act
        DownloadController.search();
        
        // assert
        expect(DownloadController.foundItems).toEqual(expectOutput);
    });

    it('search() with should search for types', () => {
        // arrange
        DownloadController.items = [{ FileName: 'item1', FileType: 'type1' },{ FileName: 'item2', FileType: 'type2' },{ FileName: 'veryDifferentName', FileType: 'veryDifferent1' }];
        DownloadController.foundItems;
        DownloadController.query = "type"
        var expectOutput = [{ FileName: 'item1', FileType: 'type1' },{ FileName: 'item2', FileType: 'type2' }];
        // act
        DownloadController.search();
        
        // assert
        expect(DownloadController.foundItems).toEqual(expectOutput);
    });

    it('search() with should search for name and types', () => {
        // arrange
        DownloadController.items = [{ FileName: 'item1', FileType: 'type1' },{ FileName: 'item2', FileType: 'type2' },{ FileName: 'veryDifferentName', FileType: 'veryDifferent1' }];
        DownloadController.foundItems;
        DownloadController.query = "1"
        var expectOutput = [{ FileName: 'item1', FileType: 'type1' },{ FileName: 'veryDifferentName', FileType: 'veryDifferent1' }];
        // act
        DownloadController.search();
        
        // assert
        expect(DownloadController.foundItems).toEqual(expectOutput);
    });

    it('search() with should ignore case', () => {
        // arrange
        DownloadController.items = [{ FileName: 'item1', FileType: 'type1' },{ FileName: 'item2', FileType: 'type2' },{ FileName: 'veryDifferentName', FileType: 'veryDifferent1' }];
        DownloadController.foundItems;
        DownloadController.query = "ItEm"
        var expectOutput = [{ FileName: 'item1', FileType: 'type1' },{ FileName: 'item2', FileType: 'type2' }];
        // act
        DownloadController.search();
        
        // assert
        expect(DownloadController.foundItems).toEqual(expectOutput);
    });

    it('logout() should clear sessionStorage and then go to login page', () => {
        
        // arrange
        // act
        DownloadController.logout();
        // assert
        expect(sessionStorage.clear).toHaveBeenCalled();
        $httpBackend.flush();
        expect($state.current.name).toBe('login');
    });

});