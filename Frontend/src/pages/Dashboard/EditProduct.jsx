// Import necessary React hooks and libraries
import React, { useState, useEffect } from "react";
import axios from "axios"; // Library for making API calls
import { useNavigate, useParams } from "react-router-dom"; // React Router hooks for navigation and URL parameters
import { toast } from "react-toastify"; // Library for showing notifications
import { CLOUDINARY_URL, UPLOAD_PRESET } from "../../utils/Cloudinary"; // Cloudinary configuration for image upload

const SIZE_OPTIONS = ["S", "M", "L", "XL", "XXL"]; // Available product sizes (constant array)

const EditProduct = () => {
  // Hooks for navigation and URL parameters
  const navigate = useNavigate(); // Hook for programmatic navigation
  const { id } = useParams(); // Get product ID from URL parameters
  
  // Local state variables for component functionality
  const [categories, setCategories] = useState([]); // Store available product categories
  const [loading, setLoading] = useState(true); // Track initial data loading state
  const [updating, setUpdating] = useState(false); // Track form submission state
  const [uploading, setUploading] = useState(false); // Track image upload progress

  // Product form data state with initial values
  const [productData, setProductData] = useState({
    name: "", // Product name
    image: "", // Product image URL
    colors: "", // Available colors (comma-separated)
    price: "", // Product price
    category: "", // Product category
    stock: [0, 0, 0, 0, 0], // Stock quantity for each size (matches SIZE_OPTIONS array)
  });

  // Effect hook: Fetch available categories when component loads
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // API call to get categories from server
        const res = await axios.get("http://localhost:5000/api/v1/getcategory");
        setCategories(res.data.categories); // Store categories in state
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories"); // Show error notification
      }
    };

    fetchCategories(); // Call the function
  }, []);

  // Effect hook: Fetch existing product data when component loads or ID changes
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // API call to get specific product data by ID
        const res = await axios.get(`http://localhost:5000/api/v1/admin/products/${id}`);
        const product = res.data;

        // Ensure stock array has correct length (matches SIZE_OPTIONS)
        let stock = product.stock || [];
        if (stock.length < SIZE_OPTIONS.length) {
          // Fill missing stock values with 0
          stock = Array(SIZE_OPTIONS.length)
            .fill(0)
            .map((_, i) => stock[i] || 0);
        }

        // Update form data with fetched product information
        setProductData({
          ...product, // Spread all product properties
          stock, // Use processed stock array
        });
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false); // Hide loading state regardless of success/failure
      }
    };

    fetchProduct(); // Call the function
  }, [id]);

  // Function to handle regular input field changes (name, price, colors, category)
  const handleChange = (e) => {
    const { name, value } = e.target; // Get input name and value
    // Update product data state with new value
    setProductData({
      ...productData, // Keep existing data
      [name]: value, // Update only the changed field
    });
  };

  // Function to handle stock quantity changes for each size
  const handleStockChange = (index, value) => {
    const updatedStock = [...productData.stock]; // Create copy of current stock array
    updatedStock[index] = parseInt(value) || 0; // Update stock for specific size index
    // Update product data with new stock array
    setProductData({
      ...productData,
      stock: updatedStock,
    });
  };

  // Function to handle image upload to Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; // Get selected file
    if (!file) return; // Exit if no file selected

    setUploading(true); // Show uploading state
    
    // Create FormData object for file upload
    const formData = new FormData();
    formData.append("file", file); // Add image file
    formData.append("upload_preset", UPLOAD_PRESET); // Add Cloudinary preset

    try {
      // Upload image to Cloudinary
      const res = await axios.post(CLOUDINARY_URL, formData);
      // Update product data with new image URL using functional state update
      setProductData((prevData) => ({
        ...prevData,
        image: res.data.secure_url, // Get secure URL from Cloudinary response
      }));
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false); // Hide uploading state
    }
  };

  // Function to handle form submission and update product
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setUpdating(true); // Show updating state

    // Filter sizes that have stock greater than 0
    const size = SIZE_OPTIONS.filter((_, i) => productData.stock[i] > 0);

    try {
      // Get authentication token from localStorage
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Add token for authentication
        },
      };

      // API call to update product with new data
      await axios.put(
        `http://localhost:5000/api/v1/editproduct/${id}`,
        { ...productData, size }, // Send updated product data with available sizes
        config
      );
      toast.success("Product updated successfully");
      navigate("/dashboard/products"); // Navigate back to products list after successful update
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    } finally {
      setUpdating(false); // Hide updating state
    }
  };

  // Conditional rendering: Show loading spinner while fetching initial data
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // JSX: Component's user interface (main edit form)
  return (
    // Main container with Bootstrap styling
    <div className="container-fluid px-4 py-4">
      <div className="card shadow-sm border-0">
        {/* Header section */}
        <div className="card-header bg-white border-0 pt-3">
          <h3 className="mb-0 fw-bold text-primary">Edit Product</h3>
          <p className="text-muted mt-1">Update the product details below</p>
        </div>
        
        {/* Form body */}
        <div className="card-body">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {/* Product edit form */}
              <form onSubmit={handleSubmit}>
                {/* Product name input */}
                <div className="mb-4">
                  <label htmlFor="name" className="form-label fw-semibold">Product Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control border-primary rounded-2 py-2"
                    value={productData.name}
                    onChange={handleChange} // Handle input changes
                    required
                  />
                </div>

                {/* Image upload section */}
                <div className="mb-4">
                  <label htmlFor="image" className="form-label fw-semibold">Image</label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    className="form-control border-primary rounded-2 py-2"
                    onChange={handleImageUpload} // Handle image upload
                    accept="image/*" // Only accept image files
                  />
                  {/* Show uploading status */}
                  {uploading && <div className="text-muted mt-2">Uploading image...</div>}
                  {/* Show current/uploaded image preview */}
                  {productData.image && (
                    <img src={productData.image} alt="Preview" className="mt-3 rounded border" style={{ maxHeight: "200px" }} />
                  )}
                </div>

                {/* Price and Category section (side by side) */}
                <div className="row g-3 mb-4">
                  {/* Price input */}
                  <div className="col-md-6">
                    <label htmlFor="price" className="form-label fw-semibold">Price (Rs.)</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      className="form-control border-primary rounded-2 py-2"
                      value={productData.price}
                      onChange={handleChange} // Handle price changes
                      required
                    />
                  </div>
                  
                  {/* Category dropdown */}
                  <div className="col-md-6">
                    <label htmlFor="category" className="form-label fw-semibold">Category</label>
                    <select
                      id="category"
                      name="category"
                      className="form-select border-primary rounded-2 py-2"
                      value={productData.category}
                      onChange={handleChange} // Handle category selection
                      required
                    >
                      <option value="" disabled>Select a category</option>
                      {/* Map through available categories */}
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Stock management section for each size */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Stock per Size</label>
                  <div className="row">
                    {/* Create input for each size option */}
                    {SIZE_OPTIONS.map((size, index) => (
                      <div className="col-md-2 mb-2" key={size}>
                        <label className="form-label">{size}</label>
                        <input
                          type="number"
                          min="0"
                          className="form-control border-primary rounded-2 py-2"
                          value={productData.stock[index]} // Current stock value for this size
                          onChange={(e) => handleStockChange(index, e.target.value)} // Handle stock changes
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Colors input */}
                <div className="mb-4">
                  <label htmlFor="colors" className="form-label fw-semibold">Colors (comma separated)</label>
                  <input
                    type="text"
                    id="colors"
                    name="colors"
                    className="form-control border-primary rounded-2 py-2"
                    value={productData.colors}
                    onChange={handleChange} // Handle color input changes
                    required
                  />
                </div>

                {/* Submit button */}
                <div className="d-grid pt-2">
                  <button type="submit" className="btn btn-primary py-2 rounded-2 fw-semibold" disabled={updating}>
                    {/* Dynamic button text based on updating state */}
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

// Export component for use in other files
export default EditProduct;