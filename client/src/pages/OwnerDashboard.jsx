import { useEffect, useState } from "react";
import {
  FaBuilding,
  FaCalendarAlt,
  FaClock,
  FaHeart,
} from "react-icons/fa";

import OwnerSidebar from "../components/OwnerSidebar";
import { getOwnerDashboard } from "../services/owner";

const OwnerDashboard = () => {
  const [stats, setStats] = useState({
    properties: 0,
    bookings: 0,
    pending_bookings: 0,
    shortlists: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (!storedUser?.id) {
        alert("Please login again.");
        return;
      }

      const response = await getOwnerDashboard(storedUser.id);

      if (response.data.success) {
        setStats(response.data.stats);
      } else {
        alert(
          response.data.message ||
            "Failed to load dashboard."
        );
      }
    } catch (error) {
      console.error("Owner Dashboard Error:", error);
      alert("Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "My Properties",
      value: stats.properties,
      icon: <FaBuilding />,
      bg: "bg-cyan-100",
      text: "text-cyan-600",
    },
    {
      title: "Total Bookings",
      value: stats.bookings,
      icon: <FaCalendarAlt />,
      bg: "bg-blue-100",
      text: "text-blue-600",
    },
    {
      title: "Pending Bookings",
      value: stats.pending_bookings,
      icon: <FaClock />,
      bg: "bg-yellow-100",
      text: "text-yellow-600",
    },
    {
      title: "Shortlists",
      value: stats.shortlists,
      icon: <FaHeart />,
      bg: "bg-red-100",
      text: "text-red-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      <OwnerSidebar />

      <main className="ml-64 p-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Owner Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your PG properties and bookings.
          </p>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl p-8 text-center text-gray-500">
            Loading dashboard...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

            {cards.map((card) => (
              <div
                key={card.title}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-gray-500">
                      {card.title}
                    </p>

                    <h2 className="text-3xl font-bold text-gray-800 mt-2">
                      {card.value}
                    </h2>
                  </div>

                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center ${card.bg} ${card.text}`}
                  >
                    {card.icon}
                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

      </main>
    </div>
  );
};

export default OwnerDashboard;