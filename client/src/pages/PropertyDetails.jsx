import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaVenusMars,
  FaWifi,
  FaUtensils,
  FaSnowflake,
  FaCar,
  FaTv,
  FaTshirt,
  FaHeart,
  FaRegHeart,
  FaPhone,
  FaUser,
  FaCheckCircle,
} from "react-icons/fa";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  getProperty,
  addToShortlist,
  removeFromShortlist,
  checkShortlist,
} from "../services/property";


const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedImage, setSelectedImage] = useState("");
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [shortlistLoading, setShortlistLoading] = useState(false);


  // Image base URL
  const imageBaseUrl =
    "http://localhost/PG-Hub/server/uploads/properties/";


  // =========================
  // FETCH PROPERTY
  // =========================
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProperty(id);

        console.log(
          "PROPERTY DETAIL RESPONSE:",
          response.data
        );

        // IMPORTANT:
        // API returns property inside response.data.property
        if (
          response.data &&
          response.data.success &&
          response.data.property
        ) {
          const propertyData = response.data.property;

          setProperty(propertyData);

          // =========================
          // SET MAIN IMAGE
          // =========================
          if (
            propertyData.images &&
            Array.isArray(propertyData.images) &&
            propertyData.images.length > 0
          ) {
            const firstImage = propertyData.images[0];

            setSelectedImage(
              typeof firstImage === "object"
                ? firstImage.image
                : firstImage
            );
          } else if (propertyData.image) {
            setSelectedImage(propertyData.image);
          }


          // =========================
          // CHECK SHORTLIST
          // =========================
          const storedUser =
            localStorage.getItem("user");

          if (storedUser) {
            try {
              const user = JSON.parse(storedUser);

              if (user && user.id) {
                const shortlistResponse =
                  await checkShortlist(
                    user.id,
                    propertyData.id
                  );

                if (
                  shortlistResponse.data &&
                  shortlistResponse.data.success
                ) {
                  setIsShortlisted(
                    shortlistResponse.data.shortlisted
                  );
                }
              }
            } catch (shortlistError) {
              console.error(
                "SHORTLIST CHECK ERROR:",
                shortlistError
              );
            }
          }
        } else {
          setProperty(null);
          setError("PG not found");
        }

      } catch (err) {
        console.error(
          "PROPERTY DETAIL ERROR:",
          err
        );

        setProperty(null);
        setError("PG not found");

      } finally {
        setLoading(false);
      }
    };


    if (id) {
      fetchProperty();
    } else {
      setLoading(false);
      setError("PG not found");
    }

  }, [id]);


  // =========================
  // SHORTLIST
  // =========================
  const handleShortlist = async () => {
    const storedUser =
      localStorage.getItem("user");

    if (!storedUser) {
      alert("Please login to add PG to shortlist.");
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      if (!user || !user.id) {
        alert("Please login to continue.");
        navigate("/login");
        return;
      }

      setShortlistLoading(true);

      if (isShortlisted) {
        const response =
          await removeFromShortlist(
            user.id,
            property.id
          );

        if (response.data.success) {
          setIsShortlisted(false);
        } else {
          alert(
            response.data.message ||
              "Failed to remove from shortlist."
          );
        }

      } else {
        const response =
          await addToShortlist(
            user.id,
            property.id
          );

        if (response.data.success) {
          setIsShortlisted(true);
        } else {
          alert(
            response.data.message ||
              "Failed to add to shortlist."
          );
        }
      }

    } catch (error) {
      console.error(
        "SHORTLIST ERROR:",
        error
      );

      alert(
        "Something went wrong. Please try again."
      );

    } finally {
      setShortlistLoading(false);
    }
  };


  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen bg-[#0d152b] text-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

            <p className="text-gray-300">
              Loading PG details...
            </p>
          </div>
        </div>

        <Footer />
      </>
    );
  }


  // =========================
  // ERROR / NO PG FOUND
  // =========================
  if (error || !property) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen bg-[#0d152b] text-white flex items-center justify-center px-4">

          <div className="text-center">

            <h2 className="text-3xl font-bold text-white mb-3">
              No PG Found
            </h2>

            <p className="text-gray-400 mb-6">
              The PG you are looking for does not exist
              or could not be loaded.
            </p>

            <Link
              to="/properties"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-[#0d152b] font-semibold rounded-lg transition"
            >
              <FaArrowLeft />
              Back to Properties
            </Link>

          </div>

        </div>

        <Footer />
      </>
    );
  }


  // =========================
  // NORMALIZE IMAGES
  // =========================
  let propertyImages = [];


  if (
    property.images &&
    Array.isArray(property.images) &&
    property.images.length > 0
  ) {
    propertyImages = property.images
      .map((item) => {

        // Backend may return:
        // { id: 1, image: "abc.jpg" }

        if (
          typeof item === "object" &&
          item !== null
        ) {
          return item.image;
        }

        // Or simply:
        // "abc.jpg"

        return item;

      })
      .filter(Boolean);
  }


  // If property_images is empty,
  // use main properties.image
  if (
    propertyImages.length === 0 &&
    property.image
  ) {
    propertyImages = [property.image];
  }


  // Main image
  const mainImage =
    selectedImage ||
    propertyImages[0] ||
    "";


  const mainImageUrl = mainImage
    ? `${imageBaseUrl}${mainImage}`
    : "";


  // =========================
  // AMENITIES
  // =========================
  let amenities = [];

  if (Array.isArray(property.amenities)) {
    amenities = property.amenities;
  } else if (property.amenities) {
    amenities = property.amenities
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }


  const amenityIcons = {
    wifi: <FaWifi />,
    food: <FaUtensils />,
    ac: <FaSnowflake />,
    parking: <FaCar />,
    tv: <FaTv />,
    laundry: <FaTshirt />,
  };


  const getAmenityIcon = (amenity) => {
    const key = amenity
      .toLowerCase()
      .trim();

    return amenityIcons[key] || (
      <FaCheckCircle />
    );
  };


  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#0d152b] text-white">

        {/* =========================
            BACK BUTTON
        ========================= */}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

          <Link
            to="/properties"
            className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200 transition"
          >
            <FaArrowLeft />
            Back to Properties
          </Link>

        </div>


        {/* =========================
            PROPERTY DETAILS
        ========================= */}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">


            {/* =========================
                LEFT SECTION
            ========================= */}

            <div className="lg:col-span-2">

              {/* IMAGE GALLERY */}

              <div className="bg-[#111c36] rounded-2xl overflow-hidden border border-white/10">

                {/* MAIN IMAGE */}

                <div className="w-full h-105 bg-[#0a1022] flex items-center justify-center">

                  {mainImageUrl ? (

                    <img
                      src={mainImageUrl}
                      alt={property.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error(
                          "IMAGE LOAD ERROR:",
                          mainImageUrl
                        );

                        e.currentTarget.style.display =
                          "none";
                      }}
                    />

                  ) : (

                    <div className="text-gray-500 text-center">
                      <p className="text-lg">
                        No image available
                      </p>
                    </div>

                  )}

                </div>


                {/* THUMBNAILS */}

                {propertyImages.length > 0 && (

                  <div className="p-4 flex gap-3 overflow-x-auto">

                    {propertyImages.map(
                      (image, index) => {

                        const imageUrl =
                          `${imageBaseUrl}${image}`;

                        return (
                          <button
                            key={`${image}-${index}`}
                            type="button"
                            onClick={() =>
                              setSelectedImage(
                                image
                              )
                            }
                            className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                              mainImage === image
                                ? "border-cyan-400"
                                : "border-transparent"
                            }`}
                          >

                            <img
                              src={imageUrl}
                              alt={`PG ${index + 1}`}
                              className="w-full h-full object-cover"
                            />

                          </button>
                        );
                      }
                    )}

                  </div>

                )}

              </div>


              {/* =========================
                  TITLE + LOCATION
              ========================= */}

              <div className="mt-6">

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <h1 className="text-3xl md:text-4xl font-bold text-white">
                      {property.title}
                    </h1>

                    <div className="flex items-center gap-2 text-gray-400 mt-3">

                      <FaMapMarkerAlt className="text-cyan-400" />

                      <span>
                        {property.location},{" "}
                        {property.city}
                      </span>

                    </div>

                  </div>


                  {/* SHORTLIST */}

                  <button
                    type="button"
                    onClick={handleShortlist}
                    disabled={shortlistLoading}
                    className="w-12 h-12 rounded-full bg-[#111c36] border border-white/10 flex items-center justify-center hover:border-cyan-400 transition disabled:opacity-50"
                  >

                    {isShortlisted ? (
                      <FaHeart className="text-red-500 text-xl" />
                    ) : (
                      <FaRegHeart className="text-gray-300 text-xl" />
                    )}

                  </button>

                </div>


                {/* PRICE + GENDER */}

                <div className="flex flex-wrap gap-4 mt-6">

                  <div className="flex items-center gap-2 bg-[#111c36] px-4 py-3 rounded-lg">

                    <FaRupeeSign className="text-cyan-400" />

                    <span className="font-semibold">
                      ₹{Number(property.price).toLocaleString("en-IN")}
                    </span>

                    <span className="text-gray-400 text-sm">
                      / month
                    </span>

                  </div>


                  <div className="flex items-center gap-2 bg-[#111c36] px-4 py-3 rounded-lg">

                    <FaVenusMars className="text-cyan-400" />

                    <span>
                      {property.gender}
                    </span>

                  </div>

                </div>

              </div>


              {/* =========================
                  DESCRIPTION
              ========================= */}

              <section className="mt-8 bg-[#111c36] rounded-2xl p-6 border border-white/10">

                <h2 className="text-xl font-semibold mb-4">
                  About this PG
                </h2>

                <p className="text-gray-300 leading-7">
                  {property.description ||
                    "No description available."}
                </p>

              </section>


              {/* =========================
                  AMENITIES
              ========================= */}

              <section className="mt-6 bg-[#111c36] rounded-2xl p-6 border border-white/10">

                <h2 className="text-xl font-semibold mb-5">
                  Amenities
                </h2>


                {amenities.length > 0 ? (

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                    {amenities.map(
                      (amenity, index) => (

                        <div
                          key={`${amenity}-${index}`}
                          className="flex items-center gap-3 bg-[#0d152b] rounded-lg px-4 py-3 text-gray-300"
                        >

                          <span className="text-cyan-400">
                            {getAmenityIcon(
                              amenity
                            )}
                          </span>

                          <span>
                            {amenity}
                          </span>

                        </div>

                      )
                    )}

                  </div>

                ) : (

                  <p className="text-gray-400">
                    No amenities listed.
                  </p>

                )}

              </section>


              {/* =========================
                  OWNER INFORMATION
              ========================= */}

              <section className="mt-6 bg-[#111c36] rounded-2xl p-6 border border-white/10">

                <h2 className="text-xl font-semibold mb-5">
                  Owner Information
                </h2>

                <div className="space-y-4">

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center">

                      <FaUser className="text-cyan-400" />

                    </div>

                    <div>

                      <p className="text-sm text-gray-400">
                        Owner
                      </p>

                      <p className="font-medium">
                        {property.owner_name ||
                          "Property Owner"}
                      </p>

                    </div>

                  </div>


                  {property.owner_phone && (

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center">

                        <FaPhone className="text-cyan-400" />

                      </div>

                      <div>

                        <p className="text-sm text-gray-400">
                          Phone
                        </p>

                        <a
                          href={`tel:${property.owner_phone}`}
                          className="font-medium text-cyan-300 hover:text-cyan-200"
                        >
                          {property.owner_phone}
                        </a>

                      </div>

                    </div>

                  )}

                </div>

              </section>

            </div>


            {/* =========================
                RIGHT BOOKING CARD
            ========================= */}

            <div className="lg:col-span-1">

              <div className="bg-[#111c36] rounded-2xl p-6 border border-white/10 sticky top-24">

                <div className="mb-6">

                  <p className="text-gray-400 text-sm">
                    Monthly Rent
                  </p>

                  <div className="flex items-center gap-1 mt-1">

                    <FaRupeeSign className="text-cyan-400" />

                    <span className="text-3xl font-bold">
                      {Number(
                        property.price
                      ).toLocaleString("en-IN")}
                    </span>

                    <span className="text-gray-400">
                      /month
                    </span>

                  </div>

                </div>


                <div className="border-t border-white/10 pt-6">

                  <h3 className="text-lg font-semibold mb-4">
                    Interested in this PG?
                  </h3>

                  <p className="text-gray-400 text-sm leading-6 mb-5">
                    Book this property and submit
                    your preferred move-in date.
                  </p>


                  <Link
                    to={`/booking/${property.id}`}
                    className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-[#0d152b] font-semibold py-3 rounded-lg transition"
                  >
                    Book Now
                  </Link>


                  {property.owner_phone && (

                    <a
                      href={`tel:${property.owner_phone}`}
                      className="w-full flex items-center justify-center gap-2 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-400/10 font-semibold py-3 rounded-lg transition mt-3"
                    >
                      <FaPhone />
                      Contact Owner
                    </a>

                  )}

                </div>

              </div>

            </div>

          </div>

        </div>

      </main>

      <Footer />
    </>
  );
};

export default PropertyDetails;