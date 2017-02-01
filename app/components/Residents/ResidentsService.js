(function () {
    "use strict";

    angular.module('CHM').factory('ResidentsService', ResidentsService);

    ResidentsService.$inject = ['$rootScope', '$q', '$http', '$window'];

    function ResidentsService($rootScope, $q, $http, $window) {

        var objResidentsService = {};

        objResidentsService.GetActiveResidents = getActiveResidents;


        objResidentsService.GetActiveSections = getActiveSections;
        objResidentsService.UploadPhoto = uploadPhoto;
        objResidentsService.SavePersonalInformation = savePersonalInformation;
        objResidentsService.SavePainMonitoring = SavePainMonitoring;
        objResidentsService.UpdatePersonalInformation = updatePersonalInformation;
        objResidentsService.GetPersonalInformation = getPersonalInformation;
        objResidentsService.GetPainMonitoring = GetPainMonitoring;
        objResidentsService.GetAssessmentData = getAssessmentData;
        objResidentsService.SaveAssessmentData = saveAssessmentData;
        objResidentsService.UpdateAssessmentData = updateAssessmentData;
        objResidentsService.GetAssessmentSummary = getAssessmentSummary;
        objResidentsService.getAssessmentSummaryOnScores = getAssessmentSummaryOnScores;
        objResidentsService.AcceptAsResident = acceptAsResident;
        objResidentsService.GetTaskTitlesForResident = getTaskTitlesForResident;
        objResidentsService.getSectionQuestionByID = getSectionQuestionByID;
        objResidentsService.GetResidentSummaryByID = GetResidentSummaryByID;
        objResidentsService.getAllActiveQuestionParentQuestion = getAllActiveQuestionParentQuestion;
        objResidentsService.getRequiredAssessmentSummary = getRequiredAssessmentSummary;
        objResidentsService.InterventionQuestionParentQuestion = InterventionQuestionParentQuestion;
        objResidentsService.UpdateInterventionAssessmentData = UpdateInterventionAssessmentData;
        objResidentsService.getInterventionAssessmentData = getInterventionAssessmentData;
        objResidentsService.getInterventionSummary = getInterventionSummary;

        objResidentsService.getInterventionResidentAnswerAssessmentData = getInterventionResidentAnswerAssessmentData;
        objResidentsService.SaveInterventionAnswerAssessmentData = SaveInterventionAnswerAssessmentData;
        objResidentsService.getSectionQuestionByID = getSectionQuestionByID;
        objResidentsService.GetResidentSummaryDataofAnswers = GetResidentSummaryDataofAnswers;
        objResidentsService.getSectionInterventionStatementsID = GetSectionInterventionStatementsID;
        objResidentsService.GetOnlyActiveSection = getOnlyActiveSection;
        objResidentsService.GetActiveSectionByID = getActiveSectionById;
        objResidentsService.GetActiveSectionIntervention = getActiveSectionIntervention;
        objResidentsService.GetActiveAdhocSectionIntervention = getActiveAdhocSectionIntervention
        objResidentsService.GetOnlyThreeSections = getOnlyThreeSections;
        objResidentsService.GetResidentSummaryAlert = GetResidentSummaryAlert;
        objResidentsService.getNewRequiredAssessmentSummary = getNewRequiredAssessmentSummary;

        objResidentsService.getActiveResidentsByOrganizationID = getActiveResidentsByOrganizationID;
        objResidentsService.getOnlyThreeSectionsbyOrganization = getOnlyThreeSectionsbyOrganization;

        objResidentsService.GetActiveSectionByOrganizationID = GetActiveSectionByOrganizationID;
        objResidentsService.GetActiveSectionsByOrganizationIDBySection = GetActiveSectionsByOrganizationIDBySection;

        objResidentsService.GetOnlyAssessmentSummary = getOnlyAssessmentSummary;


        objResidentsService.getActiveSectionByIdandOrganizationID = getActiveSectionByIdandOrganizationID;
        objResidentsService.DeleteResident = DeleteResident;
        objResidentsService.DeletePainMonitoringPart = DeletePainMonitoringPart;


        objResidentsService.GetAllResidentsByOrganizationID = GetAllResidentsByOrganizationID;


        return objResidentsService;

        function getActiveResidents() {
            return $http.get($rootScope.ApiPath + 'Residents/GetActiveResidents');
        }
        function getActiveResidentsByOrganizationID(OrganizationId) {
            return $http.get($rootScope.ApiPath + 'Residents/GetActiveResidentsByOrganizationID?OrganizationID=' + OrganizationId);
        }

        function GetAllResidentsByOrganizationID(OrganizationId) {
            return $http.get($rootScope.ApiPath + 'Residents/GetAllResidentsByOrganizationID?OrganizationID=' + OrganizationId);
        }

        //function getActiveResidents(OrganizationID) {
        //    return $http.get($rootScope.ApiPath + 'Residents/GetActiveResidents?OrganizationID=' + OrganizationID);
        //}

        function getActiveSections() {
            return $http.get($rootScope.ApiPath + 'Sections/GetActiveSections');
        }

        function getOnlyThreeSections() {
            return $http.get($rootScope.ApiPath + 'Sections/GetOnlyThreeSections');
        }


        function getOnlyThreeSectionsbyOrganization(OrganizationID) {
            return $http.get($rootScope.ApiPath + 'Sections/GetOnlyThreeSectionsByOrganizationID?OrganizationID=' + OrganizationID);
        }


        function getActiveSectionById(SectionId) {
            return $http.get($rootScope.ApiPath + 'Sections/GetActiveSectionById?SectionId=' + SectionId);
        }

        function getActiveSectionByIdandOrganizationID(SectionId, organizationID) {
            return $http.get($rootScope.ApiPath + 'Sections/GetActiveSectionByIdandOrganizationId?SectionId=' + SectionId + '&OrganizationID=' + organizationID);
        }

        function getOnlyActiveSection() {
            return $http.get($rootScope.ApiPath + 'Sections/GetOnlyActiveSections');
        }

        function GetActiveSectionByOrganizationID(organizationID) {
            return $http.get($rootScope.ApiPath + 'Sections/GetActiveSectionsByOrganizationID?OrganizationID=' + organizationID);
        }

        function GetActiveSectionsByOrganizationIDBySection(organizationID) {
            return $http.get($rootScope.ApiPath + 'Sections/GetActiveSectionsByOrganizationIDBySection?OrganizationID=' + organizationID);
        }

        function savePersonalInformation(resident) {
            resident.OrganizationId = $rootScope.OrganizationId;
            return $http.post($rootScope.ApiPath + 'Residents/SaveResident', resident);
        }

        function SavePainMonitoring(resident) {
            return $http.post($rootScope.ApiPath + 'Residents/SavePainMonitoring', resident);
        }

        function updatePersonalInformation(resident) {
            return $http.post($rootScope.ApiPath + 'Residents/UpdateResident', resident);
        }

        function uploadPhoto(file, residentId) {
            var fd = new FormData();
            fd.append('file', file);
            fd.append('ResidentId', residentId);
            return $http.post($rootScope.ApiPath + 'Residents/UploadPhoto', fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            });
        }

        function getPersonalInformation(residentId) {
            return $http.post($rootScope.ApiPath + 'Residents/GetResident?residentId=' + residentId);
        }
        function GetPainMonitoring(residentID) {

            return $http.get($rootScope.ApiPath + 'Residents/GetPainMonitoring?residentID=' + residentID);
        }

        function getAssessmentData(residentId) {
            return $http.post($rootScope.ApiPath + 'Residents/GetAssessmentData?residentId=' + residentId);
        }

        function getInterventionAssessmentData(residentId) {
            return $http.post($rootScope.ApiPath + 'Residents/GetInterventionAssessmentData?residentId=' + residentId);
        }

        function saveAssessmentData(lstAssessmentData) {
            return $http.post($rootScope.ApiPath + 'Residents/SaveAssessmentData', lstAssessmentData);
        }


        //method changed to CopyUpdateAssessmentDataWithFiles duplicate based on 6/20/2016
        function updateAssessmentData(residentId, lstAssessmentData) {
            var fd = new FormData();
            for (var i = 0; i < lstAssessmentData.length; i++) {
                if (lstAssessmentData[i].FileData) {
                    fd.append(lstAssessmentData[i].Section_Question_AnswerId, lstAssessmentData[i].FileData);
                    delete lstAssessmentData[i].FileData;
                }
            }

            fd.append('Answers', JSON.stringify(lstAssessmentData));
            return $http.post($rootScope.ApiPath + 'Residents/CopyUpdateAssessmentDataWithFiles?residentId=' + residentId, fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            });
        }

        function UpdateInterventionAssessmentData(residentId, lstAssessmentData) {
            var fd = new FormData();
            for (var i = 0; i < lstAssessmentData.length; i++) {
                if (lstAssessmentData[i].FileData) {
                    fd.append(lstAssessmentData[i].Intervention_Question_AnswerID, lstAssessmentData[i].FileData);
                    delete lstAssessmentData[i].FileData;
                }
            }

            fd.append('Answers', JSON.stringify(lstAssessmentData));
            return $http.post($rootScope.ApiPath + 'Residents/UpdateInterventionAssessmentDataWithFiles?residentId=' + residentId, fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            });

        }
        function getAssessmentSummary(residentId) {
            return $http.post($rootScope.ApiPath + 'Residents/GetAssessmentSummary?residentId=' + residentId);
        }

        function getOnlyAssessmentSummary(residentId, SectionInterventionID) {
            return $http.post($rootScope.ApiPath + 'Residents/GetOnlyAssessmentSummary?residentId=' + residentId + '&SectionInterventionID=' + SectionInterventionID);
        }

        function getInterventionSummary(residentId) {
            return $http.post($rootScope.ApiPath + 'Residents/GetInterventionAssessmentSummary?residentId=' + residentId);
        }

        function getAssessmentSummaryOnScores(residentId) {
            return $http.post($rootScope.ApiPath + 'Residents/GetAssessmentSummaryOnScores?residentId=' + residentId);
        }

        function getRequiredAssessmentSummary(residentId) {
            return $http.post($rootScope.ApiPath + 'Residents/GetRequiredAssessmentSummary?residentId=' + residentId);
        }


        function getNewRequiredAssessmentSummary(residentId) {
            return $http.post($rootScope.ApiPath + 'Residents/GetNewRequiredAssessmentSummary?residentId=' + residentId);
        }

        function acceptAsResident(residentId) {
            return $http.post($rootScope.ApiPath + 'Residents/AcceptAsResident?residentId=' + residentId);
        }

        function getTaskTitlesForResident(residentId) {
            return $http.post($rootScope.ApiPath + 'Residents/GetTaskTitlesForResident?residentId=' + residentId);
        }


        function getSectionQuestionByID(SecQueID) {
            return $http.get($rootScope.ApiPath + 'SectionsQuestions/GetActiveSectionsQuestionsByID?SecQueID=' + SecQueID);
        }

        //function GetResidentSummary(residentId) {
        //    return $http.post($rootScope.ApiPath + 'Residents/GetTaskTitlesForResident?residentId=' + residentId);GetAllInterventionQuestionParentQuestion
        //}



        function GetResidentSummaryByID(ResidentId) {
            return $http.get($rootScope.ApiPath + 'Residents/GetResidentSummary?residentId=' + ResidentId);
        }

        function GetResidentSummaryAlert(ResidentId) {
            return $http.get($rootScope.ApiPath + 'Residents/GetResidentSummaryAlert?residentId=' + ResidentId);
        }

        function GetResidentSummaryDataofAnswers(SectionQuestionID, residentId) {
            // return $http.get($rootScope.ApiPath + 'Residents/GetResidentSummaryData?SectionQuestionID=' + SectionQuestionID);
            return $http.get($rootScope.ApiPath + 'Residents/GetResidentSummaryData?residentId=' + residentId + '&SectionQuestionID=' + SectionQuestionID);
        }



        function getAllActiveQuestionParentQuestion() {
            return $http.get($rootScope.ApiPath + 'QuestionParentQuestion/GetAllQuestionParentQuestion');
        }

        function InterventionQuestionParentQuestion() {
            return $http.get($rootScope.ApiPath + 'InterventionQuestionParentQuestion/GetAllInterventionQuestionParentQuestion');
        }

        function SaveInterventionAnswerAssessmentData(residentId, lstAssessmentData) {
            var fd = new FormData();
            for (var i = 0; i < lstAssessmentData.length; i++) {
                if (lstAssessmentData[i].FileData) {
                    fd.append(lstAssessmentData[i].Intervention_Question_AnswerID, lstAssessmentData[i].FileData);
                    delete lstAssessmentData[i].FileData;
                }
            }

            fd.append('Answers', JSON.stringify(lstAssessmentData));
            return $http.post($rootScope.ApiPath + 'Residents/SaveInterventionAnswerAssessmentDataWithFiles?residentId=' + residentId, fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            });

        }


        function getInterventionResidentAnswerAssessmentData(residentId, InterventionId) {
            return $http.post($rootScope.ApiPath + 'Residents/GetInterventionResAnsAssessmentData?residentId=' + residentId + '&InterventionId=' + InterventionId);

        }


        function GetSectionInterventionStatementsID(SectionInterventionID) {
            return $http.get($rootScope.ApiPath + 'Residents/GetSectionInterventionStatements?sectionInterventionID=' + SectionInterventionID);
        }
        function getActiveSectionIntervention() {
            return $http.get($rootScope.ApiPath + 'Residents/GetActiveSectionIntervention');
        }



        function getActiveAdhocSectionIntervention(OrganizationId) {
            return $http.get($rootScope.ApiPath + 'Residents/GetActiveAdhocSectionIntervention?OrganizationId=' + OrganizationId);
        }
        function DeleteResident(objResident) {

            return $http.post($rootScope.ApiPath + 'Residents/DeleteResidents', objResident)
        }

        function DeletePainMonitoringPart(lstPainMonitoring) {

            return $http.post($rootScope.ApiPath + 'Residents/DeletePainMonitoringPart', lstPainMonitoring);
        }
    }

}());