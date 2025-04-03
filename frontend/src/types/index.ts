export interface GameState {
  game_id: string;
  width: number;
  height: number;
  mines_count: number;
  revealed: boolean[][];
  board: number[][];
  flagged: boolean[][];
  is_over: boolean;
  is_won: boolean;
}

export interface NewGameConfig {
  width: number;
  height: number;
  mines_count: number;
}

export interface LeaderboardEntry {
  username: string;
  wins: number;
  total_games: number;
  win_rate: number;
}

export enum GameResult {
  YOU_WON = "You won!",
  GAME_OVER = "Game over :(",
}
