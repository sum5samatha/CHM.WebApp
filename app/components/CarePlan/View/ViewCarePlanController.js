(function () {
    "use strict";

    angular.module('CHM').controller('ViewCarePlanController', ViewCarePlanController);

    ViewCarePlanController.$inject = ['$rootScope', '$q', '$uibModal', '$window', '$filter', '$stateParams', '$sce', 'toastr', 'ResidentsService', 'InterventionsService'];

    function ViewCarePlanController($rootScope, $q, $uibModal, $window, $filter, $stateParams,$sce, toastr, ResidentsService, InterventionsService) {
        var vm = this;

        vm.ResidentId = $stateParams.ResidentId;
        vm.Resident = {};
        vm.CarePlan = [];
        var oldRecurrencePattern = {};

        if (!vm.ResidentId) {

        }


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


        var SetRecurrencePattern = function (objCarePlan) {
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

        var SetRecurrenceRange = function (objCarePlan) {
            objCarePlan.Recurrence.NoOfOccurrences = 10;
            objCarePlan.Recurrence.RecurrenceStartDate = new Date(moment());//.format($rootScope.DateFormatForMoment);
            objCarePlan.Recurrence.RecurrenceEndDate = new Date(moment().add(10, 'day'));//.format($rootScope.DateFormatForMoment);
        };

        var GetDateForWeekDay = function (desiredDay, occurrence, month, year) {

            var dt = moment(new Date(year, month, 1));
            var j = 0;
            if (desiredDay - dt.day() >= 0)
                j = desiredDay - dt.day() + 1;
            else
                j = 7 - dt.day() + desiredDay + 1;

            var date = j + (occurrence - 1) * 7;
            if (!isValidDate(date, month, year))
                date = j + (occurrence - 2) * 7;;

            return date;

        }

        var isValidDate = function (date, month, year) {
            var d = new Date(year, month, date);
            return d && d.getMonth() == month && d.getDate() == date;
        }

        vm.ToggleWeekDaySelection = function (objCarePlan, weekDay) {
            var idx = objCarePlan.Recurrence.SelectedWeekDays.indexOf(weekDay);

            // is currently selected
            if (idx > -1) {
                objCarePlan.Recurrence.SelectedWeekDays.splice(idx, 1);
                objCarePlan.Recurrence.SelectedWeekDayTimings.splice(idx, 1);
            }
            else {
                objCarePlan.Recurrence.SelectedWeekDays.push(weekDay);
                objCarePlan.Recurrence.SelectedWeekDayTimings.push([{ StartTime: new Date(), EndTime: new Date() }]);
            }

        };

        vm.OpenRecurrencePattern = function (objCarePlan) {
            oldRecurrencePattern = angular.copy(objCarePlan.Recurrence);
            objCarePlan.IsRecurrencePatternShown = true;
        };

        vm.CloseRecurrencePattern = function (objCarePlan) {
            objCarePlan.IsRecurrencePatternShown = false;
            objCarePlan.Recurrence = angular.copy(oldRecurrencePattern);
            oldRecurrencePattern = {};
        };

        vm.SaveRecurrencePattern = function (objCarePlan) {
            objCarePlan.IsRecurrencePatternShown = false;
            oldRecurrencePattern = {};
        };

        vm.AddTiming = function (objCarePlan) {
            var objTiming = { StartTime: new Date(), EndTime: new Date() };
            objCarePlan.Recurrence.Timings.push(objTiming);
        };

        vm.RemoveTiming = function (objCarePlan, $index) {
            objCarePlan.Recurrence.Timings.splice($index, 1);
        }

        vm.AddWeekDayTiming = function (objWeekDayTimings) {
            var objTiming = { StartTime: new Date(), EndTime: new Date() };
            objWeekDayTimings.push(objTiming);
        };

        vm.RemoveWeekDayTiming = function (objWeekDayTimings, $index) {
            objWeekDayTimings.splice($index, 1);
        }

        vm.OpenRecurrenceStartDate = function (objCarePlan, $event) {
            $event.preventDefault();
            $event.stopPropagation();
            objCarePlan.Recurrence.RecurrenceStartDateOpened = true;
        }
        vm.OpenRecurrenceEndDate = function (objCarePlan, $event) {
            $event.preventDefault();
            $event.stopPropagation();
            objCarePlan.Recurrence.RecurrenceEndDateOpened = true;
        }

        //End - Recurrence Pattern



        ResidentsService.GetPersonalInformation(vm.ResidentId).then(
            function (response) {
                vm.Resident = response.data.Resident;
            },
            function (err) {
                toastr.error('An error occurred while retrieving resident information.');
            }
        );

        //code for view mode in care plan start


         ResidentsService.InterventionQuestionParentQuestion().then(
         function (response) {
         vm.QuestionParentQuestion = response.data;        
         vm.CopyQuestionParentQuestion = vm.QuestionParentQuestion;
         GetAllActiveSection();
     },
          function (err) {
           toastr.error('An error occurred while retrieving QuestionParentQuestion.');
         })

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
                  vm.InterventionCarePlan.push(objCarePlan);

                  //  vm.CarePlan.push(objCarePlan);

              }



          }, function (err) {
              toastr.error('An error occurred while retrieving assessment answers.');
          })


         }

         InterventionForInterventionQuestion();

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

         var BindCarePaln=function(obj)
        {
            for (var i = 0; i < obj.length; i++) {

                for (var M = 0; M < obj[i].Intervention_Question_Answer.length; M++) {
                    obj[i].Intervention_Question_Answer[M].CarePlan = [];
                    for (var z = 0; z < vm.InterventionCarePlan.length; z++) {
                        if(obj[i].Intervention_Question_Answer[M].ID==vm.InterventionCarePlan[z].AnswerID)
                        {
                            obj[i].Intervention_Question_Answer[M].CarePlan.push(vm.InterventionCarePlan[z]);
                        }
                    }
                    BindCarePaln(obj[i].Intervention_Question_Answer[M].childQuestion);

                }
            }
        }

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


                                 //console.log('step4 complete');
                                 //console.log(vm.AllSetQuestion);

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







                     // vm.CarePlan = [];
                     for (var i = 0; i < vm.Sections.length; i++) {


                         var objCarePlan = {};
                         objCarePlan.Id = vm.Sections[i].ID;
                         objCarePlan.TaskTitle = vm.Sections[i].InterventionTitle;
                         objCarePlan.Section_Question_Answer_TaskID = vm.Sections[i].ID;
                         objCarePlan.QuestionIntervention = vm.Sections[i].Intervention_Question;
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
                    // console.log(vm.SectionCareplan);
                 }
             },
             function (err) {
                 toastr.error('An error occurred while retrieving task titles.');
             }
         );
         }

         var GetAssessmentAnswers = function () {
             ResidentsService.getInterventionAssessmentData(vm.ResidentId).then(
               function (response) {
                  
                     var lstAssessmentData = response.data;

                     for (var i = 0; i < vm.Sections.length; i++) {
                         for (var j = 0; j < vm.Sections[i].Intervention_Question.length; j++) {
                             vm.Sections[i].Intervention_Question[j].AnswerText = '-';

                            
                             if (!vm.Sections[i].Intervention_Question[j].MulChosenAnswerID)
                                 vm.Sections[i].Intervention_Question[j].MulChosenAnswerID = [];


                             if (!vm.Sections[i].Intervention_Question[j].SumofScores)
                                 vm.Sections[i].Intervention_Question[j].SumofScores = 0;
                            


                             if (vm.Sections[i].Intervention_Question[j].AnswerType == 'CheckBoxList') {
                                
                                 vm.Sections[i].Intervention_Question[j].ChosenAnswerID = null;
                                 for (var m = 0; m < lstAssessmentData.length; m++) {

                                     if (vm.Sections[i].Intervention_Question[j].ID == lstAssessmentData[m].ResidentQuestionAnswer.Intervention_Question_Answer.Intervention_QuestionID) {

                                         var checkboxAnsTxt = $filter('filter')(vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer, { ID: lstAssessmentData[m].ResidentQuestionAnswer.Intervention_Question_AnswerID })[0].LabelText;
                                         if (checkboxAnsTxt.toUpperCase() == 'OTHER'||checkboxAnsTxt.toUpperCase() == 'OTHERS') {
                                             checkboxAnsTxt = lstAssessmentData[m].ResidentQuestionAnswer.AnswerText;
                                         }
                                         //else {
                                         //    if (lstAssessmentData[m].ResidentQuestionAnswer.AnswerText != null)
                                         //        checkboxAnsTxt += ',' + lstAssessmentData[m].ResidentQuestionAnswer.AnswerText;
                                         //}


                                         vm.Sections[i].Intervention_Question[j].AnswerText += checkboxAnsTxt + ",";
                                         vm.Sections[i].Intervention_Question[j].MulChosenAnswerID.push(lstAssessmentData[m].ResidentQuestionAnswer.Intervention_Question_AnswerID);
                                         vm.Sections[i].Intervention_Question[j].SumofScores += $filter('filter')(vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer, { ID: lstAssessmentData[m].ResidentQuestionAnswer.Intervention_Question_AnswerID })[0].Score;
                                         if (vm.Sections[i].Intervention_Question[j].Question == "Falls") {
                                             if (lstAssessmentData[m].ResidentQuestionAnswer.AnswerText != null) {
                                                 vm.Sections[i].Intervention_Question[j].SumofScores += parseInt(lstAssessmentData[m].ResidentQuestionAnswer.AnswerText) * 5;

                                             }
                                         }

                                     }
                                 }
                                 if (vm.Sections[i].Intervention_Question[j].MinScore == null)
                                     ViewSubQuestionsAndAnswers(vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer, lstAssessmentData, vm.Sections[i].Intervention_Question[j].AnswerText);
                                 else
                                     ViewSubQuestionsAndAnswers(vm.Sections[i].Intervention_Question, lstAssessmentData, vm.Sections[i].Intervention_Question[j].AnswerText);
                             }
                             else {
                                 for (var k = 0; k < lstAssessmentData.length; k++) {
                                     if (vm.Sections[i].Intervention_Question[j].ID == lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_Answer.Intervention_QuestionID) {
                                         vm.Sections[i].Intervention_Question[j].ChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID;
                                         vm.Sections[i].Intervention_Question[j].AnswerText = $filter('filter')(vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID })[0].LabelText;
                                         if (lstAssessmentData[k].ResidentQuestionAnswer.AnswerText != null) {
                                             vm.Sections[i].Intervention_Question[j].AnswerText = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                         }

                                         if (vm.Sections[i].Intervention_Question[j].AnswerType == 'RadioButtonList') {
                                             vm.Sections[i].Intervention_Question[j].SumofScores = $filter('filter')(vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID })[0].Score;
                                         }

                                         if (lstAssessmentData[k].ResidentFile != null) {
                                             vm.Sections[i].Intervention_Question[j].ChosenAnswer = lstAssessmentData[k].ResidentFile;
                                             var filename = lstAssessmentData[k].ResidentFile.split('/');
                                             vm.Sections[i].Intervention_Question[j].AnswerText = filename[5];
                                         }
                                         if (vm.Sections[i].Intervention_Question[j].MinScore == null)
                                             ViewSubQuestionsAndAnswers(vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer, lstAssessmentData, vm.Sections[i].Intervention_Question[j].AnswerText);
                                         else
                                             ViewSubQuestionsAndAnswers(vm.Sections[i].Intervention_Question, lstAssessmentData, vm.Sections[i].Intervention_Question[j].AnswerText);


                                     }



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



         var ViewSubQuestionsAndAnswers = function (answers, lstAssessmentData, AnswerText) {


             for (var i = 0; i < answers.length; i++) {
                 for (var j = 0; j < answers[i].childQuestion.length; j++) {
                     if (!answers[i].childQuestion[j].MulChosenAnswerID)
                         answers[i].childQuestion[j].MulChosenAnswerID = [];
                     if (!answers[i].childQuestion[j].SumofScores)
                         answers[i].childQuestion[j].SumofScores = 0;

                     if (AnswerText != '-')
                         answers[i].childQuestion[j].AnswerText = '-';
                     else
                         answers[i].childQuestion[j].AnswerText = false;
                     for (var k = 0; k < lstAssessmentData.length; k++) {

                         if (answers[i].childQuestion[j].AnswerType == 'CheckBoxList') {
                          
                             answers[i].childQuestion[j].ChosenAnswerID = null;
                             if (answers[i].childQuestion[j].ID == lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_Answer.Intervention_QuestionID) {

                                 if (answers[i].childQuestion[j].AnswerText == '-') {
                                     answers[i].childQuestion[j].AnswerText = " ";
                                 }
                                 var checkboxAnsTxt = $filter('filter')(answers[i].childQuestion[j].Intervention_Question_Answer, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID })[0].LabelText;
                                 if (checkboxAnsTxt.toUpperCase() == 'OTHER' || checkboxAnsTxt.toUpperCase() == 'OTHERS') {
                                     checkboxAnsTxt = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                 }
                                 //else {
                                 //    if (lstAssessmentData[k].ResidentQuestionAnswer.AnswerText != null)
                                 //        checkboxAnsTxt += ',' + lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                 //}

                                 answers[i].childQuestion[j].AnswerText += checkboxAnsTxt + ",";
                                 answers[i].childQuestion[j].MulChosenAnswerID.push(lstAssessmentData[k].ResidentQuestionAnswer.Intervention_QuestionID);
                                 answers[i].childQuestion[j].SumofScores += answers[i].childQuestion[j].Intervention_Question_Answer.Score;

                             }

                             if (answers[i].childQuestion[j].MinScore == null) {
                                 ViewSubQuestionsAndAnswers(answers[i].childQuestion[j].Intervention_Question_Answer, lstAssessmentData, answers[i].childQuestion[j].AnswerText);
                             }
                             else {
                                 //ViewSubchildQuestionAndAnswers(answers[i].childQuestion[j], lstAssessmentData, answers[i].childQuestion[j].AnswerText);
                                 ViewSubQuestionsAndAnswers(answers[i].childQuestion, lstAssessmentData, answers[i].childQuestion[j].AnswerText);
                             }
                         }
                         else {
                             if (answers[i].childQuestion[j].ID == lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_Answer.Intervention_QuestionID) {
                                 answers[i].childQuestion[j].AnswerText = $filter('filter')(answers[i].childQuestion[j].Intervention_Question_Answer, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID })[0].LabelText;
                                 answers[i].childQuestion[j].ChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID;
                                 if (lstAssessmentData[k].ResidentQuestionAnswer.AnswerText != null) {
                                     answers[i].childQuestion[j].AnswerText = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                 }


                                 if (answers[i].childQuestion[j].AnswerType == 'RadioButtonList') {
                                     answers[i].childQuestion[j].SumofScores = $filter('filter')(answers[i].childQuestion[j].Intervention_Question_Answer, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID })[0].Score;
                                 }

                                 if (lstAssessmentData[k].ResidentFile != null) {
                                     answers[i].childQuestion[j].ChosenAnswer = lstAssessmentData[k].ResidentFile;
                                     var filename = lstAssessmentData[k].ResidentFile.split('/');
                                     answers[i].childQuestion[j].AnswerText = filename[5];
                                 }

                                 if (answers[i].childQuestion[j].MinScore == null) {
                                     ViewSubQuestionsAndAnswers(answers[i].childQuestion[j].Intervention_Question_Answer, lstAssessmentData, answers[i].childQuestion[j].AnswerText);
                                 }
                                 else {
                                     //ViewSubchildQuestionAndAnswers(answers[i].childQuestion[j], lstAssessmentData, answers[i].childQuestion[j].AnswerText);
                                     ViewSubQuestionsAndAnswers(answers[i].childQuestion, lstAssessmentData, answers[i].childQuestion[j].AnswerText);
                                 }


                             }
                         }

                     }
                 }

             }
         }
        //End








        //var uniquevalfirst = function (arr) {
        //    var newarr = [];
        //    var unique = {};
        //    arr.forEach(function (item, index) {
        //        if (!unique[item.ID]) {
        //            newarr.push(item);
        //            unique[item.ID] = item;
        //        }
        //    });

        //    return newarr;

        //}

        //var GetAssessmentSummary = function () {
        //    ResidentsService.getAssessmentSummaryOnScores(vm.ResidentId).then(
        //    function (response) {
        //        vm.SectionIDs = uniquevalfirst(response.data.SectionInterventionSection);
        //        var GroupSection = [];
        //        for (var m = 0; m < vm.SectionIDs.length; m++) {
        //            var arrsection = { sectionID: "",sectionName:"", sectionIntervention: [] };
        //            for (var z = 0; z < response.data.SectionInterventionSection.length; z++) {
        //                if(vm.SectionIDs[m].ID==response.data.SectionInterventionSection[z].ID)
        //                {
        //                    arrsection.sectionID = vm.SectionIDs[m].ID;
        //                    arrsection.sectionName=response.data.SectionInterventionSection[z].sectionName;
        //                    arrsection.sectionIntervention.push(response.data.SectionInterventionSection[z].section_InterventionID);
        //                }
        //            }
        //            GroupSection.push(arrsection);
        //        }
              
        //        //code Start



        //        //code End
             
        //        vm.CarePlan = [];
        //        for (var i = 0; i < response.data.SectionInterventionResponse.length; i++) {


        //            var objCarePlan = {};
        //            objCarePlan.Id=response.data.SectionInterventionResponse[i].ID;
        //            objCarePlan.TaskTitle = response.data.SectionInterventionResponse[i].InterventionTitle;
        //            // objCarePlan.Resident_Question_AnswerID = response.data[i].ID;
        //            objCarePlan.IsRecurrencePatternShown = false;
        //            SetRecurrencePattern(objCarePlan);
        //            SetRecurrenceRange(objCarePlan);
        //            vm.CarePlan.push(objCarePlan);



        //        }

        //        vm.SectionCareplan = [];
        //        if(vm.CarePlan.length>0)
        //        {
                   
        //            for (var i = 0; i < GroupSection.length; i++) {
        //                var arrsection = { sectionName: "", careplan: [] };
        //                arrsection.sectionName = GroupSection[i].sectionName;
        //                for (var m = 0; m < GroupSection[i].sectionIntervention.length; m++) {

        //                    for (var j = 0; j < vm.CarePlan.length; j++) {
        //                        if (GroupSection[i].sectionIntervention[m] == vm.CarePlan[j].Id) {
        //                            arrsection.careplan.push(vm.CarePlan[j]);
        //                        }

        //                    }

        //                }
                       
                        
        //               // vm.SectionCareplan.push(arrsection);
        //            }
                    
        //        }
        //        console.log(vm.SectionCareplan);
        //    },
        //    function (err) {
        //        toastr.error('An error occurred while retrieving task titles.');
        //    }
        //);
        //}

      //  GetAssessmentSummary();

       

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
            else {
                var parentQuestionId = [];

                for (var k = 0; k < vm.AllQuestionParentQuestion.length; k++) {
                    if (vm.AllQuestionParentQuestion[k].QuestionID == obj.ID) {
                        parentQuestionId.push(vm.AllQuestionParentQuestion[k].QuestionID);
                    }
                }
                if (obj.AnswerText == undefined) {
                    return false;
                }
                else {
                    if (obj.AnswerText != '-')
                        return true;
                    else
                        return false;
                }

            }
            if (SumofScoresofAllQuestion > 0) {
                return (obj.MinScore <= SumofScoresofAllQuestion && (obj.MaxScore >= SumofScoresofAllQuestion || obj.MaxScore == null));
            }
            else {
                return false;
            }

            //End
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


    }

}());