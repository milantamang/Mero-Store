// Import necessary React hooks and libraries
import React, { useEffect, useState } from "react";
import axios from "axios"; // For making API calls to the server
import { toast } from "react-toastify"; // For showing success/error notifications
import { MdDelete, MdAddCircleOutline } from "react-icons/md"; // Icons for buttons
import { CLOUDINARY_URL, UPLOAD_PRESET } from "../../utils/Cloudinary"; // Cloudinary config for image uploads

const AddOffer = () => {
  // State variables to manage component data
  const [offers, setOffers] = useState([]); // Store list of all offers from database
  const [loading, setLoading] = useState(false); // Track loading state when fetching offers
  const [addingOffer, setAddingOffer] = useState(false); // Track when adding new offer
  const [imageUploading, setImageUploading] = useState(false); // Track image upload progress

  // State for form data - stores the offer information being created
  const [productData, setProductData] = useState({
    name: "", // Offer title (e.g., "Summer Sale")
    image: "", // URL of uploaded image from Cloudinary
    offer: "", // Offer description (e.g., "50% off all items")
  });

  // Function to fetch all offers from the server
  const fetchOffers = async () => {
    try {
      setLoading(true); // Show loading spinner
      
      // Get authentication token from browser storage
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Send token for admin verification
        },
      };
      
      // API call to get all offers from backend
      const response = await axios.get(
        "http://localhost:5000/api/v1/getalloffers",
        config
      );
      
      // Update state with fetched offers
      setOffers(response.data.homeOffer || []);
    } catch (error) {
      console.error("Error fetching offers:", error);
      toast.error("Failed to fetch offers"); // Show error notification
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  // Function to toggle offer status (On/Off) - controls if offer is displayed on website
  const toggleOfferStatus = async (id, currentStatus) => {
    try {
      // Get authentication token
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      // API call to update offer status in database
      const response = await axios.put(
        `http://localhost:5000/api/v1/updateofferstatus/${id}`,
        { status: !currentStatus }, // Toggle the status (true becomes false, false becomes true)
        config
      );
      
      toast.success("Offer status updated successfully");
      
      // Update the offers list in frontend without refetching from server
      setOffers(
        offers.map((offer) =>
          offer._id === id ? { ...offer, status: !currentStatus } : offer
        )
      );
    } catch (error) {
      console.error("Error updating offer status:", error);
      toast.error("Failed to update offer status");
    }
  };

  // Function to delete an offer permanently
  const deleteOffer = async (id) => {
    // Show confirmation dialog before deleting
    if (!window.confirm("Are you sure you want to delete this offer?")) return;

    try {
      // Get authentication token
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      // API call to delete offer from database
      await axios.delete(
        `http://localhost:5000/api/v1/deleteoffer/${id}`,
        config
      );
      
      toast.success("Offer deleted successfully");
      fetchOffers(); // Refresh the offers list after deletion
    } catch (error) {
      console.error("Error deleting offer:", error);
      toast.error("Failed to delete offer");
    }
  };

  // Function to handle form input changes (name and offer description)
  const handleChange = (e) => {
    const { name, value } = e.target; // Get input field name and its value
    
    // Update productData state with new value
    setProductData({
      ...productData, // Keep existing data
      [name]: value,  // Update only the changed field
    });
  };

  // Function to handle image upload to Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (!file) return; // Exit if no file selected

    setImageUploading(true); // Show uploading status

    // Prepare file data for Cloudinary upload
    const formData = new FormData();
    formData.append("file", file); // Add the image file
    formData.append("upload_preset", UPLOAD_PRESET); // Add Cloudinary preset name

    try {
      // Upload image to Cloudinary
      const response = await axios.post(CLOUDINARY_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Required for file uploads
        },
      });
      
      // Get the image URL from Cloudinary response
      const imageUrl = response.data.secure_url;
      
      // Update form data with uploaded image URL
      setProductData({
        ...productData,
        image: imageUrl,
      });
      
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setImageUploading(false); // Hide uploading status
    }
  };

  // Function to handle form submission and create new offer
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setAddingOffer(true); // Show adding status

    try {
      // Get authentication token
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      // API call to create new offer in database
      await axios.post(
        "http://localhost:5000/api/v1/addoffer",
        productData, // Send form data (name, image, offer)
        config
      );
      
      toast.success("Offer added successfully");
      
      // Reset form after successful submission
      setProductData({
        name: "",
        image: "",
        offer: "",
      });
      
      fetchOffers(); // Refresh offers list to show new offer
    } catch (error) {
      console.error("Error adding offer:", error);
      toast.error("Failed to add offer");
    } finally {
      setAddingOffer(false); // Hide adding status
    }
  };

  // useEffect hook - runs when component first loads
  useEffect(() => {
    fetchOffers(); // Fetch all offers when page loads
  }, []);

  // JSX - The user interface of the component
  return (
    <div className="container-fluid px-4 py-4">
      {/* Add Offer Card - Form section for creating new offers */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-white border-0 pt-3">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0 fw-bold text-danger">Create New Offer</h4>
          </div>
          <p className="text-muted mb-0 mt-1">Add promotional offers for your store</p>
        </div>
        <div className="card-body">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {/* Form for creating new offer */}
              <form onSubmit={handleSubmit}>
                {/* Offer Title Input */}
                <div className="mb-4">
                  <label htmlFor="name" className="form-label fw-semibold">
                    Offer Title
                  </label>
                  <input
                    type="text"
                    className="form-control border-primary rounded-2 py-2"
                    id="name"
                    name="name"
                    value={productData.name}
                    onChange={handleChange} // Updates state when user types
                    required
                  />
                </div>

                {/* Offer Details Input */}
                <div className="mb-4">
                  <label htmlFor="offer" className="form-label fw-semibold">
                    Offer Details
                  </label>
                  <input
                    type="text"
                    className="form-control border-primary rounded-2 py-2"
                    id="offer"
                    name="offer"
                    value={productData.offer}
                    onChange={handleChange} // Updates state when user types
                    required
                  />
                </div>

                {/* Image Upload Input */}
                <div className="mb-4">
                  <label htmlFor="image" className="form-label fw-semibold">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    className="form-control border-primary rounded-2 py-2"
                    id="image"
                    name="image"
                    onChange={handleImageUpload} // Uploads image when file is selected
                    required
                  />
                  {/* Show uploading status */}
                  {imageUploading && (
                    <div className="text-muted mt-2">Uploading image...</div>
                  )}
                  {/* Show preview of uploaded image */}
                  {productData.image && (
                    <img
                      src={productData.image}
                      alt="Uploaded"
                      className="mt-3 rounded border"
                      style={{ width: "100px", height: "auto" }}
                    />
                  )}
                </div>

                {/* Submit Button */}
                <div className="d-grid pt-2">
                  <button
                    type="submit"
                    className="btn btn-primary py-2 rounded-2 fw-semibold"
                    disabled={addingOffer || imageUploading} // Disable while processing
                  >
                    {/* Dynamic button content based on state */}
                    {addingOffer ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Adding... {/* Show when adding offer */}
                      </>
                    ) : (
                      <>
                        <MdAddCircleOutline className="me-2" size={18} />
                        Add Offer {/* Show when ready to add */}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Offers List Card - Table section showing all existing offers */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white border-0 pt-3">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0 fw-bold text-danger">Current Offers</h4>
          </div>
          <p className="text-muted mb-0 mt-1">
            {offers.length} active {offers.length === 1 ? "offer" : "offers"}
          </p>
        </div>
        <div className="card-body">
          {/* Conditional rendering based on loading state */}
          {loading ? (
            // Show loading spinner while fetching offers
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : offers.length > 0 ? (
            // Show offers table if offers exist
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="text-center">#</th>
                    <th scope="col">Title</th>
                    <th scope="col">Offer</th>
                    <th scope="col">Image</th>
                    <th scope="col" className="text-end">Status</th>
                    <th scope="col" className="text-end pe-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Loop through each offer and create table row */}
                  {offers.map((offer, index) => (
                    <tr key={offer._id} className="border-top">
                      {/* Serial Number */}
                      <td className="text-center fw-bold">{index + 1}</td>
                      
                      {/* Offer Title */}
                      <td>
                        <span className="fw-semibold">{offer.name}</span>
                      </td>
                      
                      {/* Offer Details */}
                      <td>
                        <span className="badge bg-success bg-opacity-10 text-success">
                          {offer.offer}
                        </span>
                      </td>
                      
                      {/* Offer Image */}
                      <td>
                        <img
                          src={offer.image}
                          alt={offer.name}
                          className="rounded border"
                          style={{ width: "80px", height: "auto" }}
                        />
                      </td>
                      
                      {/* Status Toggle Button */}
                      <td>
                        <button
                          className={`btn btn-sm ${
                            offer.status ? "btn-success" : "btn-secondary"
                          }`}
                          onClick={() => toggleOfferStatus(offer._id, offer.status)}
                        >
                          {offer.status ? "On" : "Off"} {/* Show current status */}
                        </button>
                      </td>
                      
                      {/* Delete Button */}
                      <td className="text-end pe-4">
                        <button
                          className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                          onClick={() => deleteOffer(offer._id)}
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
            // Show message if no offers exist
            <div className="text-center py-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                fill="#6c757d"
                viewBox="0 0 16 16"
              >
                <path d="M7.5 1v7h1V1h-1z" />
                <path d="M3 8.812a4.999 4.999 0 0 1 2.578-4.375l-.485-.874A6 6 0 1 0 11 3.616l-.501.865A5 5 0 1 1 3 8.812z" />
              </svg>
              <h5 className="text-muted mt-3">No active offers</h5>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddOffer;