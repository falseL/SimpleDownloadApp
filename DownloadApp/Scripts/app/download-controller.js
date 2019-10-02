'use strict';
angular.module('DownloadApp', [])
    .controller('DownloadCtrl', DownloadCtrl)
    .constant('ApiBasePath', "/")
    .service('DownloadService', DownloadService)
    .filter('filesize', FileSizeFilter);



DownloadCtrl.$inject = ['DownloadService'];
function DownloadCtrl(DownloadService) {
    var downloadList = this;
    var promise = DownloadService.getDownloadItems();
    promise.then(function (response) {
        downloadList.items = response.data
    })
        .catch(function (error) {
            console.log("Something went wrong.");
        });
}

DownloadService.$inject = ['$http', 'ApiBasePath'];
function DownloadService($http, ApiBasePath) {
    var service = this;
    service.getDownloadItems = function () {
        var response = $http({ url: ApiBasePath + 'api/Downloads' });
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