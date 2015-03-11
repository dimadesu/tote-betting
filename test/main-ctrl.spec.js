describe('MainCtrl spec', function() {

    beforeEach(module('app'));

    var ctrl, scope, sampleInput = 'Bet:E:3,2:51\nResult:2:3:1';

    beforeEach(inject(function($controller, $rootScope, CalculatorFactory) {
        scope = $rootScope.$new();
        ctrl = $controller('MainCtrl', {
            $scope: scope,
            CalculatorFactory: CalculatorFactory
        });
    }));

    it('stdin and stdout should be undefined initially', function() {
        expect(scope.stdout).toBeUndefined();
        expect(scope.stdin).toBeUndefined();
        expect(scope.calculateDividends).toBeDefined();
    });

    it('should make scope.stdout defined after calling calculateDividends()', function() {
        scope.stdin = sampleInput;
        scope.calculateDividends();
        expect(scope.stdout).toBeDefined();
    });

    it('scope.stdout should have length of 5 in the end', function() {
        scope.stdin = sampleInput;
        scope.calculateDividends();
        expect(scope.stdout.length).toBe(5);
    });

});
