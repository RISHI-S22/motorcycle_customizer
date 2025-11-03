"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true); // toggle login/signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    if (!email || !password) {
      setMessage("⚠️ Please enter both email and password.");
      return;
    }

    try {
      // Check if user exists
      const { data: existingUser, error: selectError } = await supabase
        .from("user_login")
        .select("*")
        .eq("email", email)
        .single();

      if (isLogin) {
        // ✅ LOGIN FLOW
        if (selectError || !existingUser) {
          setMessage("❌ No account found. Please sign up first.");
          return;
        }

        if (existingUser.password !== password) {
          setMessage("❌ Invalid credentials. Try again.");
          return;
        }

        setMessage("✅ Login successful!");
        router.push("/dashboard");
      } else {
        // ✅ SIGNUP FLOW
        if (existingUser) {
          setMessage("⚠️ Account already exists. Please login.");
          return;
        }

        const { error: insertError } = await supabase
          .from("user_login")
          .insert([{ email, password }]);

        if (insertError) {
          setMessage("❌ Error creating account. Try again later.");
          return;
        }

        setMessage("✅ Account created successfully!");
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <form
        onSubmit={handleAuth}
        className="flex flex-col bg-gray-900 p-8 rounded-2xl shadow-lg w-96 space-y-4"
      >
        <h1 className="text-2xl font-bold text-white text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h1>

        {/* ✅ Visible input fields */}
        <input
          type="email"
          placeholder="Enter your email"
          className="p-3 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter your password"
          className="p-3 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md"
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>

        {message && (
          <p className="text-center text-sm text-gray-300 mt-2">{message}</p>
        )}

        <div className="text-center text-gray-400 text-sm">
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <button
                type="button"
                className="text-blue-400 hover:underline"
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                className="text-blue-400 hover:underline"
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
