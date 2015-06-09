(function () {
    'use strict'
    angular.module("pdfViewer.download", []);

    angular.module("pdfViewer.download").factory('downloadService', ['$document', '$q',
        function ($document, $q) {
            var _saveDirectory = "";
            var _fileTransfer;
            // Set attributes from Cordova plugins
            $document[0].addEventListener("deviceready", function () {
                _fileTransfer = new FileTransfer();
                if (device.platform === "iOS") {
                    _saveDirectory = cordova.file.dataDirectory;
                }
                else if (device.platform === "Android") {
                    _saveDirectory = cordova.file.externalApplicationStorageDirectory;
                }

            }, false);

            return {
                download: function (url, fileName) {
                    return $q(function (resolve, reject) {
                        // Checking errors
                        if (!_fileTransfer) {
                            reject('error.noTransfer');
                        }
                        if (!_saveDirectory) {
                            reject('error.noDirectory');
                        }
                        // Start download
                        var _fileURL = _saveDirectory + fileName;
                        var _uri = encodeURI(url);
                        _fileTransfer.download(
                            _uri,
                            _fileURL,
                            function (entry) {
                                resolve(entry.toURL());
                            },
                            function (error) {
                                reject('error.download', error);
                            },
                            true
                        );
                    });
                }
            }
        }]);

    angular.module("pdfViewer.viewer", []);

    angular.module("pdfViewer.viewer").factory('viewerService', ['$document', '$window', function ($document, $window) {
        var _type = "";
        var _open;
        $document[0].addEventListener("deviceready", function () {
            _open = $window.open;
            if (device.platform === "iOS") {
                _type = "_blank";
            }
            else if (device.platform === "Android") {
                _type = "_system";
            }

        }, false);
        return {
            showPDF: function (fileToShow) {
                _open(encodeURI(fileToShow), _type, 'location=no')
            }
        }
    }]);

    angular.module("pdfViewer", ['pdfViewer.download', 'pdfViewer.viewer']);

    angular.module("pdfViewer").controller('viewerController', viewerController);

    viewerController.$inject = ['$scope', 'downloadService', 'viewerService'];

    function viewerController($scope, downloadService, viewerService) {
        var _resultFileURI = "";
        var _pdfURL = "http://research.microsoft.com/en-us/um/people/simonpj/papers/giving-a-talk/writing-a-paper-slides.pdf";
        var _fileName = "writing-a-paper-slides.pdf";
        angular.extend($scope, {
            downProgress: false,
            downloaded: false,
            download: function () {
                $scope.downProgress = true;
                downloadService.download(_pdfURL, _fileName).then(function (fileURI) {
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