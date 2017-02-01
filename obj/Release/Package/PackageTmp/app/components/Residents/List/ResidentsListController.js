(function () {
    "use strict";

    angular.module('CHM').controller('ResidentsListController', ResidentsListController);

    ResidentsListController.$inject = ['$rootScope','$q', '$uibModal', '$window', 'toastr', 'ResidentsService', '$filter'];

    function ResidentsListController($rootScope,$q, $uibModal, $window, toastr, ResidentsService, $filter) {
        var vm = this;
        vm.ResidentsShowing = true;
        vm.ActiveResidentsShowing = true;
             
        vm.IsSecondaryReadonly = $rootScope.IsSecondaryRead;
      

        var getAllResidents = function () {
         
           ResidentsService.GetAllResidentsByOrganizationID($rootScope.OrganizationId).then(
                function (response) {
                
                    vm.ResidentWithPhoto = response.data;
                    var CurrentDate = moment().format();
                    var TodayDate = CurrentDate.split('T');
                    CurrentDate = TodayDate[0];

                   

                    for (var i = 0; i < vm.ResidentWithPhoto.length; i++) {
                        if (vm.ResidentWithPhoto[i].Resident.LeavingDate != null) {
                            var ResidentLeavingDate = vm.ResidentWithPhoto[i].Resident.LeavingDate;
                            var LeavingDate = ResidentLeavingDate.split('T');
                            ResidentLeavingDate = LeavingDate[0];
                            if (CurrentDate >= ResidentLeavingDate) {
                                ResidentsService.DeleteResident(vm.ResidentWithPhoto[i].Resident).then(function (response) {
                                 }, function (err) {
                                    toastr.err();
                                })
                            }
                        }
                    }

                    vm.search = function (item) {
                        if (vm.searchText == undefined) {
                            return true;
                        }
                        else {
                            if (item.Resident.FirstName.toLowerCase().indexOf(vm.searchText.toLowerCase()) != -1 ||
              item.Resident.LastName.toLowerCase().indexOf(vm.searchText.toLowerCase()) != -1 ||
              item.Resident.FirstName.toLowerCase().concat(' ').concat(item.Resident.LastName.toLowerCase()).indexOf(vm.searchText.toLowerCase()) != -1 ) {

                                return true;
                            }
                        }
                        return false;
                    }
                },
                function (err) {
                    toastr.error('An error occurred while retrieving Residents.');
                }
            );
        };
        getAllResidents();
    }
}());