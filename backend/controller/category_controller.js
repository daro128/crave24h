import Category from "../models/Category.js";
import Product from "../models/Product.js";
// import sequelize from "../database/db.js";

// export const getAllCategories = async (req, res) => {
//   try {
//     const categories = await Category.findAll({
//       attributes: [
//         "category_id",
//         "category_name",
//         "image",
//         [
//           sequelize.fn(
//             "COUNT",
//             sequelize.col("Products.product_id")
//           ),
//           "total_products",
//         ],
//       ],
//       include: [
//         {
//           model: Product,
//           attributes: [],
//         },
//       ],
//       group: ["Category.category_id"],
//     });

//     res.json({
//       success: true,
//       categories,
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: err.message,
//     });
//   }
// };

// in a categoryController
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: ["category_id", "category_name"],
      order: [["category_name", "ASC"]],
    });
    return res.status(200).json({ categories });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// router.get("/categories", getAllCategories);