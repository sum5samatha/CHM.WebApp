(function () {
    "use strict";

    angular.module('CHM').factory('OrganizationService', OrganizationService);

    OrganizationService.$inject = ['$rootScope', '$q', '$http', '$window'];

    function OrganizationService($rootScope, $q, $http, $window) {
        var objOrganizationService = {};

        objOrganizationService.SaveOrganization = SaveOrganization;
        objOrganizationService.DeleteOrganization = DeleteOrganization;
        objOrganizationService.GetOrganization = GetOrganization;
        objOrganizationService.UpdateOrganization = UpdateOrganization;
        return objOrganizationService;

        function SaveOrganization(organization) {
            return $http.post($rootScope.ApiPath + 'Users/SaveOrganization', organization);
        }

        function DeleteOrganization(objOrganization)
        {
            return $http.post($rootScope.ApiPath + 'Users/DeleteOrganizations', objOrganization);
        }

        function GetOrganization(OrganizationID)
        {
            return $http.get($rootScope.ApiPath + 'Users/GetOrganization?organizationID='+ OrganizationID);
        }
        function UpdateOrganization(objUpdateorganization)
        {
            return $http.post($rootScope.ApiPath + 'Users/UpdateOrganization', objUpdateorganization);
        }
    }

}());