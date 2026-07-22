import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Driver from "../models/Driver.js";
import Customer from "../models/customer.js";

import sequelize from "../database/db.js";
// REGISTER
export const register = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { full_name, email, phone, password, address } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({
        message: "Full name, email, and password are required",
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }
    // 3. Hash password
    const password_hash = await bcrypt.hash(password, 10);
    // 4. Create User
    const user = await User.create(
      {
        full_name,
        email,
        phone,
        password_hash,
        role: "customer",
      },
      { transaction }
    );


    await Customer.create(
      {
        user_id: user.user_id,
        address,
      },
      { transaction }
    );
    await transaction.commit();


    return res.status(201).json({
      message: "User registered successfully",
      user_id: user.user_id,
    });

  } catch (error) {
    await transaction.rollback();

    return res.status(500).json({
      message: error.message,
      errors: error.errors,
    });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password ,rememberme} = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // 2. Find user
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 3. Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    let driver = null;

    if (user.role === "driver") {
      driver = await Driver.findOne({
        where: { user_id: user.user_id },
      });
    }

    // Generate token
    // 4. Generate access token
    const accessToken = jwt.sign(
      {
        id: user.user_id,
        email: user.email,
        role: user.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: rememberme? "30d": "15m",
      }
    );
    // 5. Generate refresh token
    const refreshToken = jwt.sign(
      {
        id: user.user_id
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );
    // 6. Save refresh token in database
    user.refresh_token = refreshToken;
    await user.save();
    // 7. Return tokens and user info
    return res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        driver_id: driver?.driver_id ?? null,
      },
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    // 1. Get refresh token from request body
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is required" });
    }
    // 2. Verify refresh token and get user
    const user = await User.findOne({ where: { refresh_token : refreshToken } });
    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }
    // 3. Verify the refresh token using jwt.verify
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (decoded.id !== user.user_id) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }
    // 4. Generate new access token
    const newAccessToken = jwt.sign(
      {
        id: user.user_id,
        email: user.email,
        role: user.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );
    // 5. Return new access token
    return res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
