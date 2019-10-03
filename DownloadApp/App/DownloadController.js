'use strict';
downloadApp
    .controller('DownloadCtrl', DownloadCtrl)
    .service('DownloadService', DownloadService)
    .filter('filesize', FileSizeFilter);

DownloadCtrl.$inject = ['$state','DownloadService'];
function DownloadCtrl($state, DownloadService) {
    var downloadList = this;
    var promise = DownloadService.getDownloadItems();
    promise.then(function (response) {
        downloadList.items = response.data
    })
    .catch(function (error) {
        console.log("Something went wrong.");
    });

    downloadList.logout = function () {
        sessionStorage.clear();
        $state.go('login'); // go to login
    }
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
    }
}