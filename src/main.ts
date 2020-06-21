import { parse } from "https://deno.land/std/flags/mod.ts";
import Ask from "https://deno.land/x/ask/mod.ts";

import extractMatches from "./extractMatches.ts";
import extractGames from "./extractGames.ts";
import extractSets from "./extractSets.ts";
import extractResult from "./extractResult.ts";

// read file
const [fileName] = parse(Deno.args)._;
if (typeof fileName !== "string") {
  throw new Error("Invalid file name");
}
const data = await Deno.readFile(`${import.meta.url}/../${fileName}`);
const decoder = new TextDecoder("utf-8");
const text = decoder.decode(data);

// extract matches
const matches = extractMatches(text);
const matchNames = Object.keys(matches);

// print out help info with dynamic sample commands
const QUERY_SCORE_MATCH = "Score Match";
const QUERY_GAMES_PLAYER = "Games Player";
const QUERY_SETS_PLAYER = "Sets Player";

const sampleMatch = matchNames[0];
const samplePlayer = matches[matchNames[0]].players[0];
console.info("\nHelp:");
console.info(
  `- To find a match's score, type query: ${QUERY_SCORE_MATCH} ${sampleMatch}`,
);
console.info(
  `- To find how many games a player won & lost, type query: ${QUERY_GAMES_PLAYER} ${samplePlayer}`,
);
console.info(
  `- To find how many sets a player won & lost, type query: ${QUERY_SETS_PLAYER} ${samplePlayer}`,
);

// let the user enter queries and print resuls for them
const ask = new Ask();
let stopped = false;
while (!stopped) {
  console.info(""); // just an empty line to make it look a bit nicer

  const { query } = await ask.prompt([
    { name: "query", type: "input", message: "Query:" },
  ]);

  if (typeof query !== "string") {
    console.log("Invalid query, please try again.");
  } else if (query.startsWith(QUERY_SCORE_MATCH)) {
    const matchName = query.replace(QUERY_SCORE_MATCH, "").trim();
    const match = matches[matchName];

    if (match === undefined) {
      console.error("Invalid match name, please try again.");
    } else {
      const result = extractResult(match);

      console.log(`${result.winner} defeated ${result.loser}`);
      console.log(`${result.winnerSets} sets to ${result.loserSets}`);
    }
  } else if (query.startsWith(QUERY_GAMES_PLAYER)) {
    const player = query.replace(QUERY_GAMES_PLAYER, "").trim();
    const playerMatches = Object.values(matches).filter((match) =>
      match.players.some((playerName) => playerName === player)
    );

    if (!playerMatches.length) {
      console.error(
        "Invalid player name, not found in any matches, please try again.",
      );
    } else {
      const games = playerMatches.map(extractGames).flat();
      const wins = games.filter((game) => game.winner === player).length;
      const loses = games.filter((game) => game.winner !== player).length;

      console.log(`${wins} ${loses}`);
    }
  } else if (query.startsWith(QUERY_SETS_PLAYER)) {
    const player = query.replace(QUERY_SETS_PLAYER, "").trim();
    const playerMatches = Object.values(matches).filter((match) =>
      match.players.some((playerName) => playerName === player)
    );

    if (!playerMatches.length) {
      console.error(
        "Invalid player name, not found in any matches, please try again.",
      );
    } else {
      const sets = playerMatches.map(extractSets).flat();
      const wins = sets.filter((set) => set.winner === player).length;
      const loses = sets.filter((set) => set.winner !== player).length;

      console.log(`${wins} ${loses}`);
    }
  } else {
    console.log("No query or invalid query enterd, exiting...");
    stopped = true;
  }
}
