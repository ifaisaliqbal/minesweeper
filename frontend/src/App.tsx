import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Game from "./components/Game/Game";
import NewGame from "./components/NewGame/NewGame";
import { AuthProvider } from "./context/authContext";
import Login from "./components/Login/Login";
import { AuthenticatedRoute } from "./utils/AuthenticatedRoute";
import Navbar from "./components/Navbar/Navbar";
import Signup from "./components/Signup/Signup";
import { Leaderboard } from "./components/Leaderboard/Leaderboard";

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <div className="container min-h-screen mx-auto flex items-center justify-center mt-8">
          <div className="border-2 border-white p-9 text-center">
            <h1 className="mb-6">Minesweeper</h1>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/leaderboard"
                element={
                  <AuthenticatedRoute>
                    <Leaderboard />
                  </AuthenticatedRoute>
                }
              />
              <Route
                path="/"
                element={
                  <AuthenticatedRoute>
                    <NewGame />
                  </AuthenticatedRoute>
                }
              />
              <Route
                path="/game/:gameId"
                element={
                  <AuthenticatedRoute>
                    <Game />
                  </AuthenticatedRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
