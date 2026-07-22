import Product from "../models/Product.js";
import Restaurant from "../models/Restaurant.js";
import Category from "../models/Category.js";
import { Op } from "sequelize";
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Restaurant,
          attributes: ["restaurant_id", "restaurant_name"],
        },
        {
          model: Category,
          attributes: ["category_id", "category_name"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      total_products: products.length,
      products,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { product_id } = req.params;

    const product = await Product.findByPk(product_id, {
      include: [
        {
          model: Restaurant,
          attributes: [
            "restaurant_id",
            "restaurant_name",
            "address",
            "phone"
          ],
        },
        {
          model: Category,
          attributes: [
            "category_id",
            "category_name"
          ],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      product,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { search } = req.query;

    if (!search) {
      return res.status(400).json({
        message: "Search keyword is required",
      });
    }

    const products = await Product.findAll({
      where: {
        [Op.or]: [
          {
            product_name: {
              [Op.like]: `%${search}%`,
            },
          },
          {
            description: {
              [Op.like]: `%${search}%`,
            },
          },
        ],
      },
      include: [
        {
          model: Restaurant,
          attributes: ["restaurant_id", "restaurant_name"],
        },
        {
          model: Category,
          attributes: ["category_id", "category_name"],
        },
      ],
    });

    return res.status(200).json({
      total_products: products.length,
      products,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getProductsByRestaurant = async (req, res) => {
  try {
    const { restaurant_id } = req.params;

    // Check restaurant exists
    const restaurant = await Restaurant.findByPk(restaurant_id);

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    // Get all products
    const products = await Product.findAll({
      where: {
        restaurant_id,
      },
      include: [
        {
          model: Category,
          attributes: ["category_id", "category_name"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      restaurant: {
        restaurant_id: restaurant.restaurant_id,
        restaurant_name: restaurant.restaurant_name,
      },
      total_products: products.length,
      products,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { category_id } = req.params;

    // Check category exists
    const category = await Category.findByPk(category_id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    // Get products in this category
    const products = await Product.findAll({
      where: {
        category_id,
      },
      include: [
        {
          model: Restaurant,
          attributes: [
            "restaurant_id",
            "restaurant_name",
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      category: {
        category_id: category.category_id,
        category_name: category.category_name,
      },
      total_products: products.length,
      products,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

export const filterProducts = async (req, res) => {
  try {
    const { categories, maxPrice, sort, search } = req.query;

    const where = {};

    // text search (same as searchProducts)
    if (search) {
      where[Op.or] = [
        { product_name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    // price ceiling
    if (maxPrice && Number(maxPrice) > 0) {
      where.price = { [Op.lte]: Number(maxPrice) };
    }

    // category filter by NAME (comma separated)
    const categoryInclude = {
      model: Category,
      attributes: ["category_id", "category_name"],
    };
    if (categories) {
      categoryInclude.where = {
        category_name: { [Op.in]: categories.split(",") },
      };
    }

    // sort
    let order = [["created_at", "DESC"]];
    if (sort === "lowest_price") order = [["price", "ASC"]];
    if (sort === "popular") order = [["created_at", "DESC"]]; // no popularity field; fallback

    const products = await Product.findAll({
      where,
      include: [
        { model: Restaurant, attributes: ["restaurant_id", "restaurant_name"] },
        categoryInclude,
      ],
      order,
    });

    return res.status(200).json({
      total_products: products.length,
      products,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};