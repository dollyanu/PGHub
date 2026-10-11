import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaHeart,
  FaStar,
  FaWifi,
  FaParking,
} from "react-icons/fa";

import {
  addToShortlist,
  removeFromShortlist,
  checkShortlist,
} from "../services/property";

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();

  const [isShortlisted, setIsShortlisted] = useState(false);
  const [shortlistLoading, setShortlistLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  // Image URL
  const getImageUrl = (image) => {
    if (!image || typeof image !== "string") {
      return null;
    }

    const cleanImage = image.trim();

    if (!cleanImage) {
      return null;
    }

    if (cleanImage.startsWith("http")) {
      return cleanImage;
    }

    return `http://localhost/PG-Hub/server/uploads/properties/${cleanImage}`;
  };

  const imageUrl = getImageUrl(property?.image);

  // Check shortlist
  useEffect(() => {
    const checkPropertyShortlist = async () => {
      if (!user?.id || !property?.id) {
        return;
      }

      try {
        const response = await checkShortlist(
          user.id,
          property.id
        );

        if (response.data.success) {
          setIsShortlisted(response.data.is_shortlisted);
        }
      } catch (error) {
        console.error(
          "Failed to check shortlist:",
          error
        );
      }
    };

    checkPropertyShortlist();
  }, [property?.id, user?.id]);

  // Shortlist
  const handleShortlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user?.id) {
      navigate("/login");
      return;
    }

    if (shortlistLoading) {
      return;
    }

    try {
      setShortlistLoading(true);

      if (isShortlisted) {
        const response = await removeFromShortlist(
          user.id,
          property.id
        );

        if (response.data.success) {
          setIsShortlisted(false);
        }
      } else {
        const response = await addToShortlist(
          user.id,
          property.id
        );

        if (response.data.success) {
          setIsShortlisted(true);
        }
      }
    } catch (error) {
      console.error("Shortlist error:", error);
    } finally {
      setShortlistLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl duration-300">

      {/* Property Image */}
      <div className="relative">

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={property.title}
            className="w-full h-56 object-cover"
          />
        ) : (
          <div className="w-full h-56 bg-gray-200 flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}

        {/* Gender */}
        <span className="absolute top-4 left-4 bg-cyan-500 text-white text-sm px-3 py-1 rounded-full">
          {property.gender}
        </span>

        {/* Shortlist Heart */}
        <button
          onClick={handleShortlist}
          disabled={shortlistLoading}
          title={
            isShortlisted
              ? "Remove from shortlist"
              : "Add to shortlist"
          }
          className="absolute top-4 right-4 bg-white p-2 rounded-full shadow hover:scale-105 transition disabled:opacity-70"
        >
          <FaHeart
            className={
              isShortlisted
                ? "text-red-500"
                : "text-gray-500 hover:text-red-500"
            }
          />
        </button>

      </div>

      {/* Property Information */}
      <div className="p-5">

        {/* Name */}
        <h3 className="text-2xl font-bold text-[#0d152b]">
          {property.title}
        </h3>

        {/* City */}
        <p className="flex items-center gap-2 text-gray-500 mt-2">
          <FaMapMarkerAlt />
          {property.city}
        </p>

        {/* Amenities */}
        <div className="flex gap-5 mt-4 text-cyan-500">

          <div className="flex items-center gap-2">
            <FaWifi />
            WiFi
          </div>

          <div className="flex items-center gap-2">
            <FaParking />
            Parking
          </div>

        </div>

        {/* Price + Rating */}
        <div className="flex justify-between items-center mt-5">

          <div>
            <p className="text-3xl font-bold text-cyan-500">
              ₹{Number(property.price).toLocaleString()}
            </p>

            <p className="text-gray-500">
              /month
            </p>
          </div>

          <div className="flex items-center gap-2 text-yellow-500">
            <FaStar />
            {property.rating || "—"}
          </div>

        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">

          {/* IMPORTANT: /properties/:id */}
          <Link
            to={`/property/${property.id}`}
            className="flex-1 text-center bg-cyan-400 hover:bg-cyan-500 text-white py-3 rounded-xl transition"
          >
            View Details
          </Link>

          <button
            onClick={handleShortlist}
            className={`flex-1 rounded-xl transition ${
              isShortlisted
                ? "bg-red-50 border border-red-400 text-red-500"
                : "border border-cyan-400 text-cyan-500 hover:bg-cyan-50"
            }`}
          >
            {isShortlisted
              ? "Shortlisted"
              : "Interested"}
          </button>

        </div>

      </div>
    </div>
  );
};

export default PropertyCard;