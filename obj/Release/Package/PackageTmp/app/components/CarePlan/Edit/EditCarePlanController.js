(function () {
    "use strict";

    angular.module('CHM').controller('EditCarePlanController', EditCarePlanController);

    EditCarePlanController.$inject = ['$rootScope', '$scope', '$q', '$uibModal', '$window', '$filter', '$stateParams', '$sce', 'toastr', 'ResidentsService', 'InterventionsService'];

    function EditCarePlanController($rootScope, $scope, $q, $uibModal, $window, $filter, $stateParams, $sce, toastr, ResidentsService, InterventionsService) {
        var vm = this;

        vm.ResidentId = $stateParams.ResidentId;
        vm.Resident = {};
        vm.CarePlan = [];

        var oldRecurrencePattern = {};
        var modalInstance = null;
        if (!vm.ResidentId) {

        }
        vm.DisableGenerateTask = false;

        vm.IsChild = true;
        vm.IsParent = false;

        //Question Of Task code start 5/24/2016
        var InterventionForInterventionQuestion = function () {
            ResidentsService.getInterventionSummary(vm.ResidentId).then(
         function (response) {
             vm.InterventionCarePlan = [];
             for (var j = 0; j < response.data.length; j++) {

                 var objCarePlan = {};
                 objCarePlan.TaskTitle = response.data[j].Section_Intervention.InterventionTitle;
                 objCarePlan.Section_Question_Answer_TaskID = response.data[j].Section_Intervention.ID;
                 objCarePlan.AnswerID = response.data[j].InterventionAnswerID;
                 objCarePlan.QuestionIntervention = response.data[j].Section_Intervention.Intervention_Question;
                 objCarePlan.IsRecurrencePatternShown = false;

                 if (response.data[j].Section_Intervention.Actions.length > 0) {

                     SetRecurrenceRangeAndPattern(objCarePlan, response.data[j].Section_Intervention.Actions[0]);
                 }
                 else {
                     ResetRecurrencePattern(objCarePlan);
                     ResetRecurrenceRange(objCarePlan);
                 }

                 objCarePlan.OldRecurrence = {};
                 objCarePlan.OldRecurrence = angular.copy(objCarePlan.Recurrence);

                 vm.InterventionCarePlan.push(objCarePlan);
             }

         }, function (err) {
             toastr.error('An error occurred while retrieving assessment answers.');
         })

        }
        InterventionForInterventionQuestion();

        ResidentsService.InterventionQuestionParentQuestion().then(
       function (response) {
           vm.QuestionParentQuestion = response.data;
           //newly added 4/14/2016
           vm.CopyQuestionParentQuestion = vm.QuestionParentQuestion;
           GetAllActiveSection();
       },
       function (err) {
           toastr.error('An error occurred while retrieving QuestionParentQuestion.');
       }
       );

        var uniqueQuestion = function (arr) {
            var newarr = [];
            var unique = {};
            var onlydupiclateid = [];
            arr.forEach(function (item, index) {
                if (!unique[item.InterventionQuestionID]) {
                    newarr.push(item);
                    unique[item.InterventionQuestionID] = item;

                }
                else {
                    onlydupiclateid.push(item);
                }
            });

            //return newarr;
            //newly added 4/14/2016

            return onlydupiclateid;
        }


        var uniqueval = function (arr) {
            var newarr = [];
            var unique = {};
            arr.forEach(function (item, index) {
                if (!unique[item.InterventionQuestionID]) {
                    newarr.push(item);
                    unique[item.InterventionQuestionID] = item;
                }
            });

            return newarr;
        }

        var SubQuestionsAsParent = function (objSubquestion, lstSubQuestions) {
            for (var z = 0; z < objSubquestion.length; z++) {
                objSubquestion[z].childQuestion = [];

                for (var n = 0; n < vm.QuestionParentQuestion.length; n++) {

                    if (objSubquestion[z].ID == vm.QuestionParentQuestion[n].InterventionParentQuestionID) {
                        for (var p = 0; p < lstSubQuestions.length; p++) {

                            if (lstSubQuestions[p].ID == vm.QuestionParentQuestion[n].InterventionQuestionID) {

                                objSubquestion[z].childQuestion.push(lstSubQuestions[p]);
                                SubQuestionsAsParent(objSubquestion[z].childQuestion, lstSubQuestions);
                            }

                        }
                    }
                }
            }
            //setTimeout(SubQuestionsAsParent, 4000);
        }

        var subQuestionforAnswer = function (objSubquestion, lstSubQuestion) {
            for (var i = 0; i < objSubquestion.length; i++) {

                for (var j = 0; j < objSubquestion[i].Intervention_Question_Answer.length; j++) {
                    objSubquestion[i].Intervention_Question_Answer[j].childQuestion = [];
                    for (var n = 0; n < vm.QuestionParentQuestion.length; n++) {

                        if (objSubquestion[i].Intervention_Question_Answer[j].ID == vm.QuestionParentQuestion[n].InterventionParentAnswerID) {
                            for (var l = 0; l < lstSubQuestion.length; l++) {


                                if (lstSubQuestion[l].ID == vm.QuestionParentQuestion[n].InterventionQuestionID && objSubquestion[i].Intervention_Question_Answer[j].ID == vm.QuestionParentQuestion[n].InterventionParentAnswerID) {  //newly added
                                    lstSubQuestion[l].InterventionParentAnswerID = objSubquestion[i].Intervention_Question_Answer[j].ID;
                                    //end
                                    objSubquestion[i].Intervention_Question_Answer[j].childQuestion.push(lstSubQuestion[l]);
                                    subQuestionforAnswer(objSubquestion[i].Intervention_Question_Answer[j].childQuestion, lstSubQuestion);
                                }
                            }
                        }


                    }

                }
            }
        }
        var BindCarePaln = function (obj) {
            for (var i = 0; i < obj.length; i++) {

                for (var M = 0; M < obj[i].Intervention_Question_Answer.length; M++) {
                    obj[i].Intervention_Question_Answer[M].CarePlan = [];
                    for (var z = 0; z < vm.InterventionCarePlan.length; z++) {
                        if (obj[i].Intervention_Question_Answer[M].ID == vm.InterventionCarePlan[z].AnswerID) {
                            obj[i].Intervention_Question_Answer[M].CarePlan.push(vm.InterventionCarePlan[z]);
                        }
                    }
                    BindCarePaln(obj[i].Intervention_Question_Answer[M].childQuestion);

                }
            }
        }

        //End

        //Recurrence Pattern

        vm.Months = [
            { Name: 'January', Value: 0, Dates: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31] },
            { Name: 'February', Value: 1, Dates: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29] },
            { Name: 'March', Value: 2, Dates: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31] },
            { Name: 'April', Value: 3, Dates: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
            { Name: 'May', Value: 4, Dates: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31] },
            { Name: 'June', Value: 5, Dates: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
            { Name: 'July', Value: 6, Dates: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31] },
            { Name: 'August', Value: 7, Dates: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31] },
            { Name: 'September', Value: 8, Dates: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
            { Name: 'October', Value: 9, Dates: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31] },
            { Name: 'November', Value: 10, Dates: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
            { Name: 'December', Value: 11, Dates: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31] }
        ];
        vm.Days = [
            { Name: 'Sunday', Value: 0 },
            { Name: 'Monday', Value: 1 },
            { Name: 'Tuesday', Value: 2 },
            { Name: 'Wednesday', Value: 3 },
            { Name: 'Thursday', Value: 4 },
            { Name: 'Friday', Value: 5 },
            { Name: 'Saturday', Value: 6 }
        ];
        vm.Instances = [
            { Name: 'first', Value: 1 },
            { Name: 'second', Value: 2 },
            { Name: 'third', Value: 3 },
            { Name: 'fourth', Value: 4 },
            { Name: 'last', Value: 5 }
        ];


        var ResetRecurrencePattern = function (objCarePlan) {
            objCarePlan.Recurrence = {};
            objCarePlan.Recurrence.RecurrenceType = 'Daily';
            objCarePlan.Recurrence.MonthlyPattern = 'Date';
            objCarePlan.Recurrence.YearlyPattern = 'Date';
            objCarePlan.Recurrence.RecurrenceInterval = 1;
            objCarePlan.Recurrence.RecurrenceDay = vm.Days[0].Value;
            objCarePlan.Recurrence.RecurrenceDate = moment().format('D');
            objCarePlan.Recurrence.RecurrenceMonth = moment().month();
            objCarePlan.Recurrence.Instance = vm.Instances[0].Value;
            objCarePlan.Recurrence.RecurrenceRange = 'NoOfOccurrences';
            objCarePlan.Recurrence.SelectedWeekDays = [moment().day()];

            objCarePlan.Recurrence.SelectedWeekDayTimings = [[{ StartTime: new Date(), EndTime: new Date() }]];
            objCarePlan.Recurrence.Timings = [{ StartTime: new Date(), EndTime: new Date() }];
        };

        var ResetRecurrenceRange = function (objCarePlan) {
            objCarePlan.Recurrence.NoOfOccurrences = 10;
            objCarePlan.Recurrence.RecurrenceStartDate = new Date(moment());//.format($rootScope.DateFormatForMoment);
            objCarePlan.Recurrence.RecurrenceEndDate = new Date(moment().add(10, 'day'));//.format($rootScope.DateFormatForMoment);
        };

        vm.OpenRecurrencePattern = function (objCarePlan, objlevel) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/components/CarePlan/_partials/RecurrencePattern.html',
                controller: 'RecurrencePatternController',
                controllerAs: 'vm',
                resolve: {
                    recurrence: function () {
                        return angular.copy(objCarePlan.Recurrence);
                    },
                    title: function () {
                        return objCarePlan.TaskTitle;
                    }
                },
                backdrop: 'static',
                size: 'lg'
            });

            modalInstance.result.then(
                function (response) {
                    objCarePlan.Recurrence = angular.copy(response);
                    if (moment(response.RecurrenceStartDate).format('YYYY-MM-DD') < moment(response.RecurrenceEndDate).format('YYYY-MM-DD')) {
                        if (objlevel) {
                            vm.CarePlan.push(objCarePlan);
                        }
                    } else {
                        toastr.error("End date must be greater than start date.");
                    }
                },
                function () {
                }
            );

        };

        ResidentsService.GetPersonalInformation(vm.ResidentId).then(
            function (response) {
                vm.Resident = response.data.Resident;
            },
            function (err) {
                toastr.error('An error occurred while retrieving resident information.');
            }
        );

        var uniquevalSection = function (arr) {
            var newarr = [];
            var unique = {};
            arr.forEach(function (item, index) {
                if (!unique[item.ID]) {
                    newarr.push(item);
                    unique[item.ID] = item;
                }
            });

            return newarr;

        }

        var GetAllActiveSection = function () {
            ResidentsService.GetAssessmentSummary(vm.ResidentId).then(
            function (response) {


                if (response.data.SectionInterventionResponse.length > 0 && response.data.SectionInterventionSection.length > 0) {
                    //Code To Display Question 
                    vm.Sections = response.data.SectionInterventionResponse;
                    vm.CopyallSectionsQuestion = response.data.SectionInterventionResponse;
                    vm.MainQuestion = [];
                    vm.SubQuestion = [];
                    vm.AllSection = [];

                    vm.SectionIDs = uniquevalSection(response.data.SectionInterventionSection);
                    var GroupSection = [];
                    for (var m = 0; m < vm.SectionIDs.length; m++) {
                        var arrsection = { sectionID: "", sectionName: "", sectionIntervention: [] };
                        for (var z = 0; z < response.data.SectionInterventionSection.length; z++) {
                            if (vm.SectionIDs[m].ID == response.data.SectionInterventionSection[z].ID) {
                                arrsection.sectionID = vm.SectionIDs[m].ID;
                                arrsection.sectionName = response.data.SectionInterventionSection[z].sectionName;
                                arrsection.sectionIntervention.push(response.data.SectionInterventionSection[z].section_InterventionID);
                            }
                        }
                        GroupSection.push(arrsection);
                    }



                    //To get All Section
                    for (var x = 0; x < response.data.SectionInterventionResponse.length; x++) {

                        vm.AllSection.push(response.data.SectionInterventionResponse[x]);
                    }

                    for (var p = 0; p < response.data.SectionInterventionResponse.length; p++) {

                        for (var q = 0; q < response.data.SectionInterventionResponse[p].Intervention_Question.length; q++) {
                            var z = 0;
                            for (var r = 0; r < vm.QuestionParentQuestion.length ; r++) {


                                if (vm.QuestionParentQuestion[r].InterventionQuestionID == response.data.SectionInterventionResponse[p].Intervention_Question[q].ID) {
                                    z++;
                                }



                            }

                            if (z == 0) {
                                if (response.data.SectionInterventionResponse[p].Intervention_Question[q].IsInAssessment == true)
                                    vm.MainQuestion.push(response.data.SectionInterventionResponse[p].Intervention_Question[q]);
                            }
                            else {
                                if (response.data.SectionInterventionResponse[p].Intervention_Question[q].IsInAssessment == true)
                                    vm.SubQuestion.push(response.data.SectionInterventionResponse[p].Intervention_Question[q]);
                            }
                        }


                    }

                    for (var m = 0; m < vm.MainQuestion.length; m++) {
                        vm.MainQuestion[m].childQuestion = [];
                        for (var n = 0; n < vm.QuestionParentQuestion.length; n++) {

                            if (vm.MainQuestion[m].ID == vm.QuestionParentQuestion[n].InterventionParentQuestionID) {
                                for (var p = 0; p < vm.SubQuestion.length; p++) {

                                    if (vm.SubQuestion[p].ID == vm.QuestionParentQuestion[n].InterventionQuestionID) {

                                        vm.MainQuestion[m].childQuestion.push(vm.SubQuestion[p]);
                                        try {
                                            SubQuestionsAsParent(vm.MainQuestion[m].childQuestion, vm.SubQuestion);
                                        } catch (e) {
                                            if (e instanceof TypeError) {
                                                // ignore TypeError
                                            }
                                            else if (e instanceof RangeError) {

                                            }
                                            else {
                                                // something else
                                            }
                                        }

                                    }

                                }
                            }
                        }


                    }

                    //Code End


                    for (var k = 0; k < vm.MainQuestion.length; k++) {
                        for (var y = 0; y < vm.MainQuestion[k].Intervention_Question_Answer.length; y++) {
                            vm.MainQuestion[k].Intervention_Question_Answer[y].childQuestion = [];
                            for (var m = 0; m < vm.QuestionParentQuestion.length; m++) {

                                if (vm.MainQuestion[k].Intervention_Question_Answer[y].ID == vm.QuestionParentQuestion[m].InterventionParentAnswerID) {
                                    for (var n = 0; n < vm.SubQuestion.length; n++) {

                                        if (vm.SubQuestion[n].ID == vm.QuestionParentQuestion[m].InterventionQuestionID && vm.MainQuestion[k].Intervention_Question_Answer[y].ID == vm.QuestionParentQuestion[m].InterventionParentAnswerID) {
                                            vm.SubQuestion[n].InterventionParentAnswerID = vm.MainQuestion[k].Intervention_Question_Answer[y].ID;
                                            vm.MainQuestion[k].Intervention_Question_Answer[y].childQuestion.push(vm.SubQuestion[n]);
                                            subQuestionforAnswer(vm.MainQuestion[k].Intervention_Question_Answer[y].childQuestion, vm.SubQuestion)
                                        }
                                    }
                                }


                            }
                        }

                    }

                    for (var k = 0; k < vm.MainQuestion.length; k++) {
                        for (var i = 0; i < vm.MainQuestion[k].childQuestion.length; i++) {

                            //Start
                            for (var y = 0; y < vm.MainQuestion[k].childQuestion[i].Intervention_Question_Answer.length; y++) {
                                vm.MainQuestion[k].childQuestion[i].Intervention_Question_Answer[y].childQuestion = [];
                                for (var m = 0; m < vm.QuestionParentQuestion.length; m++) {

                                    if (vm.MainQuestion[k].childQuestion[i].Intervention_Question_Answer[y].ID == vm.QuestionParentQuestion[m].InterventionParentAnswerID) {
                                        for (var n = 0; n < vm.SubQuestion.length; n++) {

                                            if (vm.SubQuestion[n].ID == vm.QuestionParentQuestion[m].InterventionQuestionID && vm.MainQuestion[k].childQuestion[i].Intervention_Question_Answer[y].ID == vm.QuestionParentQuestion[m].InterventionParentAnswerID) {
                                                vm.SubQuestion[n].InterventionParentAnswerID = vm.MainQuestion[k].childQuestion[i].Intervention_Question_Answer[y].ID;
                                                vm.MainQuestion[k].childQuestion[i].Intervention_Question_Answer[y].childQuestion.push(vm.SubQuestion[n]);
                                                subQuestionforAnswer(vm.MainQuestion[k].childQuestion[i].Intervention_Question_Answer[y].childQuestion, vm.SubQuestion)
                                            }
                                        }
                                    }


                                }
                            }

                            //End
                        }

                    }


                    for (var t = 0; t < vm.AllSection.length; t++) {
                        vm.AllSection[t].Intervention_Question = [];
                        for (var s = 0; s < vm.MainQuestion.length; s++) {

                            if (vm.MainQuestion[s].Section_InterventionID == vm.AllSection[t].ID) {
                                vm.AllSection[t].Intervention_Question.push(vm.MainQuestion[s]);
                            }


                        }

                    }

                    vm.onlyduplicates = uniqueQuestion(vm.CopyQuestionParentQuestion);
                    vm.uniqueQuestionIDs = uniqueval(vm.onlyduplicates);


                    if (vm.uniqueQuestionIDs.length > 0) {
                        vm.uniqueQuestionIDswithNoParAnsIds = [];

                        for (var k = 0; k < vm.uniqueQuestionIDs.length; k++) {
                            if (vm.uniqueQuestionIDs[k].InterventionParentAnswerID == null) {
                                vm.uniqueQuestionIDswithNoParAnsIds.push(vm.uniqueQuestionIDs[k]);
                            }
                        }



                        if (vm.uniqueQuestionIDswithNoParAnsIds.length > 0) {
                            //Step2:
                            vm.AllParentQuestions = [];
                            for (var j = 0; j < vm.uniqueQuestionIDswithNoParAnsIds.length; j++) {

                                var newarray = { QuestionID: '', SectionQuestion: [] }
                                newarray.QuestionID = vm.uniqueQuestionIDswithNoParAnsIds[j].InterventionQuestionID;
                                for (var m = 0; m < vm.CopyQuestionParentQuestion.length; m++) {
                                    if (vm.uniqueQuestionIDswithNoParAnsIds[j].InterventionQuestionID == vm.CopyQuestionParentQuestion[m].InterventionQuestionID) {
                                        if (vm.CopyallSectionsQuestion.length > 0) {
                                            for (var u = 0; u < vm.CopyallSectionsQuestion.length; u++) {
                                                for (var r = 0; r < vm.CopyallSectionsQuestion[u].Intervention_Question.length; r++) {
                                                    if (vm.CopyallSectionsQuestion[u].Intervention_Question[r].ID == vm.CopyQuestionParentQuestion[m].InterventionParentQuestionID)
                                                        newarray.SectionQuestion.push(vm.CopyallSectionsQuestion[u].Intervention_Question[r]);
                                                }

                                            }
                                        }

                                    }
                                }
                                vm.AllParentQuestions.push(newarray);
                            }

                            if (vm.AllParentQuestions.length > 0) {
                                //step3
                                for (var zz = 0; zz < vm.AllParentQuestions.length; zz++) {
                                    var array = [];
                                    for (var yy = 0; yy < vm.AllParentQuestions[zz].SectionQuestion.length; yy++) {
                                        array.push(vm.AllParentQuestions[zz].SectionQuestion[yy].DisplayOrder)
                                    }

                                    var largest = 0;

                                    for (i = 0; i <= largest; i++) {
                                        if (array[i] > largest) {
                                            var largest = array[i];
                                        }
                                    }
                                    for (var mm = 0; mm < vm.AllParentQuestions[zz].SectionQuestion.length; mm++) {

                                        if (vm.AllParentQuestions[zz].SectionQuestion[mm].DisplayOrder == largest) {
                                            vm.AllParentQuestions[zz].SectionQuestion[mm].lastquestion = 1;
                                        }
                                    }
                                }

                                //step:4
                                if (vm.AllParentQuestions.length > 0) {

                                    vm.AllSetQuestion = [];
                                    for (var nn = 0; nn < vm.AllParentQuestions.length; nn++) {

                                        for (var w = 0; w < vm.AllParentQuestions[nn].SectionQuestion.length; w++) {

                                            var arrayMainQuesGroup = { filterdSectionQuestionID: '', GroupNo: '', IsLastQuesInGroup: false }
                                            arrayMainQuesGroup.filterdSectionQuestionID = vm.AllParentQuestions[nn].SectionQuestion[w].ID;
                                            arrayMainQuesGroup.GroupNo = nn;
                                            if (vm.AllParentQuestions[nn].SectionQuestion[w].lastquestion != undefined) {
                                                arrayMainQuesGroup.IsLastQuesInGroup = true;
                                            }
                                            vm.AllSetQuestion.push(arrayMainQuesGroup);
                                        }

                                    }
                                }



                                if (vm.AllSetQuestion.length > 0) {

                                    for (var q = 0; q < vm.AllSection.length; q++) {
                                        for (var z = 0; z < vm.AllSection[q].Intervention_Question.length; z++) {
                                            for (var L = 0; L < vm.AllSetQuestion.length; L++) {
                                                if (vm.AllSetQuestion[L].filterdSectionQuestionID == vm.AllSection[q].Intervention_Question[z].ID) {
                                                    vm.AllSection[q].Intervention_Question[z].SetGroupNo = vm.AllSetQuestion[L].GroupNo;
                                                    if (vm.AllSetQuestion[L].IsLastQuesInGroup == false) {
                                                        vm.AllSection[q].Intervention_Question[z].childQuestion = [];
                                                        vm.AllSection[q].Intervention_Question[z].LastQuestionInset = vm.AllSetQuestion[L].IsLastQuesInGroup;
                                                    }
                                                    else {
                                                        vm.AllSection[q].Intervention_Question[z].LastQuestionInset = vm.AllSetQuestion[L].IsLastQuesInGroup;
                                                        if (vm.AllSection[q].Intervention_Question[z].childQuestion.length > 0) {
                                                            for (var c = 0; c < vm.AllSection[q].Intervention_Question[z].childQuestion.length; c++) {

                                                                vm.AllSection[q].Intervention_Question[z].childQuestion[c].childGroupNo = vm.AllSetQuestion[L].GroupNo;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    for (var i = 0; i < vm.Sections.length; i++) {
                        for (var j = 0; j < vm.Sections[i].Intervention_Question.length; j++) {
                            for (var k = 0; k < vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer.length; k++) {
                                vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer[k].CarePlan = [];
                                for (var x = 0; x < vm.InterventionCarePlan.length; x++) {
                                    if (vm.InterventionCarePlan[x].AnswerID == vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer[k].ID) {
                                        vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer[k].CarePlan.push(vm.InterventionCarePlan[x]);
                                    }
                                }
                                BindCarePaln(vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer[k].childQuestion);
                            }
                        }
                    }
                    vm.Sections = vm.AllSection;
                    for (var i = 0; i < vm.Sections.length; i++) {
                        for (var j = 0; j < vm.Sections[i].Intervention_Question.length; j++) {
                            for (var k = 0; k < vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer.length; k++) {
                                if (vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer[k].IsDefault) {
                                    vm.Sections[i].Intervention_Question[j].ChosenAnswerID = vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer[k].ID;
                                }
                                if (vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer[k].childQuestion && vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer[k].childQuestion.length > 0) {
                                    BindChosenAnswerID(vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer[k].childQuestion);
                                }
                            }
                        }
                    }
                    GetAssessmentAnswers();
                    for (var i = 0; i < vm.Sections.length; i++) {
                        var objCarePlan = {};
                        objCarePlan.Id = vm.Sections[i].ID;
                        objCarePlan.TaskTitle = vm.Sections[i].InterventionTitle;
                        objCarePlan.Section_Question_Answer_TaskID = vm.Sections[i].ID;
                        objCarePlan.QuestionIntervention = vm.Sections[i].Intervention_Question;
                        objCarePlan.IsRecurrencePatternShown = false;
                        if (vm.Sections[i].Actions.length > 0) {
                            SetRecurrenceRangeAndPattern(objCarePlan, vm.Sections[i].Actions[0]);
                        }
                        else {
                            ResetRecurrencePattern(objCarePlan);
                            ResetRecurrenceRange(objCarePlan);
                        }
                        objCarePlan.OldRecurrence = {};
                        objCarePlan.OldRecurrence = angular.copy(objCarePlan.Recurrence);
                        vm.CarePlan.push(objCarePlan);
                    }


                    vm.SectionCareplan = [];
                    if (vm.CarePlan.length > 0) {
                        for (var i = 0; i < GroupSection.length; i++) {
                            var arrsection = { sectionName: "", careplan: [] };
                            arrsection.sectionName = GroupSection[i].sectionName;
                            for (var m = 0; m < GroupSection[i].sectionIntervention.length; m++) {
                                for (var j = 0; j < vm.CarePlan.length; j++) {
                                    if (GroupSection[i].sectionIntervention[m] == vm.CarePlan[j].Id) {
                                        arrsection.careplan.push(vm.CarePlan[j]);
                                    }

                                }
                            }
                            vm.SectionCareplan.push(arrsection);
                        }
                    }
                }
            },
            function (err) {
                toastr.error('An error occurred while retrieving task titles.');
            }
        );
        }

        var SetRecurrenceRangeAndPattern = function (objCarePlan, objAction) {
            objCarePlan.Recurrence = {};


            objCarePlan.Recurrence.RecurrenceStartDate = new Date(objAction.StartDate);
            if (objAction.EndDate) {
                objCarePlan.Recurrence.RecurrenceEndDate = new Date(objAction.EndDate);
                objCarePlan.Recurrence.NoOfOccurrences = 10;
                objCarePlan.Recurrence.RecurrenceRange = 'RecurrenceEndDate';
            }
            else {
                objCarePlan.Recurrence.RecurrenceEndDate = new Date(moment(objCarePlan.Recurrence.StartDate).add(10, 'day'));
                objCarePlan.Recurrence.NoOfOccurrences = objAction.Occurrences;
                objCarePlan.Recurrence.RecurrenceRange = 'NoOfOccurrences';
            }

            if (objAction.Interval)
                objCarePlan.Recurrence.RecurrenceInterval = objAction.Interval;

            if (objAction.Type)
                objCarePlan.Recurrence.RecurrenceType = objAction.Type;

            if (objAction.Month)
                objCarePlan.Recurrence.RecurrenceMonth = objAction.Month;

            if (objAction.Instance)
                objCarePlan.Recurrence.RecurrenceInstance = objAction.Instance;


            switch (objAction.Type) {
                case 'Monthly':
                    objCarePlan.Recurrence.MonthlyPattern = 'Date';
                    break;
                case 'MonthlyNth':
                    objCarePlan.Recurrence.RecurrenceType = 'Monthly';
                    objCarePlan.Recurrence.MonthlyPattern = 'Instance';
                    break;
                case 'Yearly':
                    objCarePlan.Recurrence.YearlyPattern = 'Date';
                    break;
                case 'YearlyNth':
                    objCarePlan.Recurrence.RecurrenceType = 'Yearly';
                    objCarePlan.Recurrence.YearlyPattern = 'Instance';
                    break;
            }

            objCarePlan.Recurrence.SelectedWeekDays = [];
            objCarePlan.Recurrence.SelectedWeekDayTimings = [];
            objCarePlan.Recurrence.Timings = [];
            objCarePlan.Recurrence.Day = null;
            objCarePlan.Recurrence.Date = null;


            if (objAction.Type == 'Weekly') {
                for (var i = 0; i < objAction.Actions_Days.length; i++) {
                    var weekDayIndex = objCarePlan.Recurrence.SelectedWeekDays.indexOf(objAction.Actions_Days[i].Day);

                    if (weekDayIndex == -1) {
                        weekDayIndex = objCarePlan.Recurrence.SelectedWeekDays.push(objAction.Actions_Days[i].Day) - 1;
                        objCarePlan.Recurrence.SelectedWeekDayTimings[weekDayIndex] = [];
                    }

                    var startTimeParts = objAction.Actions_Days[i].StartTime.split(':');
                    var endTimeParts = objAction.Actions_Days[i].EndTime.split(':');
                    if (startTimeParts.length == 3 && endTimeParts.length == 3)
                        objCarePlan.Recurrence.SelectedWeekDayTimings[weekDayIndex].push({ StartTime: new Date().setHours(startTimeParts[0], startTimeParts[1]), EndTime: new Date().setHours(endTimeParts[0], endTimeParts[1]) });

                }
            }
            else {
                for (var i = 0; i < objAction.Actions_Days.length; i++) {
                    objCarePlan.Recurrence.Day = objAction.Actions_Days[i].Day;
                    objCarePlan.Recurrence.Date = objAction.Actions_Days[i].Date;
                    var startTimeParts = objAction.Actions_Days[i].StartTime.split(':');
                    var endTimeParts = objAction.Actions_Days[i].EndTime.split(':');
                    if (startTimeParts.length == 3 && endTimeParts.length == 3)
                        objCarePlan.Recurrence.Timings.push({ StartTime: new Date().setHours(startTimeParts[0], startTimeParts[1]), EndTime: new Date().setHours(endTimeParts[0], endTimeParts[1]) });
                }
            }
        };

        vm.GenerateTasks = function () {
            var lstActions = [];
            vm.DisableGenerateTask = true;
            for (var i = 0; i < vm.CarePlan.length; i++) {
                if (!angular.equals(vm.CarePlan[i].Recurrence, vm.CarePlan[i].OldRecurrence)) {
                    var objAction = {};
                    objAction.ResidentID = vm.ResidentId;
                    objAction.Section_InterventionID = vm.CarePlan[i].Section_Question_Answer_TaskID;
                    objAction.StartDate = new Date(vm.CarePlan[i].Recurrence.RecurrenceStartDate);
                    objAction.EndDate = null;
                    objAction.Occurrences = null;
                    objAction.Actions_Days = [];

                    switch (vm.CarePlan[i].Recurrence.RecurrenceRange) {
                        case 'NoOfOccurrences':
                            objAction.Occurrences = vm.CarePlan[i].Recurrence.NoOfOccurrences;
                            break;
                        case 'RecurrenceEndDate':
                            objAction.EndDate = new Date(vm.CarePlan[i].Recurrence.RecurrenceEndDate);
                            break;
                    }

                    if (vm.CarePlan[i].Recurrence.RecurrenceType == 'Daily') {
                        objAction.Type = 'Daily';
                        objAction.Interval = vm.CarePlan[i].Recurrence.RecurrenceInterval;

                        for (var j = 0; j < vm.CarePlan[i].Recurrence.Timings.length; j++) {
                            var objAction_Day = {};
                            objAction_Day.Day = null;
                            objAction_Day.Date = null;
                            objAction_Day.StartTime = moment(vm.CarePlan[i].Recurrence.Timings[j].StartTime).format('HH:mm:ss');
                            objAction_Day.EndTime = moment(vm.CarePlan[i].Recurrence.Timings[j].EndTime).format('HH:mm:ss');
                            objAction_Day.Specifications = null;

                            objAction.Actions_Days.push(objAction_Day);
                        }

                    }
                    else if (vm.CarePlan[i].Recurrence.RecurrenceType == 'Weekly') {
                        objAction.Type = 'Weekly';
                        objAction.Interval = vm.CarePlan[i].Recurrence.RecurrenceInterval;
                        objAction.RecurrenceDay = vm.CarePlan[i].Recurrence.SelectedWeekDays.toString();

                        for (var j = 0; j < vm.CarePlan[i].Recurrence.SelectedWeekDays.length; j++) {
                            for (var k = 0; k < vm.CarePlan[i].Recurrence.SelectedWeekDayTimings[j].length; k++) {
                                var objAction_Day = {};
                                objAction_Day.Day = vm.CarePlan[i].Recurrence.SelectedWeekDays[j];
                                objAction_Day.Date = null;
                                objAction_Day.StartTime = moment(vm.CarePlan[i].Recurrence.SelectedWeekDayTimings[j][k].StartTime).format('HH:mm:ss');
                                objAction_Day.EndTime = moment(vm.CarePlan[i].Recurrence.SelectedWeekDayTimings[j][k].EndTime).format('HH:mm:ss');
                                objAction_Day.Specifications = null;

                                objAction.Actions_Days.push(objAction_Day);
                            }
                        }

                    }
                    else if (vm.CarePlan[i].Recurrence.RecurrenceType == 'Monthly') {
                        if (vm.CarePlan[i].Recurrence.MonthlyPattern == 'Date') {
                            objAction.Type = 'Monthly';
                            objAction.Interval = vm.CarePlan[i].Recurrence.RecurrenceInterval;

                            for (var j = 0; j < vm.CarePlan[i].Recurrence.Timings.length; j++) {
                                var objAction_Day = {};
                                objAction_Day.Day = null;
                                objAction_Day.Date = vm.CarePlan[i].Recurrence.RecurrenceDate;
                                objAction_Day.StartTime = moment(vm.CarePlan[i].Recurrence.Timings[j].StartTime).format('HH:mm:ss');;
                                objAction_Day.EndTime = moment(vm.CarePlan[i].Recurrence.Timings[j].EndTime).format('HH:mm:ss');
                                objAction_Day.Specifications = null;

                                objAction.Actions_Days.push(objAction_Day);
                            }

                        }
                        else {
                            objAction.Type = 'MonthlyNth';
                            objAction.Interval = vm.CarePlan[i].Recurrence.RecurrenceInterval;
                            objAction.Instance = vm.CarePlan[i].Recurrence.Instance;

                            for (var j = 0; j < vm.CarePlan[i].Recurrence.Timings.length; j++) {
                                var objAction_Day = {};
                                objAction_Day.Day = vm.CarePlan[i].Recurrence.RecurrenceDay;
                                objAction_Day.Date = null;
                                objAction_Day.StartTime = moment(vm.CarePlan[i].Recurrence.Timings[j].StartTime).format('HH:mm:ss');;
                                objAction_Day.EndTime = moment(vm.CarePlan[i].Recurrence.Timings[j].EndTime).format('HH:mm:ss');
                                objAction_Day.Specifications = null;

                                objAction.Actions_Days.push(objAction_Day);
                            }
                        }
                    }
                    else {
                        if (vm.CarePlan[i].Recurrence.YearlyPattern == 'Date') {
                            objAction.Type = 'Yearly';
                            objAction.Month = vm.CarePlan[i].Recurrence.RecurrenceMonth;

                            for (var j = 0; j < vm.CarePlan[i].Recurrence.Timings.length; j++) {
                                var objAction_Day = {};
                                objAction_Day.Day = null;
                                objAction_Day.Date = vm.CarePlan[i].Recurrence.RecurrenceDate;
                                objAction_Day.StartTime = moment(vm.CarePlan[i].Recurrence.Timings[j].StartTime).format('HH:mm:ss');;
                                objAction_Day.EndTime = moment(vm.CarePlan[i].Recurrence.Timings[j].EndTime).format('HH:mm:ss');
                                objAction_Day.Specifications = null;

                                objAction.Actions_Days.push(objAction_Day);
                            }

                        }
                        else {
                            objAction.Type = 'YearlyNth';
                            objAction.Month = vm.CarePlan[i].Recurrence.RecurrenceMonth;
                            objAction.Instance = vm.CarePlan[i].Recurrence.Instance;

                            for (var j = 0; j < vm.CarePlan[i].Recurrence.Timings.length; j++) {
                                var objAction_Day = {};
                                objAction_Day.Day = vm.CarePlan[i].Recurrence.RecurrenceDay;
                                objAction_Day.Date = null;
                                objAction_Day.StartTime = moment(vm.CarePlan[i].Recurrence.Timings[j].StartTime).format('HH:mm:ss');;
                                objAction_Day.EndTime = moment(vm.CarePlan[i].Recurrence.Timings[j].EndTime).format('HH:mm:ss');
                                objAction_Day.Specifications = null;

                                objAction.Actions_Days.push(objAction_Day);
                            }
                        }
                    }
                    lstActions.push(objAction);
                }
            }

            if (lstActions.length > 0) {
                var InterventionLimit;
                for (var i = 0; i < $rootScope.LimitofInterventions.length; i++) {
                    if ($rootScope.OrganizationId == $rootScope.LimitofInterventions[i].OrganizationID && $rootScope.LimitofInterventions[i].ConfigurationKey == 'GenerateInterventionLimit') {
                        InterventionLimit = $rootScope.LimitofInterventions[i].ConfigurationValue;
                        break;
                    }
                }
                InterventionsService.GenerateInterventions(lstActions, InterventionLimit).then(
                    function (response) {

                        toastr.success('Interventions generated successfully.');
                        vm.DisableGenerateTask = true;
                    },
                    function (err) {
                        toastr.error('An error occurred while generating interventions.');
                    }
                );
            }
            else {

                toastr.info('To generate pattern please choose the  fields.')
                vm.DisableGenerateTask = false;
            }

        };

        //Code for Task added start

        var BindChosenAnswerID = function (objQuestions) {
            for (var i = 0; i < objQuestions.length; i++) {
                for (var j = 0; j < objQuestions[i].Intervention_Question_Answer.length; j++) {
                    if (objQuestions[i].Intervention_Question_Answer[j].IsDefault) {
                        objQuestions[i].ChosenAnswerID = objQuestions[i].Intervention_Question_Answer[j].ID;
                    }
                    if (objQuestions[i].Intervention_Question_Answer[j].childQuestion && objQuestions[i].Intervention_Question_Answer[j].childQuestion.length > 0) {
                        BindChosenAnswerID(objQuestions[i].Intervention_Question_Answer[j].childQuestion);
                    }
                }
            }
        };

        vm.RadioButtonChange = function (objSection_Question) {


            objSection_Question.ChosenAnswerID = objSection_Question.ChosenAnswer;
            //newly added

            objSection_Question.SumofScores = $filter('filter')(objSection_Question.Intervention_Question_Answer, { ID: objSection_Question.ChosenAnswer })[0].Score;

        }

        vm.ToggleSwitchChange = function (objSection_Question) {

            if (objSection_Question.ChosenAnswer == true)
                objSection_Question.ChosenAnswerID = $filter('filter')(objSection_Question.Intervention_Question_Answer, { LabelText: 'Yes' })[0].ID;
            else
                objSection_Question.ChosenAnswerID = $filter('filter')(objSection_Question.Intervention_Question_Answer, { LabelText: 'No' })[0].ID;
        }

        //Newlyadded
        vm.copySumofScore = 0;
        //

        vm.CheckBoxChange = function (objSection_Question, objsectionQuestionAnswer) {
            if (!objSection_Question.MulChosenAnswerID)
                objSection_Question.MulChosenAnswerID = [];
            if (!objSection_Question.SumofScores) {
                objSection_Question.SumofScores = 0;
            }

            if (objsectionQuestionAnswer.ChosenAnswer == true) {
                if (objsectionQuestionAnswer.LabelText != 'None') {
                    objSection_Question.MulChosenAnswerID.push(objsectionQuestionAnswer.ID);
                    if (objsectionQuestionAnswer.Score) {
                        objSection_Question.SumofScores = objSection_Question.SumofScores + objsectionQuestionAnswer.Score;

                    }
                    for (var i = 0; i < objSection_Question.Intervention_Question_Answer.length; i++) {
                        if (objSection_Question.Intervention_Question_Answer[i].LabelText == 'None') {
                            objSection_Question.Intervention_Question_Answer[i].ChosenAnswer = false;
                            var chosenAnswerIndex = objSection_Question.MulChosenAnswerID.indexOf(objSection_Question.Intervention_Question_Answer[i].ID);
                            if (chosenAnswerIndex > -1) {

                                objSection_Question.MulChosenAnswerID.splice(chosenAnswerIndex, 1);
                            }
                        }
                    }

                }
                else {
                    objSection_Question.MulChosenAnswerID = [];
                    objSection_Question.MulChosenAnswerID.push(objsectionQuestionAnswer.ID);

                    objSection_Question.SumofScores = 0;
                    if (objsectionQuestionAnswer.Score) {
                        objSection_Question.SumofScores = objSection_Question.SumofScores + objsectionQuestionAnswer.Score;

                    }
                    for (var i = 0; i < objSection_Question.Intervention_Question_Answer.length; i++) {
                        if (objSection_Question.Intervention_Question_Answer[i].ID != objsectionQuestionAnswer.ID) {
                            objSection_Question.Intervention_Question_Answer[i].ChosenAnswer = false;
                        }
                    }
                }
            }
            else {
                var chosenAnswerIndex = objSection_Question.MulChosenAnswerID.indexOf(objsectionQuestionAnswer.ID);

                if (chosenAnswerIndex > -1) {

                    objSection_Question.MulChosenAnswerID.splice(chosenAnswerIndex, 1);
                    if (objsectionQuestionAnswer.Score) {
                        objSection_Question.SumofScores = objSection_Question.SumofScores - objsectionQuestionAnswer.Score;

                    }
                }
            }
        }
        vm.ShowChildQuestionQuestion = function (obj, val) {
            if (obj.childGroupNo != undefined) {
                var SumofScoresofAllQuestion = 0;

                for (var i = 0; i < val.objSection.Intervention_Question.length; i++) {
                    if (val.objSection.Intervention_Question[i].SetGroupNo == obj.childGroupNo) {
                        if (val.objSection.Intervention_Question[i].SumofScores != undefined && val.objSection.Intervention_Question[i].SumofScores > 0) {
                            SumofScoresofAllQuestion += val.objSection.Intervention_Question[i].SumofScores;

                        }
                    }
                }
            }

            if (SumofScoresofAllQuestion > 0) {
                return (obj.MinScore <= SumofScoresofAllQuestion && (obj.MaxScore >= SumofScoresofAllQuestion || obj.MaxScore == null));
            }
            else {
                return false;
            }

        }
        vm.SaveAssessmentData = function (objSection) {
            var lstResidents_Questions_Answers = [];

            for (var i = 0; i < objSection.QuestionIntervention.length; i++) {
                var objResidents_Questions_Answers = {};
                if (objSection.QuestionIntervention[i].ChosenAnswer != null || objSection.QuestionIntervention[i].LastQuestionInset == true) {
                    objResidents_Questions_Answers.ResidentId = vm.ResidentId;
                    if (objSection.QuestionIntervention[i].AnswerType == 'RadioButtonList') {
                        objResidents_Questions_Answers.Intervention_Question_AnswerID = objSection.QuestionIntervention[i].ChosenAnswer;
                    }
                    else if (objSection.QuestionIntervention[i].AnswerType == 'DropDownList') {
                        objResidents_Questions_Answers.Intervention_Question_AnswerID = objSection.QuestionIntervention[i].ChosenAnswer;
                    }
                    else if (objSection.QuestionIntervention[i].AnswerType == 'Yes/No') {
                        if (objSection.QuestionIntervention[i].ChosenAnswer)
                            objResidents_Questions_Answers.Intervention_Question_AnswerID = $filter('filter')(objSection.QuestionIntervention[i].Intervention_Question_Answer, { LabelText: 'Yes' })[0].ID;
                        else
                            objResidents_Questions_Answers.Intervention_Question_AnswerID = $filter('filter')(objSection.QuestionIntervention[i].Intervention_Question_Answer, { LabelText: 'No' })[0].ID;
                    }
                    else if (objSection.QuestionIntervention[i].AnswerType == 'FreeText') {
                        objResidents_Questions_Answers.Intervention_Question_AnswerID = objSection.QuestionIntervention[i].Intervention_Question_Answer[0].ID;
                        objResidents_Questions_Answers.AnswerText = objSection.QuestionIntervention[i].ChosenAnswer;
                    }
                    else if (objSection.QuestionIntervention[i].AnswerType == 'Number') {
                        objResidents_Questions_Answers.Intervention_Question_AnswerID = objSection.QuestionIntervention[i].Intervention_Question_Answer[0].ID;
                        objResidents_Questions_Answers.AnswerText = objSection.QuestionIntervention[i].ChosenAnswer;
                    }


                    lstResidents_Questions_Answers.push(objResidents_Questions_Answers);
                }

                if (objSection.QuestionIntervention[i].AnswerType == 'CheckBoxList') {
                    for (var k = 0; k < objSection.QuestionIntervention[i].MulChosenAnswerID.length; k++) {
                        var objchkResidents_Questions_Answers = {};
                        objchkResidents_Questions_Answers.ResidentId = vm.ResidentId;

                        objchkResidents_Questions_Answers.Intervention_Question_AnswerID = objSection.QuestionIntervention[i].MulChosenAnswerID[k];
                        if (objSection.QuestionIntervention[i].txtAreaAnswer) {
                            objchkResidents_Questions_Answers.AnswerText = objSection.QuestionIntervention[i].txtAreaAnswer;
                        }

                        lstResidents_Questions_Answers.push(objchkResidents_Questions_Answers);
                    }

                    if (objSection.QuestionIntervention[i].MulChosenAnswerID.length == 0) {
                        for (var k = 0; k < objSection.QuestionIntervention[i].Intervention_Question_Answer.length; k++) {
                            var objchkResidents_Questions_Answers = {};
                            objchkResidents_Questions_Answers.ResidentId = vm.ResidentId;
                            objchkResidents_Questions_Answers.Intervention_Question_AnswerID = objSection.QuestionIntervention[i].Intervention_Question_Answer[k].ID;
                            objchkResidents_Questions_Answers.AnswerText = "Deactive";


                            lstResidents_Questions_Answers.push(objchkResidents_Questions_Answers);
                        }
                    }
                }

                if (objSection.QuestionIntervention[i].AnswerType == 'FileUpload' && objSection.QuestionIntervention[i].ChosenAnswer) {

                    objResidents_Questions_Answers.Intervention_Question_AnswerID = $filter('filter')(objSection.QuestionIntervention[i].Intervention_Question_Answer, { LabelText: 'Choose Form' })[0].ID;
                    objResidents_Questions_Answers.FileData = objSection.QuestionIntervention[i].ChosenAnswer.file;

                }

                if (objSection.QuestionIntervention[i].MinScore != null) {

                    lstResidents_Questions_Answers = lstResidents_Questions_Answers.concat(GetSubQuestionQuestion(objSection.QuestionIntervention[i]));

                }
                else {
                    lstResidents_Questions_Answers = lstResidents_Questions_Answers.concat(GetSubQuestionAnswers(objSection.QuestionIntervention[i].Intervention_Question_Answer));
                }
            }


            UpdateAssessment(lstResidents_Questions_Answers);
        };

        var GetSubQuestionAnswers = function (answers) {
            var lst = [];

            for (var i = 0; i < answers.length; i++) {
                if (answers[i].childQuestion && answers[i].childQuestion.length > 0) {
                    for (var j = 0; j < answers[i].childQuestion.length; j++) {
                        var objResidents_Questions_Answers = {};
                        if (answers[i].childQuestion[j].ChosenAnswer != null && answers[i].childQuestion[j].ChosenAnswer != answers[i].childQuestion[j].OldChosenAnswer) {


                            objResidents_Questions_Answers.ResidentId = vm.ResidentId;
                            if (answers[i].childQuestion[j].AnswerType == 'RadioButtonList') {
                                objResidents_Questions_Answers.Intervention_Question_AnswerID = answers[i].childQuestion[j].ChosenAnswer;
                            }
                            else if (answers[i].childQuestion[j].AnswerType == 'DropDownList') {//newly added 4/19/2016
                                objResidents_Questions_Answers.Intervention_Question_AnswerID = answers[i].childQuestion[j].ChosenAnswer;
                            }
                            else if (answers[i].childQuestion[j].AnswerType == 'Yes/No') {
                                if (answers[i].childQuestion[j].ChosenAnswer)
                                    objResidents_Questions_Answers.Intervention_Question_AnswerID = $filter('filter')(answers[i].childQuestion[j].Intervention_Question_Answer, { LabelText: 'Yes' })[0].ID;
                                else
                                    objResidents_Questions_Answers.Intervention_Question_AnswerID = $filter('filter')(answers[i].childQuestion[j].Intervention_Question_Answer, { LabelText: 'No' })[0].ID;
                            }
                            else if (answers[i].childQuestion[j].AnswerType == 'FreeText') {
                                objResidents_Questions_Answers.Intervention_Question_AnswerID = answers[i].childQuestion[j].Intervention_Question_Answer[0].ID;
                                objResidents_Questions_Answers.AnswerText = answers[i].childQuestion[j].ChosenAnswer;
                            }
                            else if (answers[i].childQuestion[j].AnswerType == 'Number') {
                                objResidents_Questions_Answers.Intervention_Question_AnswerID = answers[i].childQuestion[j].Intervention_Question_Answer[0].ID;
                                objResidents_Questions_Answers.AnswerText = answers[i].childQuestion[j].ChosenAnswer;
                            }


                            lst.push(objResidents_Questions_Answers);
                        }

                        if (answers[i].childQuestion[j].AnswerType == 'CheckBoxList') {
                            if (answers[i].childQuestion[j].MulChosenAnswerID != undefined) {
                                for (var k = 0; k < answers[i].childQuestion[j].MulChosenAnswerID.length; k++) {
                                    var objchkResidents_Questions_Answers = {};
                                    objchkResidents_Questions_Answers.ResidentId = vm.ResidentId;

                                    objchkResidents_Questions_Answers.Intervention_Question_AnswerID = answers[i].childQuestion[j].MulChosenAnswerID[k];

                                    if (answers[i].childQuestion[j].txtAreaAnswer) {
                                        objchkResidents_Questions_Answers.AnswerText = answers[i].childQuestion[j].txtAreaAnswer;
                                    }
                                    lst.push(objchkResidents_Questions_Answers);
                                }
                            }
                        }

                        if (answers[i].childQuestion[j].AnswerType == 'FileUpload' && answers[i].childQuestion[j].ChosenAnswer) {

                            objResidents_Questions_Answers.Intervention_Question_AnswerID = $filter('filter')(answers[i].childQuestion[j].Intervention_Question_Answer, { LabelText: 'Choose Form' })[0].ID;
                            objResidents_Questions_Answers.FileData = answers[i].childQuestion[j].ChosenAnswer.file;
                        }

                        if (answers[i].childQuestion[j].MinScore != null) {

                            lst = lst.concat(GetSubQuestionQuestion(answers[i].childQuestion[j]));

                        }
                        else {
                            lst = lst.concat(GetSubQuestionAnswers(answers[i].childQuestion[j].Intervention_Question_Answer));
                        }
                    }
                }
            }
            return lst;
        };



        var GetSubQuestionQuestion = function (answers) {
            var lst = [];
            for (var j = 0; j < answers.childQuestion.length; j++) {
                var objResidents_Questions_Answers = {};
                if (answers.childQuestion[j].ChosenAnswer != null && answers.childQuestion[j].ChosenAnswer != answers.childQuestion[j].OldChosenAnswer) {
                    objResidents_Questions_Answers.ResidentId = vm.ResidentId;
                    if (answers.childQuestion[j].AnswerType == 'RadioButtonList') {
                        objResidents_Questions_Answers.Intervention_Question_AnswerID = answers.childQuestion[j].ChosenAnswer;
                    }
                    else if (answers.childQuestion[j].AnswerType == 'DropDownList') {
                        //newly added 4/19/2016
                        objResidents_Questions_Answers.Intervention_Question_AnswerID = answers.childQuestion[j].ChosenAnswer;
                    }
                    else if (answers.childQuestion[j].AnswerType == 'Yes/No') {
                        if (answers.childQuestion[j].ChosenAnswer)
                            objResidents_Questions_Answers.Intervention_Question_AnswerID = $filter('filter')(answers.childQuestion[j].Intervention_Question_Answer, { LabelText: 'Yes' })[0].ID;
                        else
                            objResidents_Questions_Answers.Intervention_Question_AnswerID = $filter('filter')(answers.childQuestion[j].Intervention_Question_Answer, { LabelText: 'No' })[0].ID;
                    }
                    else if (answers.childQuestion[j].AnswerType == 'FreeText') {
                        objResidents_Questions_Answers.Intervention_Question_AnswerID = answers.childQuestion[j].Intervention_Question_Answer[0].ID;
                        objResidents_Questions_Answers.AnswerText = answers.childQuestion[j].ChosenAnswer;
                    }
                    else if (answers.childQuestion[j].AnswerType == 'Number') {
                        objResidents_Questions_Answers.Intervention_Question_AnswerID = answers.childQuestion[j].Intervention_Question_Answer[0].ID;
                        objResidents_Questions_Answers.AnswerText = answers.childQuestion[j].ChosenAnswer;
                    }
                    lst.push(objResidents_Questions_Answers);
                }

                if (answers.childQuestion[j].AnswerType == 'CheckBoxList') {
                    if (answers.childQuestion[j].MulChosenAnswerID != undefined) {
                        for (var k = 0; k < answers.childQuestion[j].MulChosenAnswerID.length; k++) {
                            var objchkResidents_Questions_Answers = {};
                            objchkResidents_Questions_Answers.ResidentId = vm.ResidentId;

                            objchkResidents_Questions_Answers.Intervention_Question_AnswerID = answers.childQuestion[j].MulChosenAnswerID[k];

                            if (answers.childQuestion[j].txtAreaAnswer) {
                                objchkResidents_Questions_Answers.AnswerText = answers.childQuestion[j].txtAreaAnswer;
                            }
                            lst.push(objchkResidents_Questions_Answers);
                        }
                    }
                }

                if (answers.childQuestion[j].AnswerType == 'FileUpload' && answers.childQuestion[j].ChosenAnswer) {

                    objResidents_Questions_Answers.Intervention_Question_AnswerID = $filter('filter')(answers.childQuestion[j].Intervention_Question_Answer, { LabelText: 'Choose Form' })[0].ID;
                    objResidents_Questions_Answers.FileData = answers.childQuestion[j].ChosenAnswer.file;
                }
                if (answers.childQuestion[j].MinScore != null) {
                    lst = lst.concat(GetSubQuestionQuestion(answers.childQuestion[j]));
                }
                else {
                    lst = lst.concat(GetSubQuestionAnswers(answers.childQuestion[j].Intervention_Question_Answer));
                }
            }
            return lst;
        };

        var UpdateAssessment = function (lstResidents_Questions_Answers) {
            ResidentsService.UpdateInterventionAssessmentData(vm.ResidentId, lstResidents_Questions_Answers).then(
               function (response) {
                   toastr.success('Intervention Assessment updated successfully.');
               },
               function (err) {
                   toastr.error('An error occurred while updating assessment data.');
               }
           );
        };
        //End
        var UploadPhoto = function () {
            var deferred = $q.defer();
            var file = vm.ResidentImage.file;
            if (file == undefined) {
                deferred.reject('Please attach an image.');
            }
            else {
                ResidentsService.UploadPhoto(file, vm.ResidentId).success(
                    function (response) {
                        deferred.resolve();
                    },
                    function (err) {
                        deferred.reject('An error occured while uploading the attachment.');
                    }
                );
            }
            return deferred.promise;
        };
        var GetAssessmentAnswers = function () {
            ResidentsService.getInterventionAssessmentData(vm.ResidentId).then(
                function (response) {
                    var lstAssessmentData = response.data;

                    for (var i = 0; i < vm.Sections.length; i++) {
                        for (var j = 0; j < vm.Sections[i].Intervention_Question.length; j++) {
                            vm.Sections[i].Intervention_Question[j].ChosenAnswer = null;
                            vm.Sections[i].Intervention_Question[j].OldChosenAnswer = null;
                            if (!vm.Sections[i].Intervention_Question[j].MulChosenAnswerID)
                                vm.Sections[i].Intervention_Question[j].MulChosenAnswerID = [];

                            //Changes on  4/11/2016
                            if (!vm.Sections[i].Intervention_Question[j].SumofScores)
                                vm.Sections[i].Intervention_Question[j].SumofScores = 0;

                            //newly added on 4/18/2016
                            var lstQueswthnoAnswer = 0;
                            for (var k = 0; k < lstAssessmentData.length; k++) {
                                if (vm.Sections[i].Intervention_Question[j].ID == lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_Answer.Intervention_QuestionID) {
                                    lstQueswthnoAnswer++;
                                    vm.Sections[i].Intervention_Question[j].ChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID;
                                    if (vm.Sections[i].Intervention_Question[j].AnswerType == 'RadioButtonList') {
                                        vm.Sections[i].Intervention_Question[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID;
                                        vm.Sections[i].Intervention_Question[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID;
                                        //newly added 4/15/2016
                                        vm.Sections[i].Intervention_Question[j].SumofScores = $filter('filter')(vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID })[0].Score;

                                    }
                                    else if (vm.Sections[i].Intervention_Question[j].AnswerType == 'DropDownList') {
                                        //newly added on 4/19/2016
                                        vm.Sections[i].Intervention_Question[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID;
                                        vm.Sections[i].Intervention_Question[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID;

                                    }
                                    else if (vm.Sections[i].Intervention_Question[j].AnswerType == 'Yes/No') {
                                        var labelText = $filter('filter')(vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID })[0].LabelText;
                                        vm.Sections[i].Intervention_Question[j].ChosenAnswer = labelText == 'Yes' ? true : false;
                                        vm.Sections[i].Intervention_Question[j].OldChosenAnswer = labelText == 'Yes' ? true : false;

                                    }
                                    else if (vm.Sections[i].Intervention_Question[j].AnswerType == 'FreeText') {
                                        vm.Sections[i].Intervention_Question[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                        vm.Sections[i].Intervention_Question[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;

                                    }
                                    else if (vm.Sections[i].Intervention_Question[j].AnswerType == 'Number') {
                                        vm.Sections[i].Intervention_Question[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                        vm.Sections[i].Intervention_Question[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;

                                    }
                                    else if (vm.Sections[i].Intervention_Question[j].AnswerType == 'FileUpload') {
                                        vm.Sections[i].Intervention_Question[j].ChosenFilePath = lstAssessmentData[k].ResidentFile;
                                        if (lstAssessmentData[k].ResidentFile) {
                                            var filename = lstAssessmentData[k].ResidentFile.split('/');
                                            vm.Sections[i].Intervention_Question[j].ChosenFileName = filename[5];
                                        }
                                    }
                                    else if (vm.Sections[i].Intervention_Question[j].AnswerType == 'CheckBoxList') {
                                        vm.Sections[i].Intervention_Question[j].ChosenAnswerID = null;
                                        for (var p = 0; p < vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer.length; p++) {

                                            if (vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer[p].LabelText) {
                                                if (vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer[p].LabelText.includes("ResidentName")) {
                                                    var ResidentName = vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer[p].LabelText.replace("ResidentName", vm.Resident.FirstName + " " + vm.Resident.LastName);
                                                    vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer[p].LabelText = ResidentName;

                                                }
                                            }
                                            if (vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer[p].ID == lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID) {

                                                vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer[p].ChosenAnswer = true;
                                                if (lstAssessmentData[k].ResidentQuestionAnswer.AnswerText) {
                                                    vm.Sections[i].Intervention_Question[j].txtAreaAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                                }
                                                vm.Sections[i].Intervention_Question[j].MulChosenAnswerID.push(lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID);
                                                //Chnaged on 4/11/2016
                                                vm.Sections[i].Intervention_Question[j].SumofScores += vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer[p].Score;
                                            }
                                        }
                                    }

                                    //newlyaddedd
                                    if (vm.Sections[i].Intervention_Question[j].MinScore != null) {
                                        EditSubQuestionQuestion(vm.Sections[i].Intervention_Question[j], lstAssessmentData);
                                    }
                                    else {
                                        EditSubQuestion(vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer, lstAssessmentData);
                                    }
                                }
                            }

                            if (lstQueswthnoAnswer == 0 && vm.Sections[i].Intervention_Question[j].LastQuestionInset == true) {
                                if (vm.Sections[i].Intervention_Question[j].MinScore != null) {
                                    EditSubQuestionQuestion(vm.Sections[i].Intervention_Question[j], lstAssessmentData);
                                }
                                else {
                                    EditSubQuestion(vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer, lstAssessmentData);
                                }
                            }
                        }
                    }
                },
                function (err) {
                    toastr.error('An error occurred while retrieving assessment answers.');
                }
            );
        };

        var EditSubQuestion = function (answers, lstAssessmentData) {
            for (var i = 0; i < answers.length; i++) {

                if (answers[i].childQuestion != undefined) {
                    for (var j = 0; j < answers[i].childQuestion.length; j++) {
                        answers[i].childQuestion[j].ChosenAnswer = null;
                        answers[i].childQuestion[j].OldChosenAnswer = null;
                        if (!answers[i].childQuestion[j].MulChosenAnswerID)
                            answers[i].childQuestion[j].MulChosenAnswerID = [];
                        if (!answers[i].childQuestion[j].SumofScores)
                            answers[i].childQuestion[j].SumofScores = 0;

                        //newly added on 4/18/2016
                        var lstQueswthnoAnswer = 0;
                        for (var k = 0; k < lstAssessmentData.length; k++) {
                            if (answers[i].childQuestion[j].ID == lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_Answer.Intervention_QuestionID) {
                                lstQueswthnoAnswer++;
                                answers[i].childQuestion[j].ChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID;
                                if (answers[i].childQuestion[j].AnswerType == 'RadioButtonList') {
                                    answers[i].childQuestion[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID;
                                    answers[i].childQuestion[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID;

                                }
                                else if (answers[i].childQuestion[j].AnswerType == 'DropDownList') {
                                    //newly added 4/19/2016
                                    answers[i].childQuestion[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID;
                                    answers[i].childQuestion[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID;
                                }
                                else if (answers[i].childQuestion[j].AnswerType == 'Yes/No') {
                                    var labelText = $filter('filter')(answers[i].childQuestion[j].Intervention_Question_Answer, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID })[0].LabelText;
                                    answers[i].childQuestion[j].ChosenAnswer = labelText == 'Yes' ? true : false;
                                    answers[i].childQuestion[j].OldChosenAnswer = labelText == 'Yes' ? true : false;

                                }
                                else if (answers[i].childQuestion[j].AnswerType == 'FreeText') {
                                    answers[i].childQuestion[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                    answers[i].childQuestion[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;

                                }
                                else if (answers[i].childQuestion[j].AnswerType == 'Number') {
                                    answers[i].childQuestion[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                    answers[i].childQuestion[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;

                                }
                                else if (answers[i].childQuestion[j].AnswerType == 'FileUpload') {
                                    answers[i].childQuestion[j].ChosenFilePath = lstAssessmentData[k].ResidentFile;

                                    if (lstAssessmentData[k].ResidentFile) {
                                        var filename = lstAssessmentData[k].ResidentFile.split('/');
                                        answers[i].childQuestion[j].ChosenFileName = filename[5];
                                    }
                                }

                                else if (answers[i].childQuestion[j].AnswerType == 'CheckBoxList') {
                                    answers[i].childQuestion[j].ChosenAnswerID = null;
                                    // var sumscores1=0
                                    for (var p = 0; p < answers[i].childQuestion[j].Intervention_Question_Answer.length; p++) {


                                        if (answers[i].Intervention_Question[j].Intervention_Question_Answer[p].LabelText) {
                                            if (answers[i].Intervention_Question[j].Intervention_Question_Answer[p].LabelText.includes("ResidentName")) {

                                                var residentFullName = answers[i].Intervention_Question[j].Intervention_Question_Answer[p].LabelText.replace("ResidentName", vm.Resident.FirstName + " " + vm.Resident.LastName);
                                                answers[i].Intervention_Question[j].Intervention_Question_Answer[p].LabelText = residentFullName;
                                            }
                                        }
                                        if (answers[i].childQuestion[j].Intervention_Question_Answer[p].ID == lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID) {

                                            answers[i].childQuestion[j].Intervention_Question_Answer[p].ChosenAnswer = true;
                                            if (lstAssessmentData[k].ResidentQuestionAnswer.AnswerText) {
                                                answers[i].childQuestion[j].txtAreaAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                            }
                                            answers[i].childQuestion[j].MulChosenAnswerID.push(lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID);
                                            answers[i].childQuestion[j].SumofScores += answers[i].childQuestion[j].Intervention_Question_Answer.Score;
                                        }
                                    }
                                }
                                EditSubQuestion(answers[i].childQuestion[j].Intervention_Question_Answer, lstAssessmentData);
                            }
                        }
                        //newly added 4/18/2016
                        if (lstQueswthnoAnswer == 0 && answers[i].childQuestion[j].LastQuestionInset == true) {

                            EditSubQuestion(answers[i].childQuestion[j].Intervention_Question_Answer, lstAssessmentData);
                        }

                    }
                }
            }

            return true
        }

        //newly Added Start 4/5/2016 11:55 am

        var EditSubQuestionQuestion = function (answers, lstAssessmentData) {
            for (var j = 0; j < answers.childQuestion.length; j++) {
                answers.childQuestion[j].ChosenAnswer = null;
                answers.childQuestion[j].OldChosenAnswer = null;
                if (!answers.childQuestion[j].MulChosenAnswerID)
                    answers.childQuestion[j].MulChosenAnswerID = [];

                if (!answers.childQuestion[j].SumofScores)
                    answers.childQuestion[j].SumofScores = 0;

                //newly added on 4/18/2016
                var lstQueswthnoAnswer = 0;
                for (var k = 0; k < lstAssessmentData.length; k++) {
                    if (answers.childQuestion[j].ID == lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_Answer.Intervention_QuestionID) {
                        lstQueswthnoAnswer++;
                        answers.childQuestion[j].ChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID;
                        if (answers.childQuestion[j].AnswerType == 'RadioButtonList') {
                            answers.childQuestion[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID;
                            answers.childQuestion[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID;

                        }
                        else if (answers.childQuestion[j].AnswerType == 'DropDownList') {
                            //4/19/2016
                            answers.childQuestion[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID;
                            answers.childQuestion[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID;

                        }
                        else if (answers.childQuestion[j].AnswerType == 'Yes/No') {
                            var labelText = $filter('filter')(answers.childQuestion[j].Intervention_Question_Answer, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID })[0].LabelText;
                            answers.childQuestion[j].ChosenAnswer = labelText == 'Yes' ? true : false;
                            answers.childQuestion[j].OldChosenAnswer = labelText == 'Yes' ? true : false;

                        }
                        else if (answers.childQuestion[j].AnswerType == 'FreeText') {
                            answers.childQuestion[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                            answers.childQuestion[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;

                        }
                        else if (answers.childQuestion[j].AnswerType == 'Number') {
                            answers.childQuestion[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                            answers.childQuestion[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;

                        }
                        else if (answers.childQuestion[j].AnswerType == 'FileUpload') {
                            answers.childQuestion[j].ChosenFilePath = lstAssessmentData[k].ResidentFile;
                            if (lstAssessmentData[k].ResidentFile) {
                                var filename = lstAssessmentData[k].ResidentFile.split('/');
                                answers.childQuestion[j].ChosenFileName = filename[5];
                            }

                        }

                        else if (answers.childQuestion[j].AnswerType == 'CheckBoxList') {
                            answers.childQuestion[j].ChosenAnswerID = null;
                            var sumscores = 0
                            for (var p = 0; p < answers.childQuestion[j].Intervention_Question_Answer.length; p++) {
                                if (answers.Intervention_Question[j].Intervention_Question_Answer[p].LabelText) {

                                    if (answers.Intervention_Question[j].Intervention_Question_Answer[p].LabelText.includes("ResidentName")) {

                                        var residentFullName = answers.Intervention_Question[j].Intervention_Question_Answer[p].LabelText.replace("ResidentName", vm.Resident.FirstName + " " + vm.Resident.LastName);
                                        answers.Intervention_Question[j].Intervention_Question_Answer[p].LabelText = residentFullName;
                                    }
                                }
                                if (answers.childQuestion[j].Intervention_Question_Answer[p].ID == lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID) {

                                    answers.childQuestion[j].Intervention_Question_Answer[p].ChosenAnswer = true;
                                    if (lstAssessmentData[k].ResidentQuestionAnswer.AnswerText) {
                                        answers.childQuestion[j].txtAreaAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                    }
                                    answers.childQuestion[j].MulChosenAnswerID.push(lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID);
                                    answers.childQuestion[j].SumofScores += answers.childQuestion[j].Intervention_Question_Answer.Score;
                                }
                            }

                            if (sumscores > 0)
                                vm.copySumofScore = sumscores;
                        }
                        if (answers.childQuestion[j].MinScore != null) {
                            EditSubQuestionQuestion(answers.childQuestion[j], lstAssessmentData);
                        }
                        else {
                            EditSubQuestion(answers.childQuestion[j].Intervention_Question_Answer, lstAssessmentData);
                        }
                    }

                }
                //newly added 4/18/2016
                if (lstQueswthnoAnswer == 0 && answers.childQuestion[j].LastQuestionInset == true) {
                    if (answers.childQuestion[j].MinScore != null) {
                        EditSubQuestionQuestion(answers.childQuestion[j], lstAssessmentData);
                    }
                    else {
                        EditSubQuestion(answers.childQuestion[j].Intervention_Question_Answer, lstAssessmentData);
                    }
                }

            }
            return true
        }

        vm.BindSectionQuestion = function (objSectionQuestion, depth) {
            var strChevrons = '';
            for (var i = 0; i <= depth; i++) {
                strChevrons += "<i class='fa fa-chevron-right'></i>";
            }
            var ResidentFullName = vm.Resident.FirstName + " " + vm.Resident.LastName;
            var res = objSectionQuestion.replace("ResidentName", ResidentFullName);
            return $sce.trustAsHtml(strChevrons + res);
        }

        vm.ChangeResident = function (objAnswer) {
            var ResidentFullName = vm.Resident.FirstName + " " + vm.Resident.LastName;
            var res = objAnswer.replace("ResidentName", ResidentFullName);
            return res;
        }

    }

}());