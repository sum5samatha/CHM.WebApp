(function () {
    "use strict";

    angular.module('CHM').controller('ForgotPasswordController', ForgotPasswordController);

    ForgotPasswordController.$inject = ['$q', '$state', '$sce', '$uibModal', '$rootScope', '$window', '$location', '$filter', '$stateParams', 'toastr', 'UsersService'];

    function ForgotPasswordController($q, $state, $sce, $uibModal, $rootScope, $window, $location, $filter, $stateParams, toastr, UsersService) {


        var vm = this;

        vm.Submit = function () {
            UsersService.ForgotUserPasswordByEmail(vm.Users.Email).then(function (response) {
                
                $rootScope.UserInfo = null;
                $state.go('Login');
                toastr.success('Mail sent Sucessfully');
            }, function (err) {
                toastr.error('UserName was Incorrect.');
            }
           )
        }




        vm.Login = function () {
            $rootScope.UserInfo = null;
            $state.go('Login');
        }


        vm.Cancel = function () {
            $location.path('/Residents');
        }
    }
}());