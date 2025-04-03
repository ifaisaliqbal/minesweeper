import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../services/axios";
import { HorizontalLine } from "../HorizontalLine/HorizontalLine";

interface Game {
  game_id: string;
  width: number;
  height: number;
  updated_at: string;
  mines_count: number;
  is_won: boolean;
  is_over: boolean;
}

export const ResumeGameList: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      const res = await axios.get("/api/game/resume/");
      setGames(res.data);
    };
    fetchGames();
  }, []);

  return (
    <div>
      <HorizontalLine text="or resume from your last 5 games" />
      {games.length === 0 ? (
        <p>No games to resume.</p>
      ) : (
        <>
          {games.map((game) => (
            <div
              key={game.game_id}
              className="w-full max-w-md bg-gray-100 border border-gray-300 rounded p-2 mb-2 shadow-sm"
            >
              <button
                onClick={() => navigate(`/game/${game.game_id}`)}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
              >
                <div className="text-base font-semibold text-gray-800">
                  Game:{" "}
                  <span className="text-gray-500">
                    {game.game_id.slice(0, 8)}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>
                    {game.width}×{game.height}
                  </span>
                  <span>Mines: {game.mines_count}</span>
                </div>
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
