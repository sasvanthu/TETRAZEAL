import React from "react";
import { Link } from "react-router-dom";

export const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">

      <div className="bg-slate-800 p-10 rounded-xl w-[400px]">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Register
        </h1>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 rounded bg-slate-700 outline-none"
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-slate-700 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded bg-slate-700 outline-none"
          />

          <button className="w-full bg-emerald-500 hover:bg-emerald-600 p-3 rounded font-semibold">
            Create Account
          </button>

        </div>

        <p className="text-sm text-center mt-5 text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-400">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
};