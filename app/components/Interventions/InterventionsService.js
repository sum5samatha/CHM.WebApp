(function () {
    "use strict";

    angular.module('CHM').factory('InterventionsService', InterventionsService);

    InterventionsService.$inject = ['$rootScope', '$q', '$http', '$window'];

    function InterventionsService($rootScope, $q, $http, $window) {

        var objInterventionsService = {};

        objInterventionsService.GenerateInterventions = generateInterventions;
        objInterventionsService.GetInterventionsForResident = getInterventionsForResident;
        objInterventionsService.UpdateInterventionsStatus = UpdateInterventionsStatus;
        objInterventionsService.GetInterventions = GetInterventions;
        objInterventionsService.GetStartedInterventionForResident = GetStartedInterventionForResident;
        objInterventionsService.GenerateAdhocInterventions = generateAdhocInterventions;
        objInterventionsService.DeActiveAdhocIntervention = deActiveAdhocIntervention;
        objInterventionsService.UpdategeneratedInterventions = UpdategeneratedInterventions;
        objInterventionsService.DeactiveGeneratedIntervention = DeactiveGeneratedIntervention;
        return objInterventionsService;

        function generateInterventions(lstActions, InterventionLimit) {
            var interventionsWithLimit = { lstActions: lstActions, InterventionLimit: InterventionLimit };
            return $http.post($rootScope.ApiPath + 'Interventions/GenerateInterventions', interventionsWithLimit);
        }

        function generateAdhocInterventions(residentId, lstActions) {

            var fd = new FormData();
            for (var i = 0; i < lstActions.length; i++) {
                if (lstActions[i].FileData) {
                    fd.append(lstActions[i].Section_InterventionID, lstActions[i].FileData);
                    delete lstActions[i].FileData;
                }
            }
            fd.append('Answers', JSON.stringify(lstActions));

            return $http.post($rootScope.ApiPath + 'Interventions/GenerateAdhocInterventions?residentId=' + residentId, fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            });           
        }

        function getInterventionsForResident(residentId, startDate, endDate) {
            return $http.get($rootScope.ApiPath + 'Interventions/GetInterventionsForResident?residentId=' + residentId + '&startDate=' + startDate + '&endDate=' + endDate);
        }


        function UpdateInterventionsStatus(Interventions)  {
            return $http.post($rootScope.ApiPath + 'Interventions/UpdateIntervention', Interventions);
        }
        function GetInterventions(InterventionId) {
            return $http.post($rootScope.ApiPath + 'Interventions/GetIntervention?InterventionId=' + InterventionId);
        }

        
        function GetStartedInterventionForResident(residentId, startDate, endDate) {
            return $http.get($rootScope.ApiPath + 'Interventions/GetStartedInterventionsForResident?residentId=' + residentId + '&startDate=' + startDate + '&endDate=' + endDate);
        }

        function deActiveAdhocIntervention(lstActions) {
            return $http.post($rootScope.ApiPath + 'Interventions/DeActiveAdhocIntervention', lstActions);
        }


        function UpdategeneratedInterventions(lstActions) {
            return $http.post($rootScope.ApiPath + 'Interventions/UpdateGeneratedInterventions', lstActions);
        }

        function DeactiveGeneratedIntervention(interventionID) {
            return $http.post($rootScope.ApiPath + 'Interventions/DeleteGeneratedIntervention?interventionID=' + interventionID);
        }
    }

}());