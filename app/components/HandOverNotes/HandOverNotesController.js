(function () {
    "use strict";

    angular.module('CHM').controller('HandOverNotesController', HandOverNotesController);

    HandOverNotesController.$inject = ['$q', '$sce', '$state', '$uibModal', '$window', '$filter', '$stateParams', 'toastr', 'ResidentsService', 'InterventionsService', '$rootScope'];

    function HandOverNotesController($q, $sce, $state, $uibModal, $window, $filter, $stateParams, toastr, ResidentsService, InterventionsService, $rootScope) {

        var vm = this;

        vm.Residents = [];
        vm.AllActiveResidents = [];
        //HandOve Note Date Datepicker Settings
        vm.openHandOverNotes = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.HandOverNotesOpened = true;
        };


        var getAllResidents = function () {
            ResidentsService.getActiveResidentsByOrganizationID($rootScope.OrganizationId).then(
                function (response) {
                    vm.AllActiveResidents = response.data;
                    if (response.data.length > 0)
                        LoadHandOverNote(vm.HandOverNotesDate);
                },
                function (err) {
                    toastr.error('An error occurred while retrieving Residents.');
                }
            );
        };
        getAllResidents();

        vm.HandOverNotesDate = new Date();

        vm.GetHandOverNote = function (HandOverNoteDate) {
            LoadHandOverNote(HandOverNoteDate);
        }
        vm.ResdientList = function () {
            $rootScope.UserFirstLogin = false;
            $state.go('Residents');
        }

        var LoadHandOverNote = function (HandOverNoteDate) {

            var HandOverNoteDate = moment(HandOverNoteDate).format('YYYY-MM-DD');


            vm.ResidentIntervention = [];
            vm.AllActiveResidents.forEach(function (item, index) {

                var arrResidentIntervention = { Name: "", lstarryIntervention: [], lstSummary: [] };
                arrResidentIntervention.Name = item.Resident.FirstName + " " + item.Resident.LastName;


                InterventionsService.GetStartedInterventionForResident(item.Resident.ID, HandOverNoteDate, HandOverNoteDate).then(
             function (response) {
                 arrResidentIntervention.lstarryIntervention = response.data;
                 if (arrResidentIntervention.lstarryIntervention.length > 0) {
                     for (var i = 0; i < arrResidentIntervention.lstarryIntervention.length; i++) {
                         var objAnswerText = '';
                         if (arrResidentIntervention.lstarryIntervention[i].Interventions_Resident_Answers.length > 0) {
                             for (var j = 0; j < arrResidentIntervention.lstarryIntervention[i].Interventions_Resident_Answers.length; j++) {
                                 if (arrResidentIntervention.lstarryIntervention[i].Interventions_Resident_Answers[j].AnswerText != null && arrResidentIntervention.lstarryIntervention[i].Interventions_Resident_Answers[j].IsActive == true)
                                     objAnswerText += arrResidentIntervention.lstarryIntervention[i].Interventions_Resident_Answers[j].AnswerText + ',';
                             }
                         }
                         arrResidentIntervention.lstarryIntervention[i].Summary = objAnswerText.substring(0, objAnswerText.length - 1);;
                     }
                     vm.ResidentIntervention.push(arrResidentIntervention);
                 }
             },
             function (err) {
                 toastr.error('An error occurred while retrieving interventions.');
             }
              );

            });
        }

    }
}());