import React from "react";
import { useNavigate, Link } from "react-router-dom";

export const Login = () => {

  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">

      <div className="bg-slate-800 p-8 rounded-xl w-[400px]">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Login
        </h1>

        <div className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-slate-700"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded bg-slate-700"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-emerald-500 p-3 rounded font-semibold"
          >
            Login
          </button>

        </div>

        <p className="text-sm text-center mt-4 text-slate-400">

          Don't have an account?

          <Link to="/register" className="text-emerald-400 ml-1">
            Register
          </Link>

        </p>

      </div>

    </div>
  );
};