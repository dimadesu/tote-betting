app.controller('MainCtrl', function($scope, CalculatorFactory) {
    $scope.calculateDividends = function () {
        $scope.stdout = CalculatorFactory.calc($scope.stdin);
    };
});
