(function () {
    "use strict";

    angular.module('CHM').controller('ViewUserController', ViewUserController);

    ViewUserController.$inject = ['$q', '$sce','$location', '$uibModal', '$window', '$filter', '$stateParams', 'toastr', 'UsersService'];

    function ViewUserController($q, $sce,$location, $uibModal, $window, $filter, $stateParams, toastr, UsersService) {


        var vm = this;
    

        vm.UserID = $stateParams.ResidentId;



        //View User Information details

        UsersService.ViewUserInformation(vm.UserID).then(
            function (response) {       
              vm.Users = response.data;
            },
            function (err) {
                toastr.error('An error occurred while retrieving Users.');
            })


        vm.Back=function()
        {
            $location.path('/UsersList');
        }
    }
    }());