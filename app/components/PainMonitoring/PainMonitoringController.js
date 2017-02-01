(function () {
    "use strict";

    angular.module('CHM').controller('PainMonitoringController', PainMonitoringController);

    PainMonitoringController.$inject = ['$scope', '$rootScope', '$q', '$uibModal', '$window', 'toastr', 'SweetAlert', 'ResidentsService', '$filter'];

    function PainMonitoringController($scope,$rootScope, $q, $uibModal, $window, toastr,SweetAlert, ResidentsService, $filter) {
        var vm = this;
      
        vm.SelectedParts = [];
        vm.RemoveAlreadyAddedPart = [];
        vm.ResidentID = "4F0F4F44-4647-4641-8D84-3542256E4A8E";
      
        // vm.ResidentId = $stateParams.ResidentId;
        var color = function () {
            for (var i = 0; i < $("path").length; i++) {
                var ids = $("path")[i].id;
                if (ids != "border" && ids != "") {

                    $("#" + ids + "").css('fill', 'white');
                }
            }
        }
        color();
        var clickedparts = [];
        $("path").click(function () {
            var a = ($(this)[0].id);
            if (a != "border" && a != "") {
                if (vm.SelectedParts.length > 0) {
                    var newpart = true;
                    for (var i = 0; i < vm.SelectedParts.length; i++) {
                        if (vm.SelectedParts[i].PartsID == a) {
                            if (vm.SelectedParts[i].Description != "") {
                                vm.RemoveAlreadyAddedPart.push(vm.SelectedParts[i].ID);
                                vm.AlertPainMonitoringPart().then(function (response) {
                                    if (response) {
                                        vm.RemoveAlreadyAddedPart;
                                        newpart = false;
                                        var elementindex = vm.SelectedParts[i];
                                        vm.SelectedParts.splice(elementindex, 1);
                                        $("#" + a + "").css('fill', 'white');

                                    
                                        
                                    }
                                }, function err(err) {
                                    console.log(err);
                                });
                            }
                            newpart = false;
                            var elementindex = vm.SelectedParts[i];
                            vm.SelectedParts.splice(elementindex, 1);
                            $("#" + a + "").css('fill', 'white');
                        }

                      
                    }
                    if (newpart) {
                        $("#" + a + "").css('fill', 'red');
                        vm.SelectedParts.push({ PartsID: a, Description: "", ResidentID: vm.ResidentID, OrganizationID: $rootScope.OrganizationId });
                    }
                }
                else {
                    $("#" + a + "").css('fill', 'red');
                    vm.SelectedParts.push({ PartsID: a, Description: "", ResidentID: vm.ResidentID, OrganizationID: $rootScope.OrganizationId });
                }
            }
        });

        
        vm.SavePainMonitoring = function () {
           
         
         
            vm.DeletePainMonitoring();
            ResidentsService.SavePainMonitoring(vm.SelectedParts).success(
                   
                                           
                                  function (response) {
                                     
                                      toastr.success("Pain Monitoring Saved Sucessfully")

                                  },
                                  function (err) {
                                      toastr.error('An error occured while saving Pain Monitoring.');
                                  }
                              );
        }

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
                   

        vm.DeletePainMonitoring = function () {
           
            ResidentsService.DeletePainMonitoringPart(vm.RemoveAlreadyAddedPart).then(function (response) {
                         }, function (err) {

                toastr.error('An error occured while deleting Pain Monitoring.');
            })
        }
       

        var GetPainMonitoring = function () {
            var ResidentID = vm.ResidentID;
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
       
        var BindColor=function(obj)
        {
            for (var i = 0; i < obj.length; i++) {
                $("#" + obj[i].PartsID + "").css('fill', 'red');
            }
            
        }

               
    }

}());