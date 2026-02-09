require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./User");

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/campus");

async function createAdmin() {

  try {
    // Always ensure there is exactly one admin user with known credentials
    const hash = await bcrypt.hash("1234", 10);

    const admin = await User.findOneAndUpdate(
      { role: "admin" },
      {
        name: "Admin",
        email: "admin@gmail.com",
        password: hash,
        role: "admin",
      },
      {
        new: true,
        upsert: true,
      }
    );

    if (admin) {
      console.log("Admin ensured with email admin@gmail.com and password 1234");
    }
  } catch (err) {
    console.error("Failed to create/update admin:", err);
  } finally {
    process.exit();
  }
}

createAdmin();
