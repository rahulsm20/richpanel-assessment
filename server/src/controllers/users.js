const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db/connect.js");
const User = require("../models/user.model.js");

require("dotenv").config();

const secret = process.env.SECRET || "";

const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    // await db.connect();
    // const result = await db.query("SELECT * FROM users WHERE email = $1", [
    //   email,
    // ]);
    const user = await User.findOne({ email });
    // const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ email: user.email, id: user.id }, secret, {
      expiresIn: "1h",
    });

    res.status(200).json({ email: user.email, token });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!password) {
    return res.status(400).json("No password");
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });

    res.status(200).json({ message: "New user added" });
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json(error);
  }
};

const verifyToken = (req, res, next) => {
  try {
    const { verify } = req.query;
    const token =
      req.headers.authorization?.split(" ")[1] ||
      req.query?.token ||
      req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }
      req.decodedToken = decoded;
      if (verify) {
        return res.status(200).json(decoded);
      }
      next();
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
};

const authenticateFBUser = async (req, res) => {
  const { id, displayName } = req.body;
  try {
    const user = await User.findOne({ id, name: displayName });
    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
};

module.exports = { signin, signup, authenticateFBUser, verifyToken };
