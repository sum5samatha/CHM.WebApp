(function () {
    "use strict";

    angular.module('CHM').controller('TimeOutController', ['$rootScope', '$scope', 'Idle', 'Keepalive', '$uibModal', '$state', '$location',  function ($rootScope, $scope, Idle, Keepalive, $uibModal, $state, $location) {


        $scope.started = false;

        function closeModals() {
            if ($scope.warning) {
                $scope.warning.close();
                $scope.warning = null;
            }

            if ($scope.timedout) {
                $scope.timedout.close();
                $scope.timedout = null;
            }
        }

        $scope.$on('IdleStart', function () {
            closeModals();

            $scope.warning = $uibModal.open({
                templateUrl: 'warning-dialog.html',
                windowClass: 'modal-danger'
            });
        });

        $scope.$on('IdleEnd', function () {
            closeModals();
        });

        $scope.$on('IdleTimeout', function () {
            closeModals();
            $rootScope.UserInfo = null;
            $state.go('Login');

            $scope.timedout = $uibModal.open({
                templateUrl: 'timedout-dialog.html',
                windowClass: 'modal-danger'
            });
        });

        function start() {
            closeModals();
            Idle.watch();
            $scope.started = true;
        };
        start();

        $scope.stop = function () {
            closeModals();
            Idle.unwatch();
            $scope.started = false;

        };

    }]);
    }());