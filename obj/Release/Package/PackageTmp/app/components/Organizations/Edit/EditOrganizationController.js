(function () {
    "use strict";

    angular.module('CHM').controller('EditOrganizationController', EditOrganizationController);

    EditOrganizationController.$inject = ['$rootScope', '$q', '$sce', '$uibModal', '$window', '$filter', '$stateParams', 'SweetAlert', 'toastr', 'UsersService', '$scope', 'OrganizationService', '$location'];

    function EditOrganizationController($rootScope, $q, $sce, $uibModal, $window, $filter, $stateParams, SweetAlert, toastr, UsersService, $scope, OrganizationService, $location) {

        var vm = this;
    
        var organizationID= $stateParams.OrganizationID;
   

        var GetOrganizationDetails=function(objOrganizationId)
        {
            OrganizationService.GetOrganization(objOrganizationId).then(
                function(response)
                {
                    vm.Organization = response.data;
                   

                },function(err)
                {
                    toastr.error('An error occured while Retriving Organization.');
                }

                )
        }
        GetOrganizationDetails(organizationID);


        vm.UpdateOrganization=function(objorganization)
        {
            OrganizationService.UpdateOrganization(objorganization).then(
                function(response)
                {

                    toastr.success('Organization Updated Sucessfully.');
                    $location.path('/Organizations');

                },function(err)
                {
                    toastr.error('An error occured while updating Organization.');
                }
            )
        }

        vm.Cancel = function () {
            $location.path('/Organizations');

        }
    }

}());