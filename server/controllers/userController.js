import asynchandler from "express-async-handler";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerUser = asynchandler(async (req, res) => {
  const { name, email, userName, role, password, passwordConfirm } = req.body;

  if (!name || !email || !userName || !role || !password || !passwordConfirm) {
    return res.status(400).json({
      status: {
        code: "400",
        message: "Illegal JSON parameter",
      },
      data: null,
    });
  }

  if (password !== passwordConfirm) {
    return res.status(400).json({
      status: {
        code: "400",
        message: "Passwords do not match",
      },
      data: null,
    });
  }

  const exists = await User.findOne({ email: email });

  if (exists) {
    return res.status(400).json({
      status: {
        code: "400",
        message: "User already exits",
      },
      data: null,
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const createduser = {
    name,
    email,
    userName,
    role,
    password: hashedPassword,
    passwordConfirm: hashedPassword,
  };

  const user = await User.create(createduser);

  return res.status(201).json({
    status: {
      code: "201",
      message: "User registered successfully",
    },
    data: {
      user: {
        name: user.name,
        email: user.email,
        userName: user.userName,
        role: user.role,
        createdAt: user.createdAt,
        borrowedBooks: user.borrowedBooks,
        id: user.id,
      },
      token: generateToken(user.id),
    },
  });
});

const loginUser = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: {
        code: "400",
        message: "Please enter all the required fields",
      },
      data: null,
    });
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(400).json({
      status: {
        code: "400",
        message: "Invalid credentials",
      },
      data: null,
    });
  }

  const finaleduser = await User.findOne({ email: email }).select("-password");

  if (email && (await bcrypt.compare(password, user.password))) {
    return res.status(200).json({
      status: {
        code: "200",
        message: "Login successful",
      },
      data: {
        user: finaleduser,
        token: generateToken(user._id),
      },
    });
  } else {
    return res.status(400).json({
      status: {
        code: "400",
        message: "Invalid credentials",
      },
      data: null,
    });
  }
});

const getMe = asynchandler(async (req, res) => {
  const { id } = req.user;

  const user = await User.findById({ _id: id }).select("-password");

  return res.status(200).json({
    status: {
      code: "200",
      message: "User retreived successfully",
    },
    data: {
      id: user.id,
      email: user.email,
      username: user.userName,
      role: user.role,
    },
  });
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export { registerUser, loginUser, getMe };
