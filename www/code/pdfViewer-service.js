(function () {
    'use strict'
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
            else {
                _type = "_system";
            }

        }, false);
        return {
            showPDF: function (fileToShow) {
                _open(encodeURI(fileToShow),_type,'location=no')
            }
        }
    }]);
})()