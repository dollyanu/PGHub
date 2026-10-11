import { useState } from "react";

const FilterSidebar = ({ onApplyFilters }) => {
  const [city, setCity] = useState("All Cities");
  const [gender, setGender] = useState("All");
  const [budget, setBudget] = useState(15000);

  const handleApply = () => {
    onApplyFilters({
      city,
      gender,
      budget: Number(budget),
    });
  };

  const handleReset = () => {
    setCity("All Cities");
    setGender("All");
    setBudget(15000);

    onApplyFilters({
      city: "All Cities",
      gender: "All",
      budget: 15000,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">

      {/* Heading */}
      <h2 className="text-2xl font-bold text-[#0d152b]">
        Filters
      </h2>

      {/* ================= CITY ================= */}
      <div className="mt-6">

        <label className="font-semibold text-[#0d152b]">
          City
        </label>

        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full mt-2 border rounded-lg p-3 outline-none focus:border-cyan-400"
        >
          <option value="All Cities">All Cities</option>
          <option value="Delhi">Delhi</option>
          <option value="Pune">Pune</option>
          <option value="Noida">Noida</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Lucknow">Lucknow</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Mumbai">Mumbai</option>
        </select>

      </div>

      {/* ================= GENDER ================= */}
      <div className="mt-6">

        <label className="font-semibold text-[#0d152b]">
          Gender
        </label>

        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full mt-2 border rounded-lg p-3 outline-none focus:border-cyan-400"
        >
          <option value="All">All</option>
          <option value="Boys">Boys</option>
          <option value="Girls">Girls</option>
          <option value="Unisex">Unisex</option>
        </select>

      </div>

      {/* ================= BUDGET ================= */}
      <div className="mt-6">

        <div className="flex justify-between items-center">

          <label className="font-semibold text-[#0d152b]">
            Maximum Budget
          </label>

          <span className="text-cyan-500 font-semibold">
            ₹{Number(budget).toLocaleString()}
          </span>

        </div>

        <input
          type="range"
          min="3000"
          max="15000"
          step="500"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="w-full mt-4 accent-cyan-400"
        />

        <div className="flex justify-between text-sm text-gray-500">
          <span>₹3,000</span>
          <span>₹15,000</span>
        </div>

      </div>

      {/* ================= BUTTONS ================= */}
      <button
        onClick={handleApply}
        className="w-full mt-8 bg-cyan-400 hover:bg-cyan-500 text-white py-3 rounded-xl font-semibold transition"
      >
        Apply Filters
      </button>

      <button
        onClick={handleReset}
        className="w-full mt-3 border border-gray-300 hover:border-cyan-400 hover:text-cyan-500 text-gray-600 py-3 rounded-xl font-semibold transition"
      >
        Reset Filters
      </button>

    </div>
  );
};

export default FilterSidebar;