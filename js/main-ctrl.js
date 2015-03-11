app.controller('MainCtrl', function($scope, StdinFactory, CalculatorFactory) {
    $scope.stdin = StdinFactory.bets;
    // I've separated calculation in a separate thing, so that it was potentially more reusable
    $scope.stdout = CalculatorFactory.calc($scope.stdin);
});
