import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../services/axios";
import { useAuth } from "../../context/authContext";
import { TopNotification } from "../TopNotification/TopNotification";
import { Spinner } from "../Spinner/Spinner";

const InputStyles = "border-2 p-2 border-white rounded mt-4";

const Signup: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setNotification("");
      setLoading(true);
      await axios.post("/api/register/", {
        username,
        email,
        password,
      });

      await login(username, password);
      navigate("/");
    } catch (error: any) {
      setLoading(false);
      let message = "Sign up failed. ";

      if (error?.response?.data?.username) {
        message = error?.response?.data?.username?.[0] || "Invalid username";
      }

      if (error?.response?.data?.email) {
        message = `${message} ${
          error?.response?.data?.email?.[0] || "invalid email"
        }`;
      }

      if (error?.response?.data?.password) {
        message = `${message} ${
          error?.response?.data?.password?.[0] || "invalid password"
        }`;
      }
      setNotification(message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TopNotification message={notification} type="failure" />
      <h2>Sign Up</h2>
      <div className="flex flex-col items-center p-5">
        <input
          className={InputStyles}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className={InputStyles}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className={InputStyles}
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mt-4"
          type="submit"
        >
          {loading ? <Spinner /> : "Sign Up"}
        </button>
      </div>
    </form>
  );
};

export default Signup;
