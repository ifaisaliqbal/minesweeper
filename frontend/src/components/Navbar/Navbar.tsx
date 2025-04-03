import { useAuth } from "../../context/authContext";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="w-full bg-white shadow-md px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors"
        >
          Minesweeper
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-gray-700">
              Welcome, {user.username}!
            </span>
            <button
              data-testid="logout-button"
              onClick={logout}
              className="bg-blue-600 text-white px-2 py-2 rounded hover:bg-blue-700 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              data-testid="login-link"
              to="/login"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              Login
            </Link>
            <Link
              data-testid="signup-link"
              to="/signup"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
