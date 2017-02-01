(function () {
    "use strict";

    angular.module('CHM').controller('NewResidentController', NewResidentController);

    NewResidentController.$inject = ['$q', '$uibModal', '$window', '$filter','$location', 'toastr', 'ResidentsService'];

    function NewResidentController($q, $uibModal, $window, $filter,$location,toastr, ResidentsService) {
        var vm = this;
        vm.OpenOnlyOneSection = false;
        vm.Resident = {};
        vm.ResidentId = null;
        vm.PersonalInformation = { open: true };
        vm.isDisabled = false;

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




        

       // var uniqueQuestion = function (arr) {
       //     var newarr = [];
       //     var unique = {};
       //     var onlydupiclateid = [];
       //     arr.forEach(function (item, index) {
       //         if (!unique[item.QuestionID]) {
       //             newarr.push(item);
       //             unique[item.QuestionID] = item;

       //         }
       //         else {
       //             onlydupiclateid.push(item);
       //         }
       //     });
          
       //     return onlydupiclateid;
       // }

       // var uniqueval = function (arr) {
       //     var newarr = [];
       //     var unique = {};
       //     arr.forEach(function (item, index) {
       //         if (!unique[item.QuestionID]) {
       //             newarr.push(item);
       //             unique[item.QuestionID] = item;
       //         }
       //     });

       //     return newarr;

       // }


       // var SubQuestionsAsParent = function (objSubquestion, lstSubQuestions) {
       //     for (var z = 0; z < objSubquestion.length; z++) {
       //         objSubquestion[z].childQuestion = [];

       //         for (var n = 0; n < vm.QuestionParentQuestion.length; n++) {

       //             if (objSubquestion[z].ID == vm.QuestionParentQuestion[n].ParentQuestionID) {
       //                 for (var p = 0; p < lstSubQuestions.length; p++) {

       //                     if (lstSubQuestions[p].ID == vm.QuestionParentQuestion[n].QuestionID) {

       //                         objSubquestion[z].childQuestion.push(lstSubQuestions[p]);
       //                         SubQuestionsAsParent(objSubquestion[z].childQuestion, lstSubQuestions);
       //                     }

       //                 }
       //             }
       //         }
       //     }

       // }

       // var subQuestionforAnswer = function (objSubquestion, lstSubQuestion) {
       //     for (var i = 0; i < objSubquestion.length; i++) {

       //         for (var j = 0; j < objSubquestion[i].Sections_Questions_Answers.length; j++) {
       //             objSubquestion[i].Sections_Questions_Answers[j].childQuestion = [];
       //             for (var n = 0; n < vm.QuestionParentQuestion.length; n++) {

       //                 if (objSubquestion[i].Sections_Questions_Answers[j].ID == vm.QuestionParentQuestion[n].ParentAnswerID) {
       //                     for (var l = 0; l < lstSubQuestion.length; l++) {


       //                         if (lstSubQuestion[l].ID == vm.QuestionParentQuestion[n].QuestionID && objSubquestion[i].Sections_Questions_Answers[j].ID == vm.QuestionParentQuestion[n].ParentAnswerID) {  //newly added
       //                             lstSubQuestion[l].ParentAnswerID = objSubquestion[i].Sections_Questions_Answers[j].ID;
       //                             //end
       //                             objSubquestion[i].Sections_Questions_Answers[j].childQuestion.push(lstSubQuestion[l]);
       //                             subQuestionforAnswer(objSubquestion[i].Sections_Questions_Answers[j].childQuestion, lstSubQuestion);
       //                         }
       //                     }
       //                 }


       //             }

       //         }
       //     }
       // }


       // //GetAllQuestion_ParentQuestion

       //ResidentsService.getAllActiveQuestionParentQuestion().then(
       //function (response) {
       //    vm.QuestionParentQuestion = response.data;
       //    vm.CopyQuestionParentQuestion = vm.QuestionParentQuestion;
       //    GetAllActiveSection();
       //},
       //function (err) {
       //    toastr.error('An error occurred while retrieving QuestionParentQuestion.');
       //}
       //);


       // var GetAllActiveSection = function () {

       //     ResidentsService.GetActiveSections().then(
       //         function (response) {
       //             vm.Sections = response.data;

       //             vm.CopyallSectionsQuestion = response.data;

       //             //Data Modifcation Start


       //             vm.MainQuestion = [];
       //             vm.SubQuestion = [];
       //             vm.AllSection = [];

       //             //To get All Section
       //             for (var x = 0; x < response.data.length; x++) {

       //                 vm.AllSection.push(response.data[x]);
       //             }

       //             //To separate mainQuestion and subquestion start

       //             for (var p = 0; p < response.data.length; p++) {

       //                 for (var q = 0; q < response.data[p].Sections_Questions.length; q++) {
       //                     var z = 0;
       //                     for (var r = 0; r < vm.QuestionParentQuestion.length ; r++) {


       //                         if (vm.QuestionParentQuestion[r].QuestionID == response.data[p].Sections_Questions[q].ID) {
       //                             z++;
       //                         }



       //                     }

       //                     if (z == 0) {
       //                         vm.MainQuestion.push(response.data[p].Sections_Questions[q]);
       //                     }
       //                     else {
       //                         vm.SubQuestion.push(response.data[p].Sections_Questions[q]);
       //                     }
       //                 }


       //             }

       //             //End


       //             //To add subQuestion To MainQuestion start

       //             for (var m = 0; m < vm.MainQuestion.length; m++) {
       //                 vm.MainQuestion[m].childQuestion = [];
       //                 for (var n = 0; n < vm.QuestionParentQuestion.length; n++) {

       //                     if (vm.MainQuestion[m].ID == vm.QuestionParentQuestion[n].ParentQuestionID) {
       //                         for (var p = 0; p < vm.SubQuestion.length; p++) {

       //                             if (vm.SubQuestion[p].ID == vm.QuestionParentQuestion[n].QuestionID) {

       //                                 vm.MainQuestion[m].childQuestion.push(vm.SubQuestion[p]);
       //                                 SubQuestionsAsParent(vm.MainQuestion[m].childQuestion, vm.SubQuestion);
       //                             }

       //                         }
       //                     }
       //                 }


       //             }


       //             //End



       //             //To add SubQuestion To Answers Start

       //             for (var k = 0; k < vm.MainQuestion.length; k++) {
       //                 for (var y = 0; y < vm.MainQuestion[k].Sections_Questions_Answers.length; y++) {
       //                     vm.MainQuestion[k].Sections_Questions_Answers[y].childQuestion = [];
       //                     for (var m = 0; m < vm.QuestionParentQuestion.length; m++) {

       //                         if (vm.MainQuestion[k].Sections_Questions_Answers[y].ID == vm.QuestionParentQuestion[m].ParentAnswerID) {
       //                             for (var n = 0; n < vm.SubQuestion.length; n++) {

       //                                 if (vm.SubQuestion[n].ID == vm.QuestionParentQuestion[m].QuestionID && vm.MainQuestion[k].Sections_Questions_Answers[y].ID == vm.QuestionParentQuestion[m].ParentAnswerID) {
       //                                     vm.SubQuestion[n].ParentAnswerID = vm.MainQuestion[k].Sections_Questions_Answers[y].ID;
       //                                     vm.MainQuestion[k].Sections_Questions_Answers[y].childQuestion.push(vm.SubQuestion[n]);
       //                                     subQuestionforAnswer(vm.MainQuestion[k].Sections_Questions_Answers[y].childQuestion, vm.SubQuestion)
       //                                 }
       //                             }
       //                         }


       //                     }
       //                 }

       //             }

       //             //End



                    
       //             //To add Child Question to sectionquestion

       //             for (var k = 0; k < vm.MainQuestion.length; k++) {
       //                 for (var i = 0; i < vm.MainQuestion[k].childQuestion.length; i++) {

       //                     //Start
       //                     for (var y = 0; y < vm.MainQuestion[k].childQuestion[i].Sections_Questions_Answers.length; y++) {
       //                         vm.MainQuestion[k].childQuestion[i].Sections_Questions_Answers[y].childQuestion = [];
       //                         for (var m = 0; m < vm.QuestionParentQuestion.length; m++) {

       //                             if (vm.MainQuestion[k].childQuestion[i].Sections_Questions_Answers[y].ID == vm.QuestionParentQuestion[m].ParentAnswerID) {
       //                                 for (var n = 0; n < vm.SubQuestion.length; n++) {

       //                                     if (vm.SubQuestion[n].ID == vm.QuestionParentQuestion[m].QuestionID && vm.MainQuestion[k].childQuestion[i].Sections_Questions_Answers[y].ID == vm.QuestionParentQuestion[m].ParentAnswerID) {
       //                                         vm.SubQuestion[n].ParentAnswerID = vm.MainQuestion[k].childQuestion[i].Sections_Questions_Answers[y].ID;
       //                                         vm.MainQuestion[k].childQuestion[i].Sections_Questions_Answers[y].childQuestion.push(vm.SubQuestion[n]);
       //                                         subQuestionforAnswer(vm.MainQuestion[k].childQuestion[i].Sections_Questions_Answers[y].childQuestion, vm.SubQuestion)
       //                                     }
       //                                 }
       //                             }


       //                         }
       //                     }


       //                     //End
       //                 }


       //             }

       //             //End



       //             //To AddQuestion To Section Start

                   
       //             for (var t = 0; t < vm.AllSection.length; t++) {
       //                 vm.AllSection[t].Sections_Questions = [];
       //                 for (var s = 0; s < vm.MainQuestion.length; s++) {

       //                     if (vm.MainQuestion[s].SectionID == vm.AllSection[t].ID) {
       //                         vm.AllSection[t].Sections_Questions.push(vm.MainQuestion[s]);
       //                     }


       //                 }

       //             }


       //             //Step1:

       //             // vm.CopyQuestionParentQuestion
       //             vm.onlyduplicates = uniqueQuestion(vm.CopyQuestionParentQuestion);
       //             vm.uniqueQuestionIDs = uniqueval(vm.onlyduplicates);

       //             console.log('Stp1');
       //             console.log(vm.uniqueQuestionIDs);


       //             if (vm.uniqueQuestionIDs.length > 0) {
       //                 vm.uniqueQuestionIDswithNoParAnsIds = [];

       //                 for (var k = 0; k < vm.uniqueQuestionIDs.length; k++) {
       //                     if (vm.uniqueQuestionIDs[k].ParentAnswerID == null) {
       //                         vm.uniqueQuestionIDswithNoParAnsIds.push(vm.uniqueQuestionIDs[k]);
       //                     }
       //                 }



       //                 if (vm.uniqueQuestionIDswithNoParAnsIds.length > 0) {
       //                     //Step2:
       //                     vm.AllParentQuestions = [];
       //                     for (var j = 0; j < vm.uniqueQuestionIDswithNoParAnsIds.length; j++) {

       //                         var newarray = { QuestionID: '', SectionQuestion: [] }
       //                         newarray.QuestionID = vm.uniqueQuestionIDswithNoParAnsIds[j].QuestionID;
       //                         for (var m = 0; m < vm.CopyQuestionParentQuestion.length; m++) {
       //                             if (vm.uniqueQuestionIDswithNoParAnsIds[j].QuestionID == vm.CopyQuestionParentQuestion[m].QuestionID) {
       //                                 if (vm.CopyallSectionsQuestion.length > 0) {
       //                                     for (var u = 0; u < vm.CopyallSectionsQuestion.length; u++) {
       //                                         for (var r = 0; r < vm.CopyallSectionsQuestion[u].Sections_Questions.length; r++) {
       //                                             if (vm.CopyallSectionsQuestion[u].Sections_Questions[r].ID == vm.CopyQuestionParentQuestion[m].ParentQuestionID)
       //                                                 newarray.SectionQuestion.push(vm.CopyallSectionsQuestion[u].Sections_Questions[r]);
       //                                         }

       //                                     }
       //                                 }

       //                             }
       //                         }
       //                         vm.AllParentQuestions.push(newarray);
       //                     }

       //                     if (vm.AllParentQuestions.length > 0) {
       //                         //step3


       //                         for (var zz = 0; zz < vm.AllParentQuestions.length; zz++) {


       //                             var array = [];
       //                             for (var yy = 0; yy < vm.AllParentQuestions[zz].SectionQuestion.length; yy++) {


       //                                 array.push(vm.AllParentQuestions[zz].SectionQuestion[yy].DisplayOrder)
       //                             }

       //                             var largest = 0;

       //                             for (i = 0; i <= largest; i++) {
       //                                 if (array[i] > largest) {
       //                                     var largest = array[i];
       //                                 }
       //                             }





       //                             for (var mm = 0; mm < vm.AllParentQuestions[zz].SectionQuestion.length; mm++) {

       //                                 if (vm.AllParentQuestions[zz].SectionQuestion[mm].DisplayOrder == largest) {
       //                                     vm.AllParentQuestions[zz].SectionQuestion[mm].lastquestion = 1;
       //                                 }


       //                             }



       //                         }

       //                         //step:4
       //                         if (vm.AllParentQuestions.length > 0) {

       //                             vm.AllSetQuestion = [];
       //                             for (var nn = 0; nn < vm.AllParentQuestions.length; nn++) {

       //                                 for (var w = 0; w < vm.AllParentQuestions[nn].SectionQuestion.length; w++) {

       //                                     var arrayMainQuesGroup = { filterdSectionQuestionID: '', GroupNo: '', IsLastQuesInGroup: false }
       //                                     arrayMainQuesGroup.filterdSectionQuestionID = vm.AllParentQuestions[nn].SectionQuestion[w].ID;
       //                                     arrayMainQuesGroup.GroupNo = nn;
       //                                     if (vm.AllParentQuestions[nn].SectionQuestion[w].lastquestion != undefined) {
       //                                         arrayMainQuesGroup.IsLastQuesInGroup = true;
       //                                     }
       //                                     vm.AllSetQuestion.push(arrayMainQuesGroup);
       //                                 }

       //                             }


       //                         }

       //                         //console.log('step4 complete');
       //                         //console.log(vm.AllSetQuestion);

       //                     }
       //                 }
       //             }




       //             //Step:6

       //             if (vm.AllSetQuestion.length > 0) {

       //                 for (var q = 0; q < vm.AllSection.length; q++) {
       //                     if (vm.AllSection[q].DisplayOrder == 7 || vm.AllSection[q].DisplayOrder == 11 || vm.AllSection[q].DisplayOrder == 6 || vm.AllSection[q].DisplayOrder == 4 || vm.AllSection[q].DisplayOrder == 9 || vm.AllSection[q].DisplayOrder == 5 || vm.AllSection[q].DisplayOrder == 8) {
       //                         for (var z = 0; z < vm.AllSection[q].Sections_Questions.length; z++) {

       //                             for (var L = 0; L < vm.AllSetQuestion.length; L++) {

       //                                 if (vm.AllSetQuestion[L].filterdSectionQuestionID == vm.AllSection[q].Sections_Questions[z].ID) {
       //                                     vm.AllSection[q].Sections_Questions[z].SetGroupNo = vm.AllSetQuestion[L].GroupNo;
       //                                     if (vm.AllSetQuestion[L].IsLastQuesInGroup == false) {
       //                                         vm.AllSection[q].Sections_Questions[z].childQuestion = [];
       //                                         vm.AllSection[q].Sections_Questions[z].LastQuestionInset = vm.AllSetQuestion[L].IsLastQuesInGroup;
       //                                     }
       //                                     else {
       //                                         vm.AllSection[q].Sections_Questions[z].LastQuestionInset = vm.AllSetQuestion[L].IsLastQuesInGroup;
       //                                         if (vm.AllSection[q].Sections_Questions[z].childQuestion.length > 0) {
       //                                             for (var c = 0; c < vm.AllSection[q].Sections_Questions[z].childQuestion.length; c++) {

       //                                                 vm.AllSection[q].Sections_Questions[z].childQuestion[c].childGroupNo = vm.AllSetQuestion[L].GroupNo;
       //                                             }
       //                                         }

       //                                     }

       //                                 }


       //                             }


       //                         }
                               
       //                     }

       //                 }
       //             }








       //             //End


                 






       //             //Data modification End


       //             vm.Sections = vm.AllSection;

       //             for (var i = 0; i < vm.Sections.length; i++) {
       //                 for (var j = 0; j < vm.Sections[i].Sections_Questions.length; j++) {
       //                     for (var k = 0; k < vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers.length; k++) {
       //                         if (vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers[k].IsDefault) {
       //                             vm.Sections[i].Sections_Questions[j].ChosenAnswerID = vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers[k].ID;
       //                         }
       //                         if (vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers[k].childQuestion && vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers[k].childQuestion.length > 0) {
       //                             BindChosenAnswerID(vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers[k].childQuestion);
       //                         }
       //                     }
       //                 }
       //             }

       //             console.log('vm.Sections');
       //             console.log(vm.Sections);

       //         },
       //         function (err) {
       //             toastr.error('An error occurred while retrieving sections.');
       //         }
       //     );

       // }

       // var BindChosenAnswerID = function (objQuestions) {
       //     for (var i = 0; i < objQuestions.length; i++) {
       //         for (var j = 0; j < objQuestions[i].Sections_Questions_Answers.length; j++) {
       //             if (objQuestions[i].Sections_Questions_Answers[j].IsDefault) {
       //                 objQuestions[i].ChosenAnswerID = objQuestions[i].Sections_Questions_Answers[j].ID;
       //             }
       //             if (objQuestions[i].Sections_Questions_Answers[j].childQuestion && objQuestions[i].Sections_Questions_Answers[j].childQuestion.length > 0) {
       //                 BindChosenAnswerID(objQuestions[i].Sections_Questions_Answers[j].childQuestion);
       //             }
       //         }
       //     }
       // };


        vm.SavePersonalInformation = function () {
           
            vm.isDisabled = true;
            if (vm.ResidentImage) {
                if (vm.ResidentImage.file) {
                    if (vm.ResidentImage.file.type == "image/jpeg" || vm.ResidentImage.file.type == "image/png" || vm.ResidentImage.file.type == "image/gif") {
                        vm.Resident.DOB = moment(new Date(vm.DOB)).format('YYYY-MM-DDTHH:mm:ss');
                       vm.Resident.DOJ = moment(new Date(vm.DOJ)).format('YYYY-MM-DDTHH:mm:ss');
                       vm.Resident.AdmittedFrom = moment(new Date(vm.AdmittedFrom)).format('YYYY-MM-DDTHH:mm:ss');
                        ResidentsService.SavePersonalInformation(vm.Resident).success(
                                function (response) {
                                
                                    vm.ResidentId = response.ID;
                                    UploadPhoto().then(
                                        function (response) {
                                            toastr.success('Personal Information saved successfully.');
                                            $location.path('/Residents');
                                        },
                                        function (err) {
                                            toastr.error(err);
                                        }
                                    );

                                },
                                function (err) {
                                    toastr.error('An error occured while saving personal information.');
                                }
                            );
                    } else {
                        toastr.info('Please Choose jpeg,png,gif.');
                    }
                } else {
                    toastr.info('Please Choose Photo.');
                }
            } else {
                toastr.info('Please Choose Photo.');
            }
        };

        //vm.SaveAssessmentData = function (objSection) {
        //    var lstResidents_Questions_Answers = [];
           
        //    for (var i = 0; i < objSection.Sections_Questions.length; i++) {
        //        var objResidents_Questions_Answers = {};
        //        if (objSection.Sections_Questions[i].ChosenAnswer != null || objSection.Sections_Questions[i].LastQuestionInset == true) {
        //            objResidents_Questions_Answers.ResidentId = vm.ResidentId;
        //            if (objSection.Sections_Questions[i].AnswerType == 'RadioButtonList') {
        //                objResidents_Questions_Answers.Section_Question_AnswerId = objSection.Sections_Questions[i].ChosenAnswer;
        //            }
        //            else if (objSection.Sections_Questions[i].AnswerType == 'DropDownList') {                       
        //                objResidents_Questions_Answers.Section_Question_AnswerId = objSection.Sections_Questions[i].ChosenAnswer;
        //            }
        //            else if (objSection.Sections_Questions[i].AnswerType == 'Yes/No') {
        //                if (objSection.Sections_Questions[i].ChosenAnswer)
        //                    objResidents_Questions_Answers.Section_Question_AnswerId = $filter('filter')(objSection.Sections_Questions[i].Sections_Questions_Answers, { LabelText: 'Yes' })[0].ID;
        //                else
        //                    objResidents_Questions_Answers.Section_Question_AnswerId = $filter('filter')(objSection.Sections_Questions[i].Sections_Questions_Answers, { LabelText: 'No' })[0].ID;
        //            }
        //            else if (objSection.Sections_Questions[i].AnswerType == 'FreeText') {
        //                objResidents_Questions_Answers.Section_Question_AnswerId = objSection.Sections_Questions[i].Sections_Questions_Answers[0].ID;
        //                objResidents_Questions_Answers.AnswerText = objSection.Sections_Questions[i].ChosenAnswer;
        //            }
        //            else if (objSection.Sections_Questions[i].AnswerType == 'Number') {
        //                objResidents_Questions_Answers.Section_Question_AnswerId = objSection.Sections_Questions[i].Sections_Questions_Answers[0].ID;
        //                objResidents_Questions_Answers.AnswerText = objSection.Sections_Questions[i].ChosenAnswer;
        //            }


        //            lstResidents_Questions_Answers.push(objResidents_Questions_Answers);
        //        }

        //        if (objSection.Sections_Questions[i].AnswerType == 'CheckBoxList') {
        //            for (var k = 0; k < objSection.Sections_Questions[i].MulChosenAnswerID.length; k++) {
        //                var objchkResidents_Questions_Answers = {};
        //                objchkResidents_Questions_Answers.ResidentId = vm.ResidentId;

        //                objchkResidents_Questions_Answers.Section_Question_AnswerId = objSection.Sections_Questions[i].MulChosenAnswerID[k];
        //                if (objSection.Sections_Questions[i].txtAreaAnswer) {
        //                    objchkResidents_Questions_Answers.AnswerText = objSection.Sections_Questions[i].txtAreaAnswer;
        //                }

        //                lstResidents_Questions_Answers.push(objchkResidents_Questions_Answers);
        //            }

        //        }

        //        if (objSection.Sections_Questions[i].AnswerType == 'FileUpload' && objSection.Sections_Questions[i].ChosenAnswer) {

        //            objResidents_Questions_Answers.Section_Question_AnswerId = $filter('filter')(objSection.Sections_Questions[i].Sections_Questions_Answers, { LabelText: 'Choose Form' })[0].ID;
        //            objResidents_Questions_Answers.FileData = objSection.Sections_Questions[i].ChosenAnswer.file;

        //        }

        //        if (objSection.Sections_Questions[i].MinScore != null) {

        //            lstResidents_Questions_Answers = lstResidents_Questions_Answers.concat(GetSubQuestionQuestion(objSection.Sections_Questions[i]));

        //        }
        //        else {
        //            lstResidents_Questions_Answers = lstResidents_Questions_Answers.concat(GetSubQuestionAnswers(objSection.Sections_Questions[i].Sections_Questions_Answers));
        //        }
        //    }

        //    UpdateAssessment(lstResidents_Questions_Answers);
        //};


        //var UpdateAssessment = function (lstResidents_Questions_Answers) {
        //    ResidentsService.UpdateAssessmentData(vm.ResidentId, lstResidents_Questions_Answers).then(
        //       function (response) {
        //           toastr.success('Assessment updated successfully.');
        //       },
        //       function (err) {
        //           toastr.error('An error occurred while updating assessment data.');
        //       }
        //   );
        //};

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
        //                    else if (objSection.Sections_Questions[i].AnswerType == 'FreeText') {
        //                        objResidents_Questions_Answers.Section_Question_AnswerId = answers[i].Sections_Questions1[j].Sections_Questions_Answers[0].ID;
        //                        objResidents_Questions_Answers.AnswerText = objSection.Sections_Questions[i].ChosenAnswer;
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


        //var GetSubQuestionAnswers = function (answers) {
        //    var lst = [];

        //    for (var i = 0; i < answers.length; i++) {
        //        if (answers[i].childQuestion && answers[i].childQuestion.length > 0) {
        //            for (var j = 0; j < answers[i].childQuestion.length; j++) {
        //                var objResidents_Questions_Answers = {};
        //                if (answers[i].childQuestion[j].ChosenAnswer != null && answers[i].childQuestion[j].ChosenAnswer != answers[i].childQuestion[j].OldChosenAnswer) {


        //                    objResidents_Questions_Answers.ResidentId = vm.ResidentId;
        //                    if (answers[i].childQuestion[j].AnswerType == 'RadioButtonList') {
        //                        objResidents_Questions_Answers.Section_Question_AnswerId = answers[i].childQuestion[j].ChosenAnswer;
        //                    }
        //                    else if (answers[i].childQuestion[j].AnswerType == 'DropDownList') {//newly added 4/19/2016
        //                        objResidents_Questions_Answers.Section_Question_AnswerId = answers[i].childQuestion[j].ChosenAnswer;
        //                    }
        //                    else if (answers[i].childQuestion[j].AnswerType == 'Yes/No') {
        //                        if (answers[i].childQuestion[j].ChosenAnswer)
        //                            objResidents_Questions_Answers.Section_Question_AnswerId = $filter('filter')(answers[i].childQuestion[j].Sections_Questions_Answers, { LabelText: 'Yes' })[0].ID;
        //                        else
        //                            objResidents_Questions_Answers.Section_Question_AnswerId = $filter('filter')(answers[i].childQuestion[j].Sections_Questions_Answers, { LabelText: 'No' })[0].ID;
        //                    }
        //                    else if (answers[i].childQuestion[j].AnswerType == 'FreeText') {
        //                        objResidents_Questions_Answers.Section_Question_AnswerId = answers[i].childQuestion[j].Sections_Questions_Answers[0].ID;
        //                        objResidents_Questions_Answers.AnswerText = answers[i].childQuestion[j].ChosenAnswer;
        //                    }
        //                    else if (answers[i].childQuestion[j].AnswerType == 'Number') {
        //                        objResidents_Questions_Answers.Section_Question_AnswerId = answers[i].childQuestion[j].Sections_Questions_Answers[0].ID;
        //                        objResidents_Questions_Answers.AnswerText = answers[i].childQuestion[j].ChosenAnswer;
        //                    }


        //                    lst.push(objResidents_Questions_Answers);
        //                }

        //                if (answers[i].childQuestion[j].AnswerType == 'CheckBoxList') {
        //                    if (answers[i].childQuestion[j].MulChosenAnswerID != undefined) {
        //                        for (var k = 0; k < answers[i].childQuestion[j].MulChosenAnswerID.length; k++) {
        //                            var objchkResidents_Questions_Answers = {};
        //                            objchkResidents_Questions_Answers.ResidentId = vm.ResidentId;

        //                            objchkResidents_Questions_Answers.Section_Question_AnswerId = answers[i].childQuestion[j].MulChosenAnswerID[k];

        //                            if (answers[i].childQuestion[j].txtAreaAnswer) {
        //                                objchkResidents_Questions_Answers.AnswerText = answers[i].childQuestion[j].txtAreaAnswer;
        //                            }
        //                            //if (answers[i].Sections_Questions1[j].txtAreaAnswer)
        //                            //    objchkResidents_Questions_Answers.AnswerText = answers[i].Sections_Questions1[j].txtAreaAnswer;

        //                            lst.push(objchkResidents_Questions_Answers);
        //                        }
        //                    }
        //                }

        //                if (answers[i].childQuestion[j].AnswerType == 'FileUpload' && answers[i].childQuestion[j].ChosenAnswer) {

        //                    objResidents_Questions_Answers.Section_Question_AnswerId = $filter('filter')(answers[i].childQuestion[j].Sections_Questions_Answers, { LabelText: 'Choose Form' })[0].ID;
        //                    objResidents_Questions_Answers.FileData = answers[i].childQuestion[j].ChosenAnswer.file;
        //                }

        //                if (answers[i].childQuestion[j].MinScore != null) {

        //                    lst = lst.concat(GetSubQuestionQuestion(answers[i].childQuestion[j]));

        //                }
        //                else {
        //                    lst = lst.concat(GetSubQuestionAnswers(answers[i].childQuestion[j].Sections_Questions_Answers));
        //                }
        //                //lst = lst.concat(GetSubQuestionAnswers(answers[i].childQuestion[j].Sections_Questions_Answers));
        //            }
        //        }
        //    }


        //    return lst;
        //};



        //var GetSubQuestionQuestion = function (answers) {
        //    var lst = [];


        //    for (var j = 0; j < answers.childQuestion.length; j++) {
        //        var objResidents_Questions_Answers = {};
        //        if (answers.childQuestion[j].ChosenAnswer != null && answers.childQuestion[j].ChosenAnswer != answers.childQuestion[j].OldChosenAnswer) {


        //            objResidents_Questions_Answers.ResidentId = vm.ResidentId;
        //            if (answers.childQuestion[j].AnswerType == 'RadioButtonList') {
        //                objResidents_Questions_Answers.Section_Question_AnswerId = answers.childQuestion[j].ChosenAnswer;
        //            }
        //            else if (answers.childQuestion[j].AnswerType == 'DropDownList') {
        //                //newly added 4/19/2016
        //                objResidents_Questions_Answers.Section_Question_AnswerId = answers.childQuestion[j].ChosenAnswer;
        //            }
        //            else if (answers.childQuestion[j].AnswerType == 'Yes/No') {
        //                if (answers.childQuestion[j].ChosenAnswer)
        //                    objResidents_Questions_Answers.Section_Question_AnswerId = $filter('filter')(answers.childQuestion[j].Sections_Questions_Answers, { LabelText: 'Yes' })[0].ID;
        //                else
        //                    objResidents_Questions_Answers.Section_Question_AnswerId = $filter('filter')(answers.childQuestion[j].Sections_Questions_Answers, { LabelText: 'No' })[0].ID;
        //            }
        //            else if (answers.childQuestion[j].AnswerType == 'FreeText') {
        //                objResidents_Questions_Answers.Section_Question_AnswerId = answers.childQuestion[j].Sections_Questions_Answers[0].ID;
        //                objResidents_Questions_Answers.AnswerText = answers.childQuestion[j].ChosenAnswer;
        //            }
        //            else if (answers.childQuestion[j].AnswerType == 'Number') {
        //                objResidents_Questions_Answers.Section_Question_AnswerId = answers.childQuestion[j].Sections_Questions_Answers[0].ID;
        //                objResidents_Questions_Answers.AnswerText = answers.childQuestion[j].ChosenAnswer;
        //            }


        //            lst.push(objResidents_Questions_Answers);
        //        }

        //        if (answers.childQuestion[j].AnswerType == 'CheckBoxList') {
        //            if (answers.childQuestion[j].MulChosenAnswerID != undefined) {
        //                for (var k = 0; k < answers.childQuestion[j].MulChosenAnswerID.length; k++) {
        //                    var objchkResidents_Questions_Answers = {};
        //                    objchkResidents_Questions_Answers.ResidentId = vm.ResidentId;

        //                    objchkResidents_Questions_Answers.Section_Question_AnswerId = answers.childQuestion[j].MulChosenAnswerID[k];

        //                    if (answers.childQuestion[j].txtAreaAnswer) {
        //                        objchkResidents_Questions_Answers.AnswerText = answers.childQuestion[j].txtAreaAnswer;
        //                    }
        //                    //if (answers[i].Sections_Questions1[j].txtAreaAnswer)
        //                    //    objchkResidents_Questions_Answers.AnswerText = answers[i].Sections_Questions1[j].txtAreaAnswer;

        //                    lst.push(objchkResidents_Questions_Answers);
        //                }
        //            }
        //        }

        //        if (answers.childQuestion[j].AnswerType == 'FileUpload' && answers.childQuestion[j].ChosenAnswer) {

        //            objResidents_Questions_Answers.Section_Question_AnswerId = $filter('filter')(answers.childQuestion[j].Sections_Questions_Answers, { LabelText: 'Choose Form' })[0].ID;
        //            objResidents_Questions_Answers.FileData = answers.childQuestion[j].ChosenAnswer.file;
        //        }


        //        if (answers.childQuestion[j].MinScore != null) {

        //            lst = lst.concat(GetSubQuestionQuestion(answers.childQuestion[j]));

        //        }
        //        else {
        //            lst = lst.concat(GetSubQuestionAnswers(answers.childQuestion[j].Sections_Questions_Answers));
        //        }



        //    }



        //    return lst;
        //};




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






        //var GetSubQuestion = function (SecQuesId, objSubQue) {

        //    vm.SubQuestion = {};

        //    console.log(objSubQue);

        //    ResidentsService.getSectionQuestionByID(SecQuesId).success(
        //          function (response) {
        //              vm.SubQuestion = response;
        //              objSubQue.push(vm.SubQuestion);
        //          },
        //          function (err) {
        //              deferred.reject('An error occured while Retrieving.');
        //          }
        //      );





        //}


        //vm.RadioButtonChange = function (objSection_Question) {
        //    objSection_Question.ChosenAnswerID = objSection_Question.ChosenAnswer;
        //}

        //vm.ToggleSwitchChange = function (objSection_Question) {

        //    if (objSection_Question.ChosenAnswer == true)
        //        objSection_Question.ChosenAnswerID = $filter('filter')(objSection_Question.Sections_Questions_Answers, { LabelText: 'Yes' })[0].ID;
        //    else
        //        objSection_Question.ChosenAnswerID = $filter('filter')(objSection_Question.Sections_Questions_Answers, { LabelText: 'No' })[0].ID;
        //}

        //vm.CheckBoxChange = function (objSection_Question, objsectionQuestionAnswer) {
        //    if (!objSection_Question.MulChosenAnswerID)
        //        objSection_Question.MulChosenAnswerID = [];

        //    if (objsectionQuestionAnswer.ChosenAnswer == true) {
        //        if (objsectionQuestionAnswer.LabelText != 'None') {
        //            objSection_Question.MulChosenAnswerID.push(objsectionQuestionAnswer.ID);

        //            for (var i = 0; i < objSection_Question.Sections_Questions_Answers.length; i++) {
        //                if (objSection_Question.Sections_Questions_Answers[i].LabelText == 'None') {
        //                    objSection_Question.Sections_Questions_Answers[i].ChosenAnswer = false;
        //                    var chosenAnswerIndex = objSection_Question.MulChosenAnswerID.indexOf(objSection_Question.Sections_Questions_Answers[i].ID);
        //                    if (chosenAnswerIndex > -1) {

        //                        objSection_Question.MulChosenAnswerID.splice(chosenAnswerIndex, 1);
        //                    }
        //                }
        //            }

        //        }
        //        else {
        //            objSection_Question.MulChosenAnswerID = [];
        //            objSection_Question.MulChosenAnswerID.push(objsectionQuestionAnswer.ID);

        //            for (var i = 0; i < objSection_Question.Sections_Questions_Answers.length; i++) {
        //                if (objSection_Question.Sections_Questions_Answers[i].ID != objsectionQuestionAnswer.ID) {
        //                    objSection_Question.Sections_Questions_Answers[i].ChosenAnswer = false;
        //                }
        //            }
        //        }
        //    }
        //    else {
        //        var chosenAnswerIndex = objSection_Question.MulChosenAnswerID.indexOf(objsectionQuestionAnswer.ID);
        //        if (chosenAnswerIndex > -1) {

        //            objSection_Question.MulChosenAnswerID.splice(chosenAnswerIndex, 1);
        //        }
        //    }



        //    console.log(objSection_Question.MulChosenAnswerID)
        //}



        //new Code

        //vm.RadioButtonChange = function (objSection_Question) {


        //    objSection_Question.ChosenAnswerID = objSection_Question.ChosenAnswer;
        //    //newly added

        //    objSection_Question.SumofScores = $filter('filter')(objSection_Question.Sections_Questions_Answers, { ID: objSection_Question.ChosenAnswer })[0].Score;

        //}

        //vm.ToggleSwitchChange = function (objSection_Question) {

        //    if (objSection_Question.ChosenAnswer == true)
        //        objSection_Question.ChosenAnswerID = $filter('filter')(objSection_Question.Sections_Questions_Answers, { LabelText: 'Yes' })[0].ID;
        //    else
        //        objSection_Question.ChosenAnswerID = $filter('filter')(objSection_Question.Sections_Questions_Answers, { LabelText: 'No' })[0].ID;
        //}

        ////Newlyadded
        //vm.copySumofScore = 0;
        ////

        //vm.CheckBoxChange = function (objSection_Question, objsectionQuestionAnswer) {
        //    if (!objSection_Question.MulChosenAnswerID)
        //        objSection_Question.MulChosenAnswerID = [];





        //    if (!objSection_Question.SumofScores) {

        //        objSection_Question.SumofScores = 0;
        //    }

        //    if (objsectionQuestionAnswer.ChosenAnswer == true) {
        //        if (objsectionQuestionAnswer.LabelText != 'None') {
        //            objSection_Question.MulChosenAnswerID.push(objsectionQuestionAnswer.ID);
        //            if (objsectionQuestionAnswer.Score) {
        //                objSection_Question.SumofScores = objSection_Question.SumofScores + objsectionQuestionAnswer.Score;

        //            }
        //            for (var i = 0; i < objSection_Question.Sections_Questions_Answers.length; i++) {
        //                if (objSection_Question.Sections_Questions_Answers[i].LabelText == 'None') {
        //                    objSection_Question.Sections_Questions_Answers[i].ChosenAnswer = false;
        //                    var chosenAnswerIndex = objSection_Question.MulChosenAnswerID.indexOf(objSection_Question.Sections_Questions_Answers[i].ID);
        //                    if (chosenAnswerIndex > -1) {

        //                        objSection_Question.MulChosenAnswerID.splice(chosenAnswerIndex, 1);
        //                    }
        //                }
        //            }

        //        }
        //        else {
        //            objSection_Question.MulChosenAnswerID = [];
        //            objSection_Question.MulChosenAnswerID.push(objsectionQuestionAnswer.ID);

        //            objSection_Question.SumofScores = 0;
        //            if (objsectionQuestionAnswer.Score) {
        //                objSection_Question.SumofScores = objSection_Question.SumofScores + objsectionQuestionAnswer.Score;

        //            }
        //            for (var i = 0; i < objSection_Question.Sections_Questions_Answers.length; i++) {
        //                if (objSection_Question.Sections_Questions_Answers[i].ID != objsectionQuestionAnswer.ID) {
        //                    objSection_Question.Sections_Questions_Answers[i].ChosenAnswer = false;
        //                }
        //            }
        //        }
        //    }
        //    else {
        //        var chosenAnswerIndex = objSection_Question.MulChosenAnswerID.indexOf(objsectionQuestionAnswer.ID);

        //        if (chosenAnswerIndex > -1) {

        //            objSection_Question.MulChosenAnswerID.splice(chosenAnswerIndex, 1);
        //            if (objsectionQuestionAnswer.Score) {
        //                objSection_Question.SumofScores = objSection_Question.SumofScores - objsectionQuestionAnswer.Score;

        //            }

        //        }
        //    }
           

        //    console.log('mulll');
        //    console.log(objSection_Question.MulChosenAnswerID)
        //}
      
        //vm.ShowChildQuestionQuestion = function (obj, val) {

        
          
        //        console.log(val.objSection.DisplayOrder);
        //        if (val.objSection.Name == 'Eating, Drinking & Nutrition') {
        //            var sectionScore = 0;
        //            for (var i = 0; i < val.objSection.Sections_Questions.length; i++) {
        //                if (val.objSection.Sections_Questions[i].AnswerType == 'FreeText') {
        //                    sectionScore += val.objSection.Sections_Questions[i].SumofScores;
        //                }
        //            }

        //            if (sectionScore > 0)
        //                return (obj.MinScore <= sectionScore && (obj.MaxScore >= sectionScore || obj.MaxScore == null));
        //            else
        //                return false;
        //        }
        //        else {



        //            if (obj.childGroupNo != undefined) {
        //                var SumofScoresofAllQuestion = 0;

        //                for (var i = 0; i < val.objSection.Sections_Questions.length; i++) {
        //                    if (val.objSection.Sections_Questions[i].SetGroupNo == obj.childGroupNo) {
        //                        if (val.objSection.Sections_Questions[i].SumofScores != undefined && val.objSection.Sections_Questions[i].SumofScores > 0) {
        //                            SumofScoresofAllQuestion += val.objSection.Sections_Questions[i].SumofScores;

        //                        }
        //                    }


        //                }
        //            }

        //            if (SumofScoresofAllQuestion > 0) {
        //                return (obj.MinScore <= SumofScoresofAllQuestion && (obj.MaxScore >= SumofScoresofAllQuestion || obj.MaxScore == null));
        //            }
        //            else {
        //                return false;
        //            }
        //        }
        //    //End

           



        //}
      

        //vm.textBoxChange = function (objSection_Question, objsectionQuestionAnswer) {

        //    if (objSection_Question.Question == 'Falls') {
        //        if (objSection_Question.SumofScores || objSection_Question.SumofScores == 0) {

        //            if (isNaN(objSection_Question.txtAreaAnswer) || objSection_Question.txtAreaAnswer == "") {

        //                if (!(objSection_Question.oldScore === undefined)) {
        //                    objSection_Question.SumofScores = objSection_Question.SumofScores - objSection_Question.oldScore;
        //                    objSection_Question.oldScore = 0;
        //                }

        //            }
        //            else {
        //                if (objSection_Question.SumofScores >= 0) {

        //                    if (objSection_Question.oldScore === undefined) {
        //                        objSection_Question.SumofScores = (objSection_Question.SumofScores) + parseInt(objSection_Question.txtAreaAnswer * 5);
        //                        objSection_Question.oldScore = objSection_Question.txtAreaAnswer * 5;
        //                    }
        //                    else {
        //                        objSection_Question.SumofScores = ((objSection_Question.SumofScores - objSection_Question.oldScore)) + parseInt(objSection_Question.txtAreaAnswer * 5);
        //                        objSection_Question.oldScore = objSection_Question.txtAreaAnswer * 5;
        //                    }
        //                }
        //                else {
        //                    objSection_Question.txtAreaAnswer = 0;
        //                    objSection_Question.SumofScores = objSection_Question.SumofScores + objSection_Question.txtAreaAnswer;
        //                    objSection_Question.oldScore = objSection_Question.txtAreaAnswer;
        //                }

        //            }
        //        }
        //    }


        //    if (objSection_Question.Question == 'Weight') {


        //        if (objSection_Question.oldScore === undefined)
        //            objSection_Question.SumofScores = 0;

        //        if (objSection_Question.SumofScores >= 0) {


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

        vm.Redirect=function()
        {
            $location.url('/Residents');
        }

    }

}());