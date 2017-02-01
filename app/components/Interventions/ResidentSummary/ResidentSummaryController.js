(function () {
    "use strict";

    angular.module('CHM').controller('ResidentSummaryController', ResidentSummaryController);

    ResidentSummaryController.$inject = ['$q', '$sce', '$uibModal', '$window', '$filter', '$stateParams', '$state', '$uibModalInstance', 'toastr', 'ResidentsService', 'InterventionsService', 'ResidentID'];

    function ResidentSummaryController($q, $sce, $uibModal, $window, $filter, $stateParams, $state,$uibModalInstance, toastr, ResidentsService, InterventionsService, ResidentID) {
        var vm = this;
        vm.Resident = {};
        vm.ResidentSummary = [];
        vm.FilterSummary = [];
        vm.ResidentId = ResidentID;


        ResidentsService.GetPersonalInformation(vm.ResidentId).then(
      function (response) {
          vm.Resident = response.data.Resident;
        
      },
      function (err) {
          toastr.error('An error occurred while retrieving resident information.');
      }
  );

        ResidentsService.GetResidentSummaryByID(vm.ResidentId).then(
            function (response) {            
                vm.SummaryQuestion = [];
                vm.Summarydata = response.data;
                GetDataOnAnswersForSummary().then(
                    function (response) {
                        vm.Summary = vm.Summarydata;
                    });


            },
            function (err) {
                toastr.error('An error occurred while retrieving resident summary.');
            }


            );


        vm.BindSummaary = function (objSectionQuestion) {


            if (objSectionQuestion.Summary.indexOf('ResidentName') >= 0 || objSectionQuestion.Summary.indexOf('XYZ') >= 0 || objSectionQuestion.Summary.indexOf('XXXX') >= 0) {
                var res = objSectionQuestion.Summary.replace("ResidentName", vm.Resident.NickName);
                for (var k = 0; k < vm.SummaryQuestion.length; k++) {

                    if (vm.SummaryQuestion[k].Id == objSectionQuestion.ID) {

                        if (vm.SummaryQuestion[k].Ans1 != "" && vm.SummaryQuestion[k].Ans2 != "") {
                            var ans1 = res.replace("XYZ", vm.SummaryQuestion[k].Ans1);
                            var ans2 = ans1.replace("XXXX", vm.SummaryQuestion[k].Ans2);
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



        var GetDataOnAnswersForSummary = function () {

            var diferred = $q.defer();



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
                      diferred.reject();
                  });

                }

                //if(i==(vm.Summarydata.length-1))
                diferred.resolve(vm.SummaryQuestion);
            }

            return diferred.promise;
        }



        vm.CancelStatus = function () {
            $uibModalInstance.dismiss('cancel');
        }
    }

}());