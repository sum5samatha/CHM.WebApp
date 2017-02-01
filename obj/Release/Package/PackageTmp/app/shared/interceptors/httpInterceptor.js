(function () {
    "use strict";

    angular.module('CHM').factory('httpInterceptor', httpInterceptor);

    httpInterceptor.$inject = ['$q', '$rootScope', '$log'];

    angular.module('CHM').config(config);

    config.$inject = ['$httpProvider'];

    function httpInterceptor($q, $rootScope, $log) {
        var numLoadings = 0;

        return {
            request: function (config) {

                if ($rootScope.UserInfo && $rootScope.UserInfo.Token) {
                    config.headers.authorization = 'Bearer ' + $rootScope.UserInfo.Token;
                }

                numLoadings++;
                $rootScope.$broadcast("loader_show");
                return config || $q.when(config);
            },
            response: function (response) {
                if ((--numLoadings) === 0) {
                    $rootScope.$broadcast("loader_hide");
                }
                return response || $q.when(response);
            },
            responseError: function (response) {
                if (!(--numLoadings)) {
                    $rootScope.$broadcast("loader_hide");
                }
                return $q.reject(response);
            }
        };
    }

    function config($httpProvider) {
        $httpProvider.interceptors.push('httpInterceptor');
    }

}());