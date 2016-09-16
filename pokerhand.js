function PokerHand(cards) {
    this.cards = cards instanceof Array ? cards : [];

}

PokerHand.prototype.deal = function (card, index) {
    this.hand.splice(index, 1, card);
}

PokerHand.prototype.getCardValue = function (card) {
    function getCardValue(card) {

        card = card.replace(/H|C|D|S/, '');

        switch (card) {
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            case '10':
                return parseInt(card);

            case 'J':
                return 11;

            case 'Q':
                return 12;

            case 'K':
                return 13;

            case 'A':
                return 14;
        }
    }
}