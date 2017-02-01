(function () {
    "use strict";

    angular.module('CHM').controller('RecurrencePatternController', RecurrencePatternController);

    RecurrencePatternController.$inject = ['$rootScope', '$q', '$uibModalInstance', '$filter', 'toastr','recurrence','title'];

    function RecurrencePatternController($rootScope, $q, $uibModalInstance, $filter, toastr, recurrence,title) {
        var vm = this;

        vm.Recurrence = recurrence;
        vm.Title = title;
        
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
            $uibModalInstance.dismiss();
        };

        vm.SaveRecurrencePattern = function () {
            $uibModalInstance.close(vm.Recurrence);
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

    }

}());