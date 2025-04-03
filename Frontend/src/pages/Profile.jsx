const cartHistory = [
  { id: "PRD567", name: "Men Cloths Pant", price: "Rs.600" },
  { id: "PRD568", name: "Trousers", price: "Rs.840" },
  { id: "PRD569", name: "Denim Jeans", price: "Rs.950" },
  { id: "PRD570", name: "Casual Shorts", price: "Rs.700" },
  { id: "PRD571", name: "Formal Pants", price: "Rs.1200" },
];

import React, { useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { getProfile } from "../redux/user/userSlice";
import { toast } from "react-toastify";

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  console.log("Profile", user);

  useEffect(() => {
    dispatch(getProfile())
      .unwrap()
      .catch((error) => {
        toast.error(error || "Failed to load profile");
      });
  }, [dispatch]);

  return (
    <div className="h-[600px] bg-gray-100 p-4 flex justify-center">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row">
        {/* Left Side - User Profile */}
        <div className="w-full md:w-1/3 bg-gray-50 p-6 rounded-lg shadow-md flex flex-col items-center">
          <FaUserCircle className="text-red-500 w-24 h-24" />
          <h2 className="mt-4 text-2xl text-start font-bold text-gray-800">
            {user?.username || "Guest User"}
          </h2>
          <p className="text-gray-500">{user?.email || "No email available"}</p>
        </div>

        <div className="w-full md:w-2/3 md:pl-6 mt-6 md:mt-0">
          {/* Cart History Section */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-red-600 border-b pb-2 shadow-xl">
              Cart History
            </h3>
            <div className="mt-4 space-y-3">
              {cartHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between p-3 bg-gray-50 rounded-lg shadow-sm"
                >
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-gray-600">{item.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
