import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {User,Restaurant,Driver, Category,Order,Customer} from "../models/associations.js"

export const getAllUsers = async (req,res)=>{
    try {
        const users = await User.findAll({
            attributes:{
                exclude:["password_hash"],
            },
        });

        res.status(200).json({
            success:true,
            count:users.length,
            data:users,
        })

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}

export const getAllRestaurants = async (req,res)=>{
    try {
        const restaurants = await Restaurant.findAll({
            include: [
                {
                    model: User,
                    attributes: { exclude: ["password_hash"] },
                },
                {
                    model: Category,
                },
            ],
        });

         res.status(200).json({
            success:true,
            count:restaurants.length,
            data:restaurants,
        })
        
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}

export const getAllDeliveries = async (req,res)=>{
    try {
        const deliveries = await Driver.findAll({
             include: [
                {
                    model: User,
                    attributes: { exclude: ["password_hash"] },
                },
            ],
        });

         res.status(200).json({
            success:true,
            count:deliveries.length,
            data:deliveries,
        })
        
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}

export const getMe = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};


export const getDashboardStats = async (req, res) => {
  try {
    const totalDrivers = await Driver.count();
    const totalRestaurants = await Restaurant.count();
    const totalUsers = await User.count();
    const totalOrders = await Order.count();
    const orders = await Order.findAll({
        include: [
                {
                    model: Customer,
                    attributes: { exclude: ["password_hash"] },
                },
                {
                    model: Restaurant,
                },
            ],
    });

     res.status(200).json({
        success:true,
        data:{totalDrivers,
                totalRestaurants,
                totalUsers,
                totalOrders,
                orders,
        },
    })

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.update(req.body);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = user.status === "active" ? "suspended" : "active";
    await user.save();

    res.status(200).json({
      success: true,
      message: "User status updated",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const {
      full_name,
      email,
      password,
      role,
      phone
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      full_name,
      email,
      password_hash: hashedPassword,
      phone,
      role,
      status: "active",
    });

    if (user.role === "driver") {
      await Driver.create({
        user_id: user.user_id,
        current_status: "offline",
      });
    } else if (user.role === "customer") {
      await Customer.create({
        user_id: user.user_id,
      });
    }

    res.status(201).json({
      success: true,
      data: user,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const createRestaurant = async (req, res) => {
  try {
    const {
      restaurant_name,
      user_id,
      category_id,
      description,
      address,
      phone
    } = req.body;

    const logo = req.files?.logo?.[0]?.filename;
    const image = req.files?.image?.[0]?.filename;

    const restaurant = await Restaurant.create({
      restaurant_name,
      user_id,
      category_id,
      description: description || "",
      address: address || "",
      phone: phone || "",
      status: "open",
      average_rating: 0,
      ...(logo && { logo }),
      ...(image && { image }),
    });

    res.status(201).json({
      success: true,
      data: restaurant,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findByPk(id);

    if (!restaurant) {
      return res.status(404).json({ message: "Not found" });
    }

    const logo = req.files?.logo?.[0]?.filename;
    const image = req.files?.image?.[0]?.filename;

    await restaurant.update({
      ...req.body,
      ...(logo && { logo }),
      ...(image && { image }),
    });

    res.json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findByPk(id);

    if (!restaurant) {
      return res.status(404).json({ message: "Not found" });
    }

    await restaurant.destroy();

    res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleDriverStatus = async (req, res) => {
  try {
    const driver = await Driver.findByPk(req.params.id);

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    // 3-state toggle logic
    let newStatus;

    if (driver.current_status === "offline") {
      newStatus = "available";
    } else {
      newStatus = "offline";
    }

    driver.current_status = newStatus;

    await driver.save();

    res.json({
      success: true,
      data: driver,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDriver = async (req, res) => {
  await Driver.destroy({ where: { driver_id: req.params.id } });

  res.json({ message: "Deleted" });
};

export const updateDriver = async (req, res) => {
  try {
    const driver = await Driver.findByPk(req.params.id);

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    await driver.update(req.body);

    res.json({
      success: true,
      message: "Driver updated successfully",
      data: driver,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfileHandler = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const user = await User.findByPk(decoded.id);
  if (!user) return res.status(404).json({ message: "Not found" });
  await user.update(req.body);
  res.json({ success: true, data: user });
};