(function () {
    "use strict";

    angular.module('CHM').controller('InterventionsController', InterventionsController);

    InterventionsController.$inject = ['$rootScope', '$q', '$filter', '$scope', '$location', '$uibModal', 'SweetAlert', 'ngTableParams', 'toastr', 'ResidentsService', 'InterventionsService'];

    function InterventionsController($rootScope, $q, $filter, $scope, $location,$uibModal,SweetAlert, ngTableParams, toastr, ResidentsService, InterventionsService) {
        var vm = this;
        vm.show = false;
        vm.ResidentsShowing = true;
     
        vm.Interventions = [];
       // vm.InterventionDate = [];
        vm.openIntervention = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            if (vm.ResidentIDs)
                vm.InterventionDateOpened = true;
            else
                toastr.info('Please Choose Resident.');
        };

      

        ResidentsService.getActiveResidentsByOrganizationID($rootScope.OrganizationId).then(
            function (response) {
              
                vm.AllResidents = response.data;
                vm.Residents = [];
                for (var i = 0; i < vm.AllResidents.length; i++) {
                    vm.Residents.push(vm.AllResidents[i].Resident);

                }


            },
            function (err) {
                toastr.error('An error occurred while retrieving Residents.');
            })

        vm.ClearDate=function()
        {
            vm.InterventionDate = null;
            //vm.Interventions = null;
            vm.show = false;
            //$scope.AllIntervention.$params.page = 1;
            //$scope.AllIntervention.reload();
        }

        vm.GetInterventionDate = function (obj) {
            vm.show = true;
            var todayDate = moment(new Date(obj)).format('YYYY-MM-DD');
            vm.todayDate = todayDate;
            LoadPersonalInforamtion(todayDate)
          
        }

        var LoadPersonalInforamtion = function (todayDate) {
            InterventionsService.GetInterventionsForResident(vm.ResidentIDs, todayDate, todayDate).then(
                function (response) {

                    if (response.data.length > 0)
                    {
                        for (var i = 0; i < response.data.length; i++) {
                            if (response.data[i].Status == null)
                                response.data[i].Status = "Pending";
                            else if(response.data[i].Status=="NotCompleted")
                                response.data[i].Status = "Not Completed";
                            else if (response.data[i].Status == "PartiallyCompleted")
                                response.data[i].Status = "Partially Completed";
                            else
                            {

                            }
                        }
                       
                    }

                    vm.Interventions = response.data;

                    $scope.AllIntervention.$params.page = 1;
                    $scope.AllIntervention.reload();


                },
                function (err) {
                    toastr.error('An error occurred while retrieving interventions.');
                }
            );

        }
    
        vm.EditIntervention=function(obj)
        {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/components/Interventions/EditInterventionList/EditInterventionsList.html?v=1',
                controller: 'EditInterventionsListController',
                controllerAs: 'vm',
                resolve: {
                    Intervention: function () {
                        return obj;
                    }
                },
                backdrop: 'static',
                size: 'lg'
            });      

            modalInstance.result.then(
            function (response) {
                $q.all(response).then(
                     function (res) {

                         LoadPersonalInforamtion(vm.todayDate);
                     }

             );
            }, function () {

            });

        }

        vm.ViewIntervention=function(obj)
        {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/components/Interventions/ViewInterventionList/ViewInterventions.html',
                controller: 'ViewInterventionsController',
                controllerAs: 'vm',
                resolve: {
                    Intervention: function () {
                        return obj;
                    }
                },
                backdrop: 'static',
                size: 'lg'
            });

            modalInstance.result.then(
            function (response) {
                $q.all(response).then(
                     function (res) {

                         //LoadPersonalInforamtion(vm.todayDate);
                     }

             );
            }, function () {

            });
        }

        vm.DeleteIntervention = function (obj) {
           

            var sweetAlertOptions = {
                title: "",
                text: "Are you sure you want to mark this Intervention for deletion?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!"
            };

            SweetAlert.swal(sweetAlertOptions,
                function (isConfirm) {
                    if (isConfirm) {
                        InterventionsService.DeactiveGeneratedIntervention(obj.ID).then(
                            function () {
                                toastr.success('Deleted Intervention sucessfully');
                                LoadPersonalInforamtion(vm.todayDate);
                            },
                            function (err) {
                                toastr.error('An error occurred while deleting interventions.');
                            }
                        );
                    }
                }
            );
        }


            $scope.AllIntervention = new ngTableParams({
                page: 1,            // show first page
                count: 12,          // count per page
                sorting: {
                    Author: 'asc'     // initial sorting
                }
            }, {
                total: vm.Interventions.length, // length of data
                counts: [],
                getData: function ($defer, params) {
                    var data = vm.Interventions;

                    var orderedData = params.sorting() ?
                                        $filter('orderBy')(data, params.orderBy()) :
                                        data;

                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    params.total(orderedData.length);
                }
            });
            $scope.AllIntervention.settings().$scope = $scope;

        
    }
    

}());