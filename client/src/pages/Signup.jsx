import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaGoogle,
  FaPhone,
  FaUserTag,
} from "react-icons/fa";
import api from "../services/api";

const Signup = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    role: "student",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.full_name ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("auth/signup.php", {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        password: formData.password,
      });

      if (response.data.success) {
        alert(response.data.message);

        setFormData({
          full_name: "",
          email: "",
          phone: "",
          role: "student",
          password: "",
          confirmPassword: "",
        });

        navigate("/login");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-5 py-10">

      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2">

        {/* Left Side */}

        <div className="hidden lg:flex bg-linear-to-br from-cyan-400 to-[#0d152b] p-12 flex-col justify-center">

          <h1 className="text-5xl font-bold text-white">
            Join PGHub
          </h1>

          <p className="text-slate-100 mt-6 text-lg leading-8">
            Create your free account and discover thousands of verified PGs
            across India.
          </p>

        </div>

        {/* Right Side */}

        <div className="p-10 md:p-14">

          <h2 className="text-4xl font-bold text-[#0d152b]">
            Create Account
          </h2>

          <p className="text-gray-500 mt-2">
            Register to start exploring PGs.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5 mt-8">

            {/* Full Name */}

            <div className="relative">
              <FaUser className="absolute left-4 top-5 text-gray-400" />

              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full border rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-cyan-400 outline-none"
              />
            </div>

            {/* Email */}

            <div className="relative">
              <FaEnvelope className="absolute left-4 top-5 text-gray-400" />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full border rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-cyan-400 outline-none"
              />
            </div>

            {/* Phone */}

            <div className="relative">
              <FaPhone className="absolute left-4 top-5 text-gray-400" />

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full border rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-cyan-400 outline-none"
              />
            </div>

            {/* Role */}

            <div className="relative">
              <FaUserTag className="absolute left-4 top-5 text-gray-400" />

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-cyan-400 outline-none appearance-none bg-white"
              >
                <option value="student">Student</option>
<option value="owner">PG Owner</option>
              </select>
            </div>

            {/* Password */}

            <div className="relative">
              <FaLock className="absolute left-4 top-5 text-gray-400" />

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full border rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-cyan-400 outline-none"
              />
            </div>

            {/* Confirm Password */}

            <div className="relative">
              <FaLock className="absolute left-4 top-5 text-gray-400" />

              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full border rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-cyan-400 outline-none"
              />
            </div>

            {/* Signup Button */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-400 hover:bg-cyan-500 text-white py-4 rounded-xl font-semibold transition duration-300 disabled:bg-gray-400"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            {/* Google */}

            <button
              type="button"
              className="w-full border py-4 rounded-xl flex justify-center items-center gap-3 hover:bg-slate-100 transition"
            >
              <FaGoogle />
              Sign up with Google
            </button>

          </form>

          <p className="text-center mt-8 text-gray-600">

            Already have an account?

            <Link
              to="/login"
              className="text-cyan-500 font-semibold ml-2 hover:underline"
            >
              Login
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
};

export default Signup;