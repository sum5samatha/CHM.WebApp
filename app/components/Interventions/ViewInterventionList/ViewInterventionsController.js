(function () {
    "use strict";

    angular.module('CHM').controller('ViewInterventionsController', ViewInterventionsController);

    ViewInterventionsController.$inject = ['$rootScope', '$q', '$filter', '$scope', '$location', '$uibModalInstance', 'ngTableParams', 'toastr', 'ResidentsService', 'InterventionsService', 'Intervention'];

    function ViewInterventionsController($rootScope, $q, $filter, $scope, $location, $uibModalInstance, ngTableParams, toastr, ResidentsService, InterventionsService, Intervention) {
        var vm = this;



        vm.ViewIntervention = Intervention;

        vm.CloseRecurrencePattern = function () {
            $uibModalInstance.dismiss();
        };
    }


}());
