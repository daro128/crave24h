
import bcrypt from "bcrypt";
import sequelize from "../database/db.js";
import User from "../models/user.js";
async function seedUsers() {
  try {
    await sequelize.sync();

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

    const hashedUsers = await Promise.all(
      users.map(async (u) => ({
        full_name: u.full_name,
        email: u.email,
        phone: u.phone,
        password_hash: await bcrypt.hash(
          u.password,
          10
        ),
        role: u.role,
        address: u.address,
      }))
    );

    await User.bulkCreate(hashedUsers);

    console.log(" Users seeded");
    process.exit();
  } catch (error) {
    console.error(error);
  }
}

console.log(process.env.DB_USER);
console.log(process.env.DB_NAME);

seedUsers();