import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const EditOrder = ({ orderId }) => {
  const [orderData, setOrderData] = useState({
    shippingInfo: {
      address: "",
      city: "",
      country: "",
    },
    orderStatus: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(
          `http://localhost:5000/api/v1/orders/admin/${orderId}`,
          config
        );
        setOrderData(response.data.order);
      } catch (error) {
        console.error("Error fetching order details:", error);
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("shippingInfo.")) {
      const field = name.split(".")[1];
      setOrderData((prevData) => ({
        ...prevData,
        shippingInfo: {
          ...prevData.shippingInfo,
          [field]: value,
        },
      }));
    } else {
      setOrderData({
        ...orderData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.put(
        `http://localhost:5000/api/v1/orders/admin/${orderId}`,
        orderData,
        config
      );
      toast.success("Order updated successfully!");
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid px-4 py-4">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white border-0 pt-3">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0 fw-bold text-danger">Edit Order</h4>
          </div>
          <p className="text-muted mb-0 mt-1">Update the order details below</p>
        </div>

        <div className="card-body">
          {loading ? (
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
                    <label htmlFor="address" className="form-label fw-semibold">
                      Shipping Address
                    </label>
                    <input
                      type="text"
                      className="form-control border-primary rounded-2 py-2"
                      id="address"
                      name="shippingInfo.address"
                      value={orderData.shippingInfo.address}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <label htmlFor="city" className="form-label fw-semibold">
                        City
                      </label>
                      <input
                        type="text"
                        className="form-control border-primary rounded-2 py-2"
                        id="city"
                        name="shippingInfo.city"
                        value={orderData.shippingInfo.city}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="country" className="form-label fw-semibold">
                        Country
                      </label>
                      <input
                        type="text"
                        className="form-control border-primary rounded-2 py-2"
                        id="country"
                        name="shippingInfo.country"
                        value={orderData.shippingInfo.country}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="orderStatus" className="form-label fw-semibold">
                      Order Status
                    </label>
                    <select
                      className="form-select border-primary rounded-2 py-2"
                      id="orderStatus"
                      name="orderStatus"
                      value={orderData.orderStatus}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>
                        Select a status
                      </option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="d-grid pt-2">
                    <button
                      type="submit"
                      className="btn btn-primary py-2 rounded-2 fw-semibold"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Updating Order...
                        </>
                      ) : (
                        "Update Order"
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

export default EditOrder;