require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const api = require("./routes/api");
const User = require("./models/User");

const app = express();

app.use(cors());
app.use(express.json());

/* ---------------- MONGO CONNECTION ---------------- */

const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/campus";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

/* ---------------- ADMIN LOGIN API ---------------- */

app.post("/api/admin-login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find an admin stored in the User collection (seed creates admin as a User)
    const admin = await User.findOne({
      role: "admin",
      $or: [{ email: username }, { name: username }],
    });

    if (!admin) {
      return res.json({ success: false });
    }

    const match = await bcrypt.compare(password, admin.password);

    if (!match) {
      return res.json({ success: false });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
        name: admin.name,
      },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      role: admin.role,
      name: admin.name,
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/* ---------------- OTHER ROUTES ---------------- */

app.use("/api", api);

/* ---------------- START SERVER ---------------- */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
