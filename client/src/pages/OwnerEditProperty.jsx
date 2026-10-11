import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  FaArrowLeft,
  FaSave,
  FaBuilding,
  FaTimes,
} from "react-icons/fa";

import OwnerSidebar from "../components/OwnerSidebar";

import {
  getOwnerProperties,
  updateOwnerProperty,
} from "../services/owner";

const OwnerEditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    city: "",
    location: "",
    price: "",
    gender: "Boys",
    description: "",
    amenities: "",
    owner_name: "",
    owner_phone: "",
  });

  // Existing images from database
  const [existingImages, setExistingImages] = useState([]);

  // New images selected from computer
  const [newImages, setNewImages] = useState([]);

  const imageBaseUrl =
    "http://localhost/PG-Hub/server/uploads/properties/";

  // =====================================================
  // LOAD PROPERTY
  // =====================================================

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    try {
      setLoading(true);

      const response =
        await getOwnerProperties(user.id);

      if (!response.data.success) {
        alert(
          response.data.message ||
            "Failed to load properties."
        );
        return;
      }

      const property =
        response.data.properties.find(
          (item) =>
            Number(item.id) === Number(id)
        );

      if (!property) {
        alert(
          "Property not found or you do not have access."
        );

        navigate("/owner/properties");

        return;
      }

      setFormData({
        title: property.title || "",
        city: property.city || "",
        location: property.location || "",
        price: property.price || "",
        gender: property.gender || "Boys",
        description: property.description || "",
        amenities: Array.isArray(property.amenities)
          ? property.amenities.join(", ")
          : property.amenities || "",
        owner_name: property.owner_name || "",
        owner_phone: property.owner_phone || "",
      });

      // Load existing images
      if (
        property.images &&
        Array.isArray(property.images)
      ) {
        setExistingImages(property.images);
      } else if (property.image) {
        setExistingImages([property.image]);
      } else {
        setExistingImages([]);
      }

    } catch (error) {
      console.error(
        "Load Property Error:",
        error
      );

      alert("Failed to load property.");

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // NEW IMAGE SELECT
  // =====================================================

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setNewImages(files);
  };

  // =====================================================
  // REMOVE NEW SELECTED IMAGE
  // =====================================================

  const removeNewImage = (index) => {
    setNewImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
  e.preventDefault();

  const propertyId = Number(id);
  const ownerId = Number(user?.id);

  console.log("PROPERTY ID:", propertyId);
  console.log("OWNER ID:", ownerId);

  if (!propertyId || propertyId <= 0) {
    alert("Invalid property ID.");
    return;
  }

  if (!ownerId || ownerId <= 0) {
    alert("Invalid owner ID.");
    return;
  }

  try {
    setSaving(true);

    const data = new FormData();

    data.append("id", String(propertyId));
    data.append("owner_id", String(ownerId));

    data.append("title", formData.title);
    data.append("city", formData.city);
    data.append("location", formData.location);
    data.append("price", formData.price);
    data.append("gender", formData.gender);
    data.append("description", formData.description);
    data.append("amenities", formData.amenities);
    data.append("owner_name", formData.owner_name);
    data.append("owner_phone", formData.owner_phone);

    newImages.forEach((image) => {
      data.append("images[]", image);
    });

    console.log("FORM DATA:");

    for (const [key, value] of data.entries()) {
      console.log(key, value);
    }

    const response = await updateOwnerProperty(data);

    console.log("UPDATE RESPONSE:", response.data);

    if (response.data.success) {
      alert("Property updated successfully.");
      navigate("/owner/properties");
    } else {
      alert(response.data.message || "Failed to update property.");
    }

  } catch (error) {
    console.error("UPDATE PROPERTY ERROR:", error);
    console.error("SERVER RESPONSE:", error.response?.data);

    alert(
      error.response?.data?.message ||
      "Failed to update property."
    );
  } finally {
    setSaving(false);
  }
};

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">

        <OwnerSidebar />

        <main className="ml-64 p-8">

          <div className="bg-white rounded-2xl p-10 text-center text-gray-500">
            Loading property...
          </div>

        </main>

      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-100">

      <OwnerSidebar />

      <main className="ml-64 p-8">

        <button
          onClick={() =>
            navigate("/owner/properties")
          }
          className="flex items-center gap-2 text-gray-600 hover:text-cyan-600 mb-6"
        >
          <FaArrowLeft />
          Back to Properties
        </button>

        <div className="max-w-4xl mx-auto">

          <div className="bg-white rounded-2xl shadow-sm p-8">

            {/* HEADER */}

            <div className="flex items-center gap-4 mb-8">

              <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center">
                <FaBuilding />
              </div>

              <div>

                <h1 className="text-2xl font-bold text-gray-800">
                  Edit Property
                </h1>

                <p className="text-gray-500">
                  Update your PG property details.
                </p>

              </div>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* PROPERTY INFORMATION */}

              <div>

                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Property Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* TITLE */}

                  <div className="md:col-span-2">

                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Title *
                    </label>

                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
                    />

                  </div>

                  {/* CITY */}

                  <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>

                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
                    />

                  </div>

                  {/* LOCATION */}

                  <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>

                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
                    />

                  </div>

                  {/* PRICE */}

                  <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Price *
                    </label>

                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
                    />

                  </div>

                  {/* GENDER */}

                  <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender *
                    </label>

                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
                    >

                      <option value="Boys">
                        Boys
                      </option>

                      <option value="Girls">
                        Girls
                      </option>

                      <option value="Unisex">
                        Unisex
                      </option>

                    </select>

                  </div>

                </div>

              </div>

              {/* =================================================
                  EXISTING IMAGES
              ================================================= */}

              <div>

                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Existing Property Images
                </h2>

                {existingImages.length > 0 ? (

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                    {existingImages.map(
                      (image, index) => (

                        <div
                          key={index}
                          className="relative rounded-xl overflow-hidden border border-gray-200"
                        >

                          <img
                            src={`${imageBaseUrl}${image}`}
                            alt={`Property ${index + 1}`}
                            className="w-full h-32 object-cover"
                          />

                        </div>

                      )
                    )}

                  </div>

                ) : (

                  <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500">
                    No existing images.
                  </div>

                )}

              </div>

              {/* =================================================
                  ADD NEW IMAGES
              ================================================= */}

              <div>

                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Add New Images
                </h2>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white"
                />

                <p className="text-sm text-gray-500 mt-2">
                  You can select multiple images.
                </p>

                {/* NEW IMAGE PREVIEW */}

                {newImages.length > 0 && (

                  <div className="mt-5">

                    <p className="text-sm font-medium text-gray-700 mb-3">
                      New Images: {newImages.length}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                      {newImages.map(
                        (image, index) => (

                          <div
                            key={index}
                            className="relative border rounded-xl overflow-hidden"
                          >

                            <img
                              src={URL.createObjectURL(
                                image
                              )}
                              alt={`New ${index + 1}`}
                              className="w-full h-32 object-cover"
                            />

                            <button
                              type="button"
                              onClick={() =>
                                removeNewImage(index)
                              }
                              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                            >
                              <FaTimes />
                            </button>

                            <p className="text-xs text-gray-600 p-2 truncate">
                              {image.name}
                            </p>

                          </div>

                        )
                      )}

                    </div>

                  </div>

                )}

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-cyan-400"
                />

              </div>

              {/* AMENITIES */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amenities
                </label>

                <input
                  type="text"
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleChange}
                  placeholder="WiFi, AC, Food, Parking"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
                />

              </div>

              {/* OWNER INFORMATION */}

              <div>

                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Owner Information
                </h2>

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
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
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
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
                    />

                  </div>

                </div>

              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 pt-5 border-t">

                <button
                  type="button"
                  onClick={() =>
                    navigate("/owner/properties")
                  }
                  className="px-5 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-400 text-white font-semibold"
                >

                  <FaSave />

                  {saving
                    ? "Updating..."
                    : "Update Property"}

                </button>

              </div>

            </form>

          </div>

        </div>

      </main>

    </div>
  );
};

export default OwnerEditProperty;