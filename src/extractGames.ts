// figure out the winner of each game in a match

import { Score, Match } from "./extractMatches.ts";

type GameScore = [number, number];
type Game = {
  winner?: string;
  gameScore: GameScore;
  // the score log is collected so we can potentially create a table of the game
  // i.e. track the state changing with each point but it's not used currently
  scoreLog: {
    score: Score;
    player1: number;
    player2: number;
    winner?: string;
  }[];
};

type GameAccumulator = {
  games: Game[];
  activeGame: number;
};
const initialGameAccumulator: GameAccumulator = {
  games: [],
  activeGame: 0,
};
const initalGame: Game = {
  winner: undefined,
  gameScore: [0, 0],
  scoreLog: [],
};

export default (match: Match) => {
  const { games } = match.scores.reduce(({ games, activeGame }, score) => {
    const isNewGame = games[activeGame] === undefined;
    const game = !isNewGame ? games[activeGame] : initalGame;

    const gameScore: GameScore = [
      game.gameScore[0] + (score === 0 ? 1 : 0),
      game.gameScore[1] + (score === 1 ? 1 : 0),
    ];
    const [player1, player2] = gameScore;

    const hasMinPoints = player1 >= 4 || player2 >= 4;
    const winner = !hasMinPoints // nobody has reached 4 points yet
      ? undefined
      : player1 >= player2 + 2 // player 1 has won
      ? match.players[0]
      : player2 >= player1 + 2 // player 2 has won
      ? match.players[1]
      : undefined; // nobody is ahead by 2 points

    const scoreLog = [...game.scoreLog, { score, player1, player2, winner }];

    const updatedGames = [
      ...games.slice(0, activeGame),
      { winner, gameScore, scoreLog },
    ];

    return {
      games: updatedGames,
      activeGame: winner ? activeGame + 1 : activeGame,
    };
  }, initialGameAccumulator);

  return games;
};
