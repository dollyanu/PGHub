import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import PropertyList from "./pages/PropertyList";
import PropertyDetails from "./pages/PropertyDetails";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import FQAs from "./pages/FQAs";
import Contact from "./pages/Contact";
import Shortlist from "./pages/Shortlist";
import Profile from "./pages/Profile";

import Booking from "./pages/Booking";
import Bookings from "./pages/Bookings";

import Settings from "./pages/Settings";

import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";
import ManageUsers from "./pages/ManageUsers";
import ManageProperties from "./pages/ManageProperties";
import ManageBookings from "./pages/ManageBookings";

import OwnerRoute from "./components/OwnerRoute";
import OwnerDashboard from "./pages/OwnerDashboard";
import OwnerProperties from "./pages/OwnerProperties";
import OwnerBookings from "./pages/OwnerBookings";
import OwnerAddProperty from "./pages/OwnerAddProperty";
import OwnerEditProperty from "./pages/OwnerEditProperty";

function App() {
  return (
    <Routes>

      {/* Home */}
      <Route path="/" element={<Home />} />

      {/* Properties */}
      <Route path="/properties" element={<PropertyList />} />
      <Route path="/properties/:city" element={<PropertyList />} />

      {/* Property Details */}
      <Route path="/property/:id" element={<PropertyDetails />} />

      {/* Single Property Booking */}
      <Route path="/booking/:id" element={<Booking />} />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Other Pages */}
      <Route path="/fqas" element={<FQAs />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/shortlist" element={<Shortlist />} />
      <Route path="/profile" element={<Profile />} />

      {/* My Bookings */}
      <Route path="/bookings" element={<Bookings />} />

      {/* Settings */}
      <Route path="/settings" element={<Settings />} />

<Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>

<Route
  path="/admin/users"
  element={
    <AdminRoute>
      <ManageUsers />
    </AdminRoute>
  }
/>

<Route
  path="/admin/properties"
  element={
    <AdminRoute>
      <ManageProperties />
    </AdminRoute>
  }
/>

<Route
  path="/admin/bookings"
  element={
    <AdminRoute>
      <ManageBookings />
    </AdminRoute>
  }
/>  

<Route
  path="/owner"
  element={
    <OwnerRoute>
      <OwnerDashboard />
    </OwnerRoute>
  }
/>

<Route
  path="/owner/properties"
  element={
    <OwnerRoute>
      <OwnerProperties />
    </OwnerRoute>
  }
/>

<Route
  path="/owner/properties/add"
  element={
    <OwnerRoute>
      <OwnerAddProperty />
    </OwnerRoute>
  }
/>

<Route
  path="/owner/properties/edit/:id"
  element={
    <OwnerRoute>
      <OwnerEditProperty />
    </OwnerRoute>
  }
/>

<Route
  path="/owner/bookings"
  element={
    <OwnerRoute>
      <OwnerBookings />
    </OwnerRoute>
  }
/>

    </Routes>
  );
}

export default App;