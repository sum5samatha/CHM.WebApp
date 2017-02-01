(function () {
    "use strict";

    angular.module('CHM').controller('NewUserController', NewUserController);

    NewUserController.$inject = ['$q', '$sce', '$uibModal', '$window', '$location', '$filter', '$stateParams', 'toastr', 'UsersService', 'ResidentsService', '$rootScope', '$scope'];

    function NewUserController($q, $sce, $uibModal, $window, $location, $filter, $stateParams, toastr, UsersService, ResidentsService, $rootScope, $scope) {


        var vm = this;

        //DOB Datepicker Settings
        vm.openUserDOB = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.DOBUserOpened = true;
        };


        //Get UserNames within organization
        UsersService.GetEmailsInAllOrganization().then(
            function(response)
            {
                vm.AllEmails = response.data;

            },function(err)
            {

            }
            )

        UsersService.GetUserNameBasedOnOrganization($rootScope.OrganizationId).then(
            function(response)
            {
                vm.AllUserNames = response.data;
              //  console.log(vm.AllUserNames);

            },function(err)
            {

            }
            )

        vm.CheckEmail=function(objUserEmail)
        {
            if(objUserEmail!=undefined)
            {
                if(vm.AllEmails.length>0)
                {
                    for (var i = 0; i < vm.AllEmails.length; i++) {
                        if (vm.AllEmails[i]) {
                            var string1 = objUserEmail.toUpperCase();
                            var string2 = vm.AllEmails[i].toUpperCase();
                            var n = string1.localeCompare(string2);
                            if (n == 0) {
                                toastr.warning('Email Already Exists.');
                                vm.Users.Email = null;
                                $scope.digest();
                                break;
                            }
                        }
                    }
                }
            }
        }

        vm.CheckUserName=function(objuserName)
        {
            if (objuserName != undefined) {
                if (vm.AllUserNames.length > 0) {
                    for (var i = 0; i < vm.AllUserNames.length; i++) {
                        var string1 = objuserName.toUpperCase();
                        var string2 = vm.AllUserNames[i].toUpperCase();
                        var n = string1.localeCompare(string2);
                        if (n == 0) {

                            toastr.warning('UserName Already Exists.');
                            vm.Users.UserName = null;
                            $scope.digest();
                            break;
                        }

                    }
                }
            }
        }
        //Get Email within organization 
 

        //Binding Roles DropDown
        UsersService.GetRoles().then(
            function (response) {
                vm.Roles = response.data;
               
            },
            function (err) {
                toastr.error('An error occurred while retrieving Roles.');
            })

        //Binding UserTypes

        UsersService.GetUserTypes().then(
            function (response) {
                vm.UserTypes = response.data;

            }, function (err) {

            }

            );


        //Binding Residents DropDown
        ResidentsService.getActiveResidentsByOrganizationID($rootScope.OrganizationId).then(
            function (response) {
                vm.AllResidents = response.data;
                vm.Residents = [];
                for (var i = 0; i < vm.AllResidents.length; i++) {
                    vm.Residents.push(vm.AllResidents[i].Resident);                   
                }             
                
            },
            function (err) {
                toastr.error('An error occurred while retrieving Residents.');
            })


        //Save User Functionality
        vm.SaveUser = function () {

            if (vm.RoleIds != undefined) {
                vm.Users.Users_Roles = [];
                var objUsers_Roles = {
                    RoleID: vm.RoleIds
                };
                vm.Users.Users_Roles.push(objUsers_Roles);
            }

            if (vm.ResidentIDs != undefined) {
                vm.Users.Residents_Relatives2 = [];
                var objResident_Relatives = {
                    ResidentID: vm.ResidentIDs
                };
                vm.Users.Residents_Relatives2.push(objResident_Relatives);
            }

            vm.Users.Users_Organizations = [];

            var objUsersOrganization = {
               
                OrganizationID: $rootScope.OrganizationId
            }
            vm.Users.Users_Organizations.push(objUsersOrganization);
              
            
          
            UsersService.SaveUser(vm.Users).success(
                   function (response) {
                       toastr.success('Saved Sucessfully .');
                       $location.path('/UsersList');
                       
                   },
                   function (err) {
                       toastr.error('An error occured while saving personal information.');
                   }
               );
        }

        vm.Cancel = function () {
            $location.path('/UsersList');
        }

    }
    }());