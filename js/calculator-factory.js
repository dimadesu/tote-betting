app.factory("CalculatorFactory", function(){

    return {

        _parsed: null,

        _init: function () {

            this._parsed = {
                W: {
                    bets: [],
                    pool: 0
                },
                P: {
                    bets: [],
                    pool: 0
                },
                E: {
                    bets: [],
                    pool: 0
                },
                result: null
            };

        },

        _parse: function (stdin) {

            /* Note: I figured I could simply use "".split(':')
             after I wrote regular expressions, but I believe there is not much difference */
            var betExp = /Bet:(W|P|E):(\d+(?:,\d+)*):(\d+)/,
                resultExp = /Result:(\d+):(\d+):(\d+)/;

            // Manage difference in new line character between OS
            stdin.replace(/\r\n/g, '\n')
                // Create array of lines. Note: no need to trim Angular took care of that
                .split('\n')
                .forEach(function(bet){
                    var match = bet.match(betExp);
                    if (match !== null) {
                        var product = match[1],
                            selection = match[2],
                            stake = window.parseInt(match[3], 10);
                        this._parsed[product].bets.push({
                            selection: selection,
                            stake: stake
                        });
                        this._parsed[product].pool += stake;
                    } else {
                        match = bet.match(resultExp);
                        // Array with 3 numbers
                        this._parsed.result = match.slice(1);
                    }
                }, this);

        },

        _findWinners: function () {

            // Filter to find winners
            this._parsed.W.winners = this._parsed.W.bets.filter(function(bet){
                return bet.selection === this._parsed.result[0];
            }, this);
            this._parsed.P.winners1 = this._parsed.P.bets.filter(function(bet){
                return bet.selection === this._parsed.result[0];
            }, this);
            this._parsed.P.winners2 = this._parsed.P.bets.filter(function(bet){
                return bet.selection === this._parsed.result[1];
            }, this);
            this._parsed.P.winners3 = this._parsed.P.bets.filter(function(bet){
                return bet.selection === this._parsed.result[2];
            }, this);
            this._parsed.E.winners = this._parsed.E.bets.filter(function(bet){
                return bet.selection === this._parsed.result.slice(0,2).join(',');
            }, this);

        },

        _calcPools: function () {

            // Calculate pools
            this._parsed.W.pool -= (this._parsed.W.pool / 100 * 15);
            this._parsed.P.pool -= (this._parsed.P.pool / 100 * 12);
            this._parsed.P.pool /= 3;
            this._parsed.E.pool -= (this._parsed.E.pool / 100 * 18);

        },

        _calcDividends: function () {

            var stdout = [],
                productName;

            ['W','P','E'].forEach(function(product){
                var places;
                if (product === 'P') {
                    places = [1,2,3];
                } else {
                    places = [''];
                }
                switch(product) {
                    case 'W':
                        productName = 'Win';
                        break;
                    case 'P':
                        productName = 'Place';
                        break;
                    case 'E':
                        productName = 'Exacta';
                        break;
                }
                places.forEach(function(place){
                    var dividend,
                        winnersId = 'winners' + place,
                        winners = this._parsed[product][winnersId],
                        winningBetsTotal,
                        selection;
                    if (winners.length === 0) {
                        dividend = 0;
                        selection = '-'
                    } else {
                        winningBetsTotal = winners
                            .map(function(bet){
                                return bet.stake;
                            })
                            .reduce(function(prev, curr){
                                return prev + curr;
                            });
                        dividend = this._parsed[product].pool - winningBetsTotal;
                        if (dividend < 0) {
                            dividend = 0;
                        } else {
                            dividend = Math.floor(dividend * 100) / 100;
                        }
                        selection = this._parsed[product][winnersId][0].selection;
                    }
                    stdout.push([productName, selection, '$' + dividend].join(':'));
                }, this);
            }, this);

            return stdout;

        },

        calc: function (stdin) {

            this._init();

            this._parse(stdin);

            this._findWinners();

            this._calcPools();

            return this._calcDividends();

        }
    }

});
