/* App Module */
var app = angular.module('app', ['ngResource', 'ui.map','ui.event']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'index.html',   controller: 'MainCtrl'});
}]);