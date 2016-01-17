import Card from './Card';
import Suits from './Suits';
import Ranks from './Ranks';
import Stack from './Stack';

class Deck extends Stack {
  
  constructor() {
    super();

    var cards = [
      new Card(Suits.leaves, Ranks.seven),
      new Card(Suits.leaves, Ranks.eight),
      new Card(Suits.leaves, Ranks.nine),
      new Card(Suits.leaves, Ranks.ten),
      new Card(Suits.leaves, Ranks.jack),
      new Card(Suits.leaves, Ranks.queen),
      new Card(Suits.leaves, Ranks.king),
      new Card(Suits.leaves, Ranks.ace),
      new Card(Suits.acorns, Ranks.seven),
      new Card(Suits.acorns, Ranks.eight),
      new Card(Suits.acorns, Ranks.nine),
      new Card(Suits.acorns, Ranks.ten),
      new Card(Suits.acorns, Ranks.jack),
      new Card(Suits.acorns, Ranks.queen),
      new Card(Suits.acorns, Ranks.king),
      new Card(Suits.acorns, Ranks.ace),
      new Card(Suits.bells, Ranks.seven),
      new Card(Suits.bells, Ranks.eight),
      new Card(Suits.bells, Ranks.nine),
      new Card(Suits.bells, Ranks.ten),
      new Card(Suits.bells, Ranks.jack),
      new Card(Suits.bells, Ranks.queen),
      new Card(Suits.bells, Ranks.king),
      new Card(Suits.bells, Ranks.ace),
      new Card(Suits.hearts, Ranks.seven),
      new Card(Suits.hearts, Ranks.eight),
      new Card(Suits.hearts, Ranks.nine),
      new Card(Suits.hearts, Ranks.ten),
      new Card(Suits.hearts, Ranks.jack),
      new Card(Suits.hearts, Ranks.queen),
      new Card(Suits.hearts, Ranks.king),
      new Card(Suits.hearts, Ranks.ace)
    ];
    this.cards.push.apply(this.cards, cards);
    this.emit('cards:received', cards);
  }

  static get cardCount() {
    return 32;
  }

}

export default Deck;
