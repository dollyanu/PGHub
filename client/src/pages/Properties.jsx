import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Link, useParams } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaRupeeSign,
  FaWifi,
  FaUtensils,
  FaParking,
  FaSnowflake,
  FaTshirt,
  FaShieldAlt,
} from "react-icons/fa";

import { getProperties } from "../services/property";

const Properties = () => {
   const { city } = useParams();
   
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  fetchProperties();
}, [city]);

const fetchProperties = async () => {
  try {
    setLoading(true);
    setError("");

    const response = await getProperties();

    if (response.data.success) {
      const allProperties = response.data.properties || [];

      const filteredProperties = city
        ? allProperties.filter(
            (property) =>
              property.city?.trim().toLowerCase() ===
              decodeURIComponent(city).trim().toLowerCase()
          )
        : allProperties;

      setProperties(filteredProperties);
    } else {
      setError(response.data.message || "Failed to load properties.");
    }
  } catch (err) {
    console.error(err);
    setError("Unable to connect to the server.");
  } finally {
    setLoading(false);
  }
};

  const getAmenityIcon = (amenity) => {
    const name = amenity.toLowerCase();

    if (name.includes("wifi")) return <FaWifi />;
    if (name.includes("food")) return <FaUtensils />;
    if (name.includes("parking")) return <FaParking />;
    if (name.includes("ac")) return <FaSnowflake />;
    if (name.includes("laundry")) return <FaTshirt />;
    if (name.includes("cctv")) return <FaShieldAlt />;

    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d152b] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-cyan-300 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-cyan-300 text-lg">
            Loading properties...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0d152b] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">
            {error}
          </p>

          <button
            onClick={fetchProperties}
            className="px-5 py-2 bg-cyan-400 text-[#0d152b] rounded-lg font-semibold hover:bg-cyan-300 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d152b] text-white px-4 sm:px-6 lg:px-10 py-10">

      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-cyan-300 mb-3">
          Find Your Perfect PG
        </h1>

        <p className="text-gray-400">
          Explore verified PGs and hostels available in popular locations.
        </p>
      </div>

      {/* No Properties */}
      {properties.length === 0 ? (
        <div className="max-w-7xl mx-auto text-center py-20">
          <h2 className="text-2xl font-semibold text-gray-300 mb-2">
            No properties available
          </h2>

          <p className="text-gray-500">
            Please check again later.
          </p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">

          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-[#111c36] border border-gray-700 rounded-2xl overflow-hidden shadow-lg hover:border-cyan-400 hover:-translate-y-1 transition-all duration-300"
            >

              {/* Property Image */}
              <div className="h-52 bg-gray-800 overflow-hidden">
                {property.image ? (
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    No Image Available
                  </div>
                )}
              </div>

              {/* Property Details */}
              <div className="p-5">

                <div className="flex justify-between items-start gap-3 mb-3">

                  <h2 className="text-xl font-semibold text-white">
                    {property.title}
                  </h2>

                  <span className="text-xs bg-cyan-400/10 text-cyan-300 border border-cyan-400/30 px-2 py-1 rounded-full whitespace-nowrap">
                    {property.gender}
                  </span>

                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-gray-400 mb-3">
                  <FaMapMarkerAlt className="text-cyan-300" />

                  <span>
                    {property.location}, {property.city}
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center text-cyan-300 font-bold text-xl mb-4">
                  <FaRupeeSign />
                  {property.price}
                  <span className="text-sm text-gray-500 font-normal ml-1">
                    / month
                  </span>
                </div>

                {/* Amenities */}
                {property.amenities &&
                  property.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-5">

                      {property.amenities.slice(0, 6).map(
                        (amenity, index) => (
                          <span
                            key={index}
                            className="flex items-center gap-1 text-xs bg-[#0d152b] border border-gray-700 text-gray-300 px-2.5 py-1.5 rounded-full"
                          >
                            {getAmenityIcon(amenity)}
                            {amenity}
                          </span>
                        )
                      )}

                    </div>
                  )}

                {/* View Details */}
                <Link
                  to={`/properties/${property.id}`}
                  className="block w-full text-center bg-cyan-400 text-[#0d152b] py-2.5 rounded-lg font-semibold hover:bg-cyan-300 transition"
                >
                  View Details
                </Link>

              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default Properties;