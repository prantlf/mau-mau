# Mau-Mau

Card play for two or more players known as [Mau Mau], [Mau-Mau], [Prší]
and by other names.  The players are dealt each a hand of cards and the
first player, who got rid of all his-her cards, wins the game.

## Install and Run

    npm install mau-mau
    ./node_modules/.bin/mau-mau

## Command-line interface

The script `mau-mau` starts a new card game, interacting on the console.
One-based index of the winning player is returned as the program exit code.

```text
Usage: mau-mau [option]

Options:

  -h, --help                    Print usage information
  -V, --version                 Print the version number
  -p, --players <integer|list>  Player count (4 by default) or player list
  -m, --human <integer>         Index of the human player (none by default)
  -s, --silent                  No console output (false by default)
  -l, --language <locale>       Translation of texts (env.LANG by default)

Player list is a comma-delimited list of player implementations:
"human", "smart" and "dummy" identifiers are available.  The default
player list is "smart,dummy,smart,dummy".
```

### Usage examples

Runs an unattended game with four computer-controlled players:

    mau-mau

Starts a game with three players, two computer-controlled ones and one
human-controlled as the second player:

    mau-mau --players=3 --human=2

Starts a game with two players, two first one human and the second one
smart computer-controlled one, interacting German:

    mau-mau --players=human,smart --language=de

Lets 50 games be played with a smart and dummy player implementations
and gather results for each player:

```bash
WINS[1]=0
WINS[2]=0
for ((i = 0; i < 50; ++i)); do
  mau-mau --silent --players=smart,dummy
  WINS[$?]=$((${WINS[$?]} + 1))
done
echo "smart won ${WINS[1]} times, dummy ${WINS[2]} times"
```

## License

MIT © [Ferdinand Prantl](http://prantl.tk)
