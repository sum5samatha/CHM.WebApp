(function () {
    "use strict";

    angular.module('CHM').controller('LoginController', ['$rootScope', '$state', 'toastr', 'UsersService', function ($rootScope, $state, toastr, UsersService) {

        var vm = this;
        var UserPreviousLastLogin = null;
        var objuser = {};

        vm.LogIn = function () {

            UsersService.Login(vm.UserName, vm.Password).then(
                function (response) {
                    $rootScope.UserInfo = response;
                    UsersService.GetConfigurationValues().then(
                      function (response) {
                          var Configurations = response.data;
                          var lstIntervetnionList = [];
                          var lstSucideAlertPopup = [];
                          for (var i = 0; i < Configurations.length; i++) {
                              if (Configurations[i].OrganizationID == null && Configurations[i].ConfigurationKey == 'SucideAlertPopup') {
                                  Configurations[i].ConfigurationValue = Configurations[i].ConfigurationValue.split(',');
                                  lstSucideAlertPopup.push(Configurations[i]);
                              }
                              if (Configurations[i].OrganizationID != null && Configurations[i].ConfigurationKey == 'GenerateInterventionLimit') {
                                  lstIntervetnionList.push(Configurations[i]);
                              }
                          }
                          $rootScope.SucideAlertQuestionIds = lstSucideAlertPopup;
                          $rootScope.LimitofInterventions = lstIntervetnionList;

                      });

                    $rootScope.UserFirstLogin = false;
                    var Lastlogin = $rootScope.UserInfo.LastLogin;
                    if (Lastlogin != "")
                        UserPreviousLastLogin = moment(new Date((Lastlogin - 621355968000000000) / 10000)).format('YYYY-MM-DD HH:mm:ss');

                    if ($rootScope.UserInfo.RoleName == 'Administrator') {
                        $rootScope.IsAdmin = true;
                        $rootScope.IsSecondaryRead = false;
                    }
                    else if ($rootScope.UserInfo.RoleName == 'SecondaryUser' || $rootScope.UserInfo.RoleName == 'ViewOnly') {
                        $rootScope.IsSecondaryRead = true;
                        $rootScope.IsAdmin = false;
                    }
                    else {
                        $rootScope.IsAdmin = false;
                        $rootScope.IsSecondaryRead = false;
                    }
                    chkNoOfOrganizations();
                    //$state.go('Residents');
                },
                function (err) {
                    toastr.error('Login failed.');
                }
            );
        };

        var chkNoOfOrganizations = function () {

            UsersService.getUserOrganizations($rootScope.UserInfo.UserID).then(function (response) {
                if (response.data.Users_Organizations.length > 1 && $rootScope.IsAdmin) {
                    $state.go('Organizations');
                }
                else {
                    if (response.data.Users_Organizations[0]) {
                        $rootScope.OrganizationId = response.data.Users_Organizations[0].OrganizationID;
                        $state.go('Residents');
                    }
                    else {
                        UsersService.GetUserOrganizationByUserID($rootScope.UserInfo.UserID).then(function (response) {
                            if (UserPreviousLastLogin == null || (new Date(UserPreviousLastLogin).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0))) {
                                //if (((UserCurrentLogin < UserPreviousLastLogin) || (moment(new Date(UserPreviousLastLogin)).format('YYYY-MM-DD') != moment(new Date()).format('YYYY-MM-DD'))) || (UserPreviousLastLogin == null)) {
                                $rootScope.OrganizationId = response.data.OrganizationID;
                                $rootScope.UserFirstLogin = true;
                                $state.go('HandOverNotes');
                            }
                            else {
                                $rootScope.OrganizationId = response.data.OrganizationID;
                                $state.go('Residents');
                            }
                        }, function (err) {
                        });
                    }
                }
            }, function (err) {

            });
        }
        vm.ForgotPassword = function () {
            $state.go('ForgotPassword');
        }
        //For Debugging
        //vm.UserName = 'samathareddy216@gmail.com';
        //vm.Password = 'Password123';
        //vm.LogIn();
    }]);

}());