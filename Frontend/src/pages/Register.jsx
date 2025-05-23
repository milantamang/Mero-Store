// Import necessary React hooks and libraries
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // React Router hooks for navigation and links
import { toast } from "react-toastify"; // Library for showing notifications
import "react-toastify/dist/ReactToastify.css"; // CSS styles for toast notifications
import { useDispatch, useSelector } from "react-redux"; // Redux hooks for state management
import { RESET_AUTH, register } from "./../redux/user/userSlice"; // Redux actions for user registration
import Loader from "../components/Loader"; // Loading component to show during API calls

const Register = () => {
  // Redux hooks for dispatching actions and navigation
  const dispatch = useDispatch(); // Hook to dispatch Redux actions
  const navigate = useNavigate(); // Hook for programmatic navigation
  
  // Get authentication state from Redux store
  const { isLoggedIn, isLoading, isSuccess } = useSelector(
    (state) => state.user
  );
  
  // Initial form data structure
  const initialState = {
    username: "",
    email: "",
    password: "",
  };

  // Local state for form data management
  const [formData, setFormData] = useState(initialState); // Store form input values
  const { username, email, password } = formData; // Destructure form data for easy access

  // Function to handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target; // Get input name and value
    // Update form data state with new input value
    setFormData((prevState) => ({
      ...prevState, // Keep existing form data
      [name]: value, // Update only the changed field
    }));
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    
    // Form validation: Check if all fields are filled
    if (!username || !password || !email) {
      toast.error("all fields are required");
      return
    }
    
    // Create user data object for registration
    const userData = { username, email, password };
    await dispatch(register(userData)); // Dispatch register action to Redux
    setFormData(initialState); // Clear form after submission
  };
  
  // Effect hook: Handle navigation after successful registration
  useEffect(() => {
    if (isSuccess && isLoggedIn) {
      navigate("/login"); // Redirect to login page after successful registration
    }
    dispatch(RESET_AUTH()); // Reset authentication state
  }, [isSuccess, isLoggedIn, dispatch, navigate]);

  const location = useLocation(); // Get current location (not used in this component)

  // JSX: Component's user interface
  return (
    <>
      {/* Conditional rendering: Show loader during registration process */}
      {isLoading && <Loader/>}

      {/* Main registration form section */}
      <section className="h-[500px] overflow-y-hidden overflow-hidden  flex flex-col md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-16 items-center my-2 mx-5 md:mx-0 md:my-0">
        {/* Left side: Registration illustration image */}
        <div className="md:w-1/3 max-w-sm">
          <img
            src="https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-83.jpg?t=st=1710261721~exp=1710265321~hmac=77c52df5331991e2b80c53eae595cc56fd5aa936eecd6f800a11824525654f53&w=740"
            alt="Sample image"
          />
        </div>
        
        {/* Right side: Registration form */}
        <div className="md:w-1/3 max-w-sm">
         
          {/* Form header with decorative lines */}
          <div className="my-5 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
            <p className="mx-4 mb-0 text-center font-semibold text-blue-500">
             Register Account
            </p>
          </div>
          
          {/* Registration form */}
          <form onSubmit={handleSubmit} method="POST">
            {/* Username input field */}
            <input
              className="text-sm w-full px-4 py-3 border border-solid border-gray-300 rounded"
              type="text"
              name="username"
              value={username}
              onChange={handleChange} // Handle input changes
              placeholder="Enter your name"
            />
            
            {/* Email input field */}
            <input
              className="text-sm w-full px-4 py-3 border border-solid border-gray-300 rounded mt-6"
              type="text"
              name="email"
              value={email}
              onChange={handleChange} // Handle input changes
              placeholder="Email Address"
            />
            
            {/* Password input field */}
            <input
              className="text-sm w-full px-4 py-3 border border-solid border-gray-300 rounded mt-6"
              type="password"
              name="password"
              value={password}
              onChange={handleChange} // Handle input changes
              placeholder="Password"
            />
            
            {/* Remember me checkbox section */}
            <div className="mt-4 flex justify-between font-semibold text-sm">
              <label className="flex text-slate-500 hover:text-slate-600 cursor-pointer">
                <input className="mr-1" type="checkbox" />
                <span>Remember Me</span>
              </label>
            </div>
            
            {/* Submit button */}
            <div className="text-center md:text-left">
              <button
                className="mt-4 bg-primary hover:bg-blue-700 w-full py-3 text-white uppercase rounded text-xs tracking-wider"
                type="submit"
              >
                Register
              </button>
            </div>
          </form>
          
          {/* Login link for existing users */}
          <div className="mt-4 font-semibold text-sm text-slate-500 text-center md:text-left">
            Already have an account?{" "}
            <Link
              className="text-red-600 hover:underline hover:underline-offset-4"
              to="/login" // Navigate to login page
            >
              Login Here
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

// Export component for use in other files
export default Register;