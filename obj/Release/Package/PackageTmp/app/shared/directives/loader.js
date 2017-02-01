(function () {

    angular.module('CHM').directive("loader", ['$rootScope', function ($rootScope) {
        return function ($scope, element, attrs) {
            $scope.$on("loader_show", function () {
                return $(element[0]).show();//fadeIn("slow");
            });
            $scope.$on("loader_hide", function () {
                return $(element[0]).hide();//fadeOut("slow");
            });
        };
    }]);

}());