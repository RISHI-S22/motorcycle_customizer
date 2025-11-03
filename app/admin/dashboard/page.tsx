"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminDashboard() {
  const [userCount, setUserCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      const { count, error } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true });
      if (!error) setUserCount(count);
    };
    fetchCount();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-white">
      <div className="bg-slate-800 p-10 rounded-2xl shadow-2xl text-center border border-slate-600">
        <h1 className="text-4xl font-bold mb-4">👑 Admin Dashboard</h1>
        <p className="text-xl">
          Total Registered Users:{" "}
          <span className="font-extrabold text-blue-400">
            {userCount !== null ? userCount : "Loading..."}
          </span>
        </p>
      </div>
    </div>
  );
}
