app.factory("CalculatorFactory", function(){
    
  var parsed;
    
  function init () {
    
    parsed = {
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
    
  }
    
  function parse (stdin) {
    
    /* Note: I figured I could simply use "".split(':')
      after I wrote regular expressions, but I believe there is not much difference */
    var betExp = /Bet:(W|P|E):(\d+(?:,\d+)*):(\d+)/,
      resultExp = /Result:(\d+):(\d+):(\d+)/;
  
    // Parse stdin
    stdin.forEach(function(bet){
      var match = bet.match(betExp);
      if (match !== null) {
        var product = match[1],
          selection = match[2],
          stake = window.parseInt(match[3], 10);
        parsed[product].bets.push({
          selection: selection,
          stake: stake
        });
        parsed[product].pool += stake;
      } else {
        match = bet.match(resultExp);
        // Array with 3 numbers
        parsed.result = match.slice(1);
      }
    });
    
  }
  
  function findWinners () {
    
    // Filter to find winners
    parsed.W.winners = parsed.W.bets.filter(function(bet){
      return bet.selection === parsed.result[0];
    });
    parsed.P.winners1 = parsed.P.bets.filter(function(bet){
      return bet.selection === parsed.result[0];
    });
    parsed.P.winners2 = parsed.P.bets.filter(function(bet){
      return bet.selection === parsed.result[1];
    });
    parsed.P.winners3 = parsed.P.bets.filter(function(bet){
      return bet.selection === parsed.result[2];
    });
    parsed.E.winners = parsed.E.bets.filter(function(bet){
      return bet.selection === parsed.result.slice(0,2).join(',');
    });
    
  }
  
  function calcPools () {
    
    // Calculate pools
    parsed.W.pool -= (parsed.W.pool / 100 * 15);
    parsed.P.pool -= (parsed.P.pool / 100 * 12);
    parsed.P.pool /= 3;
    parsed.E.pool -= (parsed.E.pool / 100 * 18);
    
  }
  
  function calcDividends () {
    
    var stdout = [],
      productName;
    
    ['W','P','E'].forEach(function(product){
      var places;
      if (product === 'P') {
        places = [1,2,3];
      } else {
        places = [''];
      }
      places.forEach(function(place){
        var dividend,
          winnersId = 'winners' + place,
          winningBetsTotal = parsed[product][winnersId]
            .map(function(bet){
              return bet.stake;
            })
            .reduce(function(prev, curr){
              return prev + curr;
            });
        dividend = parsed[product].pool - winningBetsTotal;
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
        dividend = Math.floor(dividend * 100) / 100;
        stdout.push([productName, parsed[product][winnersId][0].selection, '$' + dividend].join(':'));
      });
    });
    
    return stdout;
    
  }
    
  function calc (stdin) {
    
    init();
    
    parse(stdin);
    
    findWinners();
    
    calcPools();
    
    return calcDividends();
    
  }

  return {
    calc: calc
  }

});
