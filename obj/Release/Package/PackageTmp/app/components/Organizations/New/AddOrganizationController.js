(function () {
    "use strict";

    angular.module('CHM').controller('AddOrganizationController', AddOrganizationController);

    AddOrganizationController.$inject = ['$rootScope', '$q', '$sce', '$uibModal', '$window', '$filter', '$stateParams', 'SweetAlert', 'toastr', 'UsersService', '$scope', 'OrganizationService', '$location'];

    function AddOrganizationController($rootScope, $q, $sce, $uibModal, $window, $filter, $stateParams, SweetAlert, toastr, UsersService, $scope, OrganizationService, $location) {

        var vm = this;
       
      
        vm.SaveOrganization=function()
        {
            vm.Organization.CreatedBy = $rootScope.UserInfo.UserID;
            vm.Organization.ModifiedBy = $rootScope.UserInfo.UserID;
            vm.Organization.OrganizationGroups_Organizations = [];
            vm.Organization.Users_Organizations = [];
            var objOrganizationGroups_Organizations = {
                OrganizationGroupID: $stateParams.OrganizationGroupID,
                CreatedBy: $rootScope.UserInfo.UserID,
                ModifiedBy: $rootScope.UserInfo.UserID
            };
           
            vm.Organization.OrganizationGroups_Organizations.push(objOrganizationGroups_Organizations);
            OrganizationService.SaveOrganization(vm.Organization).then(function(response)
            {
                
                toastr.success('Organization Saved Sucessfully.');
                $location.path('/Organizations');

            },function(err)
            {
                toastr.error('An error occured while saving Organization.');
            })
        }
        vm.Cancel=function()
        {
            $location.path('/Organizations');

        }

    }

}());