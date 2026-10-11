import { useEffect, useState } from "react";

import {
  FaUsers,
  FaBuilding,
  FaCalendarCheck,
  FaClock,
} from "react-icons/fa";

import AdminSidebar from "../components/AdminSidebar";
import { getAdminDashboard } from "../services/admin";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    properties: 0,
    bookings: 0,
    pending_bookings: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await getAdminDashboard();

      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Total Users",
      value: stats.users,
      icon: FaUsers,
    },
    {
      title: "Total Properties",
      value: stats.properties,
      icon: FaBuilding,
    },
    {
      title: "Total Bookings",
      value: stats.bookings,
      icon: FaCalendarCheck,
    },
    {
      title: "Pending Bookings",
      value: stats.pending_bookings,
      icon: FaClock,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      <AdminSidebar />

      <main className="ml-64 p-8">

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-800">
            Admin Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your PGHub platform from one place.
          </p>

        </div>


        {loading ? (
          <p className="text-gray-500">
            Loading dashboard...
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

            {cards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className="bg-white rounded-2xl shadow-sm p-6"
                >

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-gray-500 text-sm">
                        {card.title}
                      </p>

                      <h2 className="text-3xl font-bold text-gray-800 mt-2">
                        {card.value}
                      </h2>
                    </div>

                    <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center">
                      <Icon className="text-cyan-500 text-xl" />
                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </main>

    </div>
  );
};

export default AdminDashboard;