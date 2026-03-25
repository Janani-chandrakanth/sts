const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



exports.register = async (req, res) => {
  console.log("REGISTRATION REQUEST BODY:", req.body);
  const { name, email, password, age, priorityCategory, pincode } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      age,
      priorityCategory,
      pincode
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already registered" });
    }
    res.status(400).json({ message: error.message || "Registration failed" });
  }
};

exports.login = async (req, res) => {
  console.log("LOGIN REQUEST BODY:", req.body);
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({
    id:user._id,
    role:"citizen"
  }, process.env.JWT_SECRET, { expiresIn: "1d" })
;

  console.log("LOGIN SUCCESS RESPONSE:", { name: user.name, email: user.email, role: user.role });
  res.json({ token, role: user.role, name: user.name, email: user.email });
};
