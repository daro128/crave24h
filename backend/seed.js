import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";
import sequelize from "./database/db.js";

// IMPORTANT: load associations first
import "./models/associations.js";

import User from "./models/user.js";
import Driver from "./models/Driver.js";
import Customer from "./models/customer.js";
import Restaurant from "./models/Restaurant.js";
import Category from "./models/Category.js";

export async function seedAll() {
  try {
    // 1. Connect DB
    await sequelize.authenticate();
    console.log("✅ Database connected");

    // 2. Reset database
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    await sequelize.sync({ force: true });
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

    console.log(" Database synced (reset complete)");
    const categories = await Category.bulkCreate([
      { category_name: "Pizza" },
      { category_name: "Burger" },
      { category_name: "Coffee" },
      { category_name: "Khmer Food" },
    ]);

    console.log(" Categories created");

    // 3. Seed users
    const users = [
      {
        full_name: "Admin User",
        email: "admin@gmail.com",
        phone: "012345678",
        password: "123456",
        role: "admin",
        address: "Phnom Penh",
      },
      {
        full_name: "Customer One",
        email: "customer1@gmail.com",
        phone: "010111222",
        password: "123456",
        role: "customer",
        address: "BKK",
      },
      {
        full_name: "Customer Two",
        email: "customer2@gmail.com",
        phone: "010333444",
        password: "123456",
        role: "customer",
        address: "Toul Kork",
      },
      {
        full_name: "Restaurant Owner",
        email: "restaurant@gmail.com",
        phone: "011223344",
        password: "123456",
        role: "restaurant_owner",
        address: "Sen Sok",
      },
      {
        full_name: "Delivery Rider",
        email: "rider@gmail.com",
        phone: "010998877",
        password: "123456",
        role: "driver",
        address: "Chbar Ampov",
      },
    ];

    // 4. Hash passwords
    const hashedUsers = await Promise.all(
      users.map(async (u) => ({
        full_name: u.full_name,
        email: u.email,
        phone: u.phone,
        password_hash: await bcrypt.hash(u.password, 10),
        role: u.role,
        address: u.address,
      }))
    );

    // 5. Create users one-by-one (safe + guarantees user_id exists)
    const createdUsers = [];

    for (const u of hashedUsers) {
      const user = await User.create(u);
      createdUsers.push(user);
    }

    console.log(` Created ${createdUsers.length} users`);

    // 6. Create related tables
    for (const user of createdUsers) {
      if (user.role === "restaurant_owner") {
        await Restaurant.create({
          user_id: user.user_id,
          restaurant_name: "Pizza House",
          address: user.address,
          phone: user.phone,
          category_id: categories[0].category_id,
        });
      }

      if (user.role === "driver") {
        await Driver.create({
          user_id: user.user_id,
          vehicle_type: "Motorbike",
          license_number: "LIC-001",
        });
      }

      if (user.role === "customer") {
        await Customer.create({
          user_id: user.user_id,
          address: user.address,
          city: "Phnom Penh",
        });
      }
    }

    console.log("🎉 Seed completed successfully");
    
  } catch (error) {
    console.error("❌ Seed error:", error);
  
  }
}

