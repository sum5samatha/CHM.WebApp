(function () {
    "use strict";

    angular.module('CHM').factory('UsersService', UsersService);

    UsersService.$inject = ['$rootScope', '$q', '$http', '$window'];

    function UsersService($rootScope, $q, $http, $window) {

        var objUsersService = {};

        objUsersService.Login = login;

        objUsersService.GetConfigurationValues = getConfigurationValues;

        objUsersService.GetUsers = getUsers;

        objUsersService.GetActiveUsers = getActiveUsers;

        objUsersService.GetUserInfo = getUserInfo;

        objUsersService.GetCurrentUserDetails = getCurrentUserDetails;

        objUsersService.CreateUser = createUser;

        objUsersService.GetRoles = GetRoles;

        objUsersService.SaveUser = SaveUser;

        objUsersService.getUserInformation = getUserInformation;

        objUsersService.ViewUserInformation = ViewUserInformation;

        objUsersService.UpdateUser = UpdateUser;

        objUsersService.DeleteUser = DeleteUser;

        objUsersService.DeleteUserOrganization = DeleteUserOrganization;

        objUsersService.getUserOrganizations = getUserOrganizations;
        objUsersService.GetUserOrganizationByUserID = GetUserOrganizationByUserID;

        objUsersService.GetUserTypes = GetUserTypes;
        objUsersService.getAllOrganization = getAllOrganization;

       // objUsersService.CheckOldPassword = CheckOldPassword;
        objUsersService.getActiveUsersByOrganizationID = getActiveUsersByOrganizationID;

        objUsersService.UpdateUserDetails = UpdateUserDetails;
        objUsersService.ForgotUserPassword = ForgotUserPassword;
        objUsersService.ForgotUserPasswordByEmail = ForgotUserPasswordByEmail;

        objUsersService.GetMasterDataBasedonOrganization = GetMasterDataBasedonOrganization;
        objUsersService.GetMasterDataResidents = GetMasterDataResidents;
        objUsersService.GetEmailsInAllOrganization = GetEmailsInAllOrganization;
        objUsersService.GetUserNameInAllOrganization = GetUserNameInAllOrganization;
        objUsersService.GetUserNameBasedOnOrganization = GetUserNameBasedOnOrganization;
        objUsersService.GetMasterDatabasedonQuestionIds = GetMasterDatabasedonQuestionIds;      
        

        return objUsersService;

        function login(userName, password) {
           
            var deferred = $q.defer();

            $http({
                method: 'POST',
                url: $rootScope.RootUrl + '/token',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': undefined },
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: { grant_type: 'password', UserName: userName, Password: password }
            }).then(
                function (response) {
              
                    var UserInfo = {
                        Token: response.data.access_token,
                        UserName: response.data.name,
                        RoleName: response.data.Role,
                        UserID: response.data.UserID,
                        LastLogin :response.data.LastLogin,                      
                    };
                    //$window.sessionStorage["FinanceUserInfo"] = JSON.stringify($rootScope.UserInfo);
                    deferred.resolve(UserInfo);
                },
                function (err) {
                    deferred.reject(err);
                }
            );
            return deferred.promise;
        }

        function getConfigurationValues() {
            return $http.get($rootScope.ApiPath + 'Users/GetConfigurationsValues');
        }

        function getUsers() {
            return $http.get($rootScope.ApiPath + 'Users/GetAllUsers');
        }

        function getUserInformation(UserID) {
            return $http.get($rootScope.ApiPath + 'Users/GetUser?UserID=' + UserID);
        }

        function getUserOrganizations(UserID)
        {
            return $http.get($rootScope.ApiPath + 'Users/GetUserOrganizations?UserID=' + UserID);
        }

        function GetUserOrganizationByUserID(UserID) {
            return $http.get($rootScope.ApiPath + 'Users/GetUserOrganizationByUserID?UserID=' + UserID);
        }

        
        function getAllOrganization() {
            return $http.get($rootScope.ApiPath + 'Users/GetOrganization');
        }

        function getActiveUsers() {
            return $http.get($rootScope.ApiPath + 'Users/GetAllActiveUsers');
        }
        function getActiveUsersByOrganizationID(OrganizationID) {
            return $http.get($rootScope.ApiPath + 'Users/GetAllActiveUsersByOrganizationId?OrganizationID=' + OrganizationID);
        }

        function getUserInfo() {
            if ($window.sessionStorage["FinanceUserInfo"]) {
                return JSON.parse($window.sessionStorage["FinanceUserInfo"]);
            }
            return null;
        }

        function getCurrentUserDetails() {
            return $http.get($rootScope.ApiPath + 'Users/GetCurrentUserDetails');
        }

        function createUser(objUser) {
            return $http.post($rootScope.ApiPath + 'Users/Register', objUser);
        }


        function GetRoles() {

            return $http.get($rootScope.ApiPath + 'Roles/GetActiveRoles');

        }


        function SaveUser(user) {
            return $http.post($rootScope.ApiPath + 'Users/SaveUser', user);
        }

        function ViewUserInformation(UserID) {
            return $http.get($rootScope.ApiPath + 'Users/ViewUser?UserID='+UserID);
        }
        function UpdateUser(objUser) {
            return $http.post($rootScope.ApiPath + 'Users/UpdateUser', objUser);
        }

        function DeleteUser(objUser) {
            return $http.post($rootScope.ApiPath + 'Users/DeleteUser', objUser);
        }
        
        function DeleteUserOrganization(objUser) {
            return $http.post($rootScope.ApiPath + 'Users/DeleteUserOrganizations', objUser);
        }
        //function CheckOldPassword(objUserID) {
          
        //    return $http.get($rootScope.ApiPath + 'Users/CheckOldPassword', objUserID);
        //}
        function UpdateUserDetails(ObjUser) {
            return $http.post($rootScope.ApiPath + 'Users/UpdateUser', ObjUser);
        }

        function ForgotUserPassword(Username)
        {
            return $http.post($rootScope.ApiPath + 'Users/GetUserName?Username=' + Username);
        }

        function ForgotUserPasswordByEmail(UserEmail) {
            return $http.post($rootScope.ApiPath + 'Users/GetUserEmail?UserEmail=' + UserEmail);
        }
        function GetUserTypes()
        {
            return $http.get($rootScope.ApiPath + 'Users/GetUserTypes');
        }

        function GetMasterDataBasedonOrganization(OrganizationID)
        {
            return $http.get($rootScope.ApiPath + 'Syncronization/GetMasterDataBasedonOrganization?guidOrganizationID=' + OrganizationID);
        }

        function GetMasterDataResidents(OrganizationID)
        {
            return $http.get($rootScope.ApiPath + 'Syncronization/GetResidentsDataBasedonOrganization?guidOrganizationID=' + OrganizationID);
        }

        function GetEmailsInAllOrganization()
        {
            return $http.get($rootScope.ApiPath + 'Users/GetAllEmails');
        }

        function GetUserNameInAllOrganization()
        {
            return $http.get($rootScope.ApiPath + 'Users/GetAllUserName');
        }

        function GetUserNameBasedOnOrganization(OrganizationID)
        {
            return $http.get($rootScope.ApiPath + 'Users/GetAllUserNameByOrganizationID?guidOrganizationID=' + OrganizationID);
        }

        function GetMasterDatabasedonQuestionIds(objQuestionIds)
        {       
            return $http.post($rootScope.ApiPath + 'Syncronization/MasterDatabasedonQuestionIds', objQuestionIds);
        }
    }

}());