const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// Define the user schema

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar:{
    type: String,
  },
  likes: [
    {
      type: String,
    },
  ],
  shares: [
    {
      type: String,
    },
  ],
});

userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign(
    { _id: this.id, username: this.username , avatar: this.avatar},
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
  return token;
};

// Create the User model
const User = mongoose.model("User", userSchema);

module.exports = User;
