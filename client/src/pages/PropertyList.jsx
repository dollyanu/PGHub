import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PropertyCard from "../components/PropertyCard";
import FilterSidebar from "../components/FilterSidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import propBg from "../assets/properties/prop-bg.jpg";

import {
  getProperties,
  searchProperties,
} from "../services/property";

const PropertyList = () => {
  const { city } = useParams();

  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");

  const [filters, setFilters] = useState({
    city: "All Cities",
    gender: "All",
    budget: 15000,
  });

  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH ALL PROPERTIES
  // =====================================================

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getProperties();

      console.log("Properties API:", response.data);

      if (response.data.success) {
        const data = response.data.properties || [];

        setProperties(data);
        setFilteredProperties(data);
      } else {
        setError(
          response.data.message ||
            "Failed to load properties."
        );
      }
    } catch (err) {
      console.error("Property API Error:", err);

      setError(
        "Unable to connect to server. Please check XAMPP and PHP API."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // =====================================================
  // BACKEND SEARCH
  // =====================================================

  useEffect(() => {
    const performSearch = async () => {
      // Empty search
      if (search.trim() === "") {
        setFilteredProperties(properties);
        return;
      }

      try {
        setSearchLoading(true);

        const response = await searchProperties(
          search.trim()
        );

        console.log(
          "Search API Response:",
          response.data
        );

        if (response.data.success) {
          setFilteredProperties(
            response.data.properties || []
          );
        } else {
          setFilteredProperties([]);
        }
      } catch (err) {
        console.error("Search API Error:", err);

        setFilteredProperties([]);
      } finally {
        setSearchLoading(false);
      }
    };

    const timer = setTimeout(() => {
      performSearch();
    }, 400);

    return () => clearTimeout(timer);
  }, [search, properties]);

  // =====================================================
  // CITY / GENDER / BUDGET / SORT
  // =====================================================

  useEffect(() => {
    // Don't modify search results when backend search is active
    if (search.trim() !== "") {
      return;
    }

    let result = [...properties];

    // CITY FROM URL
if (city) {
  const selectedCity = decodeURIComponent(city)
    .trim()
    .toLowerCase();

  result = result.filter(
    (property) =>
      property.city?.trim().toLowerCase() === selectedCity
  );
}

    // SIDEBAR CITY
    if (filters.city !== "All Cities") {
      result = result.filter(
        (property) =>
          property.city?.toLowerCase() ===
          filters.city.toLowerCase()
      );
    }

    // GENDER
    if (filters.gender !== "All") {
      result = result.filter(
        (property) =>
          property.gender?.toLowerCase() ===
          filters.gender.toLowerCase()
      );
    }

    // BUDGET
    result = result.filter(
      (property) =>
        Number(property.price) <=
        Number(filters.budget)
    );

    // SORT
    if (sortBy === "low") {
      result.sort(
        (a, b) =>
          Number(a.price) - Number(b.price)
      );
    }

    if (sortBy === "high") {
      result.sort(
        (a, b) =>
          Number(b.price) - Number(a.price)
      );
    }

    setFilteredProperties(result);

  }, [
    properties,
    city,
    filters,
    sortBy,
    search,
  ]);

  // =====================================================
  // APPLY SORT TO SEARCH RESULTS
  // =====================================================

  useEffect(() => {
    if (search.trim() === "") {
      return;
    }

    setFilteredProperties((previous) => {
      const result = [...previous];

      if (sortBy === "low") {
        result.sort(
          (a, b) =>
            Number(a.price) -
            Number(b.price)
        );
      }

      if (sortBy === "high") {
        result.sort(
          (a, b) =>
            Number(b.price) -
            Number(a.price)
        );
      }

      return result;
    });

  }, [sortBy]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen bg-slate-100 flex items-center justify-center">

          <div className="text-center">

            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

            <p className="text-[#0d152b] text-lg font-semibold">
              Loading PGs...
            </p>

          </div>

        </div>

        <Footer />
      </>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6">

          <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md">

            <h2 className="text-2xl font-bold text-red-500 mb-3">
              Something went wrong
            </h2>

            <p className="text-gray-600 mb-6">
              {error}
            </p>

            <button
              onClick={fetchProperties}
              className="px-6 py-3 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-600 transition"
            >
              Try Again
            </button>

          </div>

        </div>

        <Footer />
      </>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <>
      <Navbar />

      <div className="bg-slate-100 min-h-screen">

        {/* ================= BANNER ================= */}

        <section
          className="relative h-[35vh] bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${propBg})`,
          }}
        >

          <div className="absolute inset-0 bg-[#0d152b]/60"></div>

          <div className="relative max-w-7xl mx-auto px-6">

            <h1 className="text-4xl md:text-5xl pt-15 font-bold text-center text-white">
              Find Your Perfect PG
            </h1>

            <p className="text-cyan-300 mt-4 text-lg text-center">
              Explore verified student accommodations across India.
            </p>

            {/* SEARCH */}

            <div className="flex justify-center relative">

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search by city or locality..."
                className="mt-8 w-full md:w-1/2 p-4 rounded-xl outline-none shadow-lg"
              />

              {searchLoading && (
                <div className="absolute right-[26%] md:right-[26%] top-12">
                  <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}

            </div>

          </div>

        </section>

        {/* ================= CONTENT ================= */}

        <section className="max-w-7xl mx-auto px-6 py-12">

          <div className="grid lg:grid-cols-4 gap-8">

            {/* FILTER SIDEBAR */}

            <div>

              <FilterSidebar
                onApplyFilters={(newFilters) => {
                  setFilters(newFilters);
                }}
              />

            </div>

            {/* PROPERTY SECTION */}

            <div className="lg:col-span-3">

              {/* HEADER */}

              <div className="flex justify-between items-center mb-8">

                <div>

                  <h2 className="text-3xl font-bold text-[#0d152b]">
                    Available PGs
                  </h2>

                  <p className="text-gray-500 mt-1">

                    {filteredProperties.length} PG
                    {filteredProperties.length !== 1
                      ? "s"
                      : ""}{" "}
                    available

                  </p>

                </div>

                {/* SORT */}

                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value)
                  }
                  className="border rounded-lg p-3 bg-white outline-none"
                >

                  <option value="default">
                    Sort By
                  </option>

                  <option value="low">
                    Price Low to High
                  </option>

                  <option value="high">
                    Price High to Low
                  </option>

                </select>

              </div>

              {/* SEARCH RESULT MESSAGE */}

              {search.trim() !== "" && (
                <div className="mb-6 bg-cyan-50 border border-cyan-100 rounded-xl px-5 py-4">

                  <p className="text-cyan-700">

                    Search results for:

                    <span className="font-bold ml-1">
                      "{search}"
                    </span>

                  </p>

                </div>
              )}

              {/* PROPERTY CARDS */}

              {filteredProperties.length === 0 ? (

                <div className="bg-white rounded-2xl p-12 text-center shadow-sm">

                  <div className="text-5xl mb-4">
                    🏠
                  </div>

                  <h3 className="text-2xl font-bold text-[#0d152b] mb-2">
                    No PGs Found
                  </h3>

                  <p className="text-gray-500">
                    Try searching for another city or locality.
                  </p>

                </div>

              ) : (

                <div className="grid md:grid-cols-2 gap-8">

                  {filteredProperties.map(
                    (property) => (

                      <PropertyCard
  key={property.id}
  property={{
    ...property,
    name: property.title,
    image: property.image
      ? `http://localhost/PG-Hub/server/uploads/properties/${property.image}`
      : null,
  }}
/>

                    )
                  )}

                </div>

              )}

            </div>

          </div>

        </section>

      </div>

      <Footer />
    </>
  );
};

export default PropertyList;