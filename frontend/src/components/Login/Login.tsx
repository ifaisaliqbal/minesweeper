import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { TopNotification } from "../TopNotification/TopNotification";
import { Spinner } from "../Spinner/Spinner";

const InputStyles = "border-2 p-2 border-white rounded mt-4";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setNotification("");
      setLoading(true);
      await login(username, password);
      navigate("/");
    } catch (err) {
      setNotification("Username or password is incorrect");
      setLoading(false);
    }
  };

  return (
    <div>
      <TopNotification message={notification} type="failure" />
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="flex flex-col items-center p-5">
          <input
            data-testid="username-input"
            required
            className={InputStyles}
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            data-testid="password-input"
            required
            className={InputStyles}
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            data-testid="submit-button"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mt-4"
            type="submit"
          >
            {loading ? <Spinner /> : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
