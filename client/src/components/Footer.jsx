import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-cyan-600 text-gray-300">

      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Logo */}
        <div>
          <Link
            to="/"
            className="text-4xl font-bold text-white"
          >
            🏠 PGHub
          </Link>

          <p className="mt-5 leading-7 text-white">
            Find verified PGs and hostels near your college with affordable
            prices, modern amenities, and secure booking.
          </p>

          <div className="flex gap-4 mt-6">

            <a
              href="#"
              className="bg-cyan-500 p-3 rounded-full hover:bg-white hover:text-cyan-500 transition"
            >
              <FaFacebookF />
            </a>

            <a
              href="#"
              className="bg-cyan-500 p-3 rounded-full hover:bg-white hover:text-cyan-500 transition"
            >
              <FaInstagram />
            </a>

            <a
              href="#"
              className="bg-cyan-500 p-3 rounded-full hover:bg-white hover:text-cyan-500 transition"
            >
              <FaLinkedinIn />
            </a>

          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-5">
            Quick Links
          </h3>

          <ul className="space-y-3">

            <li>
              <Link to="/" className="hover:text-cyan-300">
                Home
              </Link>
            </li>

            <li>
              <Link to="/properties" className="hover:text-cyan-300">
                Properties
              </Link>
            </li>

            <li>
              <Link to="/fqs" className="hover:text-cyan-300">
                FQAs
              </Link>
            </li>

            <li>
              <Link to="/contact" className="hover:text-cyan-300">
                Contact
              </Link>
            </li>

          </ul>
        </div>

        {/* Popular Cities */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-5">
            Popular Cities
          </h3>

          <ul className="space-y-3">

            <li>
              <Link to="/properties/Delhi" className="hover:text-cyan-300">
                Delhi
              </Link>
            </li>

            <li>
              <Link to="/properties/Noida" className="hover:text-cyan-300">
                Noida
              </Link>
            </li>

            <li>
              <Link to="/properties/Pune" className="hover:text-cyan-300">
                Pune
              </Link>
            </li>

            <li>
              <Link to="/properties/Hyderabad" className="hover:text-cyan-300">
                Hyderabad
              </Link>
            </li>

            <li>
              <Link to="/properties/Bengaluru" className="hover:text-cyan-300">
                Bengaluru
              </Link>
            </li>

          </ul>
        </div>

        {/* Contact */}
        <div>

          <h3 className="text-xl font-semibold text-white mb-5">
            Contact Us
          </h3>

          <div className="space-y-5">

            <div className="flex gap-3">
              <FaMapMarkerAlt className="text-cyan-400 mt-1" />
              <p>Mirzapur, Uttar Pradesh, India</p>
            </div>

            <div className="flex gap-3">
              <FaEnvelope className="text-cyan-400 mt-1" />
              <p>mauryanupama1411@gmail.com</p>
            </div>

          </div>

        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-slate-700">

        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">

          <p className="text-white text-center md:text-left">
            © {new Date().getFullYear()} PGHub. All Rights Reserved.
          </p>

          <div className="flex gap-6">

            <Link to="/privacy" className="hover:text-cyan-300">
              Privacy Policy
            </Link>

            <Link to="/terms" className="hover:text-cyan-300">
              Terms & Conditions
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
};

export default Footer;