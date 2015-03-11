app.controller('MainCtrl', function($scope, CalculatorFactory) {
    $scope.calc = function () {
        $scope.stdout = CalculatorFactory.calc($scope.stdin);
    };
});
