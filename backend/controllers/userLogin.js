const User = require("../models/user");
const bcrypt = require("bcrypt");

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email: email });
    if (!user) {
      user = await User.findOne({ username: email });
      if (!user) {
        return res.status(400).json({ error: "User does not exist" });
      }
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }
    
    const token = await user.generateAuthToken();
    // console.log("user", token);

    if (email === "anujverma11062002@gmail.com" || email === "anujverma") {
      res.status(200).json({ status: "ok", data: token, admin: true });
    } else {
      res.status(200).json({ status: "ok", data: token, admin: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", error: "Error logging in" });
  }
};

module.exports = {
  Login,
};
