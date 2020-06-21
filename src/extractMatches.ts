// convert text to an array of matches while validating it
// the match is an object containing the player names and the score list
// this allows us to separate the game & set logic from the text processing logic

const MATCH_PREFIX = "Match:";
const PLAYER_INFIX = " vs ";

export type Score = 0 | 1;
type Players = [string, string];
export type Match = {
  players: Players;
  scores: Score[];
};

type Accumulator = {
  matches: { [key in string]: Match };
  activeMatch?: string;
};
const initialAccumulator: Accumulator = {
  matches: {},
  activeMatch: undefined,
};

export default (text: string) => {
  const lines = text
    .split("\n") // break string into an array of lines
    .map((line) => line.trim()) // trim any extra whitespace from each line
    .filter((line) => line.trim() !== ""); // get rid of empty lines

  const { matches } = lines.reduce(({ matches, activeMatch }, line, index) => {
    const lineNo = index + 1;

    // figure out match name
    if (line.startsWith(MATCH_PREFIX)) {
      return { matches, activeMatch: line.replace(MATCH_PREFIX, "").trim() };
    } else if (activeMatch === undefined) {
      throw new Error(
        `[Line ${lineNo}] Invalid format, match should be defined before players`,
      );
    }

    // figure out players in match, init match obj
    if (line.includes(PLAYER_INFIX)) {
      const [one, two] = line.split(PLAYER_INFIX).map((player) =>
        player.trim()
      );

      const players: Players = [one, two];
      return {
        matches: {
          ...matches,
          [activeMatch]: { players, scores: [] },
        },
        activeMatch,
      };
    } else if (matches[activeMatch] === undefined) {
      throw new Error(
        `[Line ${lineNo}] Invalid format, players should be defined before scores`,
      );
    }

    // collect the scores for active match
    const { players, scores } = matches[activeMatch];

    const scoreRaw = parseInt(line);
    if (scoreRaw !== 0 && scoreRaw !== 1) {
      throw new Error(
        `[Line ${lineNo}] Invalid score, only 0 and 1 are valid values`,
      );
    }

    const score: Score = scoreRaw; // cast number type to 0 or 1 union
    return {
      matches: {
        ...matches,
        [activeMatch]: { players, scores: [...scores, score] },
      },
      activeMatch,
    };
  }, initialAccumulator);

  if (!Object.values(matches).length) {
    throw new Error("No matches were found");
  }

  return matches;
};
