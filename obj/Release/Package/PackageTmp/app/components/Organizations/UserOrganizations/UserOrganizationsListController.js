(function () {
    "use strict";

    angular.module('CHM').controller('UserOrganizationsListController', UserOrganizationsListController);

    UserOrganizationsListController.$inject = ['$rootScope', '$q', '$sce', '$uibModal', '$window', '$filter', '$stateParams', 'SweetAlert', 'toastr', 'UsersService', 'ngTableParams', '$scope', '$state'];

    function UserOrganizationsListController($rootScope, $q, $sce, $uibModal, $window, $filter, $stateParams, SweetAlert, toastr, UsersService, ngTableParams, $scope, $state) {

        var vm = this;
        vm.Users = [];  // Declare List Of Users
        vm.Userinf = $rootScope.UserInfo.UserName;
        var UserID = $rootScope.UserInfo.UserID;

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

        var GetAllOrganization=function()
        {
            UsersService.getAllOrganization().then(
                function(response)
                {
                    vm.organization = response.data;
                    GetUserOrganization();
                },function(err)
                {
                    toastr.error('An error occurred while retrieving organization List.');
                }

                )
        }
    
        var GetUserOrganization=function()
        {
            var userorganizations = [];
            for (var i = 0; i < vm.UserOrganizations.length; i++) {
              
                for (var j = 0; j <   vm.organization.length; j++) {

                    if(vm.UserOrganizations[i].OrganizationID==vm.organization[j].ID)
                    {
                        userorganizations.push(vm.organization[j]);
                    }

                }
            }
            BindUserList(userorganizations);
        }

        var BindUserList = function (objUserOrg) {
            UsersService.GetActiveUsers().then(
            function (response) {
                var arrAllUser = [];
                for (var i = 0; i < response.data.length; i++) {
                    var arruser = { ID: '', UserName: '', Designation: '', Role: '', Organization: '' };
                    arruser.ID = response.data[i].ID;
                    arruser.UserName = response.data[i].UserName;
                    arruser.Designation = response.data[i].Designation;
                    var allorganization = '-';
                    if(response.data[i].Users_Roles.length>0)
                    {
                        arruser.Role = response.data[i].Users_Roles[0].Role.Name
                    }
                    else
                    {
                        arruser.Role = '-';
                    }
                    
                    if (response.data[i].Users_Organizations.length > 0) {
                        allorganization = '';
                        for (var z = 0; z < response.data[i].Users_Organizations.length; z++) {
                            for (var j = 0; j < objUserOrg.length; j++) {
                                if (response.data[i].Users_Organizations[z].OrganizationID == objUserOrg[j].ID) {
                                    allorganization += objUserOrg[j].Name + ',';
                                }
                            }
                        }
                        var n = allorganization.lastIndexOf(",");
                        allorganization = allorganization.substring(0, n)
                        arruser.Organization = allorganization;
                        arrAllUser.push(arruser);
                    }

                   
                }

                if (arrAllUser.length > 0) {
                    vm.Users = arrAllUser;
                    $scope.AllUsers.$params.page = 1;
                    $scope.AllUsers.reload();
                }
            },
            function (err) {
                toastr.error('An error occurred while retrieving Users List.');
            }
        );
        }



     


        //pagination for userlist

        $scope.Userslist = [];






        $scope.AllUsers = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            sorting: {
                Created: 'desc'     // initial sorting
            }
        }, {
            total: vm.Users.length, // length of data
            counts: [],
            getData: function ($defer, params) {
                var data = vm.Users;

                var orderedData = params.sorting() ?
                                    $filter('orderBy')(data, params.orderBy()) :
                                    data;

                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                params.total(orderedData.length);
            }
        });
        $scope.AllUsers.settings().$scope = $scope;







        //Delete User

        vm.DeleteUser = function (objUser) {



            var sweetAlertOptions = {
                title: "",
                text: "Are you sure you want to mark this user for deletion?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!"
            };

            SweetAlert.swal(sweetAlertOptions,
                function (isConfirm) {
                    if (isConfirm) {
                        UsersService.DeleteUserOrganization(objUser).then(
                            function (response) {
                                toastr.success('Deleted Sucessfully .');
                               GetUserOrganizationInfo();
                            },
                        function (err) {
                            toastr.error('An error occurred while Deleting User.');
                        }
                            );


                    }
                }
            );
        }

        vm.AddNewUSer=function()
        {
            
            $state.go('NewUserOrganizations');
        }



    }

}());