(function () {
    "use strict";

    angular.module('CHM').controller('EditInterventionsListController', EditInterventionsListController);

    EditInterventionsListController.$inject = ['$rootScope', '$q', '$filter', '$scope', '$location', '$uibModalInstance', 'ngTableParams', 'toastr', 'ResidentsService', 'InterventionsService', 'Intervention'];

    function EditInterventionsListController($rootScope, $q, $filter, $scope, $location, $uibModalInstance, ngTableParams, toastr, ResidentsService, InterventionsService, Intervention) {
        var vm = this;

        var LoadData = function () {
            vm.InterventionData = [];
            var objTiming = { Id:"",Name:"",StartDate: [],StartTime: new Date(), EndTime: new Date() };

            objTiming.Id = Intervention.ID;
            objTiming.Name = Intervention.Actions_Days.Action.Section_Intervention.InterventionTitle;
            objTiming.StartDate = new Date(moment(Intervention.PlannedStartDate));
           // objTiming.StartDate = new Date(Intervention.PlannedStartDate);
            
            var starttime = moment(Intervention.PlannedStartDate).format('HH:mm:ss');
            var startTimeParts = starttime.split(':');
            var PlannedStartTime = new Date().setHours(startTimeParts[0], startTimeParts[1]);

            var endtime = moment(Intervention.PlannedEndDate).format('HH:mm:ss');
            var endTimeParts = endtime.split(':');
            var PlannedEndTime = new Date().setHours(endTimeParts[0], endTimeParts[1]);

            objTiming.StartTime = PlannedStartTime;
            objTiming.EndTime = PlannedEndTime;
                //new Date(Intervention.PlannedEndDate);
            vm.InterventionData.push(objTiming);
        }

        LoadData();
        vm.OpenRecurrenceStartDate = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.InteventionDateOpened = true;
        }

        vm.CloseRecurrencePattern = function () {
            $uibModalInstance.dismiss();
        };

        vm.UpdateIntervention=function(obj)
        {
            var objUpdateIntervention = { Id: "", Name: "", StartDate: [], StartTime: "", EndTime: "" };
            objUpdateIntervention.Id = obj.Id;
            objUpdateIntervention.Name = obj.Name;
            objUpdateIntervention.StartDate = obj.StartDate;
            objUpdateIntervention.StartTime = moment(obj.StartTime).format('HH:mm:ss');
            objUpdateIntervention.EndTime = moment(obj.EndTime).format('HH:mm:ss');

            InterventionsService.UpdategeneratedInterventions(objUpdateIntervention).then(
                function (response) {
                    toastr.success('Updated Intervention sucessfully');
                    $uibModalInstance.close(vm.InterventionData);
                },
                function (err) {
                    toastr.error('An error occured while updating Intervention.');
                
                }

                );

          
           
            

        }

    }


}());
