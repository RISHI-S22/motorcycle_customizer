"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function UserAuth() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    if (isSignup) {
      // signup - insert into users table
      const { data, error } = await supabase
        .from("users")
        .insert([{ email, password }])
        .select();

      if (error) {
        setError("Signup failed! Try again.");
        return;
      }
      alert("Signup successful! Please log in.");
      setIsSignup(false);
    } else {
      // login
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .eq("password", password)
        .single();

      if (error || !data) {
        setError("Invalid credentials");
        return;
      }

      alert("Login successful!");
      router.push("/user/customize");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-blue-700 text-white">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-[360px] text-center">
        <h2 className="text-2xl font-bold mb-6">
          {isSignup ? "User Signup" : "User Login"}
        </h2>

        <form onSubmit={handleAuth}>
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-3 px-4 py-2 text-black rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 px-4 py-2 text-black rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 py-2 rounded-lg font-semibold transition"
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        {error && <p className="text-red-400 mt-3 text-sm">{error}</p>}

        <p
          className="mt-6 text-sm cursor-pointer hover:underline"
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup
            ? "Already have an account? Login"
            : "Don't have an account? Sign up"}
        </p>
      </div>
    </div>
  );
}
