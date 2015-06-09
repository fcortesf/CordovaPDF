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
})()