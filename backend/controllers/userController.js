const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      phone,
      password: hashedPassword
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Signup failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    const user =
      await User.findOne({ where: { email: emailOrPhone } }) ||
      await User.findOne({ where: { phone: emailOrPhone } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user.id },
      "secretkey",
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      name: user.name,
      email: user.email
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};

exports.findUserByEmail = async (req, res) => {

  try {

    const email = req.query.email;

    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      user: user
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server error"
    });
  }

};
