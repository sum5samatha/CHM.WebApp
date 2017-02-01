(function () {
    "use strict";

    angular.module('CHM').controller('UsersListController', UsersListController);

    UsersListController.$inject = ['$rootScope', '$q', '$sce', '$uibModal', '$window', '$filter', '$stateParams', 'SweetAlert', 'toastr', 'UsersService', 'ngTableParams', '$scope'];

    function UsersListController($rootScope,$q, $sce, $uibModal, $window, $filter, $stateParams, SweetAlert, toastr, UsersService, ngTableParams, $scope) {

        var vm = this;
        vm.Users = [];  // Declare List Of Users
        vm.Userinf = $rootScope.UserInfo.UserName;

        var BindUserList = function () {
            UsersService.getActiveUsersByOrganizationID($rootScope.OrganizationId).then(
            function (response) {
                vm.Users = response.data;
                $scope.AllUsers.$params.page = 1;
                $scope.AllUsers.reload();
            },
            function (err) {
                toastr.error('An error occurred while retrieving Users List.');
            }
        );
        }



        BindUserList();


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
                        UsersService.DeleteUser(objUser).then(
                            function (response) {
                                toastr.success('Deleted Sucessfully .');
                                BindUserList();
                            },
                        function (err) {
                            toastr.error('An error occurred while Deleting User.');
                        }
                            );


                    }
                }
            );
        }



    }

}());