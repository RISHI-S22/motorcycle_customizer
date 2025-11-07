"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Activity, TrendingUp, LogOut } from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  recentUsers: Array<{
    id: string;
    email: string;
    name: string | null;
    created_at: string;
  }>;
  totalCustomizations: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    recentUsers: [],
    totalCustomizations: 0,
  });
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    const adminData = localStorage.getItem("admin");
    if (!adminData) {
      router.push("/admin/login");
      return;
    }

    const admin = JSON.parse(adminData);
    setAdminName(admin.name || "Admin");

    fetchDashboardData();

    const interval = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(interval);
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      const { count: userCount } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true });

      const { data: recentUsers } = await supabase
        .from("users")
        .select("id, email, name, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

      const { count: customizationCount } = await supabase
        .from("user_customizations")
        .select("*", { count: "exact", head: true });

      setStats({
        totalUsers: userCount || 0,
        recentUsers: recentUsers || [],
        totalCustomizations: customizationCount || 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin");
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center text-white">
        <div className="text-center">
          <Activity className="w-12 h-12 mx-auto mb-4 animate-spin" />
          <p className="text-xl">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-white">
      <header className="border-b border-slate-600 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-gray-400 mt-1">Welcome back, {adminName}</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="bg-red-500/10 border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-600 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Users</p>
                  <p className="text-4xl font-bold text-blue-400">{stats.totalUsers}</p>
                </div>
                <Users className="w-12 h-12 text-blue-400 opacity-50" />
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-600 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Customizations</p>
                  <p className="text-4xl font-bold text-green-400">{stats.totalCustomizations}</p>
                </div>
                <Activity className="w-12 h-12 text-green-400 opacity-50" />
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-600 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Avg per User</p>
                  <p className="text-4xl font-bold text-cyan-400">
                    {stats.totalUsers > 0 ? (stats.totalCustomizations / stats.totalUsers).toFixed(1) : "0"}
                  </p>
                </div>
                <TrendingUp className="w-12 h-12 text-cyan-400 opacity-50" />
              </div>
            </div>
          </Card>
        </div>

        <Card className="bg-slate-800/50 border-slate-600 backdrop-blur-sm">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Users className="w-6 h-6 mr-2 text-blue-400" />
              Recent Users
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentUsers.length > 0 ? (
                    stats.recentUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-slate-700 hover:bg-slate-700/30 transition-colors"
                      >
                        <td className="py-3 px-4 text-sm">{user.email}</td>
                        <td className="py-3 px-4 text-sm">{user.name || "N/A"}</td>
                        <td className="py-3 px-4 text-sm text-gray-400">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-gray-400">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-sm text-blue-300">
            <Activity className="w-4 h-4 inline mr-2" />
            Dashboard updates automatically every 5 seconds
          </p>
        </div>
      </main>
    </div>
  );
}
