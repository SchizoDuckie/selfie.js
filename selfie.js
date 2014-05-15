angular.module('Selfie', [])
    .config(function($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(data):/);
    })
    .directive('selfie', function($rootScope, $document) {
        return {
            restrict: 'E',
            transclude: true,
            template: '<div><button ng-show="!taken" ng-click="TakeSelfie(); taken=true">Take that selfie!</button><button ng-show="taken && !saved" ng-click="Save()">I love it!</button><a ng-show="saved" href="{{getDataURI()}}" download="selfie.png">Click to download your Selfie</a> <button ng-show="taken" ng-click="taken=false; saved=false;">Try again</button><video ng-show="!taken" autoplay></video><canvas ng-show="taken"></canvas></div>',
            link: function($scope, iElement) {

                var video = iElement.find('video')[0];
                var canvas = iElement.find('canvas')[0];
                var ctx = canvas.getContext('2d');

                navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
                if (navigator.getUserMedia) {
                    navigator.getUserMedia({
                            video: true
                        },
                        function(localMediaStream) {
                            video.src = window.URL.createObjectURL(localMediaStream);
                        }, console.error);
                } else {
                    console.error("No usermedia api available.");
                }

                $scope.TakeSelfie = function() {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    ctx.drawImage(video, 0, 0);
                };

                $scope.getDataURI = function() {
                    return $scope.dataUri;
                }

                $scope.Save = function() {
                    $scope.dataUri = canvas.toDataURL("image/png");
                    $scope.saved = true;
                }
            }


        }
    });
