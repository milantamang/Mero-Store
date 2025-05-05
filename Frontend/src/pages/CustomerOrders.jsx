import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cancelUserOrder, getUserOrders } from "../redux/order/orderSlice";
import { toast } from "react-toastify";

const CustomerOrders = () => {
  const dispatch = useDispatch();
  const { userOrders: orders, loading, error } = useSelector((state) => state.order);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    // Filter orders based on the active filter
    if (activeFilter === "All") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((order) => order.orderStatus === activeFilter));
    }
  }, [orders, activeFilter]);

  const handleCancelOrder = (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    dispatch(cancelUserOrder(orderId))
      .unwrap()
      .then(() => {
        toast.success("Order canceled successfully!");
      })
      .catch((error) => {
        toast.error(error || "Failed to cancel order.");
      });
  };

  return (
    <div className="container-fluid px-4 py-4">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white border-0 pt-3">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0 fw-bold text-danger">My Orders</h4>
          </div>
          <p className="text-muted mb-0 mt-1">
            {filteredOrders.length} {filteredOrders.length === 1 ? "order" : "orders"} found
          </p>
        </div>

        {/* Navigation for filtering orders */}
        <div className="card-body">
          <div className="d-flex justify-content-center mb-4">
            <button
              className={`btn btn-sm ${activeFilter === "All" ? "btn-primary" : "btn-outline-primary"} me-2`}
              onClick={() => setActiveFilter("All")}
            >
              All
            </button>
            <button
              className={`btn btn-sm ${activeFilter === "Processing" ? "btn-primary" : "btn-outline-primary"} me-2`}
              onClick={() => setActiveFilter("Processing")}
            >
              To Be Delivered
            </button>
            <button
              className={`btn btn-sm ${activeFilter === "Shipped" ? "btn-primary" : "btn-outline-primary"} me-2`}
              onClick={() => setActiveFilter("Delivered")}
            >
              Delivered
            </button>
            <button
              className={`btn btn-sm ${activeFilter === "Cancelled" ? "btn-primary" : "btn-outline-primary"} me-2`}
              onClick={() => setActiveFilter("Cancelled")}
            >
              Canceled
            </button>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Loading your orders...</p>
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Order ID</th>
                    <th scope="col">Date</th>
                    <th scope="col" className="text-end">Total</th>
                    <th scope="col">Status</th>
                    <th scope="col">Payment</th>
                    <th scope="col" className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="border-top">
                      <td>{order._id}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="text-end">Rs. {order.totalPrice}</td>
                      <td>
                        <span
                          className={`badge ${
                            order.orderStatus === "Processing"
                              ? "bg-warning text-dark"
                              : order.orderStatus === "Shipped"
                              ? "bg-info text-dark"
                              : order.orderStatus === "Delivered"
                              ? "bg-success"
                              : "bg-secondary"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            order.paymentInfo === "Paid"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          {order.paymentInfo}
                        </span>
                      </td>
                      <td className="text-end">
                        {order.orderStatus === "Processing" && (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleCancelOrder(order._id)}
                          >
                            Cancel
                          </button>
                        )}
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
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
              </svg>
              <h5 className="text-muted mt-3">No orders found</h5>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerOrders;