
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [productData, setProductData] = useState({
    name: "",
    image: "",
    colors: "",
    price: "",
    category: "",
    size: []
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/getcategory"
        );
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/products/${id}`
        );
        const product = response.data;
        setProductData({
          ...product,
          size: product.size || []
        });
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const handleSizeChange = (e) => {
    const { value, checked } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      size: checked
        ? [...prevData.size, value]
        : prevData.size.filter((s) => s !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.put(
        `http://localhost:5000/api/v1/editproduct/${id}`,
        productData,
        config
      );
      toast.success("Product updated successfully");
      navigate('/products');
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid px-4 py-5">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white border-0 pt-3">
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0 fw-bold text-danger">Edit Product</h4>
            </div>
            <p className="text-muted mb-0 mt-1">Loading product details...</p>
          </div>
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 py-4">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white border-0 pt-3">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="mb-0 fw-bold text-primary">Edit Product</h3>
          </div>
          <p className="text-muted mb-0 mt-1">Update the product details below</p>
        </div>
        
        <div className="card-body">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="form-label fw-semibold">
                    Product Name
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

                <div className="mb-4">
                  <label htmlFor="image" className="form-label fw-semibold">
                    Image URL
                  </label>
                  <input
                    type="text"
                    className="form-control border-primary rounded-2 py-2"
                    id="image"
                    name="image"
                    value={productData.image}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label htmlFor="price" className="form-label fw-semibold">
                      Price (Rs.)
                    </label>
                    <input
                      type="number"
                      className="form-control border-primary rounded-2 py-2"
                      id="price"
                      name="price"
                      value={productData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="category" className="form-label fw-semibold">
                      Category
                    </label>
                    <select
                      className="form-select border-primary rounded-2 py-2"
                      id="category"
                      name="category"
                      value={productData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>Select a category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="colors" className="form-label fw-semibold">
                    Colors (comma separated)
                  </label>
                  <input
                    type="text"
                    className="form-control border-primary rounded-2 py-2"
                    id="colors"
                    name="colors"
                    value={productData.colors}
                    onChange={handleChange}
                    placeholder="e.g., Red, Blue, Green"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Available Sizes</label>
                  <div className="d-flex flex-wrap gap-3">
                    {["S", "M", "L", "XL", "XXL"].map((size) => (
                      <div key={size} className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input border-primary"
                          id={size}
                          name="size"
                          value={size}
                          checked={productData.size.includes(size)}
                          onChange={handleSizeChange}
                        />
                        <label htmlFor={size} className="form-check-label ps-2">
                          {size}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="d-grid pt-2">
                  <button
                    type="submit"
                    className="btn btn-primary py-2 rounded-2 fw-semibold"
                    disabled={updating}
                  >
                    {updating ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Updating...
                      </>
                    ) : (
                      "Update Product"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;