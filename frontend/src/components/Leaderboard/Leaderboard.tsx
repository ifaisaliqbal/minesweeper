import { useEffect, useState } from "react";
import { gameApi } from "../../services/api";
import { LeaderboardEntry } from "../../types";
import { Link } from "react-router-dom";

export const Leaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    getLeaderboard();
  }, []);

  const getLeaderboard = async () => {
    const data = await gameApi.getLeaderboard();
    setEntries(data);
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          🏆 Leaderboard — Most Wins
        </h2>

        <div className="overflow-x-auto rounded-2xl shadow-lg bg-white">
          <table className="min-w-full text-sm text-left border border-gray-200">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Rank</th>
                <th className="px-6 py-3">Player</th>
                <th className="px-6 py-3">Wins</th>
                <th className="px-6 py-3">Total Games</th>
                <th className="px-6 py-3">Win Rate</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    No leaderboard data yet.
                  </td>
                </tr>
              ) : (
                entries.map((entry, i) => (
                  <tr
                    key={i}
                    className="even:bg-gray-50 hover:bg-blue-50 transition-colors text-black"
                  >
                    <td className="px-6 py-4 font-medium">{i + 1}</td>
                    <td className="px-6 py-4">{entry.username}</td>
                    <td className="px-6 py-4">{entry.wins}</td>
                    <td className="px-6 py-4">{entry.total_games}</td>
                    <td className="px-6 py-4">{entry.win_rate}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Link
        data-testid="login-link"
        to="/"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mt-8"
      >
        Go back
      </Link>
    </div>
  );
};
