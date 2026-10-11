import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaGoogle,
  FaHome,
} from "react-icons/fa";
import api from "../services/api";

const Login = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("auth/login.php", {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        // Save logged-in user
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );

        alert(response.data.message);

        // Redirect based on role
        

const user = response.data.user;

localStorage.setItem("user", JSON.stringify(user));

if (user.role === "admin") {
  navigate("/admin");
} else if (user.role === "owner") {
  navigate("/owner");
} else if (user.role === "student") {
  navigate("/");
}
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Unable to connect to the server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-5 py-10">

      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2">

        {/* Left Side */}
        <div className="hidden lg:flex bg-linear-to-r from-cyan-900 to-cyan-600 p-12 flex-col justify-center">

          <h1 className="text-5xl font-bold text-white">
            Welcome Back 👋
          </h1>

          <p className="text-slate-300 mt-6 text-lg leading-8">
            Login to access your saved properties, bookings,
            shortlist, and personalized recommendations.
          </p>

          <div className="space-y-5 mt-10">

            <div className="flex items-center gap-4 text-cyan-300">
              <FaHome />
              Verified PGs & Hostels
            </div>

            <div className="flex items-center gap-4 text-cyan-300">
              ✔ Affordable Rent
            </div>

            <div className="flex items-center gap-4 text-cyan-300">
              ✔ Safe & Secure Booking
            </div>

            <div className="flex items-center gap-4 text-cyan-300">
              ✔ 24×7 Customer Support
            </div>

          </div>

        </div>

        {/* Right Side */}
        <div className="p-10 md:p-14">

          <h2 className="text-4xl font-bold text-[#0d152b]">
            Login
          </h2>

          <p className="text-gray-500 mt-2">
            Login to continue to your PGHub account.
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 mt-8"
          >

            {/* Email */}
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-5 text-gray-400" />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FaLock className="absolute left-4 top-5 text-gray-400" />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            <div className="flex justify-between items-center text-sm">

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" />
                Remember Me
              </label>

              <Link
                to="/forgot-password"
                className="text-cyan-500 hover:underline"
              >
                Forgot Password?
              </Link>

            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-400 hover:bg-cyan-500 text-white py-4 rounded-xl font-semibold transition disabled:bg-gray-400"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* Google Button */}
            <button
              type="button"
              className="w-full border py-4 rounded-xl flex justify-center items-center gap-3 hover:bg-slate-100 transition"
            >
              <FaGoogle />
              Continue with Google
            </button>

          </form>

          <p className="text-center mt-8 text-gray-600">

            Don't have an account?

            <Link
              to="/signup"
              className="text-cyan-500 font-semibold ml-2 hover:underline"
            >
              Sign Up
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
};

export default Login;