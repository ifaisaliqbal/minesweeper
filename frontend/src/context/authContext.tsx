import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import axios from "../services/axios";
import { jwtDecode } from "jwt-decode";

interface Tokens {
  access: string;
  refresh: string;
}

interface DecodedToken {
  exp: number;
  user_id: number;
  username: string;
  iat: number;
}

interface AuthContextType {
  user: DecodedToken | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authTokens, setAuthTokens] = useState<Tokens | null>(() => {
    const stored = localStorage.getItem("tokens");
    return stored ? JSON.parse(stored) : null;
  });

  const [user, setUser] = useState<DecodedToken | null>(() => {
    if (authTokens) return jwtDecode(authTokens.access);
    return null;
  });

  const login = async (username: string, password: string) => {
    const res = await axios.post("/api/token/", { username, password });
    const tokens: Tokens = res.data;
    const decoded: DecodedToken = jwtDecode(tokens.access);

    setAuthTokens(tokens);
    setUser(decoded);
    localStorage.setItem("tokens", JSON.stringify(tokens));
  };

  const logout = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("tokens");
  };

  const refreshToken = async () => {
    try {
      const res = await axios.post("/api/token/refresh/", {
        refresh: authTokens?.refresh,
      });

      const newTokens = {
        access: res.data.access,
        refresh: authTokens?.refresh as string,
      };

      const decoded: DecodedToken = jwtDecode(newTokens.access);

      setAuthTokens(newTokens);
      setUser(decoded);
      localStorage.setItem("tokens", JSON.stringify(newTokens));
    } catch (error) {
      logout();
    }
  };

  useEffect(() => {
    if (!authTokens) return;

    const decoded: DecodedToken = jwtDecode(authTokens.access);
    const refreshTime = decoded.exp * 1000 - Date.now() - 10000;

    const interval = setTimeout(
      () => {
        refreshToken();
      },
      refreshTime > 0 ? refreshTime : 1000
    );

    return () => clearTimeout(interval);
  }, [authTokens]);

  const value: AuthContextType = {
    user,
    token: authTokens?.access || null,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
