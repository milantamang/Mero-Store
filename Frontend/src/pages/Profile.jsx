import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../redux/user/userSlice"; // Action to update profile
import { toast } from "react-toastify";

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  // State to manage editable profile data
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [isEditing, setIsEditing] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  // Handle save profile
  const handleSave = async () => {
    try {
      console.log("Saving profile data:", profileData);
      await dispatch(updateProfile(profileData)).unwrap(); 
      toast.success("Profile updated successfully!");
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      toast.error(error || "Failed to update profile");
    }
  };

  return (
    <div className="h-[600px] bg-gray-100 p-4 flex justify-center">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row">
        {/* Left Side - User Profile */}
        <div className="w-full md:w-1/3 bg-gray-50 p-6 rounded-lg shadow-md flex flex-col items-center">
          <FaUserCircle className="text-red-500 w-24 h-24" />
          <h2 className="mt-4 text-2xl text-start font-bold text-gray-800">
            {profileData.name || "Guest User"}
          </h2>
          <p className="text-gray-500">{profileData.email || "No email available"}</p>
        </div>

        {/* Right Side - Edit Profile */}
        <div className="w-full md:w-2/3 md:pl-6 mt-6 md:mt-0">
          <h3 className="text-xl font-semibold text-red-600 border-b pb-2 shadow-xl">
            Edit Profile
          </h3>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2"
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2"
                disabled={!isEditing}
              />
            </div>
            <div className="flex justify-end gap-4">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg"
                  >
                    Save
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;