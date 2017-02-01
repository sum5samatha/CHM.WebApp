(function () {
    "use strict";

    angular.module('CHM').controller('DailyDairyController', DailyDairyController);

    DailyDairyController.$inject = ['$q', '$sce', '$uibModal', '$window', '$filter', '$stateParams', 'toastr', 'InterventionsService', 'ResidentsService'];

    function DailyDairyController($q, $sce, $uibModal, $window, $filter, $stateParams, toastr, InterventionsService, ResidentsService) {


        var vm = this;

        vm.ReadHide = true;
        vm.PersonalInformation = { open: true };
        vm.ResidentId = $stateParams.ResidentId;
        vm.Interventions = [];
        vm.ResidentSummary = [];
        vm.FilterSummary = [];
        if (!vm.ResidentId) {

        }


        vm.ReadMoreClick = function () {
            vm.ReadHide = false;
        }
        vm.ReadLessClick = function () {
            vm.ReadHide = true;
        }
        ResidentsService.GetPersonalInformation(vm.ResidentId).then(
        function (response) {
            vm.Resident = response.data.Resident;
            vm.PhotoUrl = response.data.PhotoUrl;
        },
        function (err) {
            toastr.error('An error occurred while retrieving resident information.');
        }
    );

        //Dairy Date Datepicker Settings
        vm.openDairyDate = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.DairyDateOpened = true;
        };

       

        vm.DairyDate = new Date();


        vm.GetDailyDairy=function(DairyDate)
        {
            LoadDailyDairy(DairyDate);
        }


        var LoadDailyDairy=function(DairyDate)
        {
           
            var DailyDairyDate = moment(DairyDate).format('YYYY-MM-DD');

            InterventionsService.GetInterventionsForResident(vm.ResidentId, DailyDairyDate, DailyDairyDate).then(
               function (response) {
                   
                   vm.Interventions = response.data;
                   if (vm.Interventions.length > 0) {
                       for (var i = 0; i < vm.Interventions.length; i++) {
                           var objAnswerText = '';
                           if (vm.Interventions[i].Interventions_Resident_Answers.length > 0) {
                               for (var j = 0; j < vm.Interventions[i].Interventions_Resident_Answers.length; j++) {
                                   if (arrResidentIntervention.lstarryIntervention[i].Interventions_Resident_Answers[j].AnswerText != null && arrResidentIntervention.lstarryIntervention[i].Interventions_Resident_Answers[j].IsActive == true)
                                   objAnswerText += vm.Interventions[i].Interventions_Resident_Answers[j].AnswerText + ',';
                               }
                           }
                           vm.Interventions[i].Summary = objAnswerText.substring(0, objAnswerText.length - 1);;
                       }
                       vm.ResidentIntervention.push(vm.Interventions);
                   }
               },
               function (err) {
                   toastr.error('An error occurred while retrieving interventions.');
               }
           );



        }

        LoadDailyDairy(vm.DairyDate);

        //Summary Note

        ResidentsService.GetResidentSummaryByID(vm.ResidentId).then(
          function (response) {


              vm.Summarydata = response.data;
              GetDataOnAnswersForSummary();
              vm.Summary = response.data;

              //if (vm.ResidentSummary.length > 0) {
              //    LoadResidentSummary(vm.ResidentSummary);

              //}
          },
          function (err) {
              toastr.error('An error occurred while retrieving resident summary.');
          }


          );

        //var LoadResidentSummary = function (objResidentSummary) {

        //    for (var i = 0; i < objResidentSummary.length; i++) {
        //        for (var j = 0; j < objResidentSummary[i].Sections_Questions_Answers.Sections_Questions_Answers_Summary.length; j++) {


        //            if (objResidentSummary[i].Sections_Questions_Answers.Sections_Questions_Answers_Summary[j].IsAnswerText) {
        //                objResidentSummary[i].Sections_Questions_Answers.Sections_Questions_Answers_Summary[j].Summary = objResidentSummary[i].AnswerText;

        //            }

        //            vm.FilterSummary.push(objResidentSummary[i].Sections_Questions_Answers.Sections_Questions_Answers_Summary[j]);
        //        }


        //    }

        //    if (vm.FilterSummary.length > 0) {
        //        vm.Summary = vm.FilterSummary;
        //    }
        //}

        vm.BindSummaary = function (objSectionQuestion) {


            if (objSectionQuestion.Summary.indexOf('ResidentName') >= 0 || objSectionQuestion.Summary.indexOf('XYZ') >= 0 || objSectionQuestion.Summary.indexOf('XXXX') >= 0) {
                var res = objSectionQuestion.Summary.replace("ResidentName", vm.Resident.NickName);
                for (var k = 0; k < vm.SummaryQuestion.length; k++) {

                    if (vm.SummaryQuestion[k].Id == objSectionQuestion.ID) {

                        if (vm.SummaryQuestion[k].Ans1 != "" && vm.SummaryQuestion[k].Ans2 != "") {
                            var ans1 = res.replace("XYZ", vm.SummaryQuestion[k].Ans1);
                            var ans2 = ans1.replace(/XXXX/g, vm.SummaryQuestion[k].Ans2);
                            return ans2;
                        }
                        else {
                            if (vm.SummaryQuestion[k].Ans1 != "") {
                                var ans1 = res.replace("XYZ", vm.SummaryQuestion[k].Ans1);
                                return ans1;
                            }
                            if (vm.SummaryQuestion[k].Ans2 != "") {
                                var ans1 = res.replace("XXXX", vm.SummaryQuestion[k].Ans2);
                                return ans1;
                            }
                        }
                        break;
                    }
                }
                return res;
            }
            else {
                return objSectionQuestion.Summary;
            }



        }


        vm.SummaryQuestion = [];
        var GetDataOnAnswersForSummary = function () {




            for (var i = 0; i < vm.Summarydata.length; i++) {

                if (vm.Summarydata[i].Summary.indexOf('XYZ') >= 0 || vm.Summarydata[i].Summary.indexOf('XXXX') >= 0) {

                    var summarydata = { Id: "", Ans1: "", Ans2: "" }
                    summarydata.Id = vm.Summarydata[i].ID;

                    ResidentsService.GetResidentSummaryDataofAnswers(vm.Summarydata[i].Sections_Questions_Answers_Summary[0].Section_QuestionID, vm.ResidentId).then(
                  function (response) {

                      var score = "";
                      var AnsText = "";
                      for (var m = 0; m < response.data.length; m++) {

                          if (response.data[m].AnswerText)
                              score = response.data[m].AnswerText;

                          if (response.data[m].AnswerText == null) {
                              AnsText += response.data[m].Sections_Questions_Answers.LabelText + ','
                          }
                      }


                      summarydata.Ans1 = score;
                      summarydata.Ans2 = AnsText.replace(/,\s*$/, "");
                      vm.SummaryQuestion.push(summarydata);
                  },
                  function (err) {
                      toastr.error('An error occurred while retrieving resident summary.');
                  });

                }

            }
        }


        vm.ViewSummary = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/Components/Interventions/ResidentSummary/ResidentSummary.html',
                controller: 'ResidentSummaryController',
                controllerAs: 'vm',
                resolve: {
                    ResidentID: function () {
                        return vm.ResidentId;
                    }

                },
                backdrop: 'static'
            });
            modalInstance.result.then(
                    function (response) {
                        $q.all(response).then(
                             function () {
                                
                             }
                         );
                    }, function () {

                    }
               );
        }
    }

}());