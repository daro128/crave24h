// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";
// import sequelize from "../database/db.js";
// import "../database/associations.js";
// import User from "../models/user.js";
// import Restaurant from "../models/Restaurant.js";
// import Category from "../models/Category.js";
// import Product from "../models/Product.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const uploadsDir = path.join(__dirname, "../uploads");
// const assetsDir = path.join(__dirname, "../../frontend/src/assets");

// if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// // Copy an asset image to uploads and return the saved filename
// function copyAsset(assetName, saveName) {
//   const src = path.join(assetsDir, assetName);
//   const dest = path.join(uploadsDir, saveName);
//   if (fs.existsSync(src) && !fs.existsSync(dest)) {
//     fs.copyFileSync(src, dest);
//   }
//   return saveName;
// }

// async function seed() {
//   try {
//     await sequelize.authenticate();
//     console.log("Database connected");

//     // ── 1. Categories ─────────────────────────────────────────────────
//     const categoryData = [
//       { category_name: "Pizza" },
//       { category_name: "Burger" },
//       { category_name: "Sushi" },
//       { category_name: "Noodles" },
//       { category_name: "Dessert" },
//     ];

//     const categories = [];
//     for (const c of categoryData) {
//       const [cat] = await Category.findOrCreate({
//         where: { category_name: c.category_name },
//       });
//       categories.push(cat);
//     }
//     console.log("Categories seeded:", categories.map((c) => c.category_name));

//     // ── 2. Find restaurant owner user ──────────────────────────────────
//     const owner = await User.findOne({ where: { role: "restaurant_owner" } });
//     if (!owner) {
//       console.error(
//         'No restaurant_owner user found. Run userSeeder.js first:\n  node seeders/userSeeder.js'
//       );
//       process.exit(1);
//     }

//     // ── 3. Restaurants ─────────────────────────────────────────────────
//     const logoFile1 = copyAsset("image copy 3.png", "restaurant_logo_1.png");
//     const logoFile2 = copyAsset("image copy 4.png", "restaurant_logo_2.png");
//     const bannerFile1 = copyAsset("image copy 5.png", "restaurant_banner_1.png");
//     const bannerFile2 = copyAsset("image copy 6.png", "restaurant_banner_2.png");

//     const [rest1] = await Restaurant.findOrCreate({
//       where: { restaurant_name: "The Pizza Palace" },
//       defaults: {
//         user_id: owner.user_id,
//         description: "Authentic Italian pizzas baked in a wood-fired oven.",
//         address: "123 Riverside Blvd, Phnom Penh",
//         phone: "023 456 789",
//         latitude: 11.5564,
//         longitude: 104.9282,
//         logo: logoFile1,
//         image: bannerFile1,
//         status: "open",
//         average_rating: 4.8,
//         fee: 1,
//         category_id: categories[0].category_id,
//       },
//     });

//     const [rest2] = await Restaurant.findOrCreate({
//       where: { restaurant_name: "Burger Barn" },
//       defaults: {
//         user_id: owner.user_id,
//         description: "Juicy handcrafted burgers and crispy fries.",
//         address: "45 Monivong Ave, Phnom Penh",
//         phone: "012 987 654",
//         latitude: 11.5625,
//         longitude: 104.9210,
//         logo: logoFile2,
//         image: bannerFile2,
//         status: "open",
//         average_rating: 4.5,
//         fee: 1,
//         category_id: categories[1].category_id,
//       },
//     });

//     console.log("Restaurants seeded:", rest1.restaurant_name, rest2.restaurant_name);

//     // ── 4. Products ────────────────────────────────────────────────────
//     const productImages = [
//       copyAsset("image copy 7.png",  "product_1.png"),
//       copyAsset("image copy 8.png",  "product_2.png"),
//       copyAsset("image copy 9.png",  "product_3.png"),
//       copyAsset("image copy 10.png", "product_4.png"),
//       copyAsset("image copy 11.png", "product_5.png"),
//       copyAsset("image copy 12.png", "product_6.png"),
//       copyAsset("image copy 13.png", "product_7.png"),
//       copyAsset("image copy 14.png", "product_8.png"),
//     ];

//     const productData = [
//       // Pizza Palace products
//       {
//         restaurant_id: rest1.restaurant_id,
//         category_id: categories[0].category_id,
//         product_name: "Margherita Pizza",
//         description: "Classic tomato sauce, fresh mozzarella and basil.",
//         price: 9.99,
//         image: productImages[0],
//         stock: 50,
//         status: "available",
//       },
//       {
//         restaurant_id: rest1.restaurant_id,
//         category_id: categories[0].category_id,
//         product_name: "Pepperoni Pizza",
//         description: "Loaded with spicy pepperoni and melted cheese.",
//         price: 11.99,
//         image: productImages[1],
//         stock: 40,
//         status: "available",
//       },
//       {
//         restaurant_id: rest1.restaurant_id,
//         category_id: categories[4].category_id,
//         product_name: "Tiramisu",
//         description: "Italian coffee dessert with mascarpone cream.",
//         price: 5.50,
//         image: productImages[2],
//         stock: 20,
//         status: "available",
//       },
//       {
//         restaurant_id: rest1.restaurant_id,
//         category_id: categories[3].category_id,
//         product_name: "Spaghetti Bolognese",
//         description: "Rich meat sauce with al-dente spaghetti.",
//         price: 10.50,
//         image: productImages[3],
//         stock: 30,
//         status: "available",
//       },
//       // Burger Barn products
//       {
//         restaurant_id: rest2.restaurant_id,
//         category_id: categories[1].category_id,
//         product_name: "Classic Cheeseburger",
//         description: "Double patty with cheddar, lettuce, tomato and pickles.",
//         price: 8.99,
//         image: productImages[4],
//         stock: 60,
//         status: "available",
//       },
//       {
//         restaurant_id: rest2.restaurant_id,
//         category_id: categories[1].category_id,
//         product_name: "BBQ Bacon Burger",
//         description: "Smoky BBQ sauce, crispy bacon and caramelised onions.",
//         price: 10.99,
//         image: productImages[5],
//         stock: 45,
//         status: "available",
//       },
//       {
//         restaurant_id: rest2.restaurant_id,
//         category_id: categories[2].category_id,
//         product_name: "Salmon Sushi Roll",
//         description: "Fresh salmon, avocado and cucumber in seasoned rice.",
//         price: 12.00,
//         image: productImages[6],
//         stock: 25,
//         status: "available",
//       },
//       {
//         restaurant_id: rest2.restaurant_id,
//         category_id: categories[4].category_id,
//         product_name: "Chocolate Milkshake",
//         description: "Thick creamy shake made with real chocolate ice cream.",
//         price: 4.50,
//         image: productImages[7],
//         stock: 35,
//         status: "available",
//       },
//     ];

//     let created = 0;
//     for (const p of productData) {
//       const [, wasCreated] = await Product.findOrCreate({
//         where: { product_name: p.product_name, restaurant_id: p.restaurant_id },
//         defaults: p,
//       });
//       if (wasCreated) created++;
//     }

//     console.log(`Products seeded: ${created} new, ${productData.length - created} already existed`);
//     console.log("\nSeeding complete!");
//     process.exit(0);
//   } catch (error) {
//     console.error("Seeding failed:", error.message);
//     process.exit(1);
//   }
// }

// seed();
