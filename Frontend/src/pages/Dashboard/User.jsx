
import React, { useEffect, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:5000/api/v1/getAllUsers"
        );
        setUsers(response.data.user || []);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(
        `http://localhost:5000/api/v1/deleteuser/${id}`,
        config
      );
      setUsers(users.filter((user) => user._id !== id));
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="container-fluid px-4 py-4">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white border-0 pt-3">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0 fw-bold text-danger">Customer Management</h4>
          </div>
          <p className="text-muted mb-0 mt-1">
            {users.length} registered {users.length === 1 ? 'customer' : 'customers'}
          </p>
        </div>
        
        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : users.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="text-center">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col" className="text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user._id} className="border-top">
                      <td className="text-center fw-bold">{index + 1}</td>
                      <td>
                        <span className="fw-semibold">{user.username}</span>
                      </td>
                      <td>
                        <span className="text-muted">{user.email}</span>
                      </td>
                      <td className="text-end pe-4">
                        <div className="d-flex justify-content-end gap-2">
                          <button
                            className="btn btn-sm btn-outline-warning d-flex align-items-center gap-1"
                            onClick={() => {/* Edit functionality here */}}
                          >
                            <MdEdit size={16} />
                            <span>Edit</span>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                            onClick={() => handleDelete(user._id)}
                          >
                            <MdDelete size={16} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#6c757d" viewBox="0 0 16 16">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
              </svg>
              <h5 className="text-muted mt-3">No customers found</h5>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default User;