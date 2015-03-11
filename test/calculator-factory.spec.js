describe('CalculatorFactory spec', function() {

    beforeEach(module('app'));

    var calcFact;

    beforeEach(inject(function(CalculatorFactory) {
        calcFact = CalculatorFactory;
    }));

    it('should fill _parsed when _init() is called', function() {
        expect(calcFact._parsed).toBe(null);
        calcFact._init();
        expect(calcFact._parsed).toBeDefined();
    });

    it('_parse() should correctly parse bets', function() {
        calcFact._init();
        calcFact._parse('Bet:W:1:3\nBet:W:2:4\nBet:W:3:5\nResult:2:3:1');
        expect(calcFact._parsed.W.pool).toBe(12);
        expect(calcFact._parsed.W.bets.length).toBe(3);
    });

    it('_findWinner() should correctly identify winners for Win', function() {
        calcFact._init();
        calcFact._parse('Bet:W:1:3\nBet:W:2:4\nBet:W:3:5\nResult:2:3:1');
        calcFact._findWinners();
        expect(calcFact._parsed.W.winners.length).toBe(1);
    });

    it('_findWinner() should correctly identify winners for Place', function() {
        calcFact._init();
        calcFact._parse('Bet:P:2:89\nBet:P:3:28\nBet:P:4:72\nResult:2:3:1');
        calcFact._findWinners();
        expect(calcFact._parsed.P.winners1.length).toBe(1);
        expect(calcFact._parsed.P.winners2.length).toBe(1);
        expect(calcFact._parsed.P.winners3.length).toBe(0);
    });

    it('_findWinner() should correctly identify winners for Exacta', function() {
        calcFact._init();
        calcFact._parse('Bet:E:1,2:13\nBet:E:2,3:98\nResult:2:3:1');
        calcFact._findWinners();
        expect(calcFact._parsed.E.winners.length).toBe(1);
    });

    it('_calcPools() should extract 15% for Win', function() {
        calcFact._init();
        calcFact._parse('Bet:W:1:3\nBet:W:2:4\nBet:W:3:5\nResult:2:3:1');
        calcFact._calcPools();
        expect(calcFact._parsed.W.pool).toBe(10.2);
    });

    it('_calcPools() should extract 12% for Place', function() {
        calcFact._init();
        calcFact._parse('Bet:P:2:89\nBet:P:3:28\nBet:P:4:72\nResult:2:3:1');
        calcFact._calcPools();
        expect(calcFact._parsed.P.pool).toBe(55.44);
    });

    it('_calcPools() should extract 18% for Exacta', function() {
        calcFact._init();
        calcFact._parse('Bet:E:1,2:13\nBet:E:2,3:98\nResult:2:3:1');
        calcFact._calcPools();
        expect(calcFact._parsed.E.pool).toBe(91.02);
    });

});
