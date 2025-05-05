const bcrypt = require("bcrypt");
const User = require("../Models/UserSchema");

const createDefaultAdmin = async () => {
  try {
    const adminEmail = "admin@example.com"; // Default admin email
    const adminPassword = "admin123"; // Default admin password

    // Check if an admin user already exists
    const existingAdmin = await User.findOne({ email: adminEmail, role: "admin" });
    if (existingAdmin) {
      console.log("Default admin user already exists.");
      return;
    }

    // Hash the admin password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // Create the admin user
    const adminUser = new User({
      username: "Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      emailVerified: true, // Mark email as verified for the admin
    });

    await adminUser.save();
    console.log("Default admin user created successfully.");
  } catch (error) {
    console.error("Error creating default admin user:", error.message);
  }
};

module.exports = createDefaultAdmin;