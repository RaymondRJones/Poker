/*
  Poker: Texas Hold Em App by Raymond Jones
  Missing features:
  Going All in
  Making side pots and main pots
  Determining Hand Ranking
  Dealing Flop, Turn, and River

*/
//Card constructor
//
function Card(suit, rank){
  this.suit = suit;
  this.rank = rank;
  //getters
  this.getRank = function(){
    return this.rank;
  }
  this.getSuit = function(){
    return this.suit;
  }
}
//Deck constructor and object
//Handles Drawing and Shuffling of cards
function Deck(){
  var ranks = ["2", "3", "4","5", "6", "7","8", "9", "10"
  , "Jack", "Queen", "King", "Ace"];
  var suits = ["h", "s", "d","c"];
  var cards = [];
  for(var i = 0; i < 4; i++){
    for(var j = 0; j < 13; j++){
      cards.push(new Card(suits[i], ranks[j]));
    }
  }
  return cards;

}
//Prints entire deck for debugging
function printDeck(cards){
  for(var i = 0; i < 52; i++){
    console.log(cards[i].getRank() + " suit:" + cards[i].getSuit());
  }
}

//Shuffles deck array
//Uses Yates method to randomize and exchange values
function shuffleDeck(cards){
  var temp;
  for(var i = 51; i > 0; i--){
    var j = Math.floor(Math.random() * i);
    temp = cards[i];
    cards[i] = cards[j];
    cards[j] = temp;
  }
}

//Method that removes top card from array
//Returns top card
function draw(cards){
  drawnCard = cards[0];
  cards.splice(0, 1);
//  cards.shuffleDeck(cards);
  return drawnCard;
}



//players
//Creates player that has cards and money
function Player(name, cash, cards, isDealer){
  this.name = name;
  this.cash = cash;
  this.cards = cards;
  this.debt = 0;
  //Dealer used to determine turn
  this.isDealer = isDealer;
  this.isSmallBlind = false;
  this.isBigBlind = false;
  //Getters
  this.getName = function(){
    return name;
  }
  this.getCash = function(){
    return this.cash;
  }
  this.getDealStatus = function(){
    return this.isDealer;
  }
  this.getSB = function(){
    return this.isSmallBlind;
  }
  this.getBB = function(){
    return this.isBigBlind;
  }
  this.getDebt = function(){
    return this.debt;
  }
  this.hasCards = function(){
    if(this.cards.length == 0){
      return false;
    }
    else{
      return true;
    }
  }
  this.hasFunds = function(wager){
    if(this.cash < wager){
      return false;
    }
    else{
      return true;
    }
  }
  //Setters
  this.setDealer = function(isDeal){
    this.isDealer = isDeal;
  }
  this.setSB = function(isSmallBlind){
    this.isSmallBlind = isSmallBlind;
  }
  this.setBB = function(isBigBlind){
    this.isBigBlind = isBigBlind;
  }
  //Adds cash
  this.addCash = function(newCash){
    this.cash += newCash;
  }
  this.addDebt = function(debt){
    this.debt += debt;
  }
  this.removeDebt = function(){
    this.debt = 0;
  }

//Removes cash from player
  this.bet = function(price){
    this.cash -= price;
    if(this.cash < 0){
      this.cash = 0;
    }
  }

//Removes cash from player
  this.call = function(price){
    this.cash -= price;
  }
//Removes players cards from game
this.fold = function(){
  this.cards = [];
}

//Adds cards to players hand
//Probably link this method to Deck.js
//Linking classes is harder in js
this.addCard = function(newCard){
  this.cards.push(newCard);
  }
}

//Game Class and Methods
function Game(){
  this.pot = 0;
  this.bigBlind = 20;
  this.smallBlind = 10;
  this.ante = 0;
  this.wager = 0;
  this.community = [];
//Getters and Setters
  this.getBB = function(){
    return this.bigBlind;
  }
  this.getSB = function(){
    return this.smallBlind;
  }
  this.getWager = function(){
    return this.wager;
  }
  this.getCommunity = function(){
    return this.community;
  }
  this.setBB = function(bigBlind){
    this.bigBlind = bigBlind
  }
  this.setSB = function(smallBlind){
    this.smallBlind = smallBlind;
  }
  this.setWager = function(wager){
    this.wager = wager;
  }
  this.addCommunity = function(newCard){
    this.community.push(newCard);
  }
  this.resetCommunity = function(newCard){
    this.community = [];
  }
  //Gives debt to players after bet
  this.makeDebt = function(players, debt, pos){
    for(var i = 0; i < players.length; i++){
      if(i != pos){
        players[i].addDebt(debt);
      }
    }
  }
  //Find players left of the dealer
  //Sets them to big and small blind
  this.setBlinds = function(players){
    for(var i = 0; i < players.length; i++){
      if(players[i].getDealStatus() == true){
        if(i-1 >= 0){
          players[i-1].setSB(true);
        }
        if(i-2 >= 0){
          players[i-2].setBB(true);
        }
        else {
          if(i-2 < 0){
            players[players.length-1].setBB(true);
          }
          if(i-1 < 0){
            players[players.length].setSB(true);
          }
        }
      }
    }
  }
  this.hasWinner = function(players){
    var players_with_hands = 0;
    for(var i = 0; i < players.length; i++){
      if(players[i].hasCards() == true){
        players_with_hands++;
      }
    }
    if(players_with_hands == 1){
      return true;
    }
    else{
      return false;
    }
  }
  //Handles Removal of Blinds
  this.takeBlinds = function(players){
    for(var i = 0; i < players.length; i++){
      if(players[i].getBB() == true){
        players[i].bet(this.getBB());
      }
      if(players[i].getSB() == true){
        players[i].bet(this.getSB());
      }
    }
  }
  this.takeTurns = function(players){
    for(var i = 0; i < players.length; i++){
      if(this.hasWinner(players) == true){
        console.log("We have a winner");
        return players;
      }
      if(players[i].hasCards() == true){
        var choice = prompt(players[i].getName() + " ,1.)Check 2.)Bet 3.)Fold");
        if(choice == 1){
        }
        else if(choice == 2){
          var wager = prompt("TT How much will you bet");
          if(players[i].hasFunds(wager) == true){
            players[i].bet(wager);
            this.makeDebt(players, wager, i);
            //Returns array to end for loop
            return this.takeBets(players, i);
            }
          else{
            console.log("Not enough money");
            i--;
            }
          }
        else if(choice == 3){
        players[i].fold();
        }
      else{
        console.log("invalid input");
      }
    }
  }


}
//Split takeBets into 2 Methods
//takeBets After raise
//takeBets of Previous Players
  this.takeBets = function(players, pos){
    console.log("pos at " + pos);
    if(pos+1 >= players.length){
      pos = -1;
    }
    for(var i = pos+1; i < players.length; i++){
      console.log("i at " + i);
      if(this.hasWinner(players) == true){
        console.log("We have a winner");
        return players;
      }
      //Prompts players that have cards
      if(players[i].hasCards() == true){
        var choice = prompt(players[i].getName() + " ,1.)Call 2.)Raise 3.)Fold");
        //Call should remove all debt from player
        if(choice == 1){
          //If players can't pay debt, tell them instead
          if(players[i].hasFunds(players[i].getDebt())){
            players[i].bet(players[i].getDebt());
            players[i].removeDebt();
          }
          else{
            console.log("Lack cash");
            i--;
          }
        }
        //Betting prompts other players to move
        //During raise, calls the amount on table
        //Bets amount given by player
        else if(choice == 2){
          var raise = prompt("How much will you raise");
          if(players[i].hasFunds(raise + players[i].getDebt()) == true){
            players[i].bet(players[i].getDebt());
            players[i].bet(raise);
            this.makeDebt(players, raise, i);
            players[i].removeDebt();
            //Recursive call to prompt other players
            return this.takeBets(players, i);
            }
          else{
            console.log("Not enough money to raise");
            i--;
            }
          }
        else if(choice == 3){
        players[i].fold();
        players[i].removeDebt();
        }
      else{
        console.log("invalid input");
        return players;
      }
    }
  }
  for(var j = 0; j < pos; j++){
    if(players[j].hasCards() == true){
      var choice = prompt(players[j].getName() + " ,1.)Call 2.)Raise 3.)Fold");
      if(choice == 1){
        if(players[i].hasFunds(players[i].getDebt())){
          players[j].bet(players[j].getDebt());
          players[j].removeDebt();
        }
        else{
          console.log("Not enough cash");
          j--;
        }
      }
      else if(choice == 2){
        var raise = prompt("How much will you raise");
        if(players[j].hasFunds(raise) == true){
          players[j].bet(players[j].getDebt());
          players[j].bet(raise);
          this.makeDebt(players, raise, j);
          players[j].removeDebt();
          return this.takeBets(players, j);
        }
        else{
          console.log("Not enough money to raise");
          j--;
          }
        }
      else if(choice == 3){
        players[j].fold();
      }
    else{
      console.log("invalid input");
      }
    }
  }
  return players;
  }
//Don't have to burn cards
  this.drawFlop = function(cardss){
          console.log("making");
    for(var i = 0; i < 3; i++){
      console.log("making");
      return this.addCommunty(draw(cardss));
    }
  }
  this.drawTurn = function(cards){
      return this.community.push(draw(cards));
  }
  this.drawFlop = function(cards){
      return this.community.push(draw(cards));
  }
}
//Main Method
var game = new Game();
var cardss = Deck();
shuffleDeck(cardss);

var players = [];
/*var numberOfPlayers = prompt("How many players will playy?");
if(numberOfPlayers > 0){
  for(var i =0; i < prompt; i++){
    var name = prompt("Enter the name, cash, and dealer status of player");
    var cash = prompt("cash");
    //Deal 2 cards and store into array
    // var cards = draw(deck);
    //Storing players into an array
    if(i == 0){
      players.push(new player(name, cash, [], true));    }
    else{
      players.push(new player(name, cash, [], false));

    }
    for(var j = 0; j < 2; j++){
      player[i].addCard();
    }
  }
}
else{
  console.log("invalid input");
}
*/
//


//Make player
var p1 = new Player("p1", 30, [], false);
var p2 = new Player("p2", 40, [], true);
var p3 = new Player("p3", 50, [], false);
var p4 = new Player("p4", 100, [], false);
players.push(p1);
players.push(p2);
players.push(p3);
players.push(p4);
for(var i = 0; i < players.length; i++){
  for(var j = 0; j < 2; j++){
    players[i].addCard(draw(cardss));
  }
}
game.setBlinds(players);
game.takeBlinds(players);
console.log(players);
game.takeTurns(players);
console.log(players);
//Flop
for(i = 0; i < 3; i++){
  game.addCommunity(draw(cardss));
}
//Turn
game.addCommunity(draw(cardss));
//River
game.addCommunity(draw(cardss));
console.log(game.getCommunity());



//Pre-Flop
