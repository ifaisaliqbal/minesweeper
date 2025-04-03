import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GameState } from "../../types";
import { gameApi } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { Board } from "../Board/Board";
import { TopNotification } from "../TopNotification/TopNotification";
import { GameActions } from "../../constants";

const Game: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [notificationMessage, setNotificationMessage] = useState<{
    message: string;
    type: "success" | "failure" | string;
  }>({ message: "", type: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if (gameId) {
      fetchGameState();
    }
  }, [gameId]);

  const fetchGameState = async () => {
    if (!gameId) return;
    try {
      const data = await gameApi.getGameState(gameId);
      setGameState(data);
      setLoading(false);
    } catch (error) {
      setNotificationMessage({
        message: "Error fetching game state",
        type: "failure",
      });
    }
  };

  const handleCellClick = async (x: number, y: number) => {
    if (!gameId || !gameState || gameState.is_over) return;

    try {
      const data = await gameApi.takeAction(gameId, x, y, GameActions.REVEAL);
      setGameState(data);
    } catch (error) {
      setNotificationMessage({
        message: "Error revealing cell",
        type: "failure",
      });
    }
  };

  const handleCellRightClick = async (
    e: React.MouseEvent,
    x: number,
    y: number
  ) => {
    e.preventDefault();
    if (!gameId || !gameState || gameState.is_over) return;

    try {
      const data = await gameApi.takeAction(gameId, x, y, GameActions.FLAG);
      setGameState(data);
    } catch (error) {
      setNotificationMessage({
        message: "Error flagging cell",
        type: "failure",
      });
    }
  };

  const handleStartNewGame = () => {
    let confirmed = true;
    if (!gameState?.is_over) {
      confirmed = window.confirm("Are you sure you want to go back?");
    }

    if (confirmed) {
      navigate("/");
    }
  };

  if (!notificationMessage.message && gameState?.is_won) {
    setNotificationMessage({
      message: "🎉 You Won the Game!",
      type: "success",
    });
  } else if (!notificationMessage.message && gameState?.is_over) {
    setNotificationMessage({
      message: "💥 You Lost the Game!",
      type: "failure",
    });
  }

  if (loading || !gameState) {
    return (
      <>
        <TopNotification
          message={notificationMessage.message}
          type={notificationMessage.type}
        />
        <div>Loading...</div>
      </>
    );
  }

  return (
    <div className="flex flex-col items-center p-5">
      <div className="game-info">
        <TopNotification
          message={notificationMessage.message}
          type={notificationMessage.type}
        />
        <div data-testid="mines_count">Mines: {gameState.mines_count}</div>
      </div>
      <div data-testid="board-component" className="board">
        <Board
          gameState={gameState}
          onCellClick={handleCellClick}
          onCellRightClick={handleCellRightClick}
        />
      </div>
      <button
        data-testid="start-go-back-button"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mt-4"
        onClick={handleStartNewGame}
      >
        {gameState.is_won || gameState.is_over ? "Start New Game" : "Go back"}
      </button>
    </div>
  );
};

export default Game;
