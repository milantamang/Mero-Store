
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { MdDelete, MdAddCircleOutline } from "react-icons/md";

const Category = () => {
  const [getcategory, setGetcategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addingCategory, setAddingCategory] = useState(false);
  const [productData, setProductData] = useState({ name: "" });

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/v1/getcategory"
      );
      setGetcategory(response.data.categories);
    } catch (error) {
      console.error("Error fetching Category:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(
        `http://localhost:5000/api/v1/deletecategory/${id}`,
        config
      );
      setGetcategory(getcategory.filter((category) => category._id !== id));
      toast.success("Category deleted successfully");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Admin login required");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAddingCategory(true);

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.post(
        "http://localhost:5000/api/v1/addcategory",
        productData,
        config
      );
      toast.success("Category added successfully!");
      setProductData({ name: "" });
      fetchCategory();
    } catch (error) {
      console.error("Error adding Category:", error);
      toast.error("Failed to add category");
    } finally {
      setAddingCategory(false);
    }
  };

  return (
    <div className="container-fluid px-4 py-4">
      {/* Add Category Card */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-white border-0 pt-3">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0 fw-bold text-danger">Add New Category</h4>
          </div>
          <p className="text-muted mb-0 mt-1">Create new product categories</p>
        </div>
        <div className="card-body">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="form-label fw-semibold">
                    Category Name
                  </label>
                  <input
                    type="text"
                    className="form-control border-primary rounded-2 py-2"
                    id="name"
                    name="name"
                    value={productData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="d-grid pt-2">
                  <button
                    type="submit"
                    className="btn btn-primary py-2 rounded-2 fw-semibold"
                    disabled={addingCategory}
                  >
                    {addingCategory ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Adding...
                      </>
                    ) : (
                      <>
                        <MdAddCircleOutline className="me-2" size={18} />
                        Add Category
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Categories List Card */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white border-0 pt-3">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0 fw-bold text-danger">All Categories</h4>
          </div>
          <p className="text-muted mb-0 mt-1">
            {getcategory.length} categories available
          </p>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : getcategory.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="ps-4">Category Name</th>
                    <th scope="col" className="text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getcategory.map((category) => (
                    <tr key={category._id} className="border-top">
                      <td className="ps-4">
                        <span className="fw-semibold">{category.name}</span>
                      </td>
                      <td className="text-end pe-4">
                        <button
                          className="btn btn-sm btn-outline-danger d-flex align-items-center  gap-1"
                          onClick={() => handleDeleteCategory(category._id)}
                        >
                          <MdDelete size={16} />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#6c757d" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
              </svg>
              <h5 className="text-muted mt-3">No categories available</h5>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Category;