import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaArrowRight,
  FaWifi,
  FaParking,
} from "react-icons/fa";
import { getFeaturedProperties } from "../services/property";

const IMAGE_BASE_URL =
  "http://localhost/PG-Hub/server/uploads/properties/";

const FeaturedProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
    const response = await getFeaturedProperties();
const data = response.data;

console.log("Response type:", typeof data);
console.log("Response data:", data);

const list = Array.isArray(data)
  ? data
  : data?.properties || data?.featuredProperties || [];

setProperties(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Featured properties error:", err);
        setError("Unable to load featured properties.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const getImageUrl = (image) => {
    if (!image) return null;

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    return `${IMAGE_BASE_URL}${image}`;
  };

  const getAmenities = (amenities) => {
    if (Array.isArray(amenities)) {
      return amenities.join(" • ");
    }

    if (typeof amenities === "string") {
      return amenities.replace(/,/g, " • ");
    }

    return "Amenities information unavailable";
  };

  return (
    <section className="bg-slate-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0d152b]">
            Featured Properties
          </h2>

          <p className="text-gray-500 mt-3 text-lg">
            Discover the most popular and trusted PG accommodations.
          </p>
        </div>

        {loading && (
          <p className="text-center text-gray-500">
            Loading featured properties...
          </p>
        )}

        {!loading && error && (
          <p className="text-center text-red-500">{error}</p>
        )}

        {!loading && !error && properties.length === 0 && (
          <p className="text-center text-gray-500">
            No featured properties available.
          </p>
        )}

        {!loading && !error && properties.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => {
              const name = property.title || property.name || "PG";
              const imageUrl = getImageUrl(property.image);

              return (
                <div
                  key={property.id}
                  className="bg-white rounded-3xl border border-cyan-200 shadow-lg overflow-hidden hover:-translate-y-2 hover:shadow-xl hover:border-cyan-500 transition duration-300"
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={name}
                      className="h-64 w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="h-64 bg-slate-200 flex items-center justify-center text-gray-500">
                      No image available
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-[#0d152b]">
                      {name}
                    </h3>

                    <p className="flex items-center justify-center gap-2 mt-3 text-gray-600">
                      <FaMapMarkerAlt className="text-cyan-500" />
                      {[property.location, property.city]
                        .filter(Boolean)
                        .join(", ") || "Location unavailable"}
                    </p>

                    {property.price != null && (
                      <p className="text-center text-cyan-600 font-bold text-xl mt-4">
                        ₹{Number(property.price).toLocaleString("en-IN")}
                        <span className="text-sm text-gray-500 font-normal">
                          {" "}/ month
                        </span>
                      </p>
                    )}

                    <p className="text-gray-500 mt-5 leading-7">
                      {getAmenities(property.amenities)}
                    </p>

                    <div className="flex justify-center gap-8 mt-5 text-cyan-500">
                      <div className="flex items-center gap-2">
                        <FaWifi />
                        WiFi
                      </div>

                      <div className="flex items-center gap-2">
                        <FaParking />
                        Parking
                      </div>
                    </div>

                    <Link
                      to={`/property/${property.id}`}
                      className="mt-8 bg-cyan-400 hover:bg-cyan-500 text-white py-4 rounded-full flex items-center justify-center gap-3 transition duration-300"
                    >
                      View Property
                      <FaArrowRight />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProperties;