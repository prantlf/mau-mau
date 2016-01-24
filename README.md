# Mau-Mau [![NPM version](https://badge.fury.io/js/mau-mau.png)](http://badge.fury.io/js/mau-mau) [![Build Status](https://travis-ci.org/prantlf/mau-mau.png)](https://travis-ci.org/prantlf/mau-mau) [![Coverage Status](https://coveralls.io/repos/prantlf/mau-mau/badge.svg)](https://coveralls.io/r/prantlf/mau-mau) [![Dependency Status](https://david-dm.org/prantlf/mau-mau.svg)](https://david-dm.org/prantlf/mau-mau) [![devDependency Status](https://david-dm.org/prantlf/mau-mau/dev-status.svg)](https://david-dm.org/prantlf/mau-mau#info=devDependencies) [![devDependency Status](https://david-dm.org/prantlf/mau-mau/peer-status.svg)](https://david-dm.org/prantlf/mau-mau#info=peerDependencies) [![Code Climate](https://codeclimate.com/github/prantlf/mau-mau/badges/gpa.svg)](https://codeclimate.com/github/prantlf/mau-mau) [![Codacy Badge](https://www.codacy.com/project/badge/f3896e8dfa5342b8add12d50390edfcd)](https://www.codacy.com/public/prantlf/mau-mau) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

[![NPM Downloads](https://nodei.co/npm/mau-mau.png?downloads=true&stars=true)](https://www.npmjs.com/package/mau-mau)

Card play for two or more players known as [Mau Mau], [Mau-Mau], [Prší]
and by other names.  The players are dealt each a hand of cards and the
first player, who got rid of all his/her cards, wins the game.

## Install and Run

You need [Node.js](http://nodejs.org/) 0.12 or newer to play the game.

    npm install mau-mau
    ./node_modules/.bin/mau-mau

## Command-line interface

The script `mau-mau` starts a new card game, interacting on the console.
One-based index of the winning player is returned as the program exit code.

```text
Usage: mau-mau [option]

Starts a new mau-mau card game, interacting on the console.  One-based
index of the winning player is returned as the program exit code.

Options:

  -h, --help                    output usage information
  -V, --version                 output the version number
  -p, --players <integer|list>  Player count (3 by default) or player list
  -m, --human <integer>         One-based index of the human (no by default)
  -s, --silent                  No console output (false by default)
  -l, --language <locale>       Translation of texts (env.LANG by default)
  --continue-to-end <yes|no>    Play until the last player remains with some
                                cards in his hand (yes by default)
  --cards-per-player <integer>  Number of cards that the players are dealt
                                (4 by default)
  --players-per-deck <integer>  Player threshold to add another card deck
                                (4 by default; 5 means another deck)

Player list is a comma-delimited list of player implementations:
"human", "smart", "average" and "dummy" identifiers are available.
The default player list is "smart,average,dummy".
Supported locales: "en", "de", "cs".
```

### Usage examples

Runs an unattended game with four computer-controlled players:

    mau-mau

Starts a game with four players, three computer-controlled ones and one
human-controlled as the second player:

    mau-mau --players=4 --human=2

Starts a game with two players, two first one human and the second one
smart computer-controlled one, interacting German:

    mau-mau --players=human,smart --language=de

Lets 50 games be played with a smart and dummy player implementations
and gather results for each player:

```bash
#!/bin/bash
WINS[1]=0
WINS[2]=0
for ((i = 0; i < 50; ++i)); do
  mau-mau --silent --players=smart,dummy --continue-to-end=no
  WINS[$?]=$((${WINS[$?]} + 1))
done
echo "smart won ${WINS[1]} times, dummy ${WINS[2]} times"
```

## Rules

Only Czech rules are implemented so far:

* The German card deck with 32 cards is used.
* There can be 2 or more players.  If there are more than four playes,
  an additional pack of cards will be used, and so on for every other
  four players.
* Each player is dealt four cards at the beginning and one card is
  dropped face up on the playing stack.  The first player starts
  as if the last player had played this card - the rules for sevens
  and aces apply to him.
* Only one card of the same suit or of the same rank, that has the
  card on the top of the playing stack, can be played.
* If the player cannot play any card, he/she has to draw one new card.
* Playing an ace makes the next player skip his/her current turn and
  wait for the next one.
* Playing a seven makes the next player draw two cards and wait for
  the next turn.
* Playing a queen is possible on a card of any suit or rank and lets
  the player change its suit.  The next player will play, as if there
  was a queen with the changed suit on the top of the playing stack.
* If there are no more cards in the drawing stack, the playing stack
  will be turned over, shuffled and used as another drawing stack,
  except for the last card on its top, which will stay as the top
  of the new playing stack.
* The first player, who got rid of all his/her cards, wins.  The game
  caan be played to the end, until the last player remains with some
  cards in his hand.

## Maintenance

Check the sources, build the debug version and test it regularly:

    gulp

If you want to get the distribution files continuously updated and just
run the `mau-mau` script to check out your progress, watch for the source
code changes and build the output in the background:

```shell
gulp watch-node &
./bin/mau-mau
```

If you want to release a new version, perform these steps:

* Build and test the release mode of the distribution files
* Update the revision history in README.md
* Bump the version number in package.json
* Commit the changes including the `dist` directory
* Tag the sources by the new version number
* Push the changes and tags to Github
* Publish the NPM module to the NPM registry
* Post the test code coverage to coveralls

```shell
gulp --release
vi README.md
vi package.json
git add README.md package.json dist
git commit
git tag v0.1.1
git push
git push --tags
npm publish
gulp post-coveralls
```

## Contributing

In lieu of a formal style-guide, take care to maintain the existing coding
style.  Add unit tests for any new or changed functionality. Lint and test
your code using Gulp.

## Release History

 * 2016-01-24   v0.2.1   Add an average player, improve the smart one
                         Make the game more configurable
 * 2016-01-18   v0.1.3   Improve choosing of the best card to play
                         Add German and Czech locales
 * 2016-01-17   v0.1.0   Initial release

## License

Copyright © 2016 [Ferdinand Prantl](http://prantl.tk)

Licensed under the MIT license.

[Mau Mau]: https://en.wikipedia.org/wiki/Mau_Mau_(card_game)
[Mau-Mau]: https://de.wikipedia.org/wiki/Mau-Mau_(Kartenspiel)
[Prší]: https://cs.wikipedia.org/wiki/Prší
