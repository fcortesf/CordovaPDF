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
                else {
                    _saveDirectory = cordova.file.dataDirectory;
                }

            }, false);

            return {
                download: function (url, fileName) {
                    return $q(function (resolve, reject) {                        
                        window.resolveLocalFileSystemURL(_saveDirectory ,  function (dir) {
                            dir.getDirectory("PDF", { create: true }, function (finalDir) {
                               
                                if (!_fileTransfer) {
                                    reject('error.noTransfer');
                                }
                                if (!_saveDirectory) {
                                    reject('error.noDirectory');
                                }
                                
                                var fileURL = _saveDirectory + fileName;
                                var uri = encodeURI(url);
                                _fileTransfer.download(
                                    uri,
                                    fileURL,
                                    function (entry) {
                                        resolve(entry.toURL());
                                    },
                                    function (error) {
                                        reject(error);
                                    },
                                    true
                                );
                            });
                            
                        });
                    });

                }
            }
        }]);
})()