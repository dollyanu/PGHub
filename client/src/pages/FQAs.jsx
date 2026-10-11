import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import faqData from "../components/FqaData";

import {
  FaQuestionCircle,
  FaPhoneAlt,
  FaMoneyBill,
  FaBed,
  FaShieldAlt,
  FaMapMarkerAlt,
  FaBuilding,
  FaHeadset,
  FaChevronDown,
} from "react-icons/fa";

import { Link } from "react-router-dom";

const topicIcons = {
  General: FaQuestionCircle,
  "Booking & Contact": FaPhoneAlt,
  Pricing: FaMoneyBill,
  Amenities: FaBed,
  Safety: FaShieldAlt,
  Location: FaMapMarkerAlt,
  Owners: FaBuilding,
  Support: FaHeadset,
};

const topicDescriptions = {
  General: "Platform basics and accommodation types.",
  "Booking & Contact": "Booking process and contacting owners.",
  Pricing: "Pricing, rent and payment related questions.",
  Amenities: "Facilities available in PGs.",
  Safety: "Safety measures and verification.",
  Location: "Search properties by city or locality.",
  Owners: "Property listing and owner support.",
  Support: "Customer support and technical help.",
};

export default function FQAs() {
  const [selectedTopic, setSelectedTopic] = useState("General");
  const [openIndex, setOpenIndex] = useState(null);

  const handleTopicChange = (topic) => {
    setSelectedTopic(topic);
    setOpenIndex(null);
  };

  return (
    <>
      <Navbar />

      <section className="bg-gray-100 min-h-screen py-10 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Hero */}
          <div className="bg-cyan-600 rounded-3xl text-white text-center py-10 md:py-12 px-5 mb-8 shadow-sm">

            <p className="uppercase tracking-[4px] md:tracking-[5px] text-xs md:text-sm">
              PGHub Help Center
            </p>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-4">
              Frequently Asked Questions
            </h1>

            <p className="mt-4 text-cyan-100 max-w-2xl mx-auto text-sm md:text-base">
              Quick answers about booking, pricing, safety, amenities and
              support.
            </p>

          </div>


          {/* Main FAQ Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

            {/* Sidebar */}
            <aside className="bg-white rounded-2xl shadow-sm p-4 h-fit">

              <h2 className="text-xl font-bold text-gray-800 mb-4 px-2">
                FAQ Topics
              </h2>

              <div className="space-y-1">

                {Object.keys(faqData).map((topic) => {
                  const Icon = topicIcons[topic];

                  const isActive = selectedTopic === topic;

                  return (
                    <button
                      key={topic}
                      onClick={() => handleTopicChange(topic)}
                      className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl transition ${
                        isActive
                          ? "bg-cyan-100 text-cyan-700 font-semibold"
                          : "text-gray-600 hover:bg-cyan-50 hover:text-cyan-700"
                      }`}
                    >
                      <Icon
                        className={`text-lg ${
                          isActive ? "text-cyan-600" : "text-gray-400"
                        }`}
                      />

                      <span>{topic}</span>
                    </button>
                  );
                })}

              </div>

            </aside>


            {/* FAQ Content */}
            <main className="lg:col-span-3">

              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

                {/* Title */}
                <div className="p-6 md:p-8 border-b border-gray-100">

                  <div className="flex items-start gap-4">

                    {(() => {
                      const Icon = topicIcons[selectedTopic];

                      return (
                        <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center shrink-0">
                          <Icon className="text-cyan-500 text-xl" />
                        </div>
                      );
                    })()}

                    <div>

                      <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                        {selectedTopic}
                      </h2>

                      <p className="text-gray-500 mt-2">
                        {topicDescriptions[selectedTopic]}
                      </p>

                    </div>

                  </div>

                </div>


                {/* Questions */}
                <div>

                  {faqData[selectedTopic]?.map((item, index) => {

                    const isOpen = openIndex === index;

                    return (
                      <div
                        key={index}
                        className="border-b border-gray-100 last:border-b-0"
                      >

                        <button
                          type="button"
                          onClick={() =>
                            setOpenIndex(isOpen ? null : index)
                          }
                          className="w-full flex items-center justify-between gap-5 px-6 md:px-8 py-5 md:py-6 text-left hover:bg-gray-50 transition"
                        >

                          <span className="font-semibold text-gray-800 text-base md:text-lg">
                            {item.question}
                          </span>

                          <FaChevronDown
                            className={`shrink-0 text-cyan-500 transition-transform duration-300 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />

                        </button>


                        <div
                          className={`grid transition-all duration-300 ease-in-out ${
                            isOpen
                              ? "grid-rows-[1fr] opacity-100"
                              : "grid-rows-[0fr] opacity-0"
                          }`}
                        >

                          <div className="overflow-hidden">

                            <p className="px-6 md:px-8 pb-6 text-gray-600 leading-7">
                              {item.answer}
                            </p>

                          </div>

                        </div>

                      </div>
                    );
                  })}

                </div>

              </div>


              {/* Need Help Card */}
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 mt-6 text-center">

                <div className="w-14 h-14 bg-cyan-50 rounded-full flex items-center justify-center mx-auto">

                  <FaHeadset className="text-cyan-500 text-2xl" />

                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-[#0d152b] mt-4">
                  Need Help?
                </h2>

                <p className="text-gray-600 mt-3 max-w-2xl mx-auto leading-7">
                  If you couldn't find the answer you're looking for,
                  our support team is always ready to help. Contact us
                  for booking assistance, payment queries, property
                  verification, or technical issues.
                </p>

                <Link
                  to="/contact"
                  className="inline-block mt-6 bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-xl font-semibold transition"
                >
                  Contact Support
                </Link>

              </div>

            </main>

          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}