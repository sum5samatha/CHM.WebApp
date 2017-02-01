(function () {
    "use strict";
    angular.module('CHM').factory('ResidentDocumentsViewerService', ResidentDocumentsViewerService);

    ResidentDocumentsViewerService.inject = ['$rootScope', '$q', '$http', '$window'];

    function ResidentDocumentsViewerService($rootScope, $q, $http, $window) {

        var objResidentDocumentsViewerService = {};

        objResidentDocumentsViewerService.GetResidentInterventions = GetResidentInterventions;
        objResidentDocumentsViewerService.GetResidentAdhocInterventions = GetResidentAdhocInterventions;
        return objResidentDocumentsViewerService;

        function GetResidentInterventions(residentId) {
            return $http.get($rootScope.ApiPath + 'Interventions/GetResidentInterventions?residentId=' + residentId);
        }

        function GetResidentAdhocInterventions(residentId, startDate, endDate) {
            return $http.get($rootScope.ApiPath + 'Interventions/GetAdhocInterventionsForResident?residentId=' + residentId + '&startDate=' + startDate + '&endDate=' + endDate);
        }
    }
}());