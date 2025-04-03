
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaUsers, FaBoxes, FaShoppingCart } from "react-icons/fa";

const Home = () => {
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    orders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch products count
        const productsRes = await axios.get(
          "http://localhost:5000/api/v1/products"
        );
        
        const ordersRes = await axios.get("http://localhost:5000/api/v1/orders/count", { withCredentials: true });
setStats({ 
  ...stats,
  orders: ordersRes.data.totalOrders || 0
});

        // In a real app, you would fetch users and orders counts here too
        setStats({
          products: productsRes.data.totalProduct || 0,
          // users: usersRes.data.totalUsers || 0,
          orders: ordersRes.data.totalOrders || 0,
        });
        
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container-fluid px-4 py-4">
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-white border-0 pt-3">
          <h4 className="mb-0 fw-bold text-danger">Dashboard Overview</h4>
          <p className="text-muted mb-0 mt-1">Welcome to Mero Store Admin Panel</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {/* Users Card */}
          <div className="col-md-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body p-4 d-flex flex-column">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                    <FaUsers size={24} className="text-primary" />
                  </div>
                  <div>
                    <h6 className="mb-0 text-muted">Total Users</h6>
                    <h3 className="mb-0 fw-bold">{stats.users}+</h3>
                  </div>
                </div>
                <div className="mt-auto">
                  <div className="progress" style={{ height: "6px" }}>
                    <div 
                      className="progress-bar bg-primary" 
                      role="progressbar" 
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Card */}
          <div className="col-md-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body p-4 d-flex flex-column">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3">
                    <FaBoxes size={24} className="text-success" />
                  </div>
                  <div>
                    <h6 className="mb-0 text-muted">Total Products</h6>
                    <h3 className="mb-0 fw-bold">{stats.products}</h3>
                  </div>
                </div>
                <div className="mt-auto">
                  <div className="progress" style={{ height: "6px" }}>
                    <div 
                      className="progress-bar bg-success" 
                      role="progressbar" 
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Orders Card */}
          <div className="col-md-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body p-4 d-flex flex-column">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-danger bg-opacity-10 p-3 rounded-circle me-3">
                    <FaShoppingCart size={24} className="text-danger" />
                  </div>
                  <div>
                    <h6 className="mb-0 text-muted">Total Orders</h6>
                    <h3 className="mb-0 fw-bold">{stats.orders}+</h3>
                  </div>
                </div>
                <div className="mt-auto">
                  <div className="progress" style={{ height: "6px" }}>
                    <div 
                      className="progress-bar bg-danger" 
                      role="progressbar" 
                      style={{ width: "45%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;