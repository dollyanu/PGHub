import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OwnerSidebar from "../components/OwnerSidebar";
import { addOwnerProperty } from "../services/owner";

const OwnerAddProperty = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    title: "",
    city: "",
    location: "",
    price: "",
    gender: "Boys",
    description: "",
    amenities: "",
    owner_name: user?.full_name || "",
    owner_phone: user?.phone || "",
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    setImages(selectedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    if (images.length === 0) {
      alert("Please select at least one property image.");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      // Property information
      data.append("owner_id", user.id);
      data.append("title", formData.title);
      data.append("city", formData.city);
      data.append("location", formData.location);
      data.append("price", formData.price);
      data.append("gender", formData.gender);
      data.append("description", formData.description);
      data.append("amenities", formData.amenities);
      data.append("owner_name", formData.owner_name);
      data.append("owner_phone", formData.owner_phone);

      // Multiple images
      images.forEach((image) => {
        data.append("images[]", image);
      });

      await addOwnerProperty(data);

      alert("Property added successfully!");

      navigate("/owner/properties");
    } catch (error) {
      console.error("Add property error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to add property. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      <OwnerSidebar />

      <main className="ml-64 p-8">

        <div className="max-w-4xl mx-auto">

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Add Property
            </h1>

            <p className="text-gray-500 mt-1">
              Add your PG or hostel property
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow p-8 space-y-6"
          >

            {/* Property Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Title
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter property name"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            {/* City + Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Lucknow"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Gomti Nagar"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

            </div>

            {/* Price + Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Rent
                </label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 8000"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="Boys">Boys</option>
                  <option value="Girls">Girls</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>

            </div>

            {/* Multiple Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Images
              </label>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white"
              />

              <p className="text-sm text-gray-500 mt-2">
                You can select multiple images of your property.
              </p>

              {/* Selected Images */}
              {images.length > 0 && (
                <div className="mt-4">

                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Selected Images: {images.length}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                    {images.map((image, index) => (
                      <div
                        key={index}
                        className="border rounded-lg overflow-hidden bg-gray-50"
                      >

                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Property ${index + 1}`}
                          className="w-full h-28 object-cover"
                        />

                        <p className="text-xs text-gray-600 p-2 truncate">
                          {image.name}
                        </p>

                      </div>
                    ))}

                  </div>

                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe your property..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amenities
              </label>

              <input
                type="text"
                name="amenities"
                value={formData.amenities}
                onChange={handleChange}
                placeholder="WiFi, AC, Food, Parking, Laundry"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />

              <p className="text-xs text-gray-500 mt-1">
                Separate amenities using commas.
              </p>
            </div>

            {/* Owner Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Owner Name
                </label>

                <input
                  type="text"
                  name="owner_name"
                  value={formData.owner_name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Owner Phone
                </label>

                <input
                  type="text"
                  name="owner_phone"
                  value={formData.owner_phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                />
              </div>

            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">

              <button
                type="submit"
                disabled={loading}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
              >
                {loading ? "Adding Property..." : "Add Property"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/owner/properties")}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold"
              >
                Cancel
              </button>

            </div>

          </form>

        </div>

      </main>

    </div>
  );
};

export default OwnerAddProperty;