var Suits = {
  hearts: 'hearts',
  bells: 'bells',
  acorns: 'acorns',
  leaves: 'leaves'
};

// Avoid accidental changing of existing suits
Object.freeze(Suits);

export default Suits;
