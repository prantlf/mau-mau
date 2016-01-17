var Ranks = {
  seven: 'seven',
  eight: 'eight',
  nine: 'nine',
  ten: 'ten',
  jack: 'jack',
  queen: 'queen',
  king: 'king',
  ace: 'ace'
};

// Avoid accidental changing the existing ranks
Object.freeze(Ranks);

export default Ranks;
