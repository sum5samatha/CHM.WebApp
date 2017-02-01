(function () {
    "use strict";

    angular.module('CHM').controller('EditUserController', EditUserController);

    EditUserController.$inject = ['$q', '$sce', '$uibModal', '$location', '$window', '$filter', '$stateParams', 'toastr', 'UsersService', 'ResidentsService', '$rootScope'];

    function EditUserController($q, $sce, $uibModal, $location, $window, $filter, $stateParams, toastr, UsersService, ResidentsService, $rootScope) {
        var vm = this;

        vm.UserID = $stateParams.UserId;

       
      
        vm.DOBOpened = false;
        vm.UserInformation = [];

        vm.openDOB = function ($event) {

            $event.preventDefault();
            $event.stopPropagation();          
            vm.DOBOpened = true;
          
        };

        vm.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            initDate: new Date()
        };
        vm.EndDate = new Date();
      

        //Binding Roles DropDown
        UsersService.GetRoles().then(
            function (response) {
                vm.Roles = response.data;
                BindResidents();
            },
           function (err) {
               toastr.error('An error occurred while retrieving Users.');
           })


        //Binding Residents DropDown
        var BindResidents = function () {

            ResidentsService.getActiveResidentsByOrganizationID($rootScope.OrganizationId).then(
            function (response) {
                vm.AllResidents = response.data;
                vm.Residents = [];
                for (var i = 0; i < vm.AllResidents.length; i++) {
                    vm.Residents.push(vm.AllResidents[i].Resident);

                }

                GetUserInforamtion();

            },
            function (err) {
                toastr.error('An error occurred while retrieving Users.');
            })
        }


        //Get User Information 
        var GetUserInforamtion = function () {

            UsersService.getUserInformation(vm.UserID).then(
            function (response) {
               
                vm.Users = response.data;
                vm.Users.DOB = new Date(vm.Users.DOB);
            },
            function (err) {
                toastr.error('An error occurred while retrieving Users.');
            })
        }


        //Update userInformation
        vm.UpdateUserInformation = function (objuser) {
            UsersService.UpdateUser(objuser).success(
                function (response) {                 
                    toastr.success('Updated Sucessfully .');
                    $location.path('/UsersList');
                },
                function (err) {
                    toastr.error('An error occured while saving personal information.');
                }
            );
        }

        vm.Cancel=function()
        {
            $location.path('/UsersList');
        }
    }
}());
