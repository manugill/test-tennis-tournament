// figure out the winner of the match

import { Match } from "./extractMatches.ts";
import extractSets from "./extractSets.ts";

type SetWins = { [key: string]: number };
type WinnerAccumulator = {
  setWins: SetWins;
  winner?: string;
};
const initialWinnerAccumulator: WinnerAccumulator = {
  setWins: {},
  winner: undefined,
};

export default (match: Match) => {
  const setWinners = extractSets(match).map((set) => set.winner);

  if (setWinners.length < 2) {
    throw new Error(
      "Not enough sets to determine a match winner, please make sure there are 3 sets",
    );
  }

  const { winner } = setWinners.reduce(({ setWins }, setWinner) => {
    if (typeof setWinner !== "string") {
      throw new Error("Invalid set scores, no winner could be decided");
    }

    const playerScore = (setWins[setWinner] || 0) + 1;
    const hasWon = playerScore === 2;

    return {
      setWins: { ...setWins, [setWinner]: playerScore },
      winner: hasWon ? setWinner : undefined,
    };
  }, initialWinnerAccumulator);

  if (typeof winner !== "string") {
    throw new Error("Invalid game info, no winner could be decided ");
  }

  // the player who hasn't won the winning set, has lost
  const loser = match.players.find((player) => player !== winner);

  const winnerSets = setWinners.filter((name) => name === winner).length;
  const loserSets = setWinners.filter((name) => name === loser).length;
  return { winner, loser, winnerSets, loserSets };
};
