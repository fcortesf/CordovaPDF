(function () {
    'use strict'
    angular.module("pdfViewer", ['pdfViewer.download','pdfViewer.viewer']);

    angular.module("pdfViewer").controller('viewerController', viewerController);

    viewerController.$inject = ['$scope', 'downloadService','viewerService'];

    function viewerController($scope, downloadService, viewerService) {
        var _resultFileURI = "";
        var _pdfURL = "http://research.microsoft.com/en-us/um/people/simonpj/papers/giving-a-talk/writing-a-paper-slides.pdf";
        var _fileName = "writing-a-paper-slides.pdf";
        angular.extend($scope, {
            downProgress: false,
            downloaded: false,
            download: function () {
                $scope.downProgress = true;
                downloadService.download(_pdfURL,_fileName).then(function (fileURI) {
                    _resultFileURI = fileURI;
                    $scope.downProgress = false;
                    $scope.downloaded = true;
                }, function (errorCode, error) {
                    console.log(errorCode);
                    if (error) {
                        console.log(error);
                    }
                    $scope.downProgress = false;
                    alert('ERROR!');
                });
            },
            show: function () {
                viewerService.showPDF(_resultFileURI);
            }
        });
    }
})()