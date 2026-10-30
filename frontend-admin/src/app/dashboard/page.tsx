"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/axios";

export default function DashboardPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const { data } = await api.get("/fees/analytics");
        setAnalytics(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.email}</h1>
        <p className="text-gray-600 mt-1">Role: <span className="font-semibold">{user?.role}</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue Collected</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            ${analytics?.totalCollected ?? 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Pending Dues</h3>
          <p className="text-3xl font-bold text-orange-600 mt-2">
            ${analytics?.totalPending ?? 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Collection Rate</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {analytics?.collectionRate ?? 0}%
          </p>
        </div>
      </div>
    </div>
  );
}
