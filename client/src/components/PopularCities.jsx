import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import delhi from "../assets/images/delhi.png";
import bangalore from "../assets/images/bangalore.jpg";
import hyderabad from "../assets/images/hyderabad.png";
import pune from "../assets/images/pune.jpg";
import chennai from "../assets/images/chennai.png";
import jaipur from "../assets/images/jaipur.jpg";
import noida from "../assets/images/delhi.png";
import lucknow from "../assets/images/lucknow.jpg";

import { getPopularCities } from "../services/property";

const cityList = [
  { id: 1, name: "Delhi", image: delhi, aliases: ["delhi", "new delhi"] },
  {
    id: 2,
    name: "Bengaluru",
    image: bangalore,
    aliases: ["bengaluru", "bangalore"],
  },
  {
    id: 3,
    name: "Hyderabad",
    image: hyderabad,
    aliases: ["hyderabad"],
  },
  { id: 4, name: "Pune", image: pune, aliases: ["pune"] },
  { id: 5, name: "Chennai", image: chennai, aliases: ["chennai"] },
  { id: 6, name: "Jaipur", image: jaipur, aliases: ["jaipur"] },
  { id: 7, name: "Noida", image: noida, aliases: ["noida"] },
  { id: 8, name: "Lucknow", image: lucknow, aliases: ["lucknow"] },
];

const PopularCities = () => {
  const [cities, setCities] = useState(cityList);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await getPopularCities();
        const data = response.data;

        if (!data.success || !Array.isArray(data.cities)) {
          throw new Error("Invalid cities response");
        }

        const counts = new Map(
          data.cities.map((city) => [
            String(city.name).trim().toLowerCase(),
            Number(city.property_count) || 0,
          ])
        );

        const updatedCities = cityList.map((city) => {
          const count = city.aliases.reduce((total, alias) => {
            return total + (counts.get(alias) || 0);
          }, 0);

          return { ...city, propertyCount: count };
        });

        setCities(updatedCities);
      } catch (err) {
        console.error("Popular cities error:", err);
        setError("Unable to load city information.");
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  return (
    <section className="py-15 bg-slate-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0d152b]">
            Popular Cities
          </h2>

          <p className="mt-4 text-gray-500 text-lg">
            Explore verified PGs in India's most popular student cities.
          </p>
        </div>

        {loading && (
          <p className="text-center text-gray-500 mt-10">
            Loading popular cities...
          </p>
        )}

        {!loading && error && (
          <p className="text-center text-red-500 mt-10">{error}</p>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-8 mt-16">
            {cities.map((city) => (
              <Link
                key={city.id}
                to={`/properties/${encodeURIComponent(city.name)}`}
                className="group"
              >
                <div className="flex flex-col items-center">
                  <div className="w-28 h-28 rounded-full overflow-hidden flex items-center justify-center transition duration-300 group-hover:scale-105 group-hover:shadow-xl">
                    <img
                      src={city.image}
                      alt={city.name}
                      className="w-20 h-20 object-contain"
                    />
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-[#0d152b] group-hover:text-cyan-500 transition">
                    {city.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {city.propertyCount ?? 0}{" "}
                    {city.propertyCount === 1 ? "Property" : "Properties"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularCities;