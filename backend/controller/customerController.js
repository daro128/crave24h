// // import { pool } from "../database/db.js";

// // const getAllUsers = (async (req, res) => {
// //   try {
// //     const [rows] = await pool.query("SELECT * FROM users");
// //     res.json(rows);
// //   } catch (error) {
// //     res.status(500).json({
// //       message: error.message,
// //     });
// //   }
// // })

// // const createUser = (async (req, res) => {
// //   const { name, email, password, role } = req.body;

// //   try {
// //     const [result] = await pool.query(
// //       "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
// //       [name, email, password, role]
// //     );
// //     res.status(201).json({
// //       message: "User created successfully",
// //       userId: result.insertId,
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       message: error.message,
// //     });
// //   }
// // });

// // export { getAllUsers, createUser };

// import User from "../models/user.js";

// export const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.findAll();

//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// export const createUser = async (req, res) => {
//   try {
//     const user = await User.create(req.body);

//     res.status(201).json({
//       message: "User created successfully",
//       user,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

import Customer from '../models/customer.js'
import User from '../models/user.js'
export const getProfile = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      where: {
        user_id: req.user.id,
      },
      include: [
        {
          model: User,
          attributes: {
          exclude: ["password_hash"],
        },
        },
      ],
    });

    res.json(customer);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const { full_name, phone, address, city } = req.body;

    // Only check duplicate phone if phone exists
    if (phone && phone.trim() !== "") {
      const existingUser = await User.findOne({
        where: {
          phone,
        },
      });

      if (existingUser && existingUser.user_id !== req.user.id) {
        return res.status(400).json({
          message: "Phone number already exists",
        });
      }
    }

    // Update User table
    await User.update(
      {
        full_name,
        phone,
      },
      {
        where: {
          user_id: req.user.id,
        },
      }
    );

    // Update Customer table
    await Customer.update(
      {
        address,
        city,
      },
      {
        where: {
          user_id: req.user.id,
        },
      }
    );

    const customer = await Customer.findOne({
      where: {
        user_id: req.user.id,
      },
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password_hash"],
          },
        },
      ],
    });

    res.json({
      message: "Profile updated successfully",
      customer,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};