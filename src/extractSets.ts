// figure out winner of each set in a match

import { Match } from "./extractMatches.ts";
import extractGames from "./extractGames.ts";

type SetScore = { [key: string]: number };
type Set = {
  winner?: string;
  setScore: SetScore;
  // the game log is collected so we can potentially create a table of the sets
  // i.e. track the state changing with each game but it's not used currently
  gameLog: {
    gameWinner: string;
    currentScore: SetScore;
    winner?: string;
  }[];
};
type SetAccumulator = {
  sets: Set[];
  activeSet: number;
};
const initialSetAccumulator: SetAccumulator = {
  sets: [],
  activeSet: 0,
};
const initalSet: Set = {
  winner: undefined,
  setScore: {},
  gameLog: [],
};

export default (match: Match) => {
  const gameWinners = extractGames(match).map((game) => game.winner);

  const { sets } = gameWinners.reduce(({ sets, activeSet }, gameWinner) => {
    if (typeof gameWinner !== "string") {
      throw new Error("Invalid game scores, no winner could be decided");
    }

    const isNewSet = sets[activeSet] === undefined;
    const set = !isNewSet ? sets[activeSet] : initalSet;

    const playerScore = (set.setScore[gameWinner] || 0) + 1;
    const setScore: SetScore = {
      ...set.setScore,
      [gameWinner]: playerScore,
    };
    const hasWon = playerScore === 6;
    const winner = hasWon ? gameWinner : undefined;

    const gameLog = [
      ...set.gameLog,
      { gameWinner, currentScore: setScore, winner },
    ];

    const updatedSets: Set[] = [
      ...sets.slice(0, activeSet),
      { winner, setScore, gameLog },
    ];

    return {
      sets: updatedSets,
      activeSet: hasWon ? activeSet + 1 : activeSet,
    };
  }, initialSetAccumulator);

  return sets;
};
