import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaMapMarkerAlt,
  FaRupeeSign,
} from "react-icons/fa";

import OwnerSidebar from "../components/OwnerSidebar";
import {
  getOwnerProperties,
  deleteOwnerProperty,
} from "../services/owner";

const OwnerProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const storedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);

      const response = await getOwnerProperties(storedUser.id);

      if (response.data.success) {
        setProperties(response.data.properties || []);
      } else {
        alert(
          response.data.message ||
            "Failed to load properties."
        );
      }
    } catch (error) {
      console.error("Owner Properties Error:", error);
      alert("Failed to load properties.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (propertyId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (!confirmDelete) return;

    try {
      const response = await deleteOwnerProperty(
        storedUser.id,
        propertyId
      );

      if (response.data.success) {
        alert("Property deleted successfully.");

        setProperties((prev) =>
          prev.filter(
            (property) =>
              Number(property.id) !== Number(propertyId)
          )
        );
      } else {
        alert(
          response.data.message ||
            "Failed to delete property."
        );
      }
    } catch (error) {
      console.error("Delete Property Error:", error);
      alert("Failed to delete property.");
    }
  };

  // =====================================================
  // IMAGE URL
  // =====================================================

  const getImageUrl = (image) => {
    if (!image) return null;

    if (image.startsWith("http")) {
      return image;
    }

    return `http://localhost/PG-Hub/server/uploads/properties/${image}`;
  };

  // =====================================================
  // AMENITIES
  // =====================================================

  const getAmenities = (amenities) => {
    if (Array.isArray(amenities)) {
      return amenities;
    }

    if (!amenities) {
      return [];
    }

    return String(amenities)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  return (
    <div className="min-h-screen bg-gray-100">

      <OwnerSidebar />

      <main className="ml-64 p-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              My Properties
            </h1>

            <p className="text-gray-500 mt-1">
              Manage all PG properties listed by you.
            </p>
          </div>

          <Link
            to="/owner/properties/add"
            className="inline-flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-3 rounded-xl font-semibold transition"
          >
            <FaPlus />
            Add Property
          </Link>

        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl p-10 text-center text-gray-500">
            Loading properties...
          </div>
        )}

        {/* Empty */}
        {!loading && properties.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">

            <div className="w-16 h-16 mx-auto rounded-full bg-cyan-50 flex items-center justify-center">
              <FaPlus className="text-cyan-500 text-2xl" />
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mt-4">
              No properties yet
            </h2>

            <p className="text-gray-500 mt-2">
              Add your first PG property to start receiving bookings.
            </p>

            <Link
              to="/owner/properties/add"
              className="inline-flex items-center gap-2 mt-6 bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-3 rounded-xl font-semibold"
            >
              <FaPlus />
              Add Property
            </Link>

          </div>
        )}

        {/* Properties */}
        {!loading && properties.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">

            {properties.map((property) => {

              /*
              |--------------------------------------------------------------------------
              | Images
              |--------------------------------------------------------------------------
              */

              const firstMultipleImage =
                Array.isArray(property.images) &&
                property.images.length > 0
                  ? property.images[0]?.image
                  : null;

              const imageUrl = getImageUrl(
                firstMultipleImage || property.image
              );

              /*
              |--------------------------------------------------------------------------
              | Amenities
              |--------------------------------------------------------------------------
              */

              const amenities = getAmenities(
                property.amenities
              );

              return (
                <div
                  key={property.id}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100"
                >

                  {/* Image */}
                  <div className="h-52 bg-gray-100">

                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={property.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display =
                            "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}

                  </div>

                  {/* Content */}
                  <div className="p-5">

                    <div className="flex items-start justify-between gap-3">

                      <div>
                        <h2 className="text-lg font-bold text-gray-800">
                          {property.title}
                        </h2>

                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                          <FaMapMarkerAlt className="text-cyan-500" />
                          {property.location}, {property.city}
                        </div>
                      </div>

                      <span className="px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 text-xs font-semibold whitespace-nowrap">
                        {property.gender}
                      </span>

                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-1 mt-4 text-xl font-bold text-cyan-600">
                      <FaRupeeSign />

                      {Number(property.price).toLocaleString(
                        "en-IN"
                      )}

                      <span className="text-sm font-normal text-gray-500">
                        /month
                      </span>
                    </div>

                    {/* Amenities */}
                    {amenities.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">

                        {amenities
                          .slice(0, 3)
                          .map((amenity, index) => (
                            <span
                              key={index}
                              className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs"
                            >
                              {amenity}
                            </span>
                          ))}

                      </div>
                    )}

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2 mt-5">

                      <Link
                        to={`/property/${property.id}`}
                        className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-2.5 rounded-xl text-sm font-medium"
                      >
                        <FaEye />
                        View
                      </Link>

                      <Link
                        to={`/owner/properties/edit/${property.id}`}
                        className="flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2.5 rounded-xl text-sm font-medium"
                      >
                        <FaEdit />
                        Edit
                      </Link>

                      <button
                        onClick={() =>
                          handleDelete(property.id)
                        }
                        className="col-span-2 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2.5 rounded-xl text-sm font-medium"
                      >
                        <FaTrash />
                        Delete Property
                      </button>

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

export default OwnerProperties;