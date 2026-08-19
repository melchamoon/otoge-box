import games from "../../config/games.json";

export type FetchGame = (typeof games)[number];

export const FETCH_GAMES = games;
export const FETCH_GAME_CODES = games.map((game) => game.code);

export function isFetchGameCode(value: string): value is FetchGame["code"] {
  return FETCH_GAME_CODES.includes(value as FetchGame["code"]);
}

export function getFetchGame(gameCode: string) {
  const game = games.find((entry) => entry.code === gameCode);
  if (!game) throw new Error(`Unsupported fetch game: ${gameCode}`);
  return game;
}
