interface PropTypes {
  text?: string;
}

export const HorizontalLine: React.FC<PropTypes> = ({ text = "" }) => {
  return (
    <div className="flex items-center gap-4 my-6">
      <div className="flex-grow border-t border-gray-300"></div>
      <span className="text-sm text-gray-500 font-medium">{text}</span>
      <div className="flex-grow border-t border-gray-300"></div>
    </div>
  );
};
