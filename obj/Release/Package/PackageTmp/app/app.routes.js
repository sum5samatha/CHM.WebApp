(function () {
    "use strict";



    angular.module('CHM').config(['$stateProvider', '$urlRouterProvider', 'IdleProvider', 'KeepaliveProvider', function ($stateProvider, $urlRouterProvider, IdleProvider, KeepaliveProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider
          .state('Login', {
              url: '/',
              templateUrl: 'app/Components/Users/Login/Login.html?v=1',
              controller: 'LoginController',
              controllerAs: 'vm'
          })
          .state('Organizations', {
              url: '/Organizations',
              templateUrl: 'app/components/Organizations/List/OrganizationList.html',
              controller: 'OrganizationListController',
              controllerAs: 'vm',
              params:
              {
                  OrganizationGroupID: { value: null, squash: false },
                  hiddenParam: 'YES'
              }
          })
          .state('NewOrganization', {
              url: '/NewOrganization',
              templateUrl: 'app/components/Organizations/New/AddOrganization.html',
              controller: 'AddOrganizationController',
              controllerAs: 'vm',
              params:
              {
                  OrganizationGroupID: { value: null, squash: false },
                  hiddenParam: 'YES'
              }
          })
            .state('EditOrganization', {
                url: '/EditOrganization',
                templateUrl: 'app/components/Organizations/Edit/EditOrganization.html',
                controller: 'EditOrganizationController',
                controllerAs: 'vm',
                params:
                {
                    OrganizationID: { value: null, squash: false },
                    hiddenParam: 'YES'
                }
            })
        .state('Residents', {
            url: '/Residents',
            templateUrl: 'app/Components/Residents/List/ResidentsList.html?v=2',
            controller: 'ResidentsListController',
            controllerAs: 'vm'
        })
        .state('NewResident', {
            url: '/NewResident',
            templateUrl: 'app/Components/Residents/New/NewResident.html?v=4',
            controller: 'NewResidentController',
            controllerAs: 'vm'
        })
        .state('EditResident', {
            url: '/EditResident',
            templateUrl: 'app/Components/Residents/Edit/EditResident.html?v=12',
            controller: 'EditResidentController',
            controllerAs: 'vm',
            params: {
                ResidentId: { value: null, squash: false },
                hiddenParam: 'YES'
            }
        })
        .state('ViewResident', {
            url: '/ViewResident',
            templateUrl: 'app/Components/Residents/View/ViewResident.html?v=6',
            controller: 'ViewResidentController',
            controllerAs: 'vm',
            params: {
                ResidentId: { value: null, squash: false },
                hiddenParam: 'YES'
            }
        })

        .state('RiskAssessmentSummary', {
            url: '/RiskAssessmentSummary',
            templateUrl: 'app/Components/RiskAssessmentSummary/RiskAssessmentSummary.html?v=3',
            controller: 'RiskAssessmentSummaryController',
            controllerAs: 'vm',
            params: {
                ResidentId: { value: null, squash: false },
                EditMode: { value: false, squash: false },
                hiddenParam: 'YES'
            }
        })
        .state('EditCarePlan', {
            url: '/EditCarePlan',
            templateUrl: 'app/Components/CarePlan/Edit/EditCarePlan.html?v=5',
            controller: 'EditCarePlanController',
            controllerAs: 'vm',
            params: {
                ResidentId: { value: null, squash: false },
                hiddenParam: 'YES'
            }
        })
        .state('ViewCarePlan', {
            url: '/ViewCarePlan',
            templateUrl: 'app/Components/CarePlan/View/ViewCarePlan.html?v=5',
            controller: 'ViewCarePlanController',
            controllerAs: 'vm',
            params: {
                ResidentId: { value: null, squash: false },
                hiddenParam: 'YES'
            }
        })
        .state('ResidentInterventions', {
            url: '/ResidentInterventions',
            templateUrl: 'app/Components/Interventions/Resident/ResidentInterventions.html?v=6',
            controller: 'ResidentInterventionsController',
            controllerAs: 'vm',
            params: {
                ResidentId: { value: null, squash: false },
                hiddenParam: 'YES'
            }
        })
           .state('AdhocIntervention', {
               url: '/AdhocIntervention',
               templateUrl: 'app/Components/AdhocIntervention/AdhocInterventionList/AdhocInterventionList.html',
               controller: 'AdhocInterventionListController',
               controllerAs: 'vm',
               params: {
                   ResidentId: { value: null, squash: false },
                   hiddenParam: 'YES'
               }
           })
            .state('Interventions', {
                url: '/Interventions',
                templateUrl: 'app/Components/Interventions/InterventionsList/Interventions.html?v=1',
                controller: 'InterventionsController',
                controllerAs: 'vm',
                params: {
                    ResidentId: { value: null, squash: false },
                    hiddenParam: 'YES'
                }
            })
        .state('DailyDairy', {
            url: '/DailyDairy',
            templateUrl: 'app/Components/DailyDairy/DailyDairy.html',
            controller: 'DailyDairyController',
            controllerAs: 'vm',
            params: {
                ResidentId: { value: null, squash: false },
                hiddenParam: 'YES'
            }
        })
          .state('UsersList', {
              url: '/UsersList',
              templateUrl: 'app/Components/Users/List/UsersList.html',
              controller: 'UsersListController',
              controllerAs: 'vm',
              params: {
                  ResidentId: { value: null, squash: false },
                  hiddenParam: 'YES'
              }
          })
             .state('EditUser', {
                 url: '/EditUser',
                 templateUrl: 'app/Components/Users/Edit/EditUser.html',
                 controller: 'EditUserController',
                 controllerAs: 'vm',
                 params: {
                     UserId: { value: null, squash: false },
                     hiddenParam: 'YES'
                 }
             })
              .state('NewUser', {
                  url: '/NewUser',
                  templateUrl: 'app/Components/Users/New/NewUser.html',
                  controller: 'NewUserController',
                  controllerAs: 'vm',
                  params: {
                      ResidentId: { value: null, squash: false },
                      hiddenParam: 'YES'
                  }
              })
             .state('ViewUser', {
                 url: '/ViewUser',
                 templateUrl: 'app/Components/Users/View/ViewUser.html',
                 controller: 'ViewUserController',
                 controllerAs: 'vm',
                 params: {
                     ResidentId: { value: null, squash: false },
                     hiddenParam: 'YES'
                 }
             })
            .state('ChangePassword', {
                url: '/ChangePassword',
                templateUrl: 'app/Components/Users/ChangePassword/ChangePassword.html',
                controller: 'ChangePasswordController',
                controllerAs: 'vm',
                params: {
                    UserId: { value: null, squash: false },
                    hiddenParam: 'YES'
                }
            })
            .state('ForgotPassword', {
                url: '/ForgotPassword',
                templateUrl: 'app/Components/Users/ForgotPassword/ForgotPassword.html',
                controller: 'ForgotPasswordController',
                controllerAs: 'vm',
                params: {
                    UserId: { value: null, squash: false },
                    hiddenParam: 'YES'
                }
            })
             .state('UserOrganizations', {
                 url: '/UserOrganizations',
                 templateUrl: 'app/Components/Organizations/UserOrganizations/UserOrganizationsList.html',
                 controller: 'UserOrganizationsListController',
                 controllerAs: 'vm',
                 params: {
                     UserId: { value: null, squash: false },
                     hiddenParam: 'YES'
                 }
             })
              .state('NewUserOrganizations', {
                  url: '/NewUserOrganizations',
                  templateUrl: 'app/Components/Organizations/NewUserOrganizations/NewUserOrganizations.html',
                  controller: 'NewUserOrganizationsController',
                  controllerAs: 'vm',
                  params: {
                      UserGroupId: { value: null, squash: false },
                      hiddenParam: 'YES'
                  }
              })
             .state('MobileAPP', {
                 url: '/MobileAPP',
                 templateUrl: 'app/components/Mobile/MobileDownload/MobileAppDownload.html',
                 controller: 'MobileAppDownloadController',
                 controllerAs: 'vm'
             })
             .state('PainMonitoring', {
                 url: '/PainMonitoring',
                 templateUrl: 'app/components/PainMonitoring/PainMonitoring.html',
                 controller: 'PainMonitoringController',
                 controllerAs: 'vm'
             })
          .state('HandOverNotes', {
              url: '/HandOverNotes',
              templateUrl: 'app/Components/HandOverNotes/HandOverNotes.html?v=1',
              controller: 'HandOverNotesController',
              controllerAs: 'vm',
              params: {
                  ResidentId: { value: null, squash: false },
                  hiddenParam: 'YES'
              }
          })
            //Anil 09-01-2017
         .state('ResidentDocumentViewer', {
             url: '/ResidentDocumentViewer',
             templateUrl: 'app/components/ResidentDocumentsViewer/ResidentDocumentsViewer.html?v=1',
             controller: 'ResidentDocumentsViewerController',
             controllerAs: 'vm',
             params: {
                 ResidentId: { value: null, squash: false },
                 hiddenParam: 'YES'
             }
         });

        IdleProvider.idle(1200);//in sec
        IdleProvider.timeout(15);//in sec
        KeepaliveProvider.interval(10);//by default 10 times. Aleem changed to 1 for testing..

    }]);

    angular.module('CHM').run(['$rootScope', '$state', '$window', '$location', 'UsersService', 'Idle', function ($rootScope, $state, $window, $location, UsersService, Idle) {

        //google analytics
        $window.ga('create', 'UA-80836044-1', 'auto');
        Idle.watch();

        $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {
            //google analytics

            $window.ga('send', 'pageview', $location.path());
            if (toState.name == 'Login') {
                if ($rootScope.UserInfo)
                    e.preventDefault();
                return;
            }

            if (!$rootScope.UserInfo) {
                if (toState.name == 'ForgotPassword') {
                    return;
                } else {
                    e.preventDefault();
                    $state.go('Login');
                }

            }
        });

        $rootScope.DateFormat = 'dd-MMMM-yyyy';
        $rootScope.DateFormatForMoment = 'YYYY-MM-DD';
        $rootScope.disabled = function (date, mode) {
            return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
        };

        $rootScope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            initDate: new Date()
        };

        $rootScope.Logout = function () {
            $rootScope.UserInfo = null;
            $rootScope.OrganizationId = null;
            $rootScope.UserType = null;
            $state.go('Login');
        };


        $rootScope.RootUrl = '';
        // $rootScope.RootUrl = 'http://b422c890.ngrok.io'; //'http://win-domain:1234';
       // $rootScope.RootUrl = 'http://SF-D001:1234';
        // $rootScope.RootUrl = 'http://enthusis.azurewebsites.net';
        //$rootScope.RootUrl = 'http://54.171.141.65/lm';
        $rootScope.ApiPath = $rootScope.RootUrl + '/api/';



    }]);


}());
