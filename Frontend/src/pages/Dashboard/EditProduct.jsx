import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { CLOUDINARY_URL, UPLOAD_PRESET } from "../../utils/Constants";

const SIZE_OPTIONS = ["S", "M", "L", "XL", "XXL"];

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [productData, setProductData] = useState({
    name: "",
    image: "",
    colors: "",
    price: "",
    category: "",
    stock: [0, 0, 0, 0, 0], // Matches SIZE_OPTIONS
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/v1/getcategory");
        setCategories(res.data.categories);
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
        const res = await axios.get(`http://localhost:5000/api/v1/admin/products/${id}`);
        const product = res.data;

        // Ensure stock array is complete
        let stock = product.stock || [];
        if (stock.length < SIZE_OPTIONS.length) {
          stock = Array(SIZE_OPTIONS.length)
            .fill(0)
            .map((_, i) => stock[i] || 0);
        }

        setProductData({
          ...product,
          stock,
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

  const handleStockChange = (index, value) => {
    const updatedStock = [...productData.stock];
    updatedStock[index] = parseInt(value) || 0;
    setProductData({
      ...productData,
      stock: updatedStock,
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await axios.post(CLOUDINARY_URL, formData);
      setProductData((prevData) => ({
        ...prevData,
        image: res.data.secure_url,
      }));
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const size = SIZE_OPTIONS.filter((_, i) => productData.stock[i] > 0);

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.put(
        `http://localhost:5000/api/v1/editproduct/${id}`,
        { ...productData, size }, 
        config
      );
      toast.success("Product updated successfully");
      navigate("/dashboard/products");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 py-4">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white border-0 pt-3">
          <h3 className="mb-0 fw-bold text-primary">Edit Product</h3>
          <p className="text-muted mt-1">Update the product details below</p>
        </div>
        <div className="card-body">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="form-label fw-semibold">Product Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control border-primary rounded-2 py-2"
                    value={productData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="image" className="form-label fw-semibold">Image</label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    className="form-control border-primary rounded-2 py-2"
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                  {uploading && <div className="text-muted mt-2">Uploading image...</div>}
                  {productData.image && (
                    <img src={productData.image} alt="Preview" className="mt-3 rounded border" style={{ maxHeight: "200px" }} />
                  )}
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label htmlFor="price" className="form-label fw-semibold">Price (Rs.)</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      className="form-control border-primary rounded-2 py-2"
                      value={productData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="category" className="form-label fw-semibold">Category</label>
                    <select
                      id="category"
                      name="category"
                      className="form-select border-primary rounded-2 py-2"
                      value={productData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Stock per Size</label>
                  <div className="row">
                    {SIZE_OPTIONS.map((size, index) => (
                      <div className="col-md-2 mb-2" key={size}>
                        <label className="form-label">{size}</label>
                        <input
                          type="number"
                          min="0"
                          className="form-control border-primary rounded-2 py-2"
                          value={productData.stock[index]}
                          onChange={(e) => handleStockChange(index, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="colors" className="form-label fw-semibold">Colors (comma separated)</label>
                  <input
                    type="text"
                    id="colors"
                    name="colors"
                    className="form-control border-primary rounded-2 py-2"
                    value={productData.colors}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="d-grid pt-2">
                  <button type="submit" className="btn btn-primary py-2 rounded-2 fw-semibold" disabled={updating}>
                    {updating ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
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
