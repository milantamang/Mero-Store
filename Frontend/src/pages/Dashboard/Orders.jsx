import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(
          "http://localhost:5000/api/v1/orders/admin",
          config
        );
        setOrders(response.data.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Delete an order
  const handleDelete = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        await axios.delete(
          `http://localhost:5000/api/v1/orders/admin/${orderId}`,
          config
        );
        setOrders(orders.filter((order) => order._id !== orderId));
        toast.success("Order deleted successfully!");
      } catch (error) {
        console.error("Error deleting order:", error);
        toast.error("Failed to delete order.");
      }
    }
  };

  // Update order status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
    
      const response = await axios.put(
        `http://localhost:5000/api/v1/orders/admin/${orderId}`,
        { orderStatus: newStatus },
        config
      );
      console.log(response.data);
      if (response.data.success) {
        toast.success("Order status updated successfully!");
      setOrders(
        orders.map((order) =>
          order._id === orderId
            ? { ...order, orderStatus:newStatus }
            : order
        )
      );
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status.");
    }
  };

  return (
    <div className="container-fluid px-4 py-4">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white border-0 pt-3">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0 fw-bold text-danger">Order Management</h4>
          </div>
          <p className="text-muted mb-0 mt-1">
            {orders.length} {orders.length === 1 ? "order" : "orders"} placed
          </p>
        </div>

        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Loading orders...</p>
            </div>
          ) : orders.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Shipping Info</th>
                    <th scope="col">Order Items</th>
                    <th scope="col" className="text-end">Items Price</th>
                    <th scope="col" className="text-end">Shipping/Tax</th>
                    <th scope="col" className="text-end">Total</th>
                    <th scope="col">Status</th>
                    <th scope="col">Payment</th>
                    <th scope="col" className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-top">
                      <td>
                        {order.shippingInfo ? (
                          <div className="d-flex flex-column">
                            <div className="fw-semibold">{order.shippingInfo.city}</div>
                            <div className="text-muted small">{order.shippingInfo.country}</div>
                            <div className="text-muted small mt-1">
                              {order.shippingInfo.address}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted">No shipping info</span>
                        )}
                      </td>

                      <td>
                        <div className="d-flex flex-column gap-2">
                          {order.orderItems.map((item) => (
                            <div key={item._id} className="border-bottom pb-2">
                              <div className="fw-semibold">{item.name}</div>
                              <div className="d-flex gap-3 small text-muted">
                                <span>Size: {item.size}</span>
                                <span>Qty: {item.quantity}</span>
                              </div>
                              <div className="text-success small">
                                Rs. {item.price} each
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="text-end">
                        <span className="fw-semibold">Rs. {order.itemsPrice}</span>
                      </td>

                      <td className="text-end">
                        <div className="d-flex flex-column">
                          <span>Shipping: Rs. {order.shippingPrice}</span>
                          <span>Tax: Rs. 0</span>
                        </div>
                      </td>

                      <td className="text-end">
                        <span className="fw-bold text-primary">Rs. {order.totalPrice}</span>
                      </td>

                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        >
                          <option value="Processing">Processing</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
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

                                          <td className="text-end pe-4">
                                            <div className="d-flex justify-content-end gap-2">
                                             
                                              <button
                                                className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                                                onClick={() => handleDelete(order._id)}
                                              >
                                                <MdDelete size={16} />
                                                <span>Delete</span>
                                              </button>
                                            </div>
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

export default Order;