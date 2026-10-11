import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHeart,
  FaMapMarkerAlt,
  FaBed,
  FaWifi,
  FaTrash,
} from "react-icons/fa";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  getShortlist,
  removeFromShortlist,
} from "../services/property";

export default function Shortlist() {
  const [shortlistedPGs, setShortlistedPGs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [error, setError] = useState("");

  // Get logged-in user
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch shortlist
  useEffect(() => {
    const fetchShortlist = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await getShortlist(user.id);

        if (response.data.success) {
          setShortlistedPGs(response.data.shortlist || []);
        } else {
          setError(
            response.data.message || "Failed to load shortlist."
          );
        }
      } catch (err) {
        console.error("Shortlist fetch error:", err);

        setError(
          "Unable to load your shortlist. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchShortlist();
  }, [user?.id]);

  // Remove property from shortlist
  const handleRemove = async (propertyId) => {
    if (!user?.id) {
      return;
    }

    try {
      setRemovingId(propertyId);

      const response = await removeFromShortlist(
        user.id,
        propertyId
      );

      if (response.data.success) {
        // Remove from UI immediately
        setShortlistedPGs((prev) =>
          prev.filter((pg) => pg.property_id !== propertyId)
        );
      } else {
        alert(
          response.data.message ||
            "Failed to remove property."
        );
      }
    } catch (err) {
      console.error("Remove shortlist error:", err);

      alert(
        "Unable to remove property. Please try again."
      );
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <>
      <Navbar />

      <section className="bg-gray-100 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-6">

          {/* Hero */}
          <div className="text-center bg-linear-to-r from-[#2ba5ac] to-cyan-600 rounded-3xl p-10 text-white mb-10">

            <h1 className="text-5xl font-bold">
              My Shortlist ❤️
            </h1>

            <p className="mt-4 text-cyan-100 text-lg">
              View and manage your favourite PGs before making a booking.
            </p>

          </div>

          {/* Not Logged In */}
          {!user?.id && !loading ? (
            <div className="bg-white rounded-3xl shadow p-16 text-center">

              <FaHeart className="text-6xl text-gray-300 mx-auto mb-6" />

              <h2 className="text-3xl font-bold text-[#0d152b]">
                Please Login
              </h2>

              <p className="text-gray-500 mt-3">
                Login to view and manage your shortlisted PGs.
              </p>

              <Link
                to="/login"
                className="inline-block mt-8 bg-cyan-500 text-white px-8 py-3 rounded-xl hover:bg-cyan-600"
              >
                Login
              </Link>

            </div>
          ) : loading ? (

            /* Loading */
            <div className="bg-white rounded-3xl shadow p-16 text-center">

              <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

              <p className="text-gray-500 mt-5 text-lg">
                Loading your shortlist...
              </p>

            </div>

          ) : error ? (

            /* Error */
            <div className="bg-white rounded-3xl shadow p-16 text-center">

              <div className="text-red-500 text-5xl mb-5">
                ⚠️
              </div>

              <h2 className="text-3xl font-bold text-[#0d152b]">
                Something went wrong
              </h2>

              <p className="text-gray-500 mt-3">
                {error}
              </p>

              <button
                onClick={() => window.location.reload()}
                className="mt-8 bg-cyan-500 text-white px-8 py-3 rounded-xl hover:bg-cyan-600"
              >
                Try Again
              </button>

            </div>

          ) : shortlistedPGs.length === 0 ? (

            /* Empty State */
            <div className="bg-white rounded-3xl shadow p-16 text-center">

              <FaHeart className="text-6xl text-gray-300 mx-auto mb-6" />

              <h2 className="text-3xl font-bold text-[#0d152b]">
                No Shortlisted PGs
              </h2>

              <p className="text-gray-500 mt-3">
                Save your favourite properties to view them later.
              </p>

              <Link
                to="/properties"
                className="inline-block mt-8 bg-cyan-500 text-white px-8 py-3 rounded-xl hover:bg-cyan-600"
              >
                Browse Properties
              </Link>

            </div>

          ) : (

            /* Shortlisted Properties */
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

              {shortlistedPGs.map((pg) => (

                <div
                  key={pg.shortlist_id}
                  className="bg-white rounded-3xl shadow hover:shadow-xl duration-300 overflow-hidden"
                >

                  {/* Image */}
                  <img
                    src={pg.image}
                    alt={pg.title}
                    className="h-60 w-full object-cover"
                  />

                  <div className="p-6">

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-[#0d152b]">
                      {pg.title}
                    </h2>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-gray-500 mt-3">
                      <FaMapMarkerAlt />
                      {pg.city}
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mt-2 text-cyan-600 font-semibold">
                      <FaBed />
                      ₹{Number(pg.price).toLocaleString()} / month
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-2 mt-5">

                      {pg.amenities?.map((item, index) => (

                        <span
                          key={`${item}-${index}`}
                          className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          <FaWifi />
                          {item}
                        </span>

                      ))}

                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 mt-6">

                      <Link
                        to={`/property/${pg.property_id}`}
                        className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white text-center py-3 rounded-xl font-semibold"
                      >
                        View Details
                      </Link>

                      <button
                        onClick={() =>
                          handleRemove(pg.property_id)
                        }
                        disabled={
                          removingId === pg.property_id
                        }
                        className="bg-red-100 hover:bg-red-500 hover:text-white p-3 rounded-xl transition disabled:opacity-50"
                        title="Remove from shortlist"
                      >
                        {removingId === pg.property_id ? (
                          <span className="block w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                          <FaTrash />
                        )}
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>
      </section>

      <Footer />
    </>
  );
}