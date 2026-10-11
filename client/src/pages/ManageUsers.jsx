import { useEffect, useState } from "react";
import { FaTrash, FaUser } from "react-icons/fa";

import AdminSidebar from "../components/AdminSidebar";
import {
  getAdminUsers,
  deleteAdminUser,
} from "../services/admin";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);

      const response = await getAdminUsers();

      if (response.data.success) {
        setUsers(response.data.users || []);
      } else {
        alert(response.data.message || "Failed to load users.");
      }
    } catch (error) {
      console.error("Users Error:", error);
      alert("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      const response = await deleteAdminUser(id);

      if (response.data.success) {
        alert("User deleted successfully.");

        setUsers((prev) =>
          prev.filter((user) => Number(user.id) !== Number(id))
        );
      } else {
        alert(response.data.message || "Failed to delete user.");
      }
    } catch (error) {
      console.error("Delete User Error:", error);
      alert("Failed to delete user.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />

      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Manage Users
          </h1>

          <p className="text-gray-500 mt-1">
            View and manage all registered PGHub users.
          </p>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No users found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      User
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Email
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Phone
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Role
                    </th>

                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b last:border-b-0 hover:bg-gray-50"
                    >
                      {/* User */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
                            <FaUser className="text-cyan-600" />
                          </div>

                          <div>
                            <p className="font-semibold text-gray-800">
                              {user.full_name}
                            </p>

                            <p className="text-sm text-gray-500">
                              ID: #{user.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4 text-gray-600">
                        {user.email}
                      </td>

                      {/* Phone */}
                      <td className="px-6 py-4 text-gray-600">
                        {user.phone || "Not provided"}
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-cyan-50 text-cyan-700"
                          }`}
                        >
                          {user.role || "user"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                            title="Delete User"
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

export default ManageUsers;