import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gameApi } from "../../services/api";
import { TopNotification } from "../TopNotification/TopNotification";
import { ResumeGameList } from "../ResumeGame/ResumeGames";
import { HorizontalLine } from "../HorizontalLine/HorizontalLine";

const LabelInputStyles = "flex justify-between items-center mb-4";
const InputStyles = "border-2 p-2 border-white rounded";
const MaxWidthHight = 30;
const MinWidthHeight = 5;

const NewGame: React.FC = () => {
  const [width, setWidth] = useState<number>(10);
  const [height, setHeight] = useState<number>(10);
  const [minesCount, setMinesCount] = useState<number>(10);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const game = await gameApi.createGame({
        width,
        height,
        mines_count: minesCount,
      });
      navigate(`/game/${game.game_id}`);
    } catch (error) {
      setErrorMessage("Error creating game");
    }
  };

  return (
    <div>
      <h2 className="mb-4">Select Game Setup</h2>
      <TopNotification message={errorMessage} type="failure" />
      <form onSubmit={handleSubmit}>
        <div className={LabelInputStyles}>
          <label>Width:</label>
          <input
            data-testid="width-input"
            className={InputStyles}
            type="number"
            value={width}
            onChange={(e) => setWidth(parseInt(e.target.value))}
            min={MinWidthHeight}
            max={MaxWidthHight}
          />
        </div>
        <div className={LabelInputStyles}>
          <label>Height:</label>
          <input
            data-testid="height-input"
            className={InputStyles}
            type="number"
            value={height}
            onChange={(e) => setHeight(parseInt(e.target.value))}
            min={MinWidthHeight}
            max={MaxWidthHight}
          />
        </div>
        <div className={LabelInputStyles}>
          <label>Mines:</label>
          <input
            data-testid="mines-input"
            className={InputStyles}
            type="number"
            value={minesCount}
            onChange={(e) => setMinesCount(parseInt(e.target.value))}
            min="1"
            max={(width * height || 1) - 1}
          />
        </div>
        <button
          data-testid="submit-button"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mt-4"
          type="submit"
        >
          Start Game
        </button>
      </form>
      <ResumeGameList />
      <HorizontalLine text="See leaders!" />
      <Link
        data-testid="login-link"
        to="/leaderboard"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mt-4"
      >
        Go to leaderboard
      </Link>
    </div>
  );
};

export default NewGame;
