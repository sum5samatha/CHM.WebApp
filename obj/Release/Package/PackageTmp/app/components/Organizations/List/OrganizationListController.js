(function () {
    "use strict";

    angular.module('CHM').controller('OrganizationListController', ['$rootScope', '$state', 'toastr', 'UsersService', '$scope', '$stateParams', 'OrganizationService', 'SweetAlert', function ($rootScope, $state, toastr, UsersService, $scope, $stateParams, OrganizationService,SweetAlert) {

       
        var vm = this;
        var UserID = $rootScope.UserInfo.UserID;
        var UserName=$rootScope.UserInfo.UserName;
        var RoleName = $rootScope.UserInfo.RoleName;
        vm.UserOrganizations = [];
        vm.Organisations = [];
        vm.Allorganization = [];
        $rootScope.UserType = null;
        $rootScope.OrgGroupID = null;
        $rootScope.OrganizationId = null;
   
        var getOrganizations = function()
        {
            UsersService.getAllOrganization().then(
                function(response)
                {
                    vm.Organisations = response.data;
                    GetUserOrganizationInfo();

                },function(err)
                {
                    toastr.error('An error occurred while retrieving organizations.');
                }
                )
        }
        getOrganizations();
        //Get UserData
        var GetUserOrganizationInfo = function () {
            UsersService.getUserOrganizations(UserID).then(function (response) {
                vm.Userdata = response.data;
                vm.UserOrganizations = response.data.Users_Organizations;
                //vm.Organisations = response.data.Organizations;
                if (response.data.UserType != null) {
                    $rootScope.UserType = response.data.UserType.Name;
                }
                
                AllUserOrganization(vm.UserOrganizations, vm.Organisations);

            }, function (err) {

                toastr.error('An error occurred while retrieving user organizations.');
            });
        }

        var AllUserOrganization=function(objUserOrganization,lstOrganization)
        {
           
            var arrOrganization = [];
            for (var i = 0; i < objUserOrganization.length; i++) {

                for (var j = 0; j < lstOrganization.length; j++) {
                    if (objUserOrganization[i].OrganizationID == lstOrganization[j].ID)
                    {
                        var arrorg = { organizationID: '', organizationName: '', organizationAddress: '', orgGroupName: '' };
                        arrorg.organizationID = lstOrganization[j].ID;
                        arrorg.organizationName = lstOrganization[j].Name;
                        arrorg.organizationAddress = lstOrganization[j].Address;
                        arrorg.orgGroupName = lstOrganization[j].OrganizationGroups_Organizations[0].OrganizationGroup.Name;
                        $rootScope.OrgGroupID = lstOrganization[j].OrganizationGroups_Organizations[0].OrganizationGroup.ID;
                        arrOrganization.push(arrorg);
                    }

                }

                
            }
            vm.GetUserOrganizationInfo = arrOrganization;
           
        }
     

        vm.DeleteOrganization=function(objDeleteOrganization)
        {
            var DeleteOrganization = [];
            var Organization = { ID: '', ModifiedBy: '' }
            Organization.ID = objDeleteOrganization.organizationID;
            Organization.ModifiedBy = $rootScope.UserInfo.UserID;
            DeleteOrganization.push(Organization);

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
                        OrganizationService.DeleteOrganization(Organization).then(
                            function (response) {
                                $state.reload();
                                toastr.success('Deleted Sucessfully.');
                               
                            },
                        function (err) {
                            toastr.error('An error occurred while Deleting organization.');
                        }
                            );


                    }
                }
            );
            
        }

        vm.Organization=function(objOrganization)
        {
            $rootScope.OrganizationId = objOrganization.organizationID;
            $rootScope.OrganizationName = objOrganization.organizationName;
            $state.go('Residents');
        }


        vm.AddOrganization=function()
        {
            $state.go('NewOrganization', { 'OrganizationGroupID': $scope.OrgGroupID});
        }
    }]);

}());