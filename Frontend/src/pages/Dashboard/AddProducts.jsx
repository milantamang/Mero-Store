import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { CLOUDINARY_URL, UPLOAD_PRESET } from "../../utils/constants";

const AddProducts = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const SIZE_OPTIONS = ["S", "M", "L", "XL", "XXL"];
  const [productData, setProductData] = useState({
    name: "",
    image: "",
    price: "",
    colors: "",
    category: "",
    stock: [0, 0, 0, 0, 0]
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:5000/api/v1/getcategory"
        );
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const handleStockChange = (index, value) => {
    const newStock = [...productData.stock];
    newStock[index] = parseInt(value) || 0;
    setProductData({ ...productData, stock: newStock });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET); // Replace with your Cloudinary upload preset

    try {
      const response = await axios.post(CLOUDINARY_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const imageUrl = response.data.secure_url;
      setProductData({
        ...productData,
        image: imageUrl,
      });
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const size = SIZE_OPTIONS.filter((_, i) => productData.stock[i] > 0);
    const totalStock = productData.stock.reduce((sum, qty) => sum + qty, 0);
    if (totalStock === 0) {
      toast.error("Please enter stock for at least one size.");
      setLoading(false);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        "http://localhost:5000/api/v1/products/new",
        {...productData, size} ,
        config
      );
      toast.success("Product added successfully!");
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
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid px-4 py-4">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white border-0 pt-3">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0 fw-bold text-danger">Add New Product</h4>
          </div>
          <p className="text-muted mb-0 mt-1">Fill in the product details below</p>
        </div>

        <div className="card-body">
          {loading && categories.length === 0 ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
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
                      Upload Image
                    </label>
                    <input
                      type="file"
                      className="form-control border-primary rounded-2 py-2"
                      id="image"
                      name="image"
                      onChange={handleImageUpload}
                      required
                    />
                    {imageUploading && (
                      <div className="text-muted mt-2">Uploading image...</div>
                    )}
                    {productData.image && (
                      <img
                        src={productData.image}
                        alt="Uploaded"
                        className="mt-3 rounded border"
                        style={{ width: "100px", height: "auto" }}
                      />
                    )}
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
                    <label htmlFor="colors" className="form-label fw-semibold">
                      Colors 
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

                  <div className="d-grid pt-2">
                    <button
                      type="submit"
                      className="btn btn-primary py-2 rounded-2 fw-semibold"
                      disabled={loading || imageUploading}
                    >
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

export default AddProducts;