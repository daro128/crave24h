import FavouriteRestaurant from "../models/FavouriteRestaurant.js";
import FavouriteProduct from "../models/FavouriteProduct.js";
import Customer from "../models/customer.js";
import Restaurant from "../models/Restaurant.js";
import Product from "../models/Product.js";

//Favourite Restaurants

// Add favourite restaurant
export const addFavouriteRestaurant = async (req, res) => {
  try {
    const { restaurant_id } = req.body;

    const customer = await Customer.findOne({
      where: {
        user_id: req.user.id,
      },
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    const existing = await FavouriteRestaurant.findOne({
      where: {
        customer_id: customer.customer_id,
        restaurant_id,
      },
    });

    if (existing) {
      return res.status(400).json({
        message: "Restaurant already in favourites",
      });
    }

    await FavouriteRestaurant.create({
      customer_id: customer.customer_id,
      restaurant_id,
    });

    res.status(201).json({
      message: "Restaurant added to favourites",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// Remove favourite restaurant
export const removeFavouriteRestaurant = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      where: {
        user_id: req.user.id,
      },
    });

    await FavouriteRestaurant.destroy({
      where: {
        customer_id: customer.customer_id,
        restaurant_id: req.params.restaurant_id,
      },
    });

    res.json({
      message: "Restaurant removed from favourites",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get favourite restaurants
export const getFavouriteRestaurants = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      where: {
        user_id: req.user.id,
      },
    });

    const favourites = await FavouriteRestaurant.findAll({
      where: {
        customer_id: customer.customer_id,
      },
      include: [
        {
          model: Restaurant,
        },
      ],
    });

    res.json(favourites);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//Favourite Products

// Add favourite product
export const addFavouriteProduct = async (req, res) => {
  try {
    const { product_id } = req.body;

    const customer = await Customer.findOne({
      where: {
        user_id: req.user.id,
      },
    });

    const existing = await FavouriteProduct.findOne({
      where: {
        customer_id: customer.customer_id,
        product_id,
      },
    });

    if (existing) {
      return res.status(400).json({
        message: "Product already in favourites",
      });
    }

    await FavouriteProduct.create({
      customer_id: customer.customer_id,
      product_id,
    });

    res.status(201).json({
      message: "Product added to favourites",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Remove favourite product
export const removeFavouriteProduct = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      where: {
        user_id: req.user.id,
      },
    });

    await FavouriteProduct.destroy({
      where: {
        customer_id: customer.customer_id,
        product_id: req.params.product_id,
      },
    });

    res.json({
      message: "Product removed from favourites",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get favourite products
export const getFavouriteProducts = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      where: {
        user_id: req.user.id,
      },
    });

    const favourites = await FavouriteProduct.findAll({
      where: {
        customer_id: customer.customer_id,
      },
      include: [
        {
          model: Product,
        },
      ],
    });

    res.json(favourites);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};