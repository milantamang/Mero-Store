import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { RESET_AUTH, register } from "./../redux/user/userSlice";
import Loader from "../components/Loader";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, isLoading, isSuccess } = useSelector(
    (state) => state.user
  );
  const initialState = {
    username: "",
    email: "",
    password: "",
  };

  const [formData, setFormData] = useState(initialState);
  const { username, email, password } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password || !email) {
      toast.error("all fields are required");
      return
    }
    const userData = { username, email, password };
    await dispatch(register(userData));
    setFormData(initialState);

  };
  useEffect(() => {
    if (isSuccess && isLoggedIn) {
      navigate("/login");
    }
    dispatch(RESET_AUTH());
  }, [isSuccess, isLoggedIn, dispatch, navigate]);

  const location = useLocation();



  return (
    <>
      {isLoading && <Loader/>}

      <section className="h-[500px] overflow-y-hidden overflow-hidden  flex flex-col md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-16 items-center my-2 mx-5 md:mx-0 md:my-0">
        <div className="md:w-1/3 max-w-sm">
          <img
            src="https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-83.jpg?t=st=1710261721~exp=1710265321~hmac=77c52df5331991e2b80c53eae595cc56fd5aa936eecd6f800a11824525654f53&w=740"
            alt="Sample image"
          />
        </div>
        <div className="md:w-1/3 max-w-sm">
         
          <div className="my-5 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
            <p className="mx-4 mb-0 text-center font-semibold text-blue-500">
             Register Account
            </p>
          </div>
          <form onSubmit={handleSubmit} method="POST">
            <input
              className="text-sm w-full px-4 py-3 border border-solid border-gray-300 rounded"
              type="text"
              name="username"
              value={username}
              onChange={handleChange}
              placeholder="Enter your name"
            />
            <input
              className="text-sm w-full px-4 py-3 border border-solid border-gray-300 rounded mt-6"
              type="text"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Email Address"
            />
            <input
              className="text-sm w-full px-4 py-3 border border-solid border-gray-300 rounded mt-6"
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Password"
            />
            <div className="mt-4 flex justify-between font-semibold text-sm">
              <label className="flex text-slate-500 hover:text-slate-600 cursor-pointer">
                <input className="mr-1" type="checkbox" />
                <span>Remember Me</span>
              </label>
             
            </div>
            <div className="text-center md:text-left">
              <button
                className="mt-4 bg-primary hover:bg-blue-700 w-full py-3 text-white uppercase rounded text-xs tracking-wider"
                type="submit"
              >
                Register
              </button>
            </div>
          </form>
          <div className="mt-4 font-semibold text-sm text-slate-500 text-center md:text-left">
            Already have an account?{" "}
            <Link
              className="text-red-600 hover:underline hover:underline-offset-4"
              to="/login"
            >
              Login Here
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Register;
