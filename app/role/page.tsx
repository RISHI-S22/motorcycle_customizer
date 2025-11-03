"use client";
import { useRouter } from "next/navigation";

export default function RolePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-indigo-900 to-slate-800 text-white">
      <h1 className="text-4xl font-extrabold mb-10 drop-shadow-lg">
        Choose Your Role
      </h1>
      <div className="flex gap-10">
        <button
          className="px-8 py-4 bg-blue-600 text-white rounded-2xl shadow-xl text-lg font-semibold hover:scale-105 hover:bg-blue-700 transition-transform"
          onClick={() => router.push("/login")}
        >
          👤 User
        </button>
        <button
          className="px-8 py-4 bg-emerald-600 text-white rounded-2xl shadow-xl text-lg font-semibold hover:scale-105 hover:bg-emerald-700 transition-transform"
          onClick={() => router.push("/admin/login")}
        >
          🧑‍💼 Admin
        </button>
      </div>
    </div>
  );
}
