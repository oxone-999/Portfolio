const User = require("../models/user");

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).exec();
    res.json({ users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error retrieving users" });
  }
};

module.exports = {
    getUsers,
};