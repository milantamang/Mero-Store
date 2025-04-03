import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { RESET_AUTH, adminlogin } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, isLoading, isSuccess } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      navigate("/");
    }

    if (isSuccess && isLoggedIn) {
      navigate("/");
    }

    dispatch(RESET_AUTH());
  }, [isSuccess, isLoggedIn, dispatch, navigate]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("Please fill in all fields");
    }
    const userData = { email, password };
    await dispatch(adminlogin(userData));
    console.log(formData);
  };

  useEffect(() => {
    if (isSuccess && isLoggedIn) {
      navigate("/");
    }
    dispatch(RESET_AUTH());
  }, [isSuccess, isLoggedIn, dispatch, navigate]);

  return (
    <>
      {isLoading && <p className="text-red-500">Loading..</p>}
      <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-light">
        <div className="card border-0 shadow">
          <div className="card-body p-5">
            <h2 className="text-center mb-2 font-monospace  fw-bold">
              Admin Login
            </h2>
            <form onSubmit={handleSubmit} method="POST">
              <div className="mb-3 ">
                <label htmlFor="email" className="form-label ">
                  Email:
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  className="form-control rounded-pill px-5"
                  id="email"
                  placeholder="Enter email"
                />
              </div>
              <div className="mb-4 ">
                <label htmlFor="password" className="form-label ">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control rounded-pill px-5"
                  id="password"
                  value={password}
                  name="password"
                  placeholder="Enter password"
                  onChange={handleChange}
                />
              </div>
              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-primary rounded-pill btn-block"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
