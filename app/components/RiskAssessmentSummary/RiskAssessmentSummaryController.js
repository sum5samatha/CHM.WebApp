(function () {
    "use strict";

    angular.module('CHM').controller('RiskAssessmentSummaryController', RiskAssessmentSummaryController);

    RiskAssessmentSummaryController.$inject = ['$q', '$uibModal', '$window', '$filter', '$stateParams', 'toastr', 'ResidentsService'];

    function RiskAssessmentSummaryController($q, $uibModal, $window, $filter, $stateParams, toastr, ResidentsService) {
        var vm = this;

        vm.ResidentId = $stateParams.ResidentId;
        vm.EditMode = $stateParams.EditMode;
        vm.Resident = {};
        if (!vm.ResidentId) {

        }

        vm.PrintElem = function (elem) {
            Popup($(elem).html());
        }

        function Popup(data) {
            var Name = vm.Resident.FirstName + ' ' + vm.Resident.LastName;
            var mywindow = window.open('', '', 'height=400,width=600');
            mywindow.document.write('<html><head><title> '+Name+' </title>');
            /*optional stylesheet*/ //mywindow.document.write('<link rel="stylesheet" href="main.css" type="text/css" />');
            mywindow.document.write('</head><body >');
            mywindow.document.write(data);
            mywindow.document.write('</body></html>');

            mywindow.document.close(); // necessary for IE >= 10
            mywindow.focus(); // necessary for IE >= 10

            mywindow.print();
            mywindow.close();

            return true;
        }


        vm.OpenOnlyOneSection = false;
        vm.Sections = [];
        vm.AssessmentSummary = [];

        //DOB Datepicker Settings
        vm.openDOB = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.DOBOpened = true;
        };

        vm.AcceptAsResident = function () {
            ResidentsService.AcceptAsResident(vm.ResidentId).then(
                function (response) {
                    toastr.success('Prospect accepted as a resident.');
                    vm.Resident.IsAccepted = true;
                },
                function (err) {
                    toastr.error('An error occurred while accepting as resident.');
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

        ResidentsService.getNewRequiredAssessmentSummary(vm.ResidentId).then(
            function (response) {
                vm.AssessmentSummary = response.data;
                GetAssessementSummary(vm.AssessmentSummary);
            },
            function (err) {
                toastr.error('An error occurred while retrieving assessment answers.');
            }
        );

        var GetAssessementSummary = function (obj) {
            ResidentsService.GetActiveSections().then(
            function (response) {
                vm.Sections = response.data;

                for (var i = 0; i < vm.Sections.length; i++) {
                    vm.Sections[i].Assessment = [];
                    //for (var j = 0; j < obj.length; j++) {
                    //    if (obj[j].SectionID == vm.Sections[i].ID) {
                    //        var Summary = { Question: "", LabelTxt: "" ,DisplayOrder:0,InterventionName:"",Occurrence:"",Type:"",startDate:""};
                    //        Summary.Question = obj[j].Question;
                    //        Summary.LabelTxt = obj[j].LabelTxt;
                    //        Summary.DisplayOrder = obj[j].DisplayOrder;
                    //        if(obj[j].InterventionName!=null)
                    //            Summary.InterventionName = obj[j].InterventionName;

                    //        if (obj[j].Type != null)
                    //        {
                    //            Summary.Occurrence = obj[j].Ocuurrence;
                    //            Summary.Type = obj[j].Type;
                    //            Summary.startDate = obj[j].StartDate;


                    //        }
                    //        vm.Sections[i].Assessment.push(Summary);
                    //    }
                    //}
                    for (var j = 0; j < obj.length; j++) {
                        if (obj[j].SectionID == vm.Sections[i].ID) {
                            var Summary = { Question: "", LabelTxt: "" ,DisplayOrder:0,Intervention:[]};
                            Summary.Question = obj[j].Question;
                            Summary.LabelTxt = obj[j].LabelTxt;
                            Summary.DisplayOrder = obj[j].DisplayOrder;

                            if(obj[j].lstGroupIntervention!=null)
                            {
                                for (var m = 0; m < obj[j].lstGroupIntervention.length; m++) {

                                    var interventiondata = { InterventionName: "", Occurrence: "", Type: "", startDate: "" };

                                    if (obj[j].lstGroupIntervention[m].InterventionName != null)
                                        interventiondata.InterventionName = obj[j].lstGroupIntervention[m].InterventionName;

                                    if (obj[j].lstGroupIntervention[m].Type != null) {
                                        interventiondata.Occurrence = obj[j].lstGroupIntervention[m].Ocuurrence;
                                        interventiondata.Type = obj[j].lstGroupIntervention[m].Type;
                                        interventiondata.startDate = obj[j].lstGroupIntervention[m].StartDate;


                                    }

                                    Summary.Intervention.push(interventiondata);
                                }
                              
                                
                            }




                            vm.Sections[i].Assessment.push(Summary);
                        }
                    }


                    if (vm.Sections[i].Assessment.length > 0)
                        vm.Sections[i].HasAssesment = true;
                    else
                        vm.Sections[i].HasAssesment = false;

                }


            },
            function (err) {
                toastr.error('An error occurred while retrieving assessment answers.');
            }
        );
        }



        vm.BindSectionQuestion = function (objSectionQuestion) {
            var ResidentFullName = vm.Resident.FirstName + " " + vm.Resident.LastName;
            var res = objSectionQuestion.replace("ResidentName", ResidentFullName);
            return res;
        }
        vm.chk=function(obj)
        {
            var s = obj;
        }
    }

}());