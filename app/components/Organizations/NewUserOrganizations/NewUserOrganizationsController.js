(function () {
    "use strict";

    angular.module('CHM').controller('NewUserOrganizationsController', NewUserOrganizationsController);

    NewUserOrganizationsController.$inject = ['$q', '$sce', '$uibModal', '$window', '$location', '$filter', '$stateParams', 'toastr', 'UsersService', 'ResidentsService', '$rootScope', '$scope', '$state'];

    function NewUserOrganizationsController($q, $sce, $uibModal, $window, $location, $filter, $stateParams, toastr, UsersService, ResidentsService, $rootScope, $scope, $state) {

        var vm = this;

        var UserID = $rootScope.UserInfo.UserID;
       
        
        UsersService.GetUserNameInAllOrganization().then(
            function(response)
            {
                vm.AllUsername = response.data;
               

            },function(err)
            {

            }
            )


        var GetUserOrganizationInfo = function () {
            UsersService.getUserOrganizations(UserID).then(function (response) {
                vm.Userdata = response.data;
                vm.UserOrganizations = response.data.Users_Organizations;

                if (response.data.UserType != null) {
                    $rootScope.UserType = response.data.UserType.Name;
                }
                GetAllOrganization();



            }, function (err) {

                toastr.error('An error occurred while retrieving user organizations.');
            });
        }

        GetUserOrganizationInfo();

        var GetAllOrganization = function () {
            UsersService.getAllOrganization().then(
                function (response) {
                    vm.organization = response.data;
                    GetUserOrganization();
                  
                }, function (err) {
                    toastr.error('An error occurred while retrieving organization List.');
                }

                )
        }

        var GetUserOrganization = function () {
            var userorganizations = [];
            for (var i = 0; i < vm.UserOrganizations.length; i++) {

                for (var j = 0; j < vm.organization.length; j++) {

                    if (vm.UserOrganizations[i].OrganizationID == vm.organization[j].ID) {
                        userorganizations.push(vm.organization[j]);
                    }

                }
            }
            vm.userOrganization = userorganizations;
            Residents();
        }







        vm.CheckEmail = function (objUserEmail) {
            if (objUserEmail != undefined) {
                if (vm.AllEmails.length > 0) {
                    for (var i = 0; i < vm.AllEmails.length; i++) {

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


        vm.CheckUserName=function(objuserName,OrganizationIDs)
        {
            
            
            if (objuserName != undefined) {
                var username = [];

                for (var i = 0; i < OrganizationIDs.length; i++) {
                    for (var j = 0; j < vm.AllUsername.length; j++) {
                        if (vm.AllUsername[j].OrganizationID == OrganizationIDs[i]) {
                            username.push(vm.AllUsername[j].UserName);
                        }

                    }

                }

                if (username.length > 0) {
                    for (var i = 0; i < username.length; i++) {

                        var string1 = objuserName.toUpperCase();
                        var string2 = username[i].toUpperCase();
                        var n = string1.localeCompare(string2);
                        if (n == 0) {

                            toastr.warning('UserName  Already Exists.');
                            vm.Users.UserName = null;
                            $scope.digest();
                            break;
                        }

                    }
                }


            }

        }




       
        //DOB Datepicker Settings
        vm.openDOB = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.DOBOpened = true;
        };

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
        var Residents = function () {
            ResidentsService.GetActiveResidents().then(
            function (response) {
                vm.AllResidents = response.data;
                vm.Residents = [];
                for (var k = 0; k < vm.userOrganization.length; k++) {
                    for (var i = 0; i < vm.AllResidents.length; i++) {

                        if (vm.userOrganization[k].ID == vm.AllResidents[i].Resident.OrganizationID && vm.AllResidents[i].Resident.IsAccepted==true)
                        vm.Residents.push(vm.AllResidents[i].Resident);

                    }
                }
                


            },
            function (err) {
                toastr.error('An error occurred while retrieving Residents.');
            })
        }

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

            for (var i = 0; i < vm.OrganizationIDs.length; i++) {
                var objUsersOrganization = {
                    OrganizationID: vm.OrganizationIDs[i]
                }
                vm.Users.Users_Organizations.push(objUsersOrganization);
            }
           
           



            UsersService.SaveUser(vm.Users).success(
                   function (response) {
                       toastr.success('Saved Sucessfully .');
                       $location.path('/UserOrganizations');

                   },
                   function (err) {
                       toastr.error('An error occured while saving personal information.');
                   }
               );

            
        }

        vm.Cancel = function () {
            $state.go('UserOrganizations');
        }

    }
}());