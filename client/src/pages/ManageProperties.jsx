import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

import AdminSidebar from "../components/AdminSidebar";
import {
  getAdminProperties,
  deleteAdminProperty,
} from "../services/admin";

const ManageProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);

      const response = await getAdminProperties();

      if (response.data.success) {
        setProperties(response.data.properties || []);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Properties Error:", error);
      alert("Failed to load properties.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (!confirmDelete) return;

    try {
      const response = await deleteAdminProperty(id);

      if (response.data.success) {
        alert("Property deleted successfully.");

        setProperties((prev) =>
          prev.filter((property) => property.id !== id)
        );
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Delete Property Error:", error);
      alert("Failed to delete property.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      <AdminSidebar />

      <main className="ml-64 p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Manage Properties
            </h1>

            <p className="text-gray-500 mt-1">
              View, edit and manage all PG properties.
            </p>
          </div>

          <Link
            to="/admin/properties/add"
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-3 rounded-xl font-semibold transition"
          >
            <FaPlus />
            Add Property
          </Link>

        </div>


        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading properties...
            </div>
          ) : properties.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No properties found.
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50 border-b">

                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Property
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Location
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Price
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Gender
                    </th>

                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                      Actions
                    </th>
                  </tr>

                </thead>

                <tbody>

                  {properties.map((property) => (

                    <tr
                      key={property.id}
                      className="border-b last:border-b-0 hover:bg-gray-50"
                    >

                      <td className="px-6 py-4">

                        <div className="font-semibold text-gray-800">
                          {property.title}
                        </div>

                        <div className="text-sm text-gray-500">
                          ID: #{property.id}
                        </div>

                      </td>


                      <td className="px-6 py-4 text-gray-600">
                        {property.location}, {property.city}
                      </td>


                      <td className="px-6 py-4 font-semibold text-gray-800">
                        ₹{Number(property.price).toLocaleString("en-IN")}
                      </td>


                      <td className="px-6 py-4">

                        <span className="px-3 py-1 rounded-full text-sm bg-cyan-50 text-cyan-700">
                          {property.gender}
                        </span>

                      </td>


                      <td className="px-6 py-4">

                        <div className="flex justify-end gap-2">

                          <Link
                            to={`/property/${property.id}`}
                            className="px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                            title="View"
                          >
                            View
                          </Link>

                          <Link
                            to={`/admin/properties/edit/${property.id}`}
                            className="p-2 rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                            title="Edit"
                          >
                            <FaEdit />
                          </Link>

                          <button
                            onClick={() =>
                              handleDelete(property.id)
                            }
                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </main>

    </div>
  );
};

export default ManageProperties;