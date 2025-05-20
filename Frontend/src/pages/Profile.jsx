import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { changePassword, updateProfile } from "../redux/user/userSlice"; // Existing action
import { toast } from "react-toastify";

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: user?.address || "",
    phoneNumber: user?.phoneNumber || "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };

  const handleSave = async () => {
    try {
      await dispatch(updateProfile(profileData)).unwrap();
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error(error || "Failed to update profile");
    }
  };

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwords;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    try {
      await dispatch(changePassword({ currentPassword, newPassword })).unwrap();
      toast.success("Password changed successfully!");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setIsChangingPassword(false);
    } catch (error) {
      toast.error(error || "Failed to change password");
    }
  };

  return (
    <div className="h-auto bg-gray-100 p-4 flex justify-center">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row">
        {/* Left Side - User Info */}
        <div className="w-full md:w-1/3 bg-gray-50 p-6 rounded-lg shadow-md flex flex-col items-center">
          <FaUserCircle className="text-red-500 w-24 h-24" />
          <h2 className="mt-4 text-2xl font-bold text-gray-800">
            {profileData.name || "Guest User"}
          </h2>
          <p className="text-gray-500">{profileData.email || "No email available"}</p>
        </div>

        {/* Right Side - Edit Profile & Password */}
        <div className="w-full md:w-2/3 md:pl-6 mt-6 md:mt-0">
          <h3 className="text-xl font-semibold text-red-600 border-b pb-2 shadow-xl">Edit Profile</h3>

          {/* Profile Fields */}
          <div className="mt-4 space-y-4">
            {["name", "email", "address", "phoneNumber"].map((field) => (
              <div key={field}>
                <label className="block text-gray-700 font-semibold mb-2 capitalize">
                  {field.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={profileData[field]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  disabled={!isEditing}
                />
              </div>
            ))}

            {/* Buttons for profile update */}
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

            {/* Change Password Section */}
            {!isChangingPassword && (
                <div className="mt-4">
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
                  >
                    Change Password
                  </button>
                </div>
              )}
            <div className="mt-8">
              {isChangingPassword && (
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwords.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full border border-gray-300 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwords.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full border border-gray-300 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwords.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full border border-gray-300 rounded-lg p-2"
                    />
                  </div>

                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setIsChangingPassword(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleChangePassword}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              )}

              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
