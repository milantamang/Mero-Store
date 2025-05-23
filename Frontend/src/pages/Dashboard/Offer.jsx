import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { MdDelete, MdAddCircleOutline } from "react-icons/md";
import { CLOUDINARY_URL, UPLOAD_PRESET } from "../../utils/Cloudinary";

const AddOffer = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addingOffer, setAddingOffer] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const [productData, setProductData] = useState({
    name: "",
    image: "",
    offer: "",
  });

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        "http://localhost:5000/api/v1/getalloffers",
        config
      );
      setOffers(response.data.homeOffer || []);
    } catch (error) {
      console.error("Error fetching offers:", error);
      toast.error("Failed to fetch offers");
    } finally {
      setLoading(false);
    }
  };

    const toggleOfferStatus = async (id, currentStatus) => {
      try {
      
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.put(
        `http://localhost:5000/api/v1/updateofferstatus/${id}`,
        { status: !currentStatus }, // Toggle the status
        config
      );
      toast.success("Offer status updated successfully");
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

  const deleteOffer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(
        `http://localhost:5000/api/v1/deleteoffer/${id}`,
        config
      );
      toast.success("Offer deleted successfully");
      fetchOffers();
    } catch (error) {
      console.error("Error deleting offer:", error);
      toast.error("Failed to delete offer");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
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
    setAddingOffer(true);

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.post(
        "http://localhost:5000/api/v1/addoffer",
        productData,
        config
      );
      toast.success("Offer added successfully");
      setProductData({
        name: "",
        image: "",
        offer: "",
      });
      fetchOffers();
    } catch (error) {
      console.error("Error adding offer:", error);
      toast.error("Failed to add offer");
    } finally {
      setAddingOffer(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  return (
    <div className="container-fluid px-4 py-4">
      {/* Add Offer Card */}
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
              <form onSubmit={handleSubmit}>
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
                    onChange={handleChange}
                    required
                  />
                </div>

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

                <div className="d-grid pt-2">
                  <button
                    type="submit"
                    className="btn btn-primary py-2 rounded-2 fw-semibold"
                    disabled={addingOffer || imageUploading}
                  >
                    {addingOffer ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Adding...
                      </>
                    ) : (
                      <>
                        <MdAddCircleOutline className="me-2" size={18} />
                        Add Offer
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Offers List Card */}
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
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : offers.length > 0 ? (
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
                  {offers.map((offer, index) => (
                    <tr key={offer._id} className="border-top">
                      <td className="text-center fw-bold">{index + 1}</td>
                      <td>
                        <span className="fw-semibold">{offer.name}</span>
                      </td>
                      <td>
                        <span className="badge bg-success bg-opacity-10 text-success">
                          {offer.offer}
                        </span>
                      </td>
                      <td>
                        <img
                          src={offer.image}
                          alt={offer.name}
                          className="rounded border"
                          style={{ width: "80px", height: "auto" }}
                        />
                      </td>
                       <td>
                        <button
                          className={`btn btn-sm ${
                            offer.status ? "btn-success" : "btn-secondary"
                          }`}
                          onClick={() => toggleOfferStatus(offer._id, offer.status)}
                        >
                          {offer.status ? "On" : "Off"}
                        </button>
                      </td>
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