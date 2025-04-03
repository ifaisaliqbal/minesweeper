import axios from "./axios";
import { GameState, LeaderboardEntry, NewGameConfig } from "../types";

const API_BASE_URL = "http://localhost:8000/api/game";

export const gameApi = {
  createGame: async (config: NewGameConfig): Promise<GameState> => {
    const response = await axios.post(`${API_BASE_URL}/create/`, config);
    return response.data;
  },

  getGameState: async (gameId: string): Promise<GameState> => {
    const response = await axios.get(`${API_BASE_URL}/${gameId}/`);
    return response.data;
  },

  takeAction: async (
    gameId: string,
    x: number,
    y: number,
    action: string
  ): Promise<GameState> => {
    const response = await axios.post(`${API_BASE_URL}/${gameId}/action/`, {
      action,
      x,
      y,
    });
    return response.data;
  },
  getLeaderboard: async () => {
    const response = await axios.get(`${API_BASE_URL}/leaderboard/`);
    return response.data as LeaderboardEntry[];
  },
};
