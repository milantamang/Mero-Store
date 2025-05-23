// Import necessary React hooks and libraries
import React, { useEffect, useState } from "react";
import axios from "axios"; // Library for making API calls
import { toast } from "react-toastify"; // Library for showing notifications
import { CLOUDINARY_URL, UPLOAD_PRESET } from "../../utils/Cloudinary"; // Cloudinary configuration for image upload

const AddProducts = () => {
  // Local state variables for component functionality
  const [categories, setCategories] = useState([]); // Store available product categories
  const [loading, setLoading] = useState(false); // Track loading state for API calls
  const [imageUploading, setImageUploading] = useState(false); // Track image upload progress
  const SIZE_OPTIONS = ["S", "M", "L", "XL", "XXL"]; // Available product sizes (constant array)
  
  // Product form data state with initial values
  const [productData, setProductData] = useState({
    name: "", // Product name
    image: "", // Product image URL (from Cloudinary)
    price: "", // Product price
    colors: "", // Available colors (comma-separated)
    category: "", // Selected product category
    stock: [0, 0, 0, 0, 0] // Stock quantity for each size (S, M, L, XL, XXL)
  });

  // Effect hook: Fetch categories when component loads
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true); // Show loading state
        // API call to get available categories from server
        const response = await axios.get(
          "http://localhost:5000/api/v1/getcategory"
        );
        setCategories(response.data.categories); // Store categories in state
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories"); // Show error notification
      } finally {
        setLoading(false); // Hide loading state
      }
    };

    fetchCategories(); // Call the function
  }, []);

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
    const newStock = [...productData.stock]; // Create copy of current stock array
    newStock[index] = parseInt(value) || 0; // Update stock for specific size index
    setProductData({ ...productData, stock: newStock }); // Update product data with new stock
  };

  // Function to handle image upload to Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; // Get selected file
    if (!file) return; // Exit if no file selected

    setImageUploading(true); // Show image uploading state

    // Create FormData object for file upload
    const formData = new FormData();
    formData.append("file", file);                   // image fle
    formData.append("upload_preset", UPLOAD_PRESET); // Preset name (acts like a "piblic key")

    try {
      // Upload image to Cloudinary
      const response = await axios.post(CLOUDINARY_URL, formData, { // send to cloudinary-No username/password
        headers: {
          "Content-Type": "multipart/form-data", // Required for file upload
        },
      });
      const imageUrl = response.data.secure_url; // Get image URL from Cloudinary response
      // Update product data with uploaded image URL
      setProductData({
        ...productData,
        image: imageUrl,
      });
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setImageUploading(false); // Hide uploading state
    }
  };

  // Function to handle form submission and create new product
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true); // Show loading state
    
    // Filter sizes that have stock greater than 0
    const size = SIZE_OPTIONS.filter((_, i) => productData.stock[i] > 0);
    
    // Calculate total stock across all sizes
    const totalStock = productData.stock.reduce((sum, qty) => sum + qty, 0);
    
    // Validation: Check if at least one size has stock
    if (totalStock === 0) {
      toast.error("Please enter stock for at least one size.");
      setLoading(false);
      return;
    }
    
    try {
      // Get authentication token from localStorage
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Add token for authentication
        },
      };
      
      // API call to create new product
      const response = await axios.post(
        "http://localhost:5000/api/v1/products/new",
        {...productData, size} , // Send product data with available sizes
        config
      );
      toast.success("Product added successfully!");
      
      // Reset form after successful submission
      setProductData({
        name: "",
        image: "",
        price: "",
        colors: "",
        category: "",
        stock: [0, 0, 0, 0, 0],
      });
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product");
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  // JSX: Component's user interface
  return (
    // Main container with Bootstrap styling
    <div className="container-fluid px-4 py-4">
      <div className="card shadow-sm border-0">
        {/* Header section */}
        <div className="card-header bg-white border-0 pt-3">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0 fw-bold text-danger">Add New Product</h4>
          </div>
          <p className="text-muted mb-0 mt-1">Fill in the product details below</p>
        </div>

        {/* Form body */}
        <div className="card-body">
          {/* Conditional rendering: Show loader if categories are loading */}
          {loading && categories.length === 0 ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row justify-content-center">
              <div className="col-lg-8">
                {/* Product form */}
                <form onSubmit={handleSubmit}>
                  {/* Product name input */}
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
                      onChange={handleChange} // Handle input changes
                      required
                    />
                  </div>

                  {/* Image upload section */}
                  <div className="mb-4">
                    <label htmlFor="image" className="form-label fw-semibold">
                      Upload Image
                    </label>
                    <input
                      type="file"
                      className="form-control border-primary rounded-2 py-2"
                      id="image"
                      name="image"
                      onChange={handleImageUpload} // Handle image upload
                      required
                    />
                    {/* Show uploading status */}
                    {imageUploading && (
                      <div className="text-muted mt-2">Uploading image...</div>
                    )}
                    {/* Show uploaded image preview */}
                    {productData.image && (
                      <img
                        src={productData.image}
                        alt="Uploaded"
                        className="mt-3 rounded border"
                        style={{ width: "100px", height: "auto" }}
                      />
                    )}
                  </div>

                  {/* Price and Category section (side by side) */}
                  <div className="row g-3 mb-4">
                    {/* Price input */}
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
                        onChange={handleChange} // Handle price changes
                        required
                      />
                    </div>

                    {/* Category dropdown */}
                    <div className="col-md-6">
                      <label htmlFor="category" className="form-label fw-semibold">
                        Category
                      </label>
                      <select
                        className="form-select border-primary rounded-2 py-2"
                        id="category"
                        name="category"
                        value={productData.category}
                        onChange={handleChange} // Handle category selection
                        required
                      >
                        <option value="" disabled>Select a category</option>
                        {/* Map through available categories */}
                        {categories.map((category) => (
                          <option key={category._id} value={category.name}>
                            {category.name}
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
                            value={productData.stock[index]} // Stock value for this size
                            onChange={(e) => handleStockChange(index, e.target.value)} // Handle stock changes
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Colors input */}
                  <div className="mb-4">
                    <label htmlFor="colors" className="form-label fw-semibold">
                      Colors 
                    </label>
                    <input
                      type="text"
                      className="form-control border-primary rounded-2 py-2"
                      id="colors"
                      name="colors"
                      value={productData.colors}
                      onChange={handleChange} // Handle color input changes
                      placeholder="e.g., Red, Blue, Green"
                      required
                    />
                  </div>

                  {/* Submit button */}
                  <div className="d-grid pt-2">
                    <button
                      type="submit"
                      className="btn btn-primary py-2 rounded-2 fw-semibold"
                      disabled={loading || imageUploading} // Disable during loading or image upload
                    >
                      {/* Dynamic button text based on loading state */}
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Adding Product...
                        </>
                      ) : (
                        "Add Product"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Export component for use in other files
export default AddProducts;