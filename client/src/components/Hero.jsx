import { useState } from "react";
import { FaArrowRight, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import heroBg from "../assets/images/hero-bg.jpg";

const Hero = () => {
  const navigate = useNavigate();

  const [location, setLocation] = useState("");
  const [gender, setGender] = useState("All");

  const handleSearch = () => {
    const searchText = location.trim();

    // Agar kuch search nahi kiya
    if (!searchText) {
      navigate("/properties");
      return;
    }

    // Search + gender ko Properties page par bhejo
    navigate(
      `/properties?search=${encodeURIComponent(
        searchText
      )}&gender=${encodeURIComponent(gender)}`
    );
  };

  return (
    <section
      className="relative h-[60vh] bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${heroBg})`,
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-[#001326]/40"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center justify-center px-6 text-center">

        <h1 className="text-white text-3xl sm:text-3xl md:text-4xl lg:text-6xl font-semibold pt-15 leading-tight">
          Find Your Perfect PG
        </h1>

        <h2 className="mt-4 text-xl text-white max-w-2xl">
          Explore trusted PG made for comfort.
        </h2>

        {/* Search Bar */}
        <div className="mt-8 w-full max-w-2xl bg-white rounded-full shadow-2xl flex items-center overflow-hidden">

          {/* Location Input */}
          <div className="flex items-center gap-3 px-6 flex-1">

            <FaMapMarkerAlt className="text-cyan-500 text-xl shrink-0" />

            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder="Search by city, college or locality..."
              className="w-full py-5 outline-none text-gray-800"
            />

          </div>

          {/* Gender */}
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="outline-none font-semibold text-gray-900 bg-white cursor-pointer px-2"
          >
            <option value="Boys">Men</option>
            <option value="Girls">Women</option>
            <option value="All">All</option>
          </select>

          {/* Search Button */}
          <button
            type="button"
            onClick={handleSearch}
            className="bg-cyan-300 hover:bg-cyan-500 text-white rounded-full w-14 h-14 flex items-center justify-center transition mr-1"
          >
            <FaArrowRight />
          </button>

        </div>
      </div>
    </section>
  );
};

export default Hero;