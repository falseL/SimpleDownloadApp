'use strict';
downloadApp
    .controller('DownloadController', DownloadController)
    .service('DownloadService', DownloadService)
    .filter('filesize', FileSizeFilter);

DownloadController.$inject = ['$state', 'DownloadService','$scope'];
function DownloadController($state, DownloadService, $scope) {
    var downloadList = this;
    var promise = DownloadService.getDownloadItems();
    
    downloadList.foundItems = [];

    promise.then(function (response) {
        downloadList.items = response.data;
        downloadList.foundItems = response.data;
    })
    .catch(function (error) {
        console.log("Something went wrong.", error);
    });

    downloadList.logout = function () {
        sessionStorage.clear();
        $state.go('login'); // go to login
    };

    downloadList.search = function () {
        if (downloadList.query === "") {
            downloadList.foundItems = downloadList.items;
        }
        else {
            downloadList.foundItems = [];
            for (var item of downloadList.items) {
                var fileNameMatched = item.FileName.toLowerCase().indexOf(downloadList.query.toLowerCase()) !== -1;
                var fileTypeMatched = item.FileType.toLowerCase().indexOf(downloadList.query.toLowerCase()) !== -1;
                if (fileNameMatched || fileTypeMatched) {
                    downloadList.foundItems.push(item);
                }
            }
        }
    };
}

DownloadService.$inject = ['$http', 'ApiBasePath'];
function DownloadService($http, ApiBasePath) {
    var service = this;
    service.getDownloadItems = function () {
        var response = $http({
            method: 'GET',
            url: ApiBasePath + 'api/Downloads',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem("access_token")
            }
        });
        return response;
    };
}

function FileSizeFilter() {
    return function (bytes, precision) {
        if (bytes === 0) return '0 B';
        if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
        if (typeof precision === 'undefined') precision = 1;
        var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
            number = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
    };
}