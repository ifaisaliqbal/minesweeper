interface PropTypes {
  message?: string;
  type?: "success" | "failure" | string;
}

export const TopNotification: React.FC<PropTypes> = ({
  message,
  type,
}: PropTypes) => (
  <div data-testid="top-notification">
    {message && (
      <div
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-lg animate-fade-in-out
            ${type === "success" ? "bg-green-500" : "bg-red-600"} text-white`}
      >
        {message}
      </div>
    )}
  </div>
);
