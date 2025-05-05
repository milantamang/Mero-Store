
import React, { useEffect, useState } from "react";
import { MdEdit, MdDelete, MdAddCircleOutline } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Product = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/products"
        );
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(
        `http://localhost:5000/api/v1/deleteproducts/${id}`,
        config
      );
      setProducts(products.filter((user) => user._id !== id));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEdit = async (id) => {
    navigate(`/dashboard/editproduct/${id}`);
  };

  const addProducts = () => {
    navigate("/dashboard/addproducts");
  };

  return (
    <div className="container-fluid px-4 py-4">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white border-0 pt-3">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0 fw-bold text-danger">Product Inventory</h4>
            <button
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={addProducts}
            >
              <MdAddCircleOutline size={20} />
              <span>Add Product</span>
            </button>
          </div>
          <p className="text-muted mb-0 mt-1">Total available products: {products.length}</p>
        </div>
        
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="ps-4">Image</th>
                  <th scope="col">Title</th>
                  <th scope="col">Price</th>
                  <th scope="col">Colors</th>
                  <th scope="col">Category</th>
                  <th scope="col">Size</th>
                  <th scope="col" className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products && products.map((product) => (
                  <tr key={product._id} className="border-top">
                    <td className="ps-4">
                      <div className="d-flex align-items-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="rounded border"
                          style={{ width: "60px", height: "60px", objectFit: "cover" }}
                        />
                      </div>
                    </td>
                    <td>
                      <span className="fw-semibold">{product.name}</span>
                    </td>
                    <td>
                      <span className="badge bg-success bg-opacity-10 text-success">
                        Rs. {product.price}
                      </span>
                    </td>
                    <td>
                      <span className="text-muted">{product.colors}</span>
                    </td>
                    <td>
                      <span className="badge bg-info bg-opacity-10 text-info">
                        {product.category}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-1" style={{ maxWidth: "150px" }}>
                        {product.size.map((s, i) => (
                          <span key={i} className="badge bg-light text-dark border">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="text-end pe-4">
                      <div className="d-flex justify-content-end gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                          onClick={() => handleEdit(product._id)}
                        >
                          <MdEdit size={16} />
                          <span>Edit</span>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                          onClick={() => handleDelete(product._id)}
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
          
          {products.length === 0 && (
            <div className="text-center py-5">
              <h5 className="text-muted">No products available</h5>
              <button 
                className="btn btn-primary mt-3"
                onClick={addProducts}
              >
                Add Your First Product
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;