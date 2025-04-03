import React from "react";
import { GameState } from "../../types";
import { Cell } from "../Cell/Cell";

interface PropTypes {
  gameState: GameState;
  onCellClick: (x: number, y: number) => void;
  onCellRightClick: (e: React.MouseEvent, x: number, y: number) => void;
}

export const Board: React.FC<PropTypes> = ({
  gameState,
  onCellClick: handleCellClick,
  onCellRightClick: handleCellRightClick,
}) => {
  return (
    <div
      data-testid="board"
      className="grid gap-[1px] bg-[#999] p-[1px]"
      style={{
        gridTemplateColumns: `repeat(${gameState.width}, 30px)`,
      }}
    >
      {Array.from({ length: gameState.height }, (_, y) =>
        Array.from({ length: gameState.width }, (_, x) => (
          <Cell
            key={`${x}-${y}`}
            revealed={gameState.revealed[y][x]}
            flagged={gameState.flagged[y][x]}
            onClick={() => handleCellClick(x, y)}
            value={gameState.board[y][x]}
            onContextMenu={(e) => handleCellRightClick(e, x, y)}
          />
        ))
      )}
    </div>
  );
};
