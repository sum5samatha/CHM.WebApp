(function () {
    "use strict";

    angular.module('CHM').controller('EditResidentController', EditResidentController);

    EditResidentController.$inject = ['$scope', '$q', '$uibModal', '$window', '$filter', '$sce', '$stateParams', '$location', '$state', '$timeout', 'toastr', 'ResidentsService', 'SweetAlert', '$rootScope'];

    function EditResidentController($scope, $q, $uibModal, $window, $filter, $sce, $stateParams, $location, $state, $timeout, toastr, ResidentsService, SweetAlert, $rootScope) {
        var vm = this;

        vm.ResidentId = $stateParams.ResidentId;
        vm.PersonalInformation = { open: true };
        vm.RemoveAlreadyAddedPart = [];
        vm.SelectedParts = [];
        var lstAlertQuestionAnswerScore = [];
        if (!vm.ResidentId) {

        }




        vm.CurrentChange = function (objSection_Question, event1) {
            //$(event1.target).parents('.clsSig').first().signature({
            //    change: function (event, ui) {
            //        objSection_Question.ChosenAnswer = $(event1.target).parents('.clsSig').first().signature('toSVG');
            //        console.log(objSection_Question.ChosenAnswer);
            //    }
            //});


            objSection_Question.ChosenAnswer = $(event1.target).parents('.clsSig').first().signature('toSVG');
            //console.log(objSection_Question.ChosenAnswer);

        }


        vm.OpenOnlyOneSection = false;
        vm.Resident = {};
        vm.DOBOpened = false;
        vm.DOAOpened = false;
        vm.AdmittedOpened = false;
        vm.LeavingDateOpened = false;


        vm.getNumber = function (num) {
            return new Array(num);
        }



        ResidentsService.GetActiveSectionByOrganizationID($rootScope.OrganizationId).then(
             function (response) {
                 vm.OnlySection = response.data;
             }
             , function (err) {

             });


        vm.ClickAccordianHeader = function (objSection) {

            vm.sectionID = objSection.ID;
            if (objSection.Sections_Questions.length == 0)
                GetAllActiveSection(objSection);
            //objSection.Sections_Questions = [];

            //for (var jj = 0; jj < vm.Sections.length; jj++) {

            //    if(vm.Sections[jj].ID==vm.sectionID)
            //    {
            //        objSection.Sections_Questions=vm.Sections[jj].Sections_Questions;
            //    }
            //}
        }




        //DOB Datepicker Settings
        vm.openDOB = function ($event) {

            $event.preventDefault();
            $event.stopPropagation();
            vm.DOBOpened = true;

        };

        vm.openDOA = function ($event) {

            $event.preventDefault();
            $event.stopPropagation();

            vm.DOAOpened = true;
        };

        vm.openAdmittedFrom = function ($event) {

            $event.preventDefault();
            $event.stopPropagation();

            vm.AdmittedOpened = true;
        };
        vm.openLeavingDate = function ($event) {

            $event.preventDefault();
            $event.stopPropagation();

            vm.LeavingDateOpened = true;
        };
        

        //recently added 5/10/2016
        vm.dateDOBOptions = {
            formatYear: 'yy',
            startingDay: 1,
            initDate: new Date()
        };
        vm.EndDate = new Date();

        vm.dateDOAOptions = {
            formatYear: 'yy',
            startingDay: 1,
            initDate: new Date()
        };
        vm.EndDate = new Date();

        vm.dateAdmittedOptions = {
            formatYear: 'yy',
            startingDay: 1,
            initDate: new Date()
        };
        vm.EndDate = new Date();

        vm.dateLeavingDateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            initDate: new Date()
        };
        vm.EndDate = new Date();

        //newly Added 4/14/2016

        var uniqueQuestion = function (arr) {
            var newarr = [];
            var unique = {};
            var onlydupiclateid = [];
            arr.forEach(function (item, index) {
                if (!unique[item.QuestionID]) {
                    newarr.push(item);
                    unique[item.QuestionID] = item;
                    //added this line to fix error in contienence start 5/30/2016
                    onlydupiclateid.push(item);
                    //end
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
                if (!unique[item.QuestionID]) {
                    newarr.push(item);
                    // console.log('chk');
                    // console.log(item.QuestionID);
                    unique[item.QuestionID] = item;
                }
            });

            return newarr;

        }

        //End



        //GetAllQuestion_ParentQuestion


        ResidentsService.getAllActiveQuestionParentQuestion().then(
   function (response) {
       vm.QuestionParentQuestion = response.data;
       //newly added 4/14/2016
       vm.CopyQuestionParentQuestion = vm.QuestionParentQuestion;
       // GetAllActiveSection();
   },
   function (err) {
       toastr.error('An error occurred while retrieving QuestionParentQuestion.');
   }


   );


        var SubQuestionsAsParent = function (objSubquestion, lstSubQuestions) {
            for (var z = 0; z < objSubquestion.length; z++) {
                objSubquestion[z].childQuestion = [];

                for (var n = 0; n < vm.QuestionParentQuestion.length; n++) {

                    if (objSubquestion[z].ID == vm.QuestionParentQuestion[n].ParentQuestionID) {
                        for (var p = 0; p < lstSubQuestions.length; p++) {

                            if (lstSubQuestions[p].ID == vm.QuestionParentQuestion[n].QuestionID) {

                                objSubquestion[z].childQuestion.push(lstSubQuestions[p]);
                                SubQuestionsAsParent(objSubquestion[z].childQuestion, lstSubQuestions);
                            }

                        }
                    }
                }
            }

        }

        var subQuestionforAnswer = function (objSubquestion, lstSubQuestion) {
            for (var i = 0; i < objSubquestion.length; i++) {

                for (var j = 0; j < objSubquestion[i].Sections_Questions_Answers.length; j++) {
                    objSubquestion[i].Sections_Questions_Answers[j].childQuestion = [];
                    for (var n = 0; n < vm.QuestionParentQuestion.length; n++) {

                        if (objSubquestion[i].Sections_Questions_Answers[j].ID == vm.QuestionParentQuestion[n].ParentAnswerID) {
                            for (var l = 0; l < lstSubQuestion.length; l++) {


                                if (lstSubQuestion[l].ID == vm.QuestionParentQuestion[n].QuestionID && objSubquestion[i].Sections_Questions_Answers[j].ID == vm.QuestionParentQuestion[n].ParentAnswerID) {  //newly added
                                    lstSubQuestion[l].ParentAnswerID = objSubquestion[i].Sections_Questions_Answers[j].ID;
                                    //end
                                    objSubquestion[i].Sections_Questions_Answers[j].childQuestion.push(lstSubQuestion[l]);
                                    subQuestionforAnswer(objSubquestion[i].Sections_Questions_Answers[j].childQuestion, lstSubQuestion);
                                }
                            }
                        }


                    }

                }
            }
        }

        //add child question sectionquestionanswer childquestion start



        //End


        //Start 6/28/2016 
        var groupchildQuestion = function (objQuestion) {
            for (var i = 0; i < objQuestion.length; i++) {


                for (var L = 0; L < vm.AllSetQuestion.length; L++) {



                    if (vm.AllSetQuestion[L].filterdSectionQuestionID == objQuestion[i].ID) {
                        objQuestion[i].SetGroupNo = vm.AllSetQuestion[L].GroupNo;
                        if (vm.AllSetQuestion[L].IsLastQuesInGroup == false) {
                            objQuestion[i].childQuestion = [];
                            objQuestion[i].LastQuestionInset = vm.AllSetQuestion[L].IsLastQuesInGroup;
                        }
                        else {
                            objQuestion[i].LastQuestionInset = vm.AllSetQuestion[L].IsLastQuesInGroup;
                            if (objQuestion[i].childQuestion.length > 0) {
                                for (var c = 0; c < objQuestion[i].childQuestion.length; c++) {

                                    objQuestion[i].childQuestion[c].childGroupNo = vm.AllSetQuestion[L].GroupNo;
                                }
                            }

                        }

                    }

                }
                var childno = 0;
                for (var k = 0; k < objQuestion[i].Sections_Questions_Answers.length; k++) {
                    if (objQuestion[i].Sections_Questions_Answers[k].childQuestion != undefined) {
                        if (objQuestion[i].Sections_Questions_Answers[k].childQuestion.length > 0) {
                            childno = 1
                            groupchildQuestion(objQuestion[i].Sections_Questions_Answers[k].childQuestion);
                        }
                    }
                }
                if (childno == 0) {
                    if (objQuestion[i].childQuestion != undefined)
                        groupchildQuestion(objQuestion[i].childQuestion);
                }

            }
        }

        //End 6/28/2016

        var GetAllActiveSection = function (objsection) {

            ResidentsService.GetActiveSectionByID(vm.sectionID).then(
            function (response) {
                vm.Sections = response.data;


                //newly added 4/14/2016
                vm.CopyallSectionsQuestion = angular.copy(response.data);

                //Data modification start



                vm.MainQuestion = [];
                vm.SubQuestion = [];
                vm.AllSection = [];


                //To get All Section
                for (var x = 0; x < response.data.length; x++) {

                    vm.AllSection.push(response.data[x]);
                }


                //To separate mainQuestion and subquestion start

                for (var p = 0; p < response.data.length; p++) {

                    for (var q = 0; q < response.data[p].Sections_Questions.length; q++) {
                        var z = 0;
                        for (var r = 0; r < vm.QuestionParentQuestion.length ; r++) {


                            if (vm.QuestionParentQuestion[r].QuestionID == response.data[p].Sections_Questions[q].ID) {
                                z++;
                            }



                        }

                        if (z == 0) {
                            vm.MainQuestion.push(response.data[p].Sections_Questions[q]);
                        }
                        else {
                            vm.SubQuestion.push(response.data[p].Sections_Questions[q]);
                        }
                    }


                }

                //End


                //To add subQuestion To MainQuestion start

                for (var m = 0; m < vm.MainQuestion.length; m++) {
                    vm.MainQuestion[m].childQuestion = [];
                    for (var n = 0; n < vm.QuestionParentQuestion.length; n++) {

                        if (vm.MainQuestion[m].ID == vm.QuestionParentQuestion[n].ParentQuestionID) {
                            for (var p = 0; p < vm.SubQuestion.length; p++) {

                                if (vm.SubQuestion[p].ID == vm.QuestionParentQuestion[n].QuestionID) {

                                    vm.MainQuestion[m].childQuestion.push(vm.SubQuestion[p]);
                                    SubQuestionsAsParent(vm.MainQuestion[m].childQuestion, vm.SubQuestion);
                                }

                            }
                        }
                    }


                }


                //End


                //To add SubQuestion To Answers Start

                for (var k = 0; k < vm.MainQuestion.length; k++) {
                    for (var y = 0; y < vm.MainQuestion[k].Sections_Questions_Answers.length; y++) {
                        vm.MainQuestion[k].Sections_Questions_Answers[y].childQuestion = [];
                        for (var m = 0; m < vm.QuestionParentQuestion.length; m++) {

                            if (vm.MainQuestion[k].Sections_Questions_Answers[y].ID == vm.QuestionParentQuestion[m].ParentAnswerID) {
                                for (var n = 0; n < vm.SubQuestion.length; n++) {

                                    if (vm.SubQuestion[n].ID == vm.QuestionParentQuestion[m].QuestionID && vm.MainQuestion[k].Sections_Questions_Answers[y].ID == vm.QuestionParentQuestion[m].ParentAnswerID) {
                                        vm.SubQuestion[n].ParentAnswerID = vm.MainQuestion[k].Sections_Questions_Answers[y].ID;
                                        vm.MainQuestion[k].Sections_Questions_Answers[y].childQuestion.push(vm.SubQuestion[n]);
                                        subQuestionforAnswer(vm.MainQuestion[k].Sections_Questions_Answers[y].childQuestion, vm.SubQuestion)
                                    }
                                }
                            }


                        }
                    }

                }

                //End




                //To add Child Question to sectionquestion

                for (var k = 0; k < vm.MainQuestion.length; k++) {
                    for (var i = 0; i < vm.MainQuestion[k].childQuestion.length; i++) {

                        //Start
                        for (var y = 0; y < vm.MainQuestion[k].childQuestion[i].Sections_Questions_Answers.length; y++) {
                            vm.MainQuestion[k].childQuestion[i].Sections_Questions_Answers[y].childQuestion = [];
                            for (var m = 0; m < vm.QuestionParentQuestion.length; m++) {

                                if (vm.MainQuestion[k].childQuestion[i].Sections_Questions_Answers[y].ID == vm.QuestionParentQuestion[m].ParentAnswerID) {
                                    for (var n = 0; n < vm.SubQuestion.length; n++) {

                                        if (vm.SubQuestion[n].ID == vm.QuestionParentQuestion[m].QuestionID && vm.MainQuestion[k].childQuestion[i].Sections_Questions_Answers[y].ID == vm.QuestionParentQuestion[m].ParentAnswerID) {
                                            vm.SubQuestion[n].ParentAnswerID = vm.MainQuestion[k].childQuestion[i].Sections_Questions_Answers[y].ID;
                                            vm.MainQuestion[k].childQuestion[i].Sections_Questions_Answers[y].childQuestion.push(vm.SubQuestion[n]);
                                            subQuestionforAnswer(vm.MainQuestion[k].childQuestion[i].Sections_Questions_Answers[y].childQuestion, vm.SubQuestion)
                                        }
                                    }
                                }


                            }
                        }


                        //End
                    }


                }



                //End


                //To AddQuestion To Section Start

                //console.log(vm.AllSection);
                for (var t = 0; t < vm.AllSection.length; t++) {
                    vm.AllSection[t].Sections_Questions = [];
                    for (var s = 0; s < vm.MainQuestion.length; s++) {

                        if (vm.MainQuestion[s].SectionID == vm.AllSection[t].ID) {
                            vm.AllSection[t].Sections_Questions.push(vm.MainQuestion[s]);
                        }


                    }

                }

                //Newly added code 4/12/2016

                //for (var q = 0; q < vm.AllSection.length; q++) {
                //    if (vm.AllSection[q].DisplayOrder == 5 )
                //    {
                //        for (var z = 0; z < vm.AllSection[q].Sections_Questions.length; z++) {
                //            if (vm.AllSection[q].Sections_Questions[z].DisplayOrder == (vm.AllSection[q].Sections_Questions.length))
                //            {
                //                vm.AllSection[q].Sections_Questions[z].totalScore = [];
                //            }
                //            else
                //            {

                //                vm.AllSection[q].Sections_Questions[z].childQuestion = [];
                //            }
                //        }
                //    }
                //    else if(vm.AllSection[q].DisplayOrder == 9)
                //    {
                //        for (var z = 0; z < vm.AllSection[q].Sections_Questions.length; z++) {
                //            if (vm.AllSection[q].Sections_Questions[z].DisplayOrder == (vm.AllSection[q].Sections_Questions.length)) {

                //            }
                //            else {

                //                vm.AllSection[q].Sections_Questions[z].childQuestion = [];
                //            }
                //        }
                //    }

                //}


                //

                //End




                //newly added code  start 4/14/2016




                //Step1:

                // vm.CopyQuestionParentQuestion
                vm.onlyduplicates = uniqueQuestion(vm.CopyQuestionParentQuestion);
                vm.uniqueQuestionIDs = uniqueval(vm.onlyduplicates);

                // console.log('Stp1');
                //console.log(vm.uniqueQuestionIDs);


                if (vm.uniqueQuestionIDs.length > 0) {
                    vm.uniqueQuestionIDswithNoParAnsIds = [];

                    for (var k = 0; k < vm.uniqueQuestionIDs.length; k++) {
                        if (vm.uniqueQuestionIDs[k].ParentAnswerID == null) {
                            vm.uniqueQuestionIDswithNoParAnsIds.push(vm.uniqueQuestionIDs[k]);
                        }
                    }



                    if (vm.uniqueQuestionIDswithNoParAnsIds.length > 0) {
                        //Step2:
                        vm.AllParentQuestions = [];
                        //var unique = {};
                        for (var j = 0; j < vm.uniqueQuestionIDswithNoParAnsIds.length; j++) {


                            var newarray = { QuestionID: '', SectionQuestion: [] }
                            newarray.QuestionID = vm.uniqueQuestionIDswithNoParAnsIds[j].QuestionID;

                            for (var m = 0; m < vm.CopyQuestionParentQuestion.length; m++) {
                                if (vm.uniqueQuestionIDswithNoParAnsIds[j].QuestionID == vm.CopyQuestionParentQuestion[m].QuestionID) {

                                    //newarray.SectionQuestion = GetQuestionsStructure(vm.CopyQuestionParentQuestion[m].ParentQuestionID);

                                    for (var u = 0; u < vm.CopyallSectionsQuestion.length; u++) {



                                        for (var r = 0; r < vm.CopyallSectionsQuestion[u].Sections_Questions.length; r++) {

                                            //console.log('end1');
                                            // console.log(vm.CopyallSectionsQuestion[u].Sections_Questions[r].ID);

                                            if ((vm.CopyallSectionsQuestion[u].Sections_Questions[r].ID == vm.CopyQuestionParentQuestion[m].ParentQuestionID)) {

                                                newarray.SectionQuestion.push(vm.CopyallSectionsQuestion[u].Sections_Questions[r]);
                                                // unique[vm.CopyQuestionParentQuestion[m].ParentQuestionID] = vm.CopyQuestionParentQuestion[m];
                                            }
                                        }

                                    }


                                }


                            }

                            if (newarray.SectionQuestion.length > 0)
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

                            //console.log('step4 complete');
                            //console.log(vm.AllSetQuestion);

                        }
                    }
                }




                //Step:6
                if (vm.AllSetQuestion != undefined) {
                    if (vm.AllSetQuestion.length > 0) {

                        for (var q = 0; q < vm.AllSection.length; q++) {
                            if (vm.AllSection[q].HasScore == true) {

                                // if (vm.AllSection[q].DisplayOrder == 2 || vm.AllSection[q].DisplayOrder == 7 || vm.AllSection[q].DisplayOrder == 11 || vm.AllSection[q].DisplayOrder == 6 || vm.AllSection[q].DisplayOrder == 4 || vm.AllSection[q].DisplayOrder == 9 || vm.AllSection[q].DisplayOrder == 5 || vm.AllSection[q].DisplayOrder == 8 || vm.AllSection[q].DisplayOrder == 3 || vm.AllSection[q].DisplayOrder == 15) {


                                for (var z = 0; z < vm.AllSection[q].Sections_Questions.length; z++) {

                                    for (var L = 0; L < vm.AllSetQuestion.length; L++) {


                                        if (vm.AllSetQuestion[L].filterdSectionQuestionID == vm.AllSection[q].Sections_Questions[z].ID) {
                                            vm.AllSection[q].Sections_Questions[z].SetGroupNo = vm.AllSetQuestion[L].GroupNo;
                                            if (vm.AllSetQuestion[L].IsLastQuesInGroup == false) {
                                                vm.AllSection[q].Sections_Questions[z].childQuestion = [];
                                                vm.AllSection[q].Sections_Questions[z].LastQuestionInset = vm.AllSetQuestion[L].IsLastQuesInGroup;
                                            }
                                            else {
                                                vm.AllSection[q].Sections_Questions[z].LastQuestionInset = vm.AllSetQuestion[L].IsLastQuesInGroup;
                                                if (vm.AllSection[q].Sections_Questions[z].childQuestion.length > 0) {
                                                    for (var c = 0; c < vm.AllSection[q].Sections_Questions[z].childQuestion.length; c++) {

                                                        vm.AllSection[q].Sections_Questions[z].childQuestion[c].childGroupNo = vm.AllSetQuestion[L].GroupNo;
                                                    }
                                                }

                                            }

                                        }


                                    }
                                    var i = 0;
                                    for (var u = 0; u < vm.AllSection[q].Sections_Questions[z].Sections_Questions_Answers.length; u++) {
                                        if (vm.AllSection[q].Sections_Questions[z].Sections_Questions_Answers[u].childQuestion.length > 0) {
                                            i = 1;
                                            groupchildQuestion(vm.AllSection[q].Sections_Questions[z].Sections_Questions_Answers[u].childQuestion);
                                        }
                                    }
                                    if (i == 0) {
                                        groupchildQuestion(vm.AllSection[q].Sections_Questions[z].childQuestion);
                                    }
                                }
                                // console.log('step6');
                                //console.log(vm.AllSection[q]);
                            }






                        }
                    }

                }






                //End


                //console.log(vm.MainQuestion);
                // console.log('all data');
                //console.log(vm.AllSection);






                //Data modification End

                //REgion





                vm.Sections = vm.AllSection;


                objsection.Sections_Questions = [];
                objsection.Sections_Questions = vm.Sections[0].Sections_Questions;
                // console.log('allsection');
                // console.log(vm.Sections);




                for (var i = 0; i < vm.Sections.length; i++) {
                    for (var j = 0; j < vm.Sections[i].Sections_Questions.length; j++) {
                        for (var k = 0; k < vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers.length; k++) {
                            if (vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers[k].IsDefault) {
                                vm.Sections[i].Sections_Questions[j].ChosenAnswerID = vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers[k].ID;
                            }
                            if (vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers[k].childQuestion && vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers[k].childQuestion.length > 0) {

                                BindChosenAnswerID(vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers[k].childQuestion);
                            }
                        }
                    }
                }

                //console.log('suceess');

                GetAssessmentAnswers();
            },
            function (err) {
                toastr.error('An error occurred while retrieving sections.');
            }
        );
        }

        //var GetQuestionStructure = function (sectionId, questionId) {
        //    for (var i = 0; i < vm.MainQuestion.length; i++) {
        //        if (vm.CopyallSectionsQuestion[i].SectionID == sectionId) {

        //            for (var j = 0; j < vm.CopyallSectionsQuestion[i].Sections_Questions.length; j++) {

        //            }

        //        }

        //    }
        //}

        $timeout(function () {
            for (var i = 0; i < $(".selectedpart").length; i++) {
                var ids = $(".selectedpart")[i].id;
                if (ids != "border" && ids != "") {

                    $("#" + ids + "").css('fill', 'white');
                }
            }


            $('.selectedpart').on('click', function () {

                var Part = ($(this)[0].id);

                var Parts = Part.replace(/_/g, " ");

                if (vm.SelectedParts.length > 0) {
                    //var newpart = false;
                    var Count = 0;
                    if (Part != "border" && Part != "") {

                        vm.SelectedParts.forEach(function (item, i) {
                            if (item.PartsID == Parts) {
                                Count++;
                                if (item.Description != "") {

                                    if (item.ID)
                                        vm.RemoveAlreadyAddedPart.push(item.ID);

                                    vm.AlertPainMonitoringPart().then(function (response) {
                                        if (response) {

                                            vm.SelectedParts.splice(i, 1);
                                            $("#" + Part + "").css('fill', 'white');
                                            vm.DeletePainMonitoring();

                                        }
                                    }, function err(err) {
                                        console.log(err);
                                    });
                                }
                                else {
                                    vm.SelectedParts.splice(i, 1);
                                    $("#" + Part + "").css('fill', 'white');
                                }
                            }
                        })


                        if (Count == 0) {

                            $("#" + Part + "").css('fill', 'red');
                            vm.SelectedParts.push({ PartsID: Parts, Description: "", ResidentID: vm.ResidentId, OrganizationID: $rootScope.OrganizationId });
                        }
                    }
                }
                else {
                    $("#" + Part + "").css('fill', 'red');
                    vm.SelectedParts.push({ PartsID: Parts, Description: "", ResidentID: vm.ResidentId, OrganizationID: $rootScope.OrganizationId });
                }

            });



            var GetPainMonitoring = function () {
                var ResidentID = vm.ResidentId;
                ResidentsService.GetPainMonitoring(ResidentID).then(
                    function (response) {
                        vm.SelectedParts = response.data;

                        BindColor(vm.SelectedParts);
                    }


                    ),
                    function (err) {
                        toastr.error('An error occurred while retrieving Pain Monitoring.');
                    }

            }
            GetPainMonitoring();

            //Binding the color in Pageload
            vm.SavePainMonitoring = function () {

                ResidentsService.SavePainMonitoring(vm.SelectedParts).success(
                                      function (response) {
                                          if (vm.RemoveAlreadyAddedPart.length == 0) {
                                              GetPainMonitoring();
                                          }
                                          else
                                              vm.DeletePainMonitoring();

                                          toastr.success("Pain Monitoring Updated Sucessfully")
                                      },
                                      function (err) {
                                          toastr.error('An error occured while saving Pain Monitoring.');
                                      }
                                  );
            }
            //Delete Pain Monitoring
            vm.DeletePainMonitoring = function () {

                ResidentsService.DeletePainMonitoringPart(vm.RemoveAlreadyAddedPart).then(function (response) {
                    // GetPainMonitoring();
                }, function (err) {

                    toastr.error('An error occured while deleting Pain Monitoring.');
                })
            }
            var BindColor = function (obj) {

                for (var i = 0; i < obj.length; i++) {
                    var image = obj[i].PartsID.replace(/ /g, "_");

                    $("#" + image + "").css('fill', 'red');
                }

            }


        });


        var BindChosenAnswerID = function (objQuestions) {
            for (var i = 0; i < objQuestions.length; i++) {
                for (var j = 0; j < objQuestions[i].Sections_Questions_Answers.length; j++) {
                    if (objQuestions[i].Sections_Questions_Answers[j].IsDefault) {
                        objQuestions[i].ChosenAnswerID = objQuestions[i].Sections_Questions_Answers[j].ID;
                    }
                    if (objQuestions[i].Sections_Questions_Answers[j].childQuestion && objQuestions[i].Sections_Questions_Answers[j].childQuestion.length > 0) {
                        BindChosenAnswerID(objQuestions[i].Sections_Questions_Answers[j].childQuestion);
                    }
                }
            }
        };
        var GetPersonalInformation = function () {

            ResidentsService.GetPersonalInformation(vm.ResidentId).then(
                function (response) {

                    vm.Resident = response.data.Resident;
                    if (vm.Resident.Gender == 'M') {
                        vm.showmaleimage = true;
                        vm.showfemaleimage = false;

                    }
                    else {
                        vm.showmaleimage = false;
                        vm.showfemaleimage = true;

                    }

                    vm.Resident.DOB = new Date(vm.Resident.DOB);
                    vm.Resident.DOJ = new Date(vm.Resident.DOJ);
                    vm.Resident.AdmittedFrom = new Date(vm.Resident.AdmittedFrom);
                    vm.PhotoUrl = response.data.PhotoUrl;
                    if (vm.Resident.LeavingDate == null) {
                      
                        vm.Resident.LeavingDate = '';
                    }
                    else {
                        vm.Resident.LeavingDate = new Date(vm.Resident.LeavingDate);
                    }
                   
                },
                function (err) {
                    toastr.error('An error occurred while retrieving personal information.');
                }
            );
        };

        GetPersonalInformation();

        var GetAssessmentAnswers = function () {
            ResidentsService.GetAssessmentData(vm.ResidentId).then(
                function (response) {
                    var lstAssessmentData = response.data;

                    for (var i = 0; i < vm.Sections.length; i++) {
                        for (var j = 0; j < vm.Sections[i].Sections_Questions.length; j++) {
                            vm.Sections[i].Sections_Questions[j].ChosenAnswer = null;
                            vm.Sections[i].Sections_Questions[j].OldChosenAnswer = null;
                            vm.Sections[i].Sections_Questions[j].OldChosenAnswerID = null;
                            vm.Sections[i].Sections_Questions[j].SignatureIcon = null;
                            if (!vm.Sections[i].Sections_Questions[j].OldChkChosenAnswer)
                                vm.Sections[i].Sections_Questions[j].OldChkChosenAnswer = [];

                            if (!vm.Sections[i].Sections_Questions[j].MulChosenAnswerID)
                                vm.Sections[i].Sections_Questions[j].MulChosenAnswerID = [];

                            //Changes on  4/11/2016
                            if (!vm.Sections[i].Sections_Questions[j].SumofScores)
                                vm.Sections[i].Sections_Questions[j].SumofScores = 0;


                            //newly added on 4/18/2016
                            var lstQueswthnoAnswer = 0;
                            for (var k = 0; k < lstAssessmentData.length; k++) {
                                if (vm.Sections[i].Sections_Questions[j].ID == lstAssessmentData[k].ResidentQuestionAnswer.Sections_Questions_Answers.Section_QuestionID) {
                                    lstQueswthnoAnswer++;
                                    vm.Sections[i].Sections_Questions[j].ChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                    if (vm.Sections[i].Sections_Questions[j].AnswerType == 'RadioButtonList') {
                                        vm.Sections[i].Sections_Questions[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                        vm.Sections[i].Sections_Questions[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                        vm.Sections[i].Sections_Questions[j].OldChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                        //newly added 4/15/2016
                                        vm.Sections[i].Sections_Questions[j].SumofScores = $filter('filter')(vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID })[0].Score;

                                    }
                                    else if (vm.Sections[i].Sections_Questions[j].AnswerType == 'DropDownList') {
                                        //newly added on 4/19/2016
                                        vm.Sections[i].Sections_Questions[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                        vm.Sections[i].Sections_Questions[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                        vm.Sections[i].Sections_Questions[j].OldChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;

                                    }
                                    else if (vm.Sections[i].Sections_Questions[j].AnswerType == 'Yes/No') {
                                        var labelText = $filter('filter')(vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID })[0].LabelText;
                                        vm.Sections[i].Sections_Questions[j].ChosenAnswer = labelText == 'Yes' ? true : false;
                                        vm.Sections[i].Sections_Questions[j].OldChosenAnswer = labelText == 'Yes' ? true : false;
                                        vm.Sections[i].Sections_Questions[j].OldChosenAnswerID = $filter('filter')(vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID })[0].ID;
                                    }
                                    else if (vm.Sections[i].Sections_Questions[j].AnswerType == 'FreeText') {
                                        vm.Sections[i].Sections_Questions[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                        vm.Sections[i].Sections_Questions[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                        vm.Sections[i].Sections_Questions[j].OldChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.ID;
                                        if (vm.Sections[i].Sections_Questions[j].Question == "Weight") {
                                            if (vm.Sections[i].Sections_Questions[j].ChosenAnswer != "")
                                                vm.Sections[i].Sections_Questions[j].SumofScores += vm.Sections[i].Sections_Questions[j].ChosenAnswer;
                                            vm.Sections[i].Sections_Questions[j].oldScore = vm.Sections[i].Sections_Questions[j].ChosenAnswer;
                                        }
                                    }
                                    else if (vm.Sections[i].Sections_Questions[j].AnswerType == 'Signature') {
                                        vm.Sections[i].Sections_Questions[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                        vm.Sections[i].Sections_Questions[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                        vm.Sections[i].Sections_Questions[j].OldChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.ID;
                                        vm.Sections[i].Sections_Questions[j].SignatureIcon = $sce.trustAsHtml(lstAssessmentData[k].ResidentQuestionAnswer.AnswerText);
                                    }
                                    else if (vm.Sections[i].Sections_Questions[j].AnswerType == 'Number') {
                                        vm.Sections[i].Sections_Questions[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                        vm.Sections[i].Sections_Questions[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                        vm.Sections[i].Sections_Questions[j].OldChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.ID;
                                    }
                                    else if (vm.Sections[i].Sections_Questions[j].AnswerType == 'FileUpload') {
                                        if (lstAssessmentData[k].ResidentFile) {
                                            vm.Sections[i].Sections_Questions[j].ChosenFilePath = lstAssessmentData[k].ResidentFile;
                                            // vm.Sections[i].Sections_Questions[j].OldChosenAnswerID = stAssessmentData[k].ResidentQuestionAnswer.ID;
                                            var filename = lstAssessmentData[k].ResidentFile.split('/');
                                            vm.Sections[i].Sections_Questions[j].ChosenFileName = filename[5];
                                        }
                                    }
                                    else if (vm.Sections[i].Sections_Questions[j].AnswerType == 'CheckBoxList') {
                                        vm.Sections[i].Sections_Questions[j].ChosenAnswerID = null;
                                        for (var p = 0; p < vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers.length; p++) {



                                            if (vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers[p].ID == lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID) {

                                                vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers[p].ChosenAnswer = true;
                                                if (lstAssessmentData[k].ResidentQuestionAnswer.AnswerText) {
                                                    vm.Sections[i].Sections_Questions[j].txtAreaAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                                }

                                                var chosenAnswerIndex = vm.Sections[i].Sections_Questions[j].MulChosenAnswerID.indexOf(lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID);
                                                if (!(chosenAnswerIndex > -1)) {
                                                    vm.Sections[i].Sections_Questions[j].MulChosenAnswerID.push(lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID);
                                                }
                                                //code on 6/3/2016
                                                var oldChkIndex = vm.Sections[i].Sections_Questions[j].OldChkChosenAnswer.indexOf(lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID);
                                                if (!(oldChkIndex > -1)) {
                                                    vm.Sections[i].Sections_Questions[j].OldChkChosenAnswer.push(lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID);
                                                }
                                                //Chnaged on 4/11/2016
                                                if (vm.Sections[i].Sections_Questions[j].Question == "Falls") {
                                                    if (vm.Sections[i].Sections_Questions[j].txtAreaAnswer != "" && vm.Sections[i].Sections_Questions[j].txtAreaAnswer != undefined) {
                                                        vm.Sections[i].Sections_Questions[j].SumofScores += vm.Sections[i].Sections_Questions[j].txtAreaAnswer * 5;
                                                        vm.Sections[i].Sections_Questions[j].oldScore = vm.Sections[i].Sections_Questions[j].txtAreaAnswer * 5;
                                                    }
                                                }


                                                vm.Sections[i].Sections_Questions[j].SumofScores += vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers[p].Score;
                                            }
                                            //if (vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers[k].ID == lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID) {
                                            //    vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers[k].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                            //}
                                        }
                                        //vm.Sections[i].Sections_Questions[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                        //vm.Sections[i].Sections_Questions[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;

                                    }

                                    //newlyaddedd
                                    if (vm.Sections[i].Sections_Questions[j].MinScore != null) {


                                        EditSubQuestionQuestion(vm.Sections[i].Sections_Questions[j], lstAssessmentData);



                                    }
                                    else {
                                        EditSubQuestion(vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers, lstAssessmentData);
                                    }


                                }
                            }

                            if (lstQueswthnoAnswer == 0 && vm.Sections[i].Sections_Questions[j].LastQuestionInset == true) {
                                if (vm.Sections[i].Sections_Questions[j].MinScore != null) {


                                    EditSubQuestionQuestion(vm.Sections[i].Sections_Questions[j], lstAssessmentData);



                                }
                                else {
                                    EditSubQuestion(vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers, lstAssessmentData);
                                }
                            }
                        }
                    }
                },
                function (err) {
                    toastr.error('An error occurred while retrieving assessment answers.');
                }


            );
            //console.log("Edit");
            // console.log(vm.Sections)
        };

        vm.UpdatePersonalInformation = function () {



            ResidentsService.UpdatePersonalInformation(vm.Resident).success(function (response) {


                if (vm.Resident.Gender == 'M') {
                    vm.showmaleimage = true;
                    vm.showfemaleimage = false;


                }
                else {
                    vm.showmaleimage = false;
                    vm.showfemaleimage = true;

                }


                if (vm.ResidentImage) {
                    if (vm.ResidentImage.file) {
                        if (vm.ResidentImage.file.type == "image/jpeg" || vm.ResidentImage.file.type == "image/png" || vm.ResidentImage.file.type == "image/gif") {
                            UploadPhoto().then(function (response) {

                                toastr.success('Personal Information updated successfully.');
                            },
                                function (err) {
                                    toastr.error(err);
                                });
                        } else {
                            toastr.info('Please Choose jpeg,png,gif.');
                        }
                    } else {
                        toastr.info('Please Choose Photo.');
                    }
                } else {
                    toastr.success('Personal Information updated successfully.');
                }
            },
                    function (err) {
                        toastr.error('An error occured while saving personal information.');
                    });

        };

        vm.UpdateAssessmentData = function (objSection) {
            var lstResidents_Questions_Answers = [];

            for (var i = 0; i < objSection.Sections_Questions.length; i++) {
                var objResidents_Questions_Answers = {};
                //Code on 6/6/2016
                objResidents_Questions_Answers.oldChosenAnswer = objSection.Sections_Questions[i].OldChosenAnswerID;
                objResidents_Questions_Answers.HasScore = objSection.Sections_Questions[i].MinScore;
                objResidents_Questions_Answers.ResidentId = vm.ResidentId;
                var CheckParentIsAnswered = [];
                if ((objSection.Sections_Questions[i].ChosenAnswer != null || objSection.Sections_Questions[i].LastQuestionInset == true) && objSection.Sections_Questions[i].ChosenAnswer != objSection.Sections_Questions[i].OldChosenAnswer) {



                    if (objSection.Sections_Questions[i].AnswerType == 'RadioButtonList') {
                        objResidents_Questions_Answers.Section_Question_AnswerId = objSection.Sections_Questions[i].ChosenAnswer;

                    }
                    else if (objSection.Sections_Questions[i].AnswerType == 'DropDownList') {
                        //newly added 4/19/2016
                        objResidents_Questions_Answers.Section_Question_AnswerId = objSection.Sections_Questions[i].ChosenAnswer;

                    }
                    else if (objSection.Sections_Questions[i].AnswerType == 'Yes/No') {
                        if (objSection.Sections_Questions[i].ChosenAnswer) {
                            objResidents_Questions_Answers.Section_Question_AnswerId = $filter('filter')(objSection.Sections_Questions[i].Sections_Questions_Answers, { LabelText: 'Yes' })[0].ID;
                        }
                        else {
                            objResidents_Questions_Answers.Section_Question_AnswerId = $filter('filter')(objSection.Sections_Questions[i].Sections_Questions_Answers, { LabelText: 'No' })[0].ID;
                        }

                    }
                    else if (objSection.Sections_Questions[i].AnswerType == 'FreeText') {
                        objResidents_Questions_Answers.Section_Question_AnswerId = objSection.Sections_Questions[i].Sections_Questions_Answers[0].ID;
                        objResidents_Questions_Answers.AnswerText = objSection.Sections_Questions[i].ChosenAnswer;
                        objResidents_Questions_Answers.oldChosenAnswer = null;
                    }
                    else if (objSection.Sections_Questions[i].AnswerType == 'Signature') {
                        objResidents_Questions_Answers.Section_Question_AnswerId = objSection.Sections_Questions[i].Sections_Questions_Answers[0].ID;
                        objResidents_Questions_Answers.AnswerText = objSection.Sections_Questions[i].ChosenAnswer;
                        objResidents_Questions_Answers.oldChosenAnswer = null;
                    }
                    else if (objSection.Sections_Questions[i].AnswerType == 'Number') {
                        objResidents_Questions_Answers.Section_Question_AnswerId = objSection.Sections_Questions[i].Sections_Questions_Answers[0].ID;
                        objResidents_Questions_Answers.AnswerText = objSection.Sections_Questions[i].ChosenAnswer;
                        objResidents_Questions_Answers.oldChosenAnswer = null;
                    }

                    CheckParentIsAnswered.push(objResidents_Questions_Answers.Section_Question_AnswerId);
                    //lstResidents_Questions_Answers.push(objResidents_Questions_Answers);
                }
                else {
                    if ((objSection.Sections_Questions[i].ChosenAnswer != null || objSection.Sections_Questions[i].LastQuestionInset == true) && objSection.Sections_Questions[i].ChosenAnswer == objSection.Sections_Questions[i].OldChosenAnswer)
                        objResidents_Questions_Answers.Section_Question_AnswerId = objResidents_Questions_Answers.oldChosenAnswer;
                }
                //code on 6/6/2016  
                if ((objResidents_Questions_Answers.oldChosenAnswer != null || objResidents_Questions_Answers.Section_Question_AnswerId != null) && (objSection.Sections_Questions[i].AnswerType == 'Number' || objSection.Sections_Questions[i].AnswerType == 'FreeText' || objSection.Sections_Questions[i].AnswerType == 'Yes/No' || objSection.Sections_Questions[i].AnswerType == 'DropDownList' || objSection.Sections_Questions[i].AnswerType == 'RadioButtonList'))
                    lstResidents_Questions_Answers.push(objResidents_Questions_Answers);

                if (objSection.Sections_Questions[i].AnswerType == 'CheckBoxList') {
                    //Code on 6/6/2016
                    if (objSection.Sections_Questions[i].MulChosenAnswerID.length > 0) {
                        for (var k = 0; k < objSection.Sections_Questions[i].MulChosenAnswerID.length; k++) {
                            var objchkResidents_Questions_Answers = {};
                            objchkResidents_Questions_Answers.ResidentId = vm.ResidentId;

                            objchkResidents_Questions_Answers.Section_Question_AnswerId = objSection.Sections_Questions[i].MulChosenAnswerID[k];
                            objchkResidents_Questions_Answers.HasScore = objSection.Sections_Questions[i].MinScore;
                            if (objSection.Sections_Questions[i].txtAreaAnswer) {
                                for (var ans = 0; ans < objSection.Sections_Questions[i].Sections_Questions_Answers.length; ans++) {
                                    if (objSection.Sections_Questions[i].Sections_Questions_Answers[ans].ID == objchkResidents_Questions_Answers.Section_Question_AnswerId) {
                                        if (objSection.Sections_Questions[i].Sections_Questions_Answers[ans].AnswerType == "FreeText") {
                                            objchkResidents_Questions_Answers.AnswerText = objSection.Sections_Questions[i].txtAreaAnswer;
                                        }
                                    }


                                }


                            }
                            CheckParentIsAnswered.push(objchkResidents_Questions_Answers.Section_Question_AnswerId);
                            if (objSection.Sections_Questions[i].OldChkChosenAnswer != undefined) {

                                if (!(objSection.Sections_Questions[i].OldChkChosenAnswer.indexOf(objchkResidents_Questions_Answers.Section_Question_AnswerId) >= 0))
                                    lstResidents_Questions_Answers.push(objchkResidents_Questions_Answers);
                                else {
                                    objchkResidents_Questions_Answers.Section_Question_AnswerId = objSection.Sections_Questions[i].MulChosenAnswerID[k];
                                    objchkResidents_Questions_Answers.oldChosenAnswer = objSection.Sections_Questions[i].MulChosenAnswerID[k];
                                    lstResidents_Questions_Answers.push(objchkResidents_Questions_Answers);
                                }
                            }
                            else {
                                lstResidents_Questions_Answers.push(objchkResidents_Questions_Answers);

                            }
                        }

                        if (objSection.Sections_Questions[i].OldChkChosenAnswer != undefined) {
                            for (var x = 0; x < objSection.Sections_Questions[i].OldChkChosenAnswer.length; x++) {
                                if (!(objSection.Sections_Questions[i].MulChosenAnswerID.indexOf(objSection.Sections_Questions[i].OldChkChosenAnswer[x]) >= 0)) {
                                    var objchkResidents_Questions_Answers = {};
                                    objchkResidents_Questions_Answers.ResidentId = vm.ResidentId;
                                    objchkResidents_Questions_Answers.Section_Question_AnswerId = null;
                                    //added on 6.33 pm on 6/21/2016
                                    if (objSection.Sections_Questions[i].txtAreaAnswer) {
                                        for (var ans = 0; ans < objSection.Sections_Questions[i].Sections_Questions_Answers.length; ans++) {
                                            if (objSection.Sections_Questions[i].Sections_Questions_Answers[ans].ID == objchkResidents_Questions_Answers.Section_Question_AnswerId) {
                                                if (objSection.Sections_Questions[i].Sections_Questions_Answers[ans].AnswerType == "FreeText") {
                                                    objchkResidents_Questions_Answers.AnswerText = objSection.Sections_Questions[i].txtAreaAnswer;
                                                }
                                            }


                                        }
                                    }
                                    objchkResidents_Questions_Answers.HasScore = objSection.Sections_Questions[i].MinScore;
                                    objchkResidents_Questions_Answers.oldChosenAnswer = objSection.Sections_Questions[i].OldChkChosenAnswer[x];
                                    lstResidents_Questions_Answers.push(objchkResidents_Questions_Answers);
                                }
                            }
                        }

                    }
                    else {
                        for (var m = 0; m < objSection.Sections_Questions[i].OldChkChosenAnswer.length; m++) {

                            var objchkResidents_Questions_Answers = {};
                            objchkResidents_Questions_Answers.ResidentId = vm.ResidentId;
                            objchkResidents_Questions_Answers.Section_Question_AnswerId = null;
                            //added on 6.33 pm on 6/21/2016
                            if (objSection.Sections_Questions[i].txtAreaAnswer && objSection.Sections_Questions[i].Sections_Questions_Answers[m].AnswerType == "FreeText") {
                                for (var ans = 0; ans < objSection.Sections_Questions[i].Sections_Questions_Answers.length; ans++) {
                                    if (objSection.Sections_Questions[i].Sections_Questions_Answers[ans].ID == objchkResidents_Questions_Answers.Section_Question_AnswerId) {
                                        if (objSection.Sections_Questions[i].Sections_Questions_Answers[ans].AnswerType == "FreeText") {
                                            objchkResidents_Questions_Answers.AnswerText = objSection.Sections_Questions[i].txtAreaAnswer;
                                        }
                                    }


                                }
                            }
                            objchkResidents_Questions_Answers.HasScore = objSection.Sections_Questions[i].MinScore;
                            objchkResidents_Questions_Answers.oldChosenAnswer = objSection.Sections_Questions[i].OldChkChosenAnswer[m];
                            lstResidents_Questions_Answers.push(objchkResidents_Questions_Answers);
                        }
                    }

                }


                if (objSection.Sections_Questions[i].AnswerType == 'FileUpload' && objSection.Sections_Questions[i].ChosenAnswer) {
                    objResidents_Questions_Answers.AnswerText = "FileUpload";
                    objResidents_Questions_Answers.Section_Question_AnswerId = $filter('filter')(objSection.Sections_Questions[i].Sections_Questions_Answers, { LabelText: 'Choose Form' })[0].ID;
                    objResidents_Questions_Answers.FileData = objSection.Sections_Questions[i].ChosenAnswer.file;
                    lstResidents_Questions_Answers.push(objResidents_Questions_Answers);
                    // CheckParentIsAnswered.push(objResidents_Questions_Answers.Section_Question_AnswerId);
                }
                if (objSection.Sections_Questions[i].MinScore != null) {


                    lstResidents_Questions_Answers = lstResidents_Questions_Answers.concat(GetSubQuestionQuestion(objSection.Sections_Questions[i]));

                }
                else {


                    lstResidents_Questions_Answers = lstResidents_Questions_Answers.concat(GetSubQuestionAnswers(objSection.Sections_Questions[i].Sections_Questions_Answers, CheckParentIsAnswered));
                }
            }

            UpdateAssessment(lstResidents_Questions_Answers, objSection);

        };




        //Newly Add Code For Subquestion
        //Start
        var UpdateAssessment = function (lstResidents_Questions_Answers, objsection) {
            ResidentsService.UpdateAssessmentData(vm.ResidentId, lstResidents_Questions_Answers).then(
               function (response) {
                   toastr.success('' + objsection.Name + ' updated successfully.');
                   //if (objsection.Name == 'Emotional Needs and Motivation')
                   //    RiskAlert();
                   //else
                   //    $state.go($state.current, { ResidentId: vm.ResidentId }, { reload: true });
                   //       var sweetAlertOptions = { title: "Suicide Risk!", text: "This person is at high risk of suicide and may require hospital admission.Refer to the mental health team urgently.", type: "error" };

                   //       //  $state.go($state.current, { ResidentId: vm.ResidentId }, { reload: true });
                   //       SweetAlert.swal(sweetAlertOptions,
                   //    function (isConfirm) {
                   //        if (isConfirm) {
                   //            $state.go($state.current, { ResidentId: vm.ResidentId }, { reload: true });
                   //        }
                   //    }
                   //);

               },
               function (err) {
                   toastr.error('An error occurred while updating assessment data.');
               }
           );
        };


        var RiskAlert = function () {


            ResidentsService.GetResidentSummaryAlert(vm.ResidentId).then(
                function (response) {
                    if (response.data.length > 0) {
                        var sweetAlertOptions = { title: "Suicide Risk!", text: "This person is at high risk of suicide and may require hospital admission.Refer to the mental health team urgently.", type: "error" };
                        SweetAlert.swal(sweetAlertOptions,
                          function (isConfirm) {
                              if (isConfirm) {
                                  $state.go($state.current, { ResidentId: vm.ResidentId }, { reload: true });
                              }
                          }
                         );
                    }
                    else {
                        $state.go($state.current, { ResidentId: vm.ResidentId }, { reload: true });
                    }
                }, function (err) {

                })
        }

        //var GetSubQuestionAnswers = function (answers) {
        //    var lst = [];

        //    for (var i = 0; i < answers.length; i++) {
        //        if (answers[i].Sections_Questions1 && answers[i].Sections_Questions1.length > 0) {
        //            for (var j = 0; j < answers[i].Sections_Questions1.length; j++) {
        //                var objResidents_Questions_Answers = {};
        //                if (answers[i].Sections_Questions1[j].ChosenAnswer != null && answers[i].Sections_Questions1[j].ChosenAnswer != answers[i].Sections_Questions1[j].OldChosenAnswer) {


        //                    objResidents_Questions_Answers.ResidentId = vm.ResidentId;
        //                    if (answers[i].Sections_Questions1[j].AnswerType == 'RadioButtonList') {
        //                        objResidents_Questions_Answers.Section_Question_AnswerId = answers[i].Sections_Questions1[j].ChosenAnswer;
        //                    }
        //                    else if (answers[i].Sections_Questions1[j].AnswerType == 'Yes/No') {
        //                        if (answers[i].Sections_Questions1[j].ChosenAnswer)
        //                            objResidents_Questions_Answers.Section_Question_AnswerId = $filter('filter')(answers[i].Sections_Questions1[j].Sections_Questions_Answers, { LabelText: 'Yes' })[0].ID;
        //                        else
        //                            objResidents_Questions_Answers.Section_Question_AnswerId = $filter('filter')(answers[i].Sections_Questions1[j].Sections_Questions_Answers, { LabelText: 'No' })[0].ID;
        //                    }
        //                    else if (answers[i].Sections_Questions1[j].AnswerType == 'FreeText') {
        //                        objResidents_Questions_Answers.Section_Question_AnswerId = answers[i].Sections_Questions1[j].Sections_Questions_Answers[0].ID;
        //                        objResidents_Questions_Answers.AnswerText = answers[i].Sections_Questions1[j].ChosenAnswer;
        //                    }
        //                    else if (answers[i].Sections_Questions1[j].AnswerType == 'Number') {
        //                        objResidents_Questions_Answers.Section_Question_AnswerId = answers[i].Sections_Questions1[j].Sections_Questions_Answers[0].ID;
        //                        objResidents_Questions_Answers.AnswerText = answers[i].Sections_Questions1[j].ChosenAnswer;
        //                    }


        //                    lst.push(objResidents_Questions_Answers);
        //                }

        //                if (answers[i].Sections_Questions1[j].AnswerType == 'CheckBoxList') {
        //                    for (var k = 0; k < answers[i].Sections_Questions1[j].MulChosenAnswerID.length; k++) {
        //                        var objchkResidents_Questions_Answers = {};
        //                        objchkResidents_Questions_Answers.ResidentId = vm.ResidentId;

        //                        objchkResidents_Questions_Answers.Section_Question_AnswerId = answers[i].Sections_Questions1[j].MulChosenAnswerID[k];

        //                        if (answers[i].Sections_Questions1[j].txtAreaAnswer) {
        //                            objchkResidents_Questions_Answers.AnswerText = answers[i].Sections_Questions1[j].txtAreaAnswer;
        //                        }
        //                        //if (answers[i].Sections_Questions1[j].txtAreaAnswer)
        //                        //    objchkResidents_Questions_Answers.AnswerText = answers[i].Sections_Questions1[j].txtAreaAnswer;

        //                        lst.push(objchkResidents_Questions_Answers);
        //                    }

        //                }

        //                if (answers[i].Sections_Questions1[j].AnswerType == 'FileUpload' && answers[i].Sections_Questions1[j].ChosenAnswer) {

        //                    objResidents_Questions_Answers.Section_Question_AnswerId = $filter('filter')(answers[i].Sections_Questions1[j].Sections_Questions_Answers, { LabelText: 'Choose Form' })[0].ID;
        //                    objResidents_Questions_Answers.FileData = answers[i].Sections_Questions1[j].ChosenAnswer.file;
        //                }
        //                lst = lst.concat(GetSubQuestionAnswers(answers[i].Sections_Questions1[j].Sections_Questions_Answers));
        //            }
        //        }
        //    }


        //    return lst;
        //};



        //var EditSubQuestion = function (answers, lstAssessmentData) {
        //    for (var i = 0; i < answers.length; i++) {

        //        for (var j = 0; j < answers[i].Sections_Questions1.length; j++) {
        //            answers[i].Sections_Questions1[j].ChosenAnswer = null;
        //            answers[i].Sections_Questions1[j].OldChosenAnswer = null;
        //            if (!answers[i].Sections_Questions1[j].MulChosenAnswerID)
        //                answers[i].Sections_Questions1[j].MulChosenAnswerID = [];
        //            for (var k = 0; k < lstAssessmentData.length; k++) {
        //                if (answers[i].Sections_Questions1[j].ID == lstAssessmentData[k].ResidentQuestionAnswer.Sections_Questions_Answers.Section_QuestionID) {
        //                    answers[i].Sections_Questions1[j].ChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
        //                    if (answers[i].Sections_Questions1[j].AnswerType == 'RadioButtonList') {
        //                        answers[i].Sections_Questions1[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
        //                        answers[i].Sections_Questions1[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;

        //                    }
        //                    else if (answers[i].Sections_Questions1[j].AnswerType == 'Yes/No') {
        //                        var labelText = $filter('filter')(answers[i].Sections_Questions1[j].Sections_Questions_Answers, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID })[0].LabelText;
        //                        answers[i].Sections_Questions1[j].ChosenAnswer = labelText == 'Yes' ? true : false;
        //                        answers[i].Sections_Questions1[j].OldChosenAnswer = labelText == 'Yes' ? true : false;

        //                    }
        //                    else if (answers[i].Sections_Questions1[j].AnswerType == 'FreeText') {
        //                        answers[i].Sections_Questions1[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
        //                        answers[i].Sections_Questions1[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;

        //                    }
        //                    else if (answers[i].Sections_Questions1[j].AnswerType == 'Number') {
        //                        answers[i].Sections_Questions1[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
        //                        answers[i].Sections_Questions1[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;

        //                    }
        //                    else if (answers[i].Sections_Questions1[j].AnswerType == 'FileUpload') {
        //                        answers[i].Sections_Questions1[j].ChosenFilePath = lstAssessmentData[k].ResidentFile;

        //                        var filename = lstAssessmentData[k].ResidentFile.split('/');
        //                        answers[i].Sections_Questions1[j].ChosenFileName = filename[5];
        //                    }

        //                    else if (answers[i].Sections_Questions1[j].AnswerType == 'CheckBoxList') {
        //                        answers[i].Sections_Questions1[j].ChosenAnswerID = null;
        //                        for (var p = 0; p < answers[i].Sections_Questions1[j].Sections_Questions_Answers.length; p++) {



        //                            if (answers[i].Sections_Questions1[j].Sections_Questions_Answers[p].ID == lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID) {

        //                                answers[i].Sections_Questions1[j].Sections_Questions_Answers[p].ChosenAnswer = true;
        //                                if (lstAssessmentData[k].ResidentQuestionAnswer.AnswerText) {
        //                                    answers[i].Sections_Questions1[j].txtAreaAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
        //                                }
        //                                answers[i].Sections_Questions1[j].MulChosenAnswerID.push(lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID);
        //                            }




        //                        }


        //                        //answers[i].Sections_Questions1[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
        //                        //answers[i].Sections_Questions1[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;

        //                    }
        //                    EditSubQuestion(answers[i].Sections_Questions1[j].Sections_Questions_Answers, lstAssessmentData);


        //                }
        //            }

        //        }
        //    }

        //    return true
        //}

        var GetSubQuestionAnswers = function (answers, objSectionQuestionAns) {
            var lst = [];

            for (var i = 0; i < answers.length; i++) {
                if (answers[i].childQuestion && answers[i].childQuestion.length > 0) {
                    for (var j = 0; j < answers[i].childQuestion.length; j++) {



                        var objResidents_Questions_Answers = {};
                        var CheckParentIsAnswered = [];
                        objResidents_Questions_Answers.oldChosenAnswer = answers[i].childQuestion[j].OldChosenAnswerID;
                        objResidents_Questions_Answers.HasScore = answers[i].childQuestion[j].MinScore;
                        objResidents_Questions_Answers.ResidentId = vm.ResidentId;
                        if (answers[i].childQuestion[j].ChosenAnswer != null && answers[i].childQuestion[j].ChosenAnswer != answers[i].childQuestion[j].OldChosenAnswer) {



                            if (answers[i].childQuestion[j].AnswerType == 'RadioButtonList') {
                                objResidents_Questions_Answers.Section_Question_AnswerId = answers[i].childQuestion[j].ChosenAnswer;
                            }
                            else if (answers[i].childQuestion[j].AnswerType == 'DropDownList') {//newly added 4/19/2016
                                objResidents_Questions_Answers.Section_Question_AnswerId = answers[i].childQuestion[j].ChosenAnswer;
                            }
                            else if (answers[i].childQuestion[j].AnswerType == 'Yes/No') {
                                if (answers[i].childQuestion[j].ChosenAnswer)
                                    objResidents_Questions_Answers.Section_Question_AnswerId = $filter('filter')(answers[i].childQuestion[j].Sections_Questions_Answers, { LabelText: 'Yes' })[0].ID;
                                else
                                    objResidents_Questions_Answers.Section_Question_AnswerId = $filter('filter')(answers[i].childQuestion[j].Sections_Questions_Answers, { LabelText: 'No' })[0].ID;
                            }
                            else if (answers[i].childQuestion[j].AnswerType == 'FreeText') {
                                objResidents_Questions_Answers.Section_Question_AnswerId = answers[i].childQuestion[j].Sections_Questions_Answers[0].ID;
                                objResidents_Questions_Answers.AnswerText = answers[i].childQuestion[j].ChosenAnswer;
                                objResidents_Questions_Answers.oldChosenAnswer = null;
                            }
                            else if (answers[i].childQuestion[j].AnswerType == 'Signature') {
                                objResidents_Questions_Answers.Section_Question_AnswerId = answers[i].childQuestion[j].Sections_Questions_Answers[0].ID;
                                objResidents_Questions_Answers.AnswerText = answers[i].childQuestion[j].ChosenAnswer;
                                objResidents_Questions_Answers.oldChosenAnswer = null;
                            }
                            else if (answers[i].childQuestion[j].AnswerType == 'Number') {
                                objResidents_Questions_Answers.Section_Question_AnswerId = answers[i].childQuestion[j].Sections_Questions_Answers[0].ID;
                                objResidents_Questions_Answers.AnswerText = answers[i].childQuestion[j].ChosenAnswer;
                                objResidents_Questions_Answers.oldChosenAnswer = null;
                            }

                            CheckParentIsAnswered.push(objResidents_Questions_Answers.Section_Question_AnswerId);
                            // lst.push(objResidents_Questions_Answers);
                        }
                        else {
                            if (answers[i].childQuestion[j].ChosenAnswer != null && answers[i].childQuestion[j].ChosenAnswer == answers[i].childQuestion[j].OldChosenAnswer) {
                                objResidents_Questions_Answers.Section_Question_AnswerId = objResidents_Questions_Answers.oldChosenAnswer;
                            }
                        }


                        if ((objResidents_Questions_Answers.oldChosenAnswer != null || objResidents_Questions_Answers.Section_Question_AnswerId != null) && (answers[i].childQuestion[j].AnswerType == 'RadioButtonList' || answers[i].childQuestion[j].AnswerType == 'DropDownList' || answers[i].childQuestion[j].AnswerType == 'Yes/No' || answers[i].childQuestion[j].AnswerType == 'FreeText' || answers[i].childQuestion[j].AnswerType == 'Number' || answers[i].childQuestion[j].AnswerType == 'Signature'))
                            lst.push(objResidents_Questions_Answers);

                        if (answers[i].childQuestion[j].AnswerType == 'CheckBoxList') {
                            if (answers[i].childQuestion[j].MulChosenAnswerID != undefined) {
                                if (answers[i].childQuestion[j].MulChosenAnswerID.length > 0) {
                                    for (var k = 0; k < answers[i].childQuestion[j].MulChosenAnswerID.length; k++) {
                                        var objchkResidents_Questions_Answers = {};
                                        objchkResidents_Questions_Answers.ResidentId = vm.ResidentId;
                                        objchkResidents_Questions_Answers.oldChosenAnswer = null;
                                        objchkResidents_Questions_Answers.HasScore = answers[i].childQuestion[j].MinScore;
                                        objchkResidents_Questions_Answers.Section_Question_AnswerId = answers[i].childQuestion[j].MulChosenAnswerID[k];
                                        CheckParentIsAnswered.push(objchkResidents_Questions_Answers.Section_Question_AnswerId);
                                        if (answers[i].childQuestion[j].txtAreaAnswer) {
                                            objchkResidents_Questions_Answers.AnswerText = answers[i].childQuestion[j].txtAreaAnswer;
                                        }
                                        //if (answers[i].Sections_Questions1[j].txtAreaAnswer)
                                        //    objchkResidents_Questions_Answers.AnswerText = answers[i].Sections_Questions1[j].txtAreaAnswer;
                                        if (answers[i].childQuestion[j].OldChkChosenAnswer != undefined) {

                                            if (!(answers[i].childQuestion[j].OldChkChosenAnswer.indexOf(objchkResidents_Questions_Answers.Section_Question_AnswerId) >= 0))
                                                lst.push(objchkResidents_Questions_Answers);
                                            else {
                                                objchkResidents_Questions_Answers.Section_Question_AnswerId = answers[i].childQuestion[j].MulChosenAnswerID[k];
                                                objchkResidents_Questions_Answers.oldChosenAnswer = answers[i].childQuestion[j].MulChosenAnswerID[k];
                                                lst.push(objchkResidents_Questions_Answers);
                                            }
                                        }
                                        else {
                                            lst.push(objchkResidents_Questions_Answers);
                                        }

                                    }

                                    if (answers[i].childQuestion[j].OldChkChosenAnswer != undefined) {
                                        for (var z = 0; z < answers[i].childQuestion[j].OldChkChosenAnswer.length; z++) {
                                            if (!(answers[i].childQuestion[j].MulChosenAnswerID.indexOf(answers[i].childQuestion[j].OldChkChosenAnswer[z]) >= 0)) {
                                                var objchkResidents_Questions_Answers = {};
                                                objchkResidents_Questions_Answers.ResidentId = vm.ResidentId;
                                                objchkResidents_Questions_Answers.HasScore = answers[i].childQuestion[j].MinScore;
                                                objchkResidents_Questions_Answers.Section_Question_AnswerId = null;
                                                objchkResidents_Questions_Answers.oldChosenAnswer = answers[i].childQuestion[j].OldChkChosenAnswer[z];
                                                lst.push(objchkResidents_Questions_Answers);
                                            }

                                        }
                                    }
                                }
                                else {

                                    if (answers[i].childQuestion[j].OldChkChosenAnswer != undefined) {
                                        for (var l = 0; l < answers[i].childQuestion[j].OldChkChosenAnswer.length; l++) {
                                            var objchkResidents_Questions_Answers = {};
                                            objchkResidents_Questions_Answers.ResidentId = vm.ResidentId;
                                            objchkResidents_Questions_Answers.HasScore = answers[i].childQuestion[j].MinScore;
                                            objchkResidents_Questions_Answers.Section_Question_AnswerId = null;
                                            objchkResidents_Questions_Answers.oldChosenAnswer = answers[i].childQuestion[j].OldChkChosenAnswer[l];
                                            lst.push(objchkResidents_Questions_Answers);
                                        }
                                    }
                                }
                            }
                        }

                        if (answers[i].childQuestion[j].AnswerType == 'FileUpload' && answers[i].childQuestion[j].ChosenAnswer) {

                            objResidents_Questions_Answers.Section_Question_AnswerId = $filter('filter')(answers[i].childQuestion[j].Sections_Questions_Answers, { LabelText: 'Choose Form' })[0].ID;
                            objResidents_Questions_Answers.FileData = answers[i].childQuestion[j].ChosenAnswer.file;
                            objResidents_Questions_Answers.AnswerText = "FileUpload";
                            lst.push(objResidents_Questions_Answers);
                            //CheckParentIsAnswered.push(objResidents_Questions_Answers.Section_Question_AnswerId);
                        }

                        if (answers[i].childQuestion[j].MinScore != null) {


                            lst = lst.concat(GetSubQuestionQuestion(answers[i].childQuestion[j]));

                        }
                        else {
                            //Code change on 6/30/2016
                            var hasscore = false;
                            for (var mmm = 0; mmm < answers[i].childQuestion[j].Sections_Questions_Answers.length; mmm++) {

                                if (answers[i].childQuestion[j].Sections_Questions_Answers[mmm].childQuestion.length > 0) {
                                    hasscore = true;
                                }
                            }

                            if (hasscore == true)
                                lst = lst.concat(GetSubQuestionAnswers(answers[i].childQuestion[j].Sections_Questions_Answers, CheckParentIsAnswered));
                            else {
                                if (answers[i].childQuestion[j].childQuestion.length > 0)
                                    lst = lst.concat(GetSubQuestionQuestion(answers[i].childQuestion[j]));
                            }
                        }
                        //lst = lst.concat(GetSubQuestionAnswers(answers[i].childQuestion[j].Sections_Questions_Answers));
                    }
                }
            }


            return lst;
        };

        //NewlyAdded 4/5/2016 11:47am
        //Start

        var GetSubQuestionQuestion = function (answers) {
            var lst = [];


            for (var j = 0; j < answers.childQuestion.length; j++) {
                var objResidents_Questions_Answers = {};
                objResidents_Questions_Answers.oldChosenAnswer = answers.childQuestion[j].OldChosenAnswerID;
                objResidents_Questions_Answers.HasScore = answers.childQuestion[j].MinScore;
                objResidents_Questions_Answers.ResidentId = vm.ResidentId;
                var CheckParentIsAnswered = [];
                if (answers.childQuestion[j].ChosenAnswer != null && answers.childQuestion[j].ChosenAnswer != answers.childQuestion[j].OldChosenAnswer) {



                    if (answers.childQuestion[j].AnswerType == 'RadioButtonList') {
                        objResidents_Questions_Answers.Section_Question_AnswerId = answers.childQuestion[j].ChosenAnswer;
                    }
                    else if (answers.childQuestion[j].AnswerType == 'DropDownList') {
                        //newly added 4/19/2016
                        objResidents_Questions_Answers.Section_Question_AnswerId = answers.childQuestion[j].ChosenAnswer;
                    }
                    else if (answers.childQuestion[j].AnswerType == 'Yes/No') {
                        if (answers.childQuestion[j].ChosenAnswer)
                            objResidents_Questions_Answers.Section_Question_AnswerId = $filter('filter')(answers.childQuestion[j].Sections_Questions_Answers, { LabelText: 'Yes' })[0].ID;
                        else
                            objResidents_Questions_Answers.Section_Question_AnswerId = $filter('filter')(answers.childQuestion[j].Sections_Questions_Answers, { LabelText: 'No' })[0].ID;
                    }
                    else if (answers.childQuestion[j].AnswerType == 'FreeText') {
                        objResidents_Questions_Answers.Section_Question_AnswerId = answers.childQuestion[j].Sections_Questions_Answers[0].ID;
                        objResidents_Questions_Answers.AnswerText = answers.childQuestion[j].ChosenAnswer;
                        objResidents_Questions_Answers.oldChosenAnswer = null;
                    }
                    else if (answers.childQuestion[j].AnswerType == 'Signature') {
                        objResidents_Questions_Answers.Section_Question_AnswerId = answers.childQuestion[j].Sections_Questions_Answers[0].ID;
                        objResidents_Questions_Answers.AnswerText = answers.childQuestion[j].ChosenAnswer;
                        objResidents_Questions_Answers.oldChosenAnswer = null;
                    }
                    else if (answers.childQuestion[j].AnswerType == 'Number') {
                        objResidents_Questions_Answers.Section_Question_AnswerId = answers.childQuestion[j].Sections_Questions_Answers[0].ID;
                        objResidents_Questions_Answers.AnswerText = answers.childQuestion[j].ChosenAnswer;
                        objResidents_Questions_Answers.oldChosenAnswer = null;
                    }

                    CheckParentIsAnswered.push(objResidents_Questions_Answers.Section_Question_AnswerId);
                    // lst.push(objResidents_Questions_Answers);
                }
                else {
                    if (answers.childQuestion[j].ChosenAnswer == answers.childQuestion[j].OldChosenAnswer && answers.childQuestion[j].ChosenAnswer != null) {
                        objResidents_Questions_Answers.Section_Question_AnswerId = objResidents_Questions_Answers.oldChosenAnswer;
                    }
                }

                if ((objResidents_Questions_Answers.Section_Question_AnswerId != null || objResidents_Questions_Answers.oldChosenAnswer != null) && (answers.childQuestion[j].AnswerType == 'RadioButtonList' || answers.childQuestion[j].AnswerType == 'DropDownList' || answers.childQuestion[j].AnswerType == 'Yes/No' || answers.childQuestion[j].AnswerType == 'FreeText' || answers.childQuestion[j].AnswerType == 'Number' || answers.childQuestion[j].AnswerType == 'Signature'))
                    lst.push(objResidents_Questions_Answers);

                if (answers.childQuestion[j].AnswerType == 'CheckBoxList') {
                    if (answers.childQuestion[j].MulChosenAnswerID != undefined) {

                        if (answers.childQuestion[j].MulChosenAnswerID.length > 0) {
                            for (var k = 0; k < answers.childQuestion[j].MulChosenAnswerID.length; k++) {
                                var objchkResidents_Questions_Answers = {};
                                objchkResidents_Questions_Answers.ResidentId = vm.ResidentId;
                                objchkResidents_Questions_Answers.HasScore = answers.childQuestion[j].MinScore;
                                objchkResidents_Questions_Answers.Section_Question_AnswerId = answers.childQuestion[j].MulChosenAnswerID[k];
                                CheckParentIsAnswered.push(objchkResidents_Questions_Answers.Section_Question_AnswerId);
                                if (answers.childQuestion[j].txtAreaAnswer) {
                                    objchkResidents_Questions_Answers.AnswerText = answers.childQuestion[j].txtAreaAnswer;
                                }
                                //if (answers[i].Sections_Questions1[j].txtAreaAnswer)
                                //    objchkResidents_Questions_Answers.AnswerText = answers[i].Sections_Questions1[j].txtAreaAnswer;
                                if (answers.childQuestion[j].OldChkChosenAnswer != undefined) {
                                    if (!(answers.childQuestion[j].OldChkChosenAnswer.indexOf(objchkResidents_Questions_Answers.Section_Question_AnswerId) >= 0))
                                        lst.push(objchkResidents_Questions_Answers);
                                    else {
                                        objchkResidents_Questions_Answers.Section_Question_AnswerId = answers.childQuestion[j].MulChosenAnswerID[k];
                                        objchkResidents_Questions_Answers.oldChosenAnswer = answers.childQuestion[j].MulChosenAnswerID[k];
                                        lst.push(objchkResidents_Questions_Answers);
                                    }



                                }
                                else {

                                    lst.push(objchkResidents_Questions_Answers);
                                }

                            }

                            if (answers.childQuestion[j].OldChkChosenAnswer != undefined) {
                                for (var m = 0; m < answers.childQuestion[j].OldChkChosenAnswer.length; m++) {

                                    if (!(answers.childQuestion[j].MulChosenAnswerID.indexOf(answers.childQuestion[j].OldChkChosenAnswer[m]) >= 0)) {
                                        var objchkResidents_Questions_Answers = {};
                                        objchkResidents_Questions_Answers.ResidentId = vm.ResidentId;
                                        objchkResidents_Questions_Answers.HasScore = answers.childQuestion[j].MinScore;
                                        objchkResidents_Questions_Answers.Section_Question_AnswerId = null;
                                        objchkResidents_Questions_Answers.oldChosenAnswer = answers.childQuestion[j].OldChkChosenAnswer[m];
                                        lst.push(objchkResidents_Questions_Answers);
                                    }
                                }
                            }
                        }
                        else {
                            for (var l = 0; l < answers.childQuestion[j].OldChkChosenAnswer.length; l++) {
                                var objchkResidents_Questions_Answers = {};
                                objchkResidents_Questions_Answers.ResidentId = vm.ResidentId;
                                objchkResidents_Questions_Answers.HasScore = answers.childQuestion[j].MinScore;
                                objchkResidents_Questions_Answers.Section_Question_AnswerId = null;
                                objchkResidents_Questions_Answers.oldChosenAnswer = answers.childQuestion[j].OldChkChosenAnswer[l];
                                lst.push(objchkResidents_Questions_Answers);
                            }
                        }
                    }
                }

                if (answers.childQuestion[j].AnswerType == 'FileUpload' && answers.childQuestion[j].ChosenAnswer) {

                    objResidents_Questions_Answers.Section_Question_AnswerId = $filter('filter')(answers.childQuestion[j].Sections_Questions_Answers, { LabelText: 'Choose Form' })[0].ID;
                    objResidents_Questions_Answers.FileData = answers.childQuestion[j].ChosenAnswer.file;
                    objResidents_Questions_Answers.AnswerText = "FileUpload";
                    lst.push(objResidents_Questions_Answers);
                    //CheckParentIsAnswered.push(objchkResidents_Questions_Answers.Section_Question_AnswerId);
                }


                if (answers.childQuestion[j].MinScore != null) {


                    lst = lst.concat(GetSubQuestionQuestion(answers.childQuestion[j]));

                }
                else {


                    lst = lst.concat(GetSubQuestionAnswers(answers.childQuestion[j].Sections_Questions_Answers, CheckParentIsAnswered));
                }



            }



            return lst;
        };



        //END




        var EditSubQuestion = function (answers, lstAssessmentData) {
            for (var i = 0; i < answers.length; i++) {

                if (answers[i].childQuestion != undefined) {
                    for (var j = 0; j < answers[i].childQuestion.length; j++) {
                        answers[i].childQuestion[j].ChosenAnswer = null;
                        answers[i].childQuestion[j].OldChosenAnswer = null;
                        answers[i].childQuestion[j].OldChosenAnswerID = null;
                        answers[i].childQuestion[j].SignatureIcon = null;
                        if (!answers[i].childQuestion[j].MulChosenAnswerID)
                            answers[i].childQuestion[j].MulChosenAnswerID = [];
                        if (!answers[i].childQuestion[j].SumofScores)
                            answers[i].childQuestion[j].SumofScores = 0;


                        if (!answers[i].childQuestion[j].OldChkChosenAnswer) {
                            answers[i].childQuestion[j].OldChkChosenAnswer = [];
                        }
                        //newly added on 4/18/2016
                        var lstQueswthnoAnswer = 0;
                        for (var k = 0; k < lstAssessmentData.length; k++) {
                            if (answers[i].childQuestion[j].ID == lstAssessmentData[k].ResidentQuestionAnswer.Sections_Questions_Answers.Section_QuestionID) {
                                lstQueswthnoAnswer++;
                                answers[i].childQuestion[j].ChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                if (answers[i].childQuestion[j].AnswerType == 'RadioButtonList') {
                                    answers[i].childQuestion[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                    answers[i].childQuestion[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                    answers[i].childQuestion[j].OldChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                    var rbScore = $filter('filter')(answers[i].childQuestion[j].Sections_Questions_Answers, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID })[0].Score;
                                    if (rbScore != null)
                                        answers[i].childQuestion[j].SumofScores = rbScore;
                                }
                                else if (answers[i].childQuestion[j].AnswerType == 'DropDownList') {
                                    //newly added 4/19/2016
                                    answers[i].childQuestion[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                    answers[i].childQuestion[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                    answers[i].childQuestion[j].OldChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                }
                                else if (answers[i].childQuestion[j].AnswerType == 'Yes/No') {
                                    var labelText = $filter('filter')(answers[i].childQuestion[j].Sections_Questions_Answers, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID })[0].LabelText;
                                    answers[i].childQuestion[j].ChosenAnswer = labelText == 'Yes' ? true : false;
                                    answers[i].childQuestion[j].OldChosenAnswer = labelText == 'Yes' ? true : false;
                                    answers[i].childQuestion[j].OldChosenAnswerID = $filter('filter')(answers[i].childQuestion[j].Sections_Questions_Answers, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID })[0].ID;
                                }
                                else if (answers[i].childQuestion[j].AnswerType == 'FreeText') {
                                    answers[i].childQuestion[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                    answers[i].childQuestion[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                    answers[i].childQuestion[j].OldChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                }
                                else if (answers[i].childQuestion[j].AnswerType == 'Signature') {
                                    answers[i].childQuestion[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                    answers[i].childQuestion[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                    answers[i].childQuestion[j].OldChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                    answers[i].childQuestion[j].SignatureIcon = $sce.trustAsHtml(lstAssessmentData[k].ResidentQuestionAnswer.AnswerText);
                                }
                                else if (answers[i].childQuestion[j].AnswerType == 'Number') {
                                    answers[i].childQuestion[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                    answers[i].childQuestion[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                    answers[i].childQuestion[j].OldChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                }
                                else if (answers[i].childQuestion[j].AnswerType == 'FileUpload') {
                                    if (lstAssessmentData[k].ResidentFile) {
                                        answers[i].childQuestion[j].ChosenFilePath = lstAssessmentData[k].ResidentFile;
                                        // answers[i].childQuestion[j].OldChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                        var filename = lstAssessmentData[k].ResidentFile.split('/');
                                        answers[i].childQuestion[j].ChosenFileName = filename[5];
                                    }
                                }

                                else if (answers[i].childQuestion[j].AnswerType == 'CheckBoxList') {
                                    answers[i].childQuestion[j].ChosenAnswerID = null;
                                    // var sumscores1=0
                                    for (var p = 0; p < answers[i].childQuestion[j].Sections_Questions_Answers.length; p++) {



                                        if (answers[i].childQuestion[j].Sections_Questions_Answers[p].ID == lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID) {

                                            answers[i].childQuestion[j].Sections_Questions_Answers[p].ChosenAnswer = true;
                                            if (lstAssessmentData[k].ResidentQuestionAnswer.AnswerText) {
                                                answers[i].childQuestion[j].txtAreaAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                            }

                                            var chosenAnswerIndex = answers[i].childQuestion[j].MulChosenAnswerID.indexOf(lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID);
                                            if (!(chosenAnswerIndex > -1)) {
                                                answers[i].childQuestion[j].MulChosenAnswerID.push(lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID);
                                                answers[i].childQuestion[j].SumofScores += answers[i].childQuestion[j].Sections_Questions_Answers[p].Score;
                                            }

                                            var oldchkIndex = answers[i].childQuestion[j].OldChkChosenAnswer.indexOf(lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID);
                                            if (!(oldchkIndex > -1)) {
                                                answers[i].childQuestion[j].OldChkChosenAnswer.push(lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID);
                                            }

                                            //Changed on 6/30/2016
                                            //answers[i].childQuestion[j].SumofScores += answers[i].childQuestion[j].Sections_Questions_Answers.Score;


                                            // sumscores1 += answers[i].childQuestion[j].Sections_Questions_Answers.Score;
                                        }




                                    }
                                    //if(sumscores > 0)
                                    //vm.copySumofScore = sumscores1;

                                    //answers[i].Sections_Questions1[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                    //answers[i].Sections_Questions1[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;

                                }

                                var hasonlyScores = false;
                                for (var zzz = 0; zzz < answers[i].childQuestion[j].Sections_Questions_Answers.length; zzz++) {

                                    if (answers[i].childQuestion[j].Sections_Questions_Answers[zzz].childQuestion.length > 0) {

                                        hasonlyScores = true;
                                    }
                                }

                                if (hasonlyScores == true)
                                    EditSubQuestion(answers[i].childQuestion[j].Sections_Questions_Answers, lstAssessmentData);
                                else {
                                    if (answers[i].childQuestion[j].childQuestion.length > 0) {
                                        EditSubQuestionQuestion(answers[i].childQuestion[j], lstAssessmentData);
                                    }
                                }



                            }

                        }
                        //newly added 4/18/2016
                        if (lstQueswthnoAnswer == 0 && answers[i].childQuestion[j].LastQuestionInset == true) {

                            EditSubQuestion(answers[i].childQuestion[j].Sections_Questions_Answers, lstAssessmentData);


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
                answers.childQuestion[j].OldChosenAnswerID = null;
                answers.childQuestion[j].SignatureIcon = null;
                if (!answers.childQuestion[j].MulChosenAnswerID) {
                    answers.childQuestion[j].MulChosenAnswerID = [];

                }

                if (!answers.childQuestion[j].OldChkChosenAnswer) {
                    answers.childQuestion[j].OldChkChosenAnswer = [];
                }

                if (!answers.childQuestion[j].SumofScores)
                    answers.childQuestion[j].SumofScores = 0;

                //newly added on 4/18/2016
                var lstQueswthnoAnswer = 0;
                for (var k = 0; k < lstAssessmentData.length; k++) {
                    if (answers.childQuestion[j].ID == lstAssessmentData[k].ResidentQuestionAnswer.Sections_Questions_Answers.Section_QuestionID) {
                        lstQueswthnoAnswer++;
                        answers.childQuestion[j].ChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                        if (answers.childQuestion[j].AnswerType == 'RadioButtonList') {
                            answers.childQuestion[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                            answers.childQuestion[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                            answers.childQuestion[j].OldChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                            var rbScore = $filter('filter')(answers.childQuestion[j].Sections_Questions_Answers, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID })[0].Score;
                            if (rbScore != null)
                                answers.childQuestion[j].SumofScores = rbScore;
                        }
                        else if (answers.childQuestion[j].AnswerType == 'DropDownList') {
                            //4/19/2016
                            answers.childQuestion[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                            answers.childQuestion[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                            answers.childQuestion[j].OldChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                        }
                        else if (answers.childQuestion[j].AnswerType == 'Yes/No') {
                            var labelText = $filter('filter')(answers.childQuestion[j].Sections_Questions_Answers, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID })[0].LabelText;
                            answers.childQuestion[j].ChosenAnswer = labelText == 'Yes' ? true : false;
                            answers.childQuestion[j].OldChosenAnswer = labelText == 'Yes' ? true : false;
                            answers.childQuestion[j].OldChosenAnswerID = $filter('filter')(answers.childQuestion[j].Sections_Questions_Answers, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID })[0].ID;
                        }
                        else if (answers.childQuestion[j].AnswerType == 'FreeText') {
                            answers.childQuestion[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                            answers.childQuestion[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                            answers.childQuestion[j].OldChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                        }
                        else if (answers.childQuestion[j].AnswerType == 'Signature') {
                            answers.childQuestion[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                            answers.childQuestion[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                            answers.childQuestion[j].OldChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                            answers.childQuestion[j].SignatureIcon = $sce.trustAsHtml(lstAssessmentData[k].ResidentQuestionAnswer.AnswerText);

                        }
                        else if (answers.childQuestion[j].AnswerType == 'Number') {
                            answers.childQuestion[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                            answers.childQuestion[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                            answers.childQuestion[j].OldChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                        }
                        else if (answers.childQuestion[j].AnswerType == 'FileUpload') {
                            if (lstAssessmentData[k].ResidentFile) {
                                answers.childQuestion[j].ChosenFilePath = lstAssessmentData[k].ResidentFile;
                                //  answers.childQuestion[j].OldChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                var filename = lstAssessmentData[k].ResidentFile.split('/');
                                answers.childQuestion[j].ChosenFileName = filename[5];
                            }
                        }

                        else if (answers.childQuestion[j].AnswerType == 'CheckBoxList') {
                            answers.childQuestion[j].ChosenAnswerID = null;
                            var sumscores = 0
                            for (var p = 0; p < answers.childQuestion[j].Sections_Questions_Answers.length; p++) {



                                if (answers.childQuestion[j].Sections_Questions_Answers[p].ID == lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID) {

                                    answers.childQuestion[j].Sections_Questions_Answers[p].ChosenAnswer = true;
                                    if (lstAssessmentData[k].ResidentQuestionAnswer.AnswerText) {
                                        answers.childQuestion[j].txtAreaAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                    }

                                    //code on 6/7/2016
                                    var chosenAnswerIndex = answers.childQuestion[j].MulChosenAnswerID.indexOf(lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID);
                                    if (!(chosenAnswerIndex > -1)) {
                                        answers.childQuestion[j].MulChosenAnswerID.push(lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID);
                                    }

                                    var OldChkChosenAnswerIndex = answers.childQuestion[j].OldChkChosenAnswer.indexOf(lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID);
                                    if (!(OldChkChosenAnswerIndex > -1)) {
                                        answers.childQuestion[j].OldChkChosenAnswer.push(lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID);
                                    }


                                    answers.childQuestion[j].SumofScores += answers.childQuestion[j].Sections_Questions_Answers.Score;
                                    //sumscores += answers.childQuestion[j].Sections_Questions_Answers.Score;
                                }




                            }

                            if (sumscores > 0)
                                vm.copySumofScore = sumscores;

                            //answers[i].Sections_Questions1[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                            //answers[i].Sections_Questions1[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;

                        }


                        if (answers.childQuestion[j].MinScore != null) {


                            EditSubQuestionQuestion(answers.childQuestion[j], lstAssessmentData);



                        }
                        else {
                            EditSubQuestion(answers.childQuestion[j].Sections_Questions_Answers, lstAssessmentData);
                        }





                    }

                }
                //newly added 4/18/2016
                if (lstQueswthnoAnswer == 0 && answers.childQuestion[j].LastQuestionInset == true) {
                    if (answers.childQuestion[j].MinScore != null) {


                        EditSubQuestionQuestion(answers.childQuestion[j], lstAssessmentData);



                    }
                    else {
                        EditSubQuestion(answers.childQuestion[j].Sections_Questions_Answers, lstAssessmentData);
                    }
                }

            }


            return true
        }
        //End
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

        vm.alertsArr = [];

        vm.RadioButtonChange = function (objSection_Question, objSection_Question_Answer) {

            objSection_Question.ChosenAnswerID = objSection_Question.ChosenAnswer;
            //newly added
            objSection_Question.SumofScores = $filter('filter')(objSection_Question.Sections_Questions_Answers, { ID: objSection_Question.ChosenAnswer })[0].Score;
            SucideAlertPopUp(objSection_Question, objSection_Question_Answer);
        }

        var lstAnsweredEmotionalNeedsAnswers = [];
        var SucideAlertPopUp = function (objSection_Question, objSection_Question_Answer) {

            var lstQuestionIds = [];
            for (var i = 0; i < $rootScope.SucideAlertQuestionIds.length; i++) {
                if ($rootScope.SucideAlertQuestionIds[i].ConfigurationKey == 'SucideAlertPopup') {
                    lstQuestionIds = $rootScope.SucideAlertQuestionIds[i].ConfigurationValue;
                }
            }

            if (lstQuestionIds.indexOf(angular.uppercase(objSection_Question.ID)) > -1) {
                var isQuestionAlreadyAnswered = false;

                for (var i = 0; i < lstAnsweredEmotionalNeedsAnswers.length; i++) {
                    if (lstAnsweredEmotionalNeedsAnswers[i].QuestionId == objSection_Question.ID) {
                        isQuestionAlreadyAnswered = true;
                        lstAnsweredEmotionalNeedsAnswers[i].AnswerId = objSection_Question_Answer.ID;
                        lstAnsweredEmotionalNeedsAnswers[i].Score = objSection_Question_Answer.Score;
                        break;
                    }
                }
                if (!isQuestionAlreadyAnswered) {
                    var objEmotionalNeedsAnswer = {};
                    objEmotionalNeedsAnswer.QuestionId = objSection_Question.ID;
                    objEmotionalNeedsAnswer.AnswerId = objSection_Question_Answer.ID;
                    objEmotionalNeedsAnswer.Score = objSection_Question_Answer.Score;
                    lstAnsweredEmotionalNeedsAnswers.push(objEmotionalNeedsAnswer);
                }

                var totalScoreOfEmotionalNeeds = 0;
                for (var i = 0; i < lstAnsweredEmotionalNeedsAnswers.length; i++) {
                    totalScoreOfEmotionalNeeds += lstAnsweredEmotionalNeedsAnswers[i].Score;
                }

                if (totalScoreOfEmotionalNeeds > 9) {
                    var sweetAlertOptions = { title: "Suicide Risk!", text: "This person is at high risk of suicide and may require hospital admission.Refer to the mental health team urgently.", type: "error" };
                    SweetAlert.swal(sweetAlertOptions,
                      function (isConfirm) {
                          if (isConfirm) {
                              $state.go($state.current, { ResidentId: vm.ResidentId }, { reload: false });
                          }
                      }
                     );
                }
            }
        }

        vm.ToggleSwitchChange = function (objSection_Question) {

            if (objSection_Question.ChosenAnswer == true)
                objSection_Question.ChosenAnswerID = $filter('filter')(objSection_Question.Sections_Questions_Answers, { LabelText: 'Yes' })[0].ID;
            else
                objSection_Question.ChosenAnswerID = $filter('filter')(objSection_Question.Sections_Questions_Answers, { LabelText: 'No' })[0].ID;
        }

        vm.DropDownchange = function (objSection_Question) {
            objSection_Question.ChosenAnswerID = objSection_Question.ChosenAnswer;

        }
        //Newlyadded
        vm.copySumofScore = 0;
        //


        //var uniquecheckbox = function (arr) {
        //    var newarr = [];
        //    var unique = {};
        //    arr.forEach(function (item, index) {
        //        if (!unique[item]) {
        //            newarr.push(item);
        //            unique[item] = item;
        //        }
        //    });

        //    return newarr;

        //}


        vm.CheckBoxChange = function (objSection_Question, objsectionQuestionAnswer) {
            if (!objSection_Question.MulChosenAnswerID)
                objSection_Question.MulChosenAnswerID = [];
            //else
            //{
            //    var objuniqueIds = objSection_Question.MulChosenAnswerID;
            //    objSection_Question.MulChosenAnswerID = [];
            //    objSection_Question.MulChosenAnswerID.push(uniquecheckbox(objuniqueIds));
            //}





            if (!objSection_Question.SumofScores) {

                objSection_Question.SumofScores = 0;
            }

            if (objsectionQuestionAnswer.ChosenAnswer == true) {
                if (objsectionQuestionAnswer.LabelText != 'None') {
                    objSection_Question.MulChosenAnswerID.push(objsectionQuestionAnswer.ID);
                    if (objsectionQuestionAnswer.Score) {
                        objSection_Question.SumofScores = objSection_Question.SumofScores + objsectionQuestionAnswer.Score;

                    }
                    for (var i = 0; i < objSection_Question.Sections_Questions_Answers.length; i++) {
                        if (objSection_Question.Sections_Questions_Answers[i].LabelText == 'None') {
                            objSection_Question.Sections_Questions_Answers[i].ChosenAnswer = false;
                            var chosenAnswerIndex = objSection_Question.MulChosenAnswerID.indexOf(objSection_Question.Sections_Questions_Answers[i].ID);
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
                    for (var i = 0; i < objSection_Question.Sections_Questions_Answers.length; i++) {
                        if (objSection_Question.Sections_Questions_Answers[i].ID != objsectionQuestionAnswer.ID) {
                            objSection_Question.Sections_Questions_Answers[i].ChosenAnswer = false;
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
            //if (objSection_Question.SumofScores!=undefined)
            //vm.copySumofScore+= objSection_Question.SumofScores
            // console.log('hiiii')
            //console.log($parent.objSection_Question);
            //console.log(objSection_Question.MulChosenAnswerID)

            if (objSection_Question.MulChosenAnswerID.length == 0) {
                objSection_Question.SumofScores = 0;
            }
        }

        //vm.copysum = 0;

        vm.ShowChildQuestionQuestion = function (obj, val, objParent) {


            if (val.objSection.Name == 'Eating') {
                var sectionScore = 0;
                for (var i = 0; i < val.objSection.Sections_Questions.length; i++) {
                    if (val.objSection.Sections_Questions[i].AnswerType == 'FreeText') {
                        sectionScore += val.objSection.Sections_Questions[i].SumofScores;
                    }
                }

                if (sectionScore > 0)
                    return (obj.MinScore <= sectionScore && (obj.MaxScore >= sectionScore || obj.MaxScore == null));
                else
                    return false;
            }
            else {

                //newly added 4/15/2016

                if (obj.childGroupNo != undefined) {
                    var SumofScoresofAllQuestion = 0;

                    for (var i = 0; i < val.objSection.Sections_Questions.length; i++) {
                        if (val.objSection.Sections_Questions[i].SetGroupNo == obj.childGroupNo) {

                            if (val.objSection.Sections_Questions[i].SumofScores != undefined && val.objSection.Sections_Questions[i].SumofScores > 0) {
                                SumofScoresofAllQuestion += val.objSection.Sections_Questions[i].SumofScores;

                            }
                        }


                    }

                    if (SumofScoresofAllQuestion == 0) {
                        for (var i = 0; i < val.objSection.Sections_Questions.length; i++) {
                            for (var l = 0; l < val.objSection.Sections_Questions[i].childQuestion.length; l++) {
                                if (val.objSection.Sections_Questions[i].childQuestion[l].SetGroupNo == obj.childGroupNo) {

                                    if (val.objSection.Sections_Questions[i].childQuestion[l].SumofScores != undefined && val.objSection.Sections_Questions[i].childQuestion[l].SumofScores > 0) {
                                        SumofScoresofAllQuestion += val.objSection.Sections_Questions[i].childQuestion[l].SumofScores;

                                    }
                                }
                            }



                        }
                    }


                    if (SumofScoresofAllQuestion == 0) {
                        if (objParent != undefined)
                            if (objParent.SetGroupNo != undefined) {
                                if (obj.childGroupNo == objParent.SetGroupNo) {
                                    SumofScoresofAllQuestion = objParent.SumofScores;
                                }
                            }
                    }

                }
                //else {

                //    var SumofScoresofAllQuestionWithNoChildGrooupNo = 0;

                //    for (var i = 0; i < val.objSection.Sections_Questions.length; i++) {                     
                //        for (var m = 0; m < val.objSection.Sections_Questions[i].childQuestion.length; m++) {
                //            if (val.objSection.Sections_Questions[i].childQuestion[m].ID==obj.ID)
                //            {
                //                SumofScoresofAllQuestionWithNoChildGrooupNo += val.objSection.Sections_Questions[i].SumofScores;
                //            }

                //        }

                //    }

                //}

                if (SumofScoresofAllQuestion > 0) {
                    return (obj.MinScore <= SumofScoresofAllQuestion && (obj.MaxScore >= SumofScoresofAllQuestion || obj.MaxScore == null));
                }
                    //else if (SumofScoresofAllQuestionWithNoChildGrooupNo>0)
                    //{
                    //    return (obj.MinScore <= SumofScoresofAllQuestionWithNoChildGrooupNo && (obj.MaxScore >= SumofScoresofAllQuestionWithNoChildGrooupNo || obj.MaxScore == null));
                    //}
                else {
                    return false;
                }

            }


            //End


            //console.log(vm.copySumofScore);
            //return (obj.MinScore <= vm.copySumofScore && obj.MaxScore >= vm.copySumofScore);

            // return true;

            //console.log('chk');
            //console.log(val);




            //if (val.objSection_Question.SumofScores != undefined)
            //{
            //    if (val.objSection_Question.SumofScores > 0)
            //    {


            //        return (obj.MinScore <= val.objSection_Question.SumofScores && obj.MaxScore >= val.objSection_Question.SumofScores);

            //    }

            //    //if (val.objSubQuestion.SumofScores > 0) {
            //    //    return (obj.MinScore <= val.objSubQuestion.SumofScores && obj.MaxScore >= val.objSubQuestion.SumofScores);

            //    //}

            //}
            //else {
            //    return false;
            //}



        }




        //vm.SampleFunction = function (parent, objSubQuestion) {

        //    // console.log(objSubQuestion);

        //        console.log(parent);

        //};

        //vm.SampleFunction = function (parent) {
        //    //console.log(questionText);
        //    console.log(parent);
        //}


        vm.txtBoxChange = function (objSection_Question, objsectionQuestionAnswer) {



            if (objSection_Question.Question == 'Falls') {
                if (objSection_Question.SumofScores || objSection_Question.SumofScores == 0) {

                    if (isNaN(objSection_Question.txtAreaAnswer) || objSection_Question.txtAreaAnswer == "") {

                        if (!(objSection_Question.oldScore === undefined)) {
                            objSection_Question.SumofScores = objSection_Question.SumofScores - objSection_Question.oldScore;
                            objSection_Question.oldScore = 0;
                        }

                    }
                    else {
                        if (objSection_Question.SumofScores >= 0) {

                            if (objSection_Question.oldScore === undefined) {
                                objSection_Question.SumofScores = (objSection_Question.SumofScores) + parseInt(objSection_Question.txtAreaAnswer * 5);
                                objSection_Question.oldScore = objSection_Question.txtAreaAnswer * 5;
                            }
                            else {
                                objSection_Question.SumofScores = ((objSection_Question.SumofScores - objSection_Question.oldScore)) + parseInt(objSection_Question.txtAreaAnswer * 5);
                                objSection_Question.oldScore = objSection_Question.txtAreaAnswer * 5;
                            }
                        }
                        else {
                            objSection_Question.txtAreaAnswer = 0;
                            objSection_Question.SumofScores = objSection_Question.SumofScores + objSection_Question.txtAreaAnswer;
                            objSection_Question.oldScore = objSection_Question.txtAreaAnswer;
                        }

                    }
                }
            }

            //if (objSection_Question.Question == 'Weight') {
            //    if (objSection_Question.SumofScores >= 0) {

            //        var value = parseInt(objSection_Question.ChosenAnswer);

            //        if (!isNaN(value)) {
            //            if (objSection_Question.oldScore === undefined) {
            //                objSection_Question.SumofScores = objSection_Question.SumofScores + parseInt(objSection_Question.ChosenAnswer);
            //                objSection_Question.oldScore = objSection_Question.ChosenAnswer;
            //            }
            //            else {
            //                objSection_Question.SumofScores = ((objSection_Question.SumofScores - objSection_Question.oldScore) + parseInt(objSection_Question.ChosenAnswer));
            //                objSection_Question.oldScore = objSection_Question.ChosenAnswer;
            //                if (objSection_Question.ChosenAnswer == "") {
            //                    objSection_Question.SumofScores = 0;
            //                    objSection_Question.oldScore = 0;
            //                }

            //            }
            //        }
            //    }
            //}

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


        vm.BindSectionQuestionAnswer = function (objSectionQuestionAnswer) {
            var ResidentFullName = vm.Resident.FirstName + " " + vm.Resident.LastName;
            var res = objSectionQuestionAnswer.replace("ResidentName", ResidentFullName);
            return res;
        }

        vm.check = function (objSubQuestion, obj) {
            // console.log(objSubQuestion);
            //console.log(obj);
            objSubQuestion.SampleScope = obj;
        }

        vm.HasChildQuestion = function (objSubQuestion) {
            //console.log('From Another fun');
            //console.log(objSubQuestion);
            return objSubQuestion.SampleScope;
        }



        //Delete Alert functionality

        vm.AlertPainMonitoringPart = function () {
            var deferred = $q.defer();
            var AlertConfirm = false;
            var sweetAlertOptions = {
                title: "",
                text: "Are you sure you want to  delete this Part ",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!"
            }

            SweetAlert.swal(sweetAlertOptions,
                   function (isConfirm) {
                       if (isConfirm) {
                           deferred.resolve(true);
                       }
                       else {
                           deferred.resolve(false);
                       }
                   });
            return deferred.promise;
        }



        //Retriving the data from db in PageLoad



    }

}());