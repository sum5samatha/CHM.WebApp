(function () {
    "use strict";

    angular.module('CHM').controller('ResidentDocumentsViewerController', ResidentDocumentsViewerController);

    ResidentDocumentsViewerController.$inject = ['$q', '$sce', '$stateParams', '$uibModal', '$window', '$filter', 'toastr', 'ResidentDocumentsViewerService', 'ResidentsService', '$rootScope', 'InterventionsService'];

    function ResidentDocumentsViewerController($q, $sce, $stateParams, $uibModal, $window, $filter, toastr, ResidentDocumentsViewerService, ResidentsService, $rootScope, InterventionsService) {

        var vm = this;
        vm.ResidentId = $stateParams.ResidentId;
        vm.ResidentSectionQuestionAnswers = [];
        vm.filteredResidentSectionQuestionAnswers = [];
        vm.ResidentInterventionsQuestionAnswer = [];
        vm.filteredResidentInterventionsQuestionAnswer = [];
        vm.ResidentAdhocInterventionsQuestionAnswer = [];
        vm.filteredResidentAdhocInterventionsQuestionAnswer = [];

        var getResidentSectionQuestionAnswers = function () {

            ResidentsService.GetAssessmentData(vm.ResidentId).then(
                  function (response) {
                      vm.ResidentSectionQuestionAnswers = response.data;
                      var objResid = {};
                      for (var i = 0; i < vm.ResidentSectionQuestionAnswers.length; i++) {
                          if (vm.ResidentSectionQuestionAnswers[i].ResidentFile != null) {                            
                              vm.ResidentSectionQuestionAnswers[i].ResidentFile = $rootScope.RootUrl + "/" + vm.ResidentSectionQuestionAnswers[i].ResidentFile;
                              vm.ResidentSectionQuestionAnswers[i].ResidentFileName = (vm.ResidentSectionQuestionAnswers[i].ResidentFile).replace(/^.*[\\\/]/, '');
                              vm.filteredResidentSectionQuestionAnswers.push(vm.ResidentSectionQuestionAnswers[i]);
                          }                        
                      }                     
                  },
                  function (err) {
                      toastr.error('An error occurred while retrieving Resident Section Question Answers.');
                  }
              );
        }
        getResidentSectionQuestionAnswers();


        var getResidentInterventionsQuestionAnswers = function () {

            //var StartDate = new Date();
            //StartDate = moment(new Date(StartDate.setDate(StartDate.getDate() - 10))).format('YYYY-MM-DD');
        
            //var EndDate = new Date();
            //EndDate = moment(new Date(EndDate.setDate(EndDate.getDate() + 30))).format('YYYY-MM-DD');

            ResidentDocumentsViewerService.GetResidentInterventions(vm.ResidentId).then(
                function (response) {
                    vm.ResidentInterventionsQuestionAnswer = response.data;
                    var objResid = {};
                    for (var i = 0; i < vm.ResidentInterventionsQuestionAnswer.length; i++) {
                        if (vm.ResidentInterventionsQuestionAnswer[i].ResidentFile != null) {
                            vm.ResidentInterventionsQuestionAnswer[i].ResidentFile = $rootScope.RootUrl + "/" + vm.ResidentInterventionsQuestionAnswer[i].ResidentFile;
                            vm.ResidentInterventionsQuestionAnswer[i].ResidentFileName = (vm.ResidentInterventionsQuestionAnswer[i].ResidentFile).replace(/^.*[\\\/]/, '');
                            vm.filteredResidentInterventionsQuestionAnswer.push(vm.ResidentInterventionsQuestionAnswer[i]);
                        }
                    }
                },
                 function (err) {
                     toastr.error('An error occurred while retrieving Resident Interventions.');
                 }
                );
        }
        getResidentInterventionsQuestionAnswers();


        var getResidentAdhocInterventions = function () {

            var StartDate = new Date();
            StartDate = moment(new Date(StartDate.setDate(StartDate.getDate() - 10))).format('YYYY-MM-DD');

            var EndDate = new Date();
            EndDate = moment(new Date(EndDate.setDate(EndDate.getDate() + 30))).format('YYYY-MM-DD');

            ResidentDocumentsViewerService.GetResidentAdhocInterventions(vm.ResidentId, StartDate, EndDate).then(
                function (response) {
                    vm.ResidentAdhocInterventionsQuestionAnswer = response.data;
                    var objResid = {};
                    for (var i = 0; i < vm.ResidentAdhocInterventionsQuestionAnswer.length; i++) {
                        if (vm.ResidentAdhocInterventionsQuestionAnswer[i].ResidentFile != null) {
                            vm.ResidentAdhocInterventionsQuestionAnswer[i].ResidentFile = $rootScope.RootUrl + "/" + vm.ResidentAdhocInterventionsQuestionAnswer[i].ResidentFile;
                            vm.ResidentAdhocInterventionsQuestionAnswer[i].ResidentFileName = (vm.ResidentAdhocInterventionsQuestionAnswer[i].ResidentFile).replace(/^.*[\\\/]/, '');
                            vm.filteredResidentAdhocInterventionsQuestionAnswer.push(vm.ResidentAdhocInterventionsQuestionAnswer[i]);
                        }
                    }
                },
                 function (err) {
                     toastr.error('An error occurred while retrieving Resident AdhocInterventions.');
                 }
                );
        }
        getResidentAdhocInterventions();

    }

}());