(function () {
    "use strict";

    angular.module('CHM').controller('NewAdhocInterventionController', NewAdhocInterventionController);

    NewAdhocInterventionController.$inject = ['$rootScope', '$q', '$uibModalInstance', '$filter', '$location', 'toastr', 'residentId', 'ResidentsService', 'InterventionsService'];

    function NewAdhocInterventionController($rootScope, $q, $uibModalInstance, $filter, $location, toastr, residentId, ResidentsService, InterventionsService) {
        var vm = this;


        vm.ResidentId = residentId;

        //Binding Residents DropDown
        ResidentsService.getActiveResidentsByOrganizationID($rootScope.OrganizationId).then(
            function (response) {
                vm.AllResidents = response.data;
                vm.Residents = [];
                for (var i = 0; i < vm.AllResidents.length; i++) {
                    if (vm.AllResidents[i].Resident.IsAccepted)
                        vm.Residents.push(vm.AllResidents[i].Resident);
                }
            },
            function (err) {
                toastr.error('An error occurred while retrieving Residents.');
            })

        //Get Section Intervention
        ResidentsService.GetActiveSectionIntervention().then(
            function (response) {
                vm.sectionIntervention = response.data;

            }, function (err) {

            })


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

        var objCarePlan = {};
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
        ResetRecurrencePattern(objCarePlan);
        ResetRecurrenceRange(objCarePlan);
        vm.Recurrence = objCarePlan.Recurrence;

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

        vm.ToggleWeekDaySelection = function (objRecurrence, weekDay) {
            var idx = objRecurrence.SelectedWeekDays.indexOf(weekDay);

            // is currently selected
            if (idx > -1) {
                objRecurrence.SelectedWeekDays.splice(idx, 1);
                objRecurrence.SelectedWeekDayTimings.splice(idx, 1);
            }
            else {
                objRecurrence.SelectedWeekDays.push(weekDay);
                objRecurrence.SelectedWeekDayTimings.push([{ StartTime: new Date(), EndTime: new Date() }]);
            }

        };

        vm.CloseRecurrencePattern = function () {
            $uibModalInstance.dismiss('cancel');
        };

        vm.SaveRecurrencePattern = function () {

            vm.Recurrence.Section_InterventionID = vm.sectionInterventionID;
            vm.Recurrence.ResidentID = vm.ResidentIDs;
            if (vm.InterventionFile != undefined) {
                vm.Recurrence.FileData = vm.InterventionFile.file;
            }
            saveAdhocIntervention(vm.Recurrence);
           };

        vm.AddTiming = function (objRecurrence) {
            var objTiming = { StartTime: new Date(), EndTime: new Date() };
            objRecurrence.Timings.push(objTiming);
        };

        vm.RemoveTiming = function (objRecurrence, $index) {
            objRecurrence.Timings.splice($index, 1);
        }

        vm.AddWeekDayTiming = function (objWeekDayTimings) {
            var objTiming = { StartTime: new Date(), EndTime: new Date() };
            objWeekDayTimings.push(objTiming);
        };

        vm.RemoveWeekDayTiming = function (objWeekDayTimings, $index) {
            objWeekDayTimings.splice($index, 1);
        }

        vm.OpenRecurrenceStartDate = function (objRecurrence, $event) {
            $event.preventDefault();
            $event.stopPropagation();
            objRecurrence.RecurrenceStartDateOpened = true;
        }

        vm.OpenRecurrenceEndDate = function (objRecurrence, $event) {
            $event.preventDefault();
            $event.stopPropagation();
            objRecurrence.RecurrenceEndDateOpened = true;
        }

        //End - Recurrence Pattern

        var saveAdhocIntervention = function (objCareplan) {
            var lstActions = [];
            vm.DisableGenerateTask = true;


            var objAction = {};

            objAction.ResidentID = vm.ResidentIDs;
             objAction.Section_InterventionID = objCareplan.Section_InterventionID;
            objAction.StartDate = new Date(objCareplan.RecurrenceStartDate);
            if (objCareplan.FileData)
                objAction.FileData = objCareplan.FileData;
            objAction.EndDate = null;
            objAction.Occurrences = null;
            objAction.Actions_Days = [];
            switch (objCareplan.RecurrenceRange) {
                case 'NoOfOccurrences':
                    objAction.Occurrences = objCareplan.NoOfOccurrences;
                    break;
                case 'RecurrenceEndDate':
                    objAction.EndDate = new Date(objCareplan.RecurrenceEndDate);
                    break;
            }

            if (objCareplan.RecurrenceType == 'Daily') {
                objAction.Type = 'Daily';
                objAction.Interval = objCareplan.RecurrenceInterval;

                for (var j = 0; j < objCareplan.Timings.length; j++) {
                    var objAction_Day = {};
                    objAction_Day.Day = null;
                    objAction_Day.Date = null;
                    objAction_Day.StartTime = moment(objCareplan.Timings[j].StartTime).format('HH:mm:ss');
                    objAction_Day.EndTime = moment(objCareplan.Timings[j].EndTime).format('HH:mm:ss');
                    objAction_Day.Specifications = null;

                    objAction.Actions_Days.push(objAction_Day);
                }

            }
            else if (objCareplan.RecurrenceType == 'Weekly') {
                objAction.Type = 'Weekly';
                objAction.Interval = objCareplan.RecurrenceInterval;
                objAction.RecurrenceDay = objCareplan.SelectedWeekDays.toString();

                for (var j = 0; j < objCareplan.SelectedWeekDays.length; j++) {
                    for (var k = 0; k < objCareplan.SelectedWeekDayTimings[j].length; k++) {
                        var objAction_Day = {};
                        objAction_Day.Day = objCareplan.SelectedWeekDays[j];
                        objAction_Day.Date = null;
                        objAction_Day.StartTime = moment(objCareplan.SelectedWeekDayTimings[j][k].StartTime).format('HH:mm:ss');
                        objAction_Day.EndTime = moment(objCareplan.SelectedWeekDayTimings[j][k].EndTime).format('HH:mm:ss');
                        objAction_Day.Specifications = null;

                        objAction.Actions_Days.push(objAction_Day);
                    }
                }

            }
            else if (objCareplan.RecurrenceType == 'Monthly') {
                if (objCareplan.MonthlyPattern == 'Date') {
                    objAction.Type = 'Monthly';
                    objAction.Interval = objCareplan.RecurrenceInterval;

                    for (var j = 0; j < objCareplan.Timings.length; j++) {
                        var objAction_Day = {};
                        objAction_Day.Day = null;
                        objAction_Day.Date = objCareplan.RecurrenceDate;
                        objAction_Day.StartTime = moment(objCareplan.Timings[j].StartTime).format('HH:mm:ss');;
                        objAction_Day.EndTime = moment(objCareplan.Timings[j].EndTime).format('HH:mm:ss');
                        objAction_Day.Specifications = null;

                        objAction.Actions_Days.push(objAction_Day);
                    }

                }
                else {
                    objAction.Type = 'MonthlyNth';
                    objAction.Interval = objCareplan.RecurrenceInterval;
                    objAction.Instance = objCareplan.Instance;

                    for (var j = 0; j < objCareplan.Timings.length; j++) {
                        var objAction_Day = {};
                        objAction_Day.Day = objCareplan.RecurrenceDay;
                        objAction_Day.Date = null;
                        objAction_Day.StartTime = moment(objCareplan.Timings[j].StartTime).format('HH:mm:ss');;
                        objAction_Day.EndTime = moment(objCareplan.Timings[j].EndTime).format('HH:mm:ss');
                        objAction_Day.Specifications = null;

                        objAction.Actions_Days.push(objAction_Day);
                    }
                }
            }
            else {
                if (objCareplan.YearlyPattern == 'Date') {
                    objAction.Type = 'Yearly';
                    objAction.Month = objCareplan.RecurrenceMonth;

                    for (var j = 0; j < objCareplan.Timings.length; j++) {
                        var objAction_Day = {};
                        objAction_Day.Day = null;
                        objAction_Day.Date = objCareplan.RecurrenceDate;
                        objAction_Day.StartTime = moment(objCareplan.Timings[j].StartTime).format('HH:mm:ss');;
                        objAction_Day.EndTime = moment(objCareplan.Timings[j].EndTime).format('HH:mm:ss');
                        objAction_Day.Specifications = null;

                        objAction.Actions_Days.push(objAction_Day);
                    }

                }
                else {
                    objAction.Type = 'YearlyNth';
                    objAction.Month = objCareplan.RecurrenceMonth;
                    objAction.Instance = objCareplan.Instance;

                    for (var j = 0; j < objCareplan.Timings.length; j++) {
                        var objAction_Day = {};
                        objAction_Day.Day = objCareplan.RecurrenceDay;
                        objAction_Day.Date = null;
                        objAction_Day.StartTime = moment(objCareplan.Timings[j].StartTime).format('HH:mm:ss');;
                        objAction_Day.EndTime = moment(objCareplan.Timings[j].EndTime).format('HH:mm:ss');
                        objAction_Day.Specifications = null;

                        objAction.Actions_Days.push(objAction_Day);
                    }
                }
            }
            lstActions.push(objAction);

            if (lstActions.length > 0) {
                InterventionsService.GenerateAdhocInterventions(vm.ResidentIDs, lstActions).then(
                    function (response) {
                        toastr.success('Interventions generated successfully.');
                        vm.DisableGenerateTask = false;
                        $uibModalInstance.close(vm.Recurrence);
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
    }

}());