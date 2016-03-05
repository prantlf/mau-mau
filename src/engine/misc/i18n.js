import Localize from 'localize';

class I18N extends Localize {

  setLocaleSafely(locale) {
    var parsedLocale = /^[a-zA-Z]+/.exec(locale);
    if (parsedLocale) {
      parsedLocale = parsedLocale[0];
      if (parsedLocale !== 'en') {
        let translations = this.getTranslations();
        // Check any text - seven card rank, for example.
        if (translations['seven'][parsedLocale]) {
          this.setLocale(parsedLocale);
        } else {
          throw new Error('Unsupported locale: "' + locale + '".');
        }
      }
    }
  }

}

export default new I18N({
  // Ranks
  'seven': {
    'de': 'Sieben',
    'cs': 'sedma'
  },
  'eight': {
    'de': 'Acht',
    'cs': 'osma'
  },
  'nine': {
    'de': 'Neun',
    'cs': 'devítka'
  },
  'ten': {
    'de': 'Zehn',
    'cs': 'desítka'
  },
  'jack': {
    'de': 'Bube',
    'cs': 'spodek'
  },
  'queen': {
    'de': 'Ober',
    'cs': 'svršek'
  },
  'king': {
    'de': 'König',
    'cs': 'král'
  },
  'ace': {
    'de': 'Daus',
    'cs': 'eso'
  },
  // Suits
  'hearts': {
    'de': 'Rot',
    'cs': 'červený'
  },
  'bells': {
    'de': 'Schelle',
    'cs': 'kule'
  },
  'acorns': {
    'de': 'Eichel',
    'cs': 'žaludy'
  },
  'leaves': {
    'de': 'Grün',
    'cs': 'zelený'
  },
  '$[1] $[2]': {
    'de': '$[2]-$[1]',
    'cs': '$[2] $[1]'
  },
  // Stacks
  'drawing stack': {
    'de': 'Stapel',
    'cs': 'balíček k lízání'
  },
  'playing stack': {
    'de': 'Auslege',
    'cs': 'odehraná hromádka'
  },
  // Players
  'human$[1]': {
    'de': 'Mensch$[1]',
    'cs': 'člověk$[1]'
  },
  'computer$[1]': {
    'de': 'Rechner$[1]',
    'cs': 'počítač$[1]'
  },
  'smart $[1]': {
    'de': 'schlauer $[1]',
    'cs': 'chytrý'
  },
  'average $[1]': {
    'de': 'normaler $[1]',
    'cs': 'průměrný'
  },
  'poor $[1]': {
    'de': 'schwach $[1]',
    'cs': 'slabý $[1]'
  },
  // Organizer
  'Two players are the minimum.': {
    'de': 'Zweil spieler sind das Minimum.',
    'cs': 'Minimum jsou dva hráči.'
  },
  'Invalid human player index.': {
    'de': 'Falsche Nummer des menschlichen Spieler.',
    'cs': 'Nesprávné číslo člověčího hráče.'
  },
  'Index of the human player out of range.': {
    'de': 'Nummer des menschlichen Spieler außer den Grenzen.',
    'cs': 'Číslo člověčího hráče mimo povolený rozsah.'
  },
  'Invalid player: "$[1]".': {
    'de': 'Falscher Spieler: "$[1]".',
    'cs': 'Nesprávný hráče: "$[1]".'
  },
  // Reporter
  '$[1] players started with $[2] cards ($[3] card decks)': {
    'de': '$[1] Spieler fingen mit $[2] Karten ($[3] Stapel) an',
    'cs': '$[1] hráči začali s $[2] kartami ($[3] balíčky)'
  },
  'each player was dealt $[1] cards': {
    'de': 'jeder Spieler kriegte $[1] Karten',
    'cs': 'každý hráč dostal $[1] karty'
  },
  '$[1] is on playing stack': {
    'de': '$[1] liegt auf dem Tisch',
    'cs': '$[1] leží na stole'
  },
  '$[1] drew a card': {
    'de': '$[1] ziehte eine Karte',
    'cs': '$[1] si lízl jednu kartu'
  },
  '$[1] played $[2]': {
    'de': '$[1] legte $[2] ab',
    'cs': '$[1] odhodil $[2]'
  },
  ' and chose $[1]': {
    'de': ' und wünschte sich $[1]',
    'cs': ' a změnil barvu na $[1]'
  },
  '$[1] had to pause': {
    'de': '$[1] musste warten',
    'cs': '$[1] musel čekat'
  },
  '$[1] had to draw two cards': {
    'de': '$[1] musste zwei Karten ziehen',
    'cs': '$[1] si musel líznout dvě karty'
  },
  'Turning over the playing stack.': {
    'de': 'Ausgelegte karten werden umgedreht.',
    'cs': 'Odehrané karty se vrací do paklu k lízání.'
  },
  '$[1] won': {
    'de': '$[1] gewinnte',
    'cs': '$[1] vyhrál'
  },
  '$[1] shed all cards': {
    'de': '$[1] wurde alle Karten los',
    'cs': '$[1] se zbavil všech karet'
  },
  '$[1] lost': {
    'de': '$[1] verlierte',
    'cs': '$[1] prohrál'
  },
  // Console prompt
  ' and chooses $[1]': {
    'de': ' und wünscht sich $[1]',
    'cs': ' a mění barvu na $[1]'
  },
  '$[1] holds $[2] cards': {
    'de': '$[1] behaltet $[2] Karten',
    'cs': '$[1] drží $[2] karty'
  },
  '$[1], choose a card to play or draw a new one': {
    'de': '$[1], wähle eine Karte zum Ablegen oder ziehe eine neue',
    'cs': '$[1], vyber kartu k odhození nebo si lízni další'
  },
  'Hold $[1]': {
    'de': 'Behalten $[1]',
    'cs': 'Nechat si $[1]'
  },
  'Play $[1]': {
    'de': 'Ablegen $[1]',
    'cs': 'Odhodit $[1]'
  },
  'Draw new card': {
    'de': 'Eine neue Karte ziehen',
    'cs': 'Líznout si další kartu'
  },
  'Choose a suit': {
    'de': 'Wünsche sich die Farbe',
    'cs': 'Změň barvu na'
  },
  // play
  'Invalid argument: "$[1]".': {
    'de': 'Falscher Parameter: "$[1]".',
    'cs': 'Nesprávný parameter: "$[1]".'
  },
  // Multilingual strings break the indentation checks.
  /*eslint indent: 0*/
  'Cannot draw cards any more.  Take additional card decks, \n\
deal fewer cards, or reduce the count of players.': {
    'de': 'Unmöglich Karten zu ziehen.  Nimm zusätzliche Stapel, \n' +
          'verteile weniger Karten, oder reduziere die Zahl von Spielern.',
    'cs': 'Nelze lízat karty.  Vezmi další balíčky karet, \n' +
          'rozdej méně karet, nebo sniž počet hráčů.'
  }
});
