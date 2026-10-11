import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane,
} from "react-icons/fa";

export default function Contact() {
  return (
    <>
      <Navbar />

      <section className="bg-gray-100 py-14">
        <div className="max-w-7xl mx-auto px-6">

          {/* Hero */}
          <div className="bg-linear-to-r from-cyan-600 to-cyan-800 rounded-3xl text-white text-center py-14 px-6 mb-10 shadow-lg">
            <h1 className="text-5xl font-bold">
              Contact Us
            </h1>

            <p className="mt-4 text-lg text-cyan-100 max-w-2xl mx-auto">
              We'd love to hear from you. Whether you have questions about
              bookings, properties, or support, our team is ready to help.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">

            {/* Contact Information */}
            <div className="space-y-6">

              <div className="bg-white rounded-2xl shadow p-6 flex items-start gap-4">
                <div className="bg-cyan-100 p-4 rounded-xl">
                  <FaEnvelope className="text-cyan-600 text-xl" />
                </div>

                <div>
                  <h3 className="font-bold text-lg text-[#0d152b]">
                    Email
                  </h3>

                  <p className="text-gray-600 mt-2">
                    mauryanupama1411@gmail.com
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow p-6 flex items-start gap-4">
                <div className="bg-cyan-100 p-4 rounded-xl">
                  <FaMapMarkerAlt className="text-cyan-600 text-xl" />
                </div>

                <div>
                  <h3 className="font-bold text-lg text-[#0d152b]">
                    Address
                  </h3>

                  <p className="text-gray-600 mt-2">
                    Lucknow, Uttar Pradesh, India
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow p-6 flex items-start gap-4">
                <div className="bg-cyan-100 p-4 rounded-xl">
                  <FaClock className="text-cyan-600 text-xl" />
                </div>

                <div>
                  <h3 className="font-bold text-lg text-[#0d152b]">
                    Working Hours
                  </h3>

                  <p className="text-gray-600 mt-2">
                    Monday - Saturday
                  </p>

                  <p className="text-gray-600">
                    9:00 AM - 6:00 PM
                  </p>
                </div>
              </div>

            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8">

              <h2 className="text-3xl font-bold text-[#0d152b] mb-2">
                Send us a Message
              </h2>

              <p className="text-gray-500 mb-8">
                Fill out the form below and our team will contact you soon.
              </p>

              <form className="space-y-6">

                <div className="grid md:grid-cols-2 gap-6">

                  <div>
                    <label className="block mb-2 font-semibold">
                      Full Name
                    </label>

                    <input
                      type="text"
                      placeholder="Enter your name"
                      className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">
                      Email
                    </label>

                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                </div>

                <div>
                  <label className="block mb-2 font-semibold">
                    Subject
                  </label>

                  <input
                    type="text"
                    placeholder="Enter subject"
                    className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold">
                    Message
                  </label>

                  <textarea
                    rows="6"
                    placeholder="Write your message..."
                    className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-3 transition"
                >
                  <FaPaperPlane />
                  Send Message
                </button>

              </form>

            </div>

          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}