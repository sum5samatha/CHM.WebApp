(function () {

    angular.module('CHM').directive("signature", ['$rootScope', function ($rootScope) {
        return function ($scope, element, attrs) {
            $(element).signature();

            //$(element).signature({
            //    background: '#ffffff', // Colour of the background 
            //    color: '#000000', // Colour of the signature 
            //    thickness: 2, // Thickness of the lines 
            //    guideline: false, // Add a guide line or not? 
            //    guidelineColor: '#a0a0a0', // Guide line colour 
            //    guidelineOffset: 25, // Guide line offset from the bottom 
            //    guidelineIndent: 10, // Guide line indent from the edges 
            //    // Error message when no canvas 
            //    notAvailable: 'Your browser doesn\'t support signing',
            //    syncField: null, // Selector for synchronised text field 
            //    change: null // Callback when signature changed 
            //});
        };
    }]);

}());