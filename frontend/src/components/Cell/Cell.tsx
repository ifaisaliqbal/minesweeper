import React from "react";

interface PropTypes {
  revealed: boolean;
  flagged: boolean;
  value: number;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

export const Cell: React.FC<PropTypes> = ({
  revealed,
  flagged,
  value,
  onClick,
  onContextMenu,
}) => {
  const getCellValue = () => {
    if (flagged) {
      return "🚩";
    }

    if (revealed) {
      if (value === 0) {
        return "";
      }

      if (value === -1) {
        return "💣";
      }

      return value;
    }

    return "";
  };

  return (
    <div
      data-testid="cell"
      className={`
        w-[30px] h-[30px] border border-[#999] 
        flex items-center justify-center 
        cursor-pointer select-none 
        text-black 
        transition-colors duration-150
        ${revealed ? "bg-white" : "bg-[#616060] hover:bg-[#9a9999]"}
  `}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      {getCellValue()}
    </div>
  );
};
