(function () {
    "use strict";

    angular.module('CHM').controller('AdhocInterventionListController', AdhocInterventionListController);

    AdhocInterventionListController.$inject = ['$rootScope', '$q', '$sce', '$uibModal', '$window', '$filter', '$stateParams', 'toastr', 'SweetAlert', 'UsersService', 'ngTableParams', '$scope', 'ResidentsService', 'InterventionsService'];

    function AdhocInterventionListController($rootScope,$q, $sce, $uibModal, $window, $filter, $stateParams, toastr,SweetAlert, UsersService, ngTableParams, $scope, ResidentsService, InterventionsService) {

        var vm = this;
        vm.AdhocIntervention = [];
        vm.ResidentId = $stateParams.ResidentId;
        
        var GetAdhocIntervention=function()
        {
            ResidentsService.GetActiveAdhocSectionIntervention($rootScope.OrganizationId).then(function (response) {
               vm.AdhocIntervention = response.data;
               $scope.AllIntervention.$params.page = 1;
               $scope.AllIntervention.reload();
                 }, function (err) {

           })
        }
        GetAdhocIntervention();

        //var userpagination = function () {
             $scope.AllIntervention= new ngTableParams({
                page: 1,            // show first page
                count: 10,          // count per page
                sorting: {
                    Created: 'desc'     // initial sorting
                }
            }, {
                total: vm.AdhocIntervention.length, // length of data
                counts: [],
                getData: function ($defer, params) {
                    var data = vm.AdhocIntervention;

                    var orderedData = params.sorting() ?
                                        $filter('orderBy')(data, params.orderBy()) :
                                        data;

                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    params.total(orderedData.length);
                }
            });
            $scope.AllIntervention.settings().$scope = $scope;
   
        vm.GenrateIntervention = function ()
        {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/components/AdhocIntervention/NewAdhocIntervention/NewAdhocIntervention.html',
                controller: 'NewAdhocInterventionController',
                controllerAs: 'vm',
                resolve: {
                    residentId: function () {
                        return vm.ResidentId;
                    }
                },
                backdrop: 'static',
                size: 'lg'
            });

            modalInstance.result.then(
            function (response) {
              $q.all(response).then(
                   function (res) {
                  
                       GetAdhocIntervention();
                   }
                   
           );
          }, function () {

          });
        }

        vm.DeleteAdhocIntervention=function(objAction)
        {
            var sweetAlertOptions = {
                title: "",
                text: "Are you sure you want to mark this Adhoc Intervention for deletion?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!"
            };

            SweetAlert.swal(sweetAlertOptions, function (isConfirm) {
                if (isConfirm) {
                    InterventionsService.DeActiveAdhocIntervention(objAction).then(
                         function (response) {
                             GetAdhocIntervention();
                             toastr.success('Removed Sucessfully .');


                         }, function (err) {
                             toastr.error('An error occurred while deleting Ad hoc Intervention.');
                         })
                }
            });
        }
    }

}());