import Customer from "../models/customer.js";
import Product from "../models/Product.js";
import OrderItem from "../models/OrderItem.js";
import Review from "../models/Review.js";
import Order from "../models/Order.js";
import User from "../models/user.js";
import Restaurant from "../models/Restaurant.js";

const updateRestaurantAverageRating = async (restaurant_id) => {
  const products = await Product.findAll({
    where: { restaurant_id },
    attributes: ["product_id"],
  });

  const productIds = products.map((p) => p.product_id);
  if (productIds.length === 0) return;

  const reviews = await Review.findAll({
    where: { product_id: productIds },
    attributes: ["rating"],
  });

  if (reviews.length === 0) return;

  const average =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  await Restaurant.update(
    { average_rating: average.toFixed(1) },
    { where: { restaurant_id } }
  );
};
export const createReview = async (req, res) => {
  try {
    const { product_id, rating, comment } = req.body;

    if (!product_id || !rating) {
      return res.status(400).json({
        message: "Product and rating are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    // Find customer
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

    // Check purchased product
    const purchased = await OrderItem.findOne({
      include: [
        {
          model: Order,
          where: {
            customer_id: customer.customer_id,
            order_status: "delivered",
          },
        },
      ],
      where: {
        product_id,
      },
    });

    if (!purchased) {
      return res.status(400).json({
        message: "You can only review delivered products.",
      });
    }

    // Prevent duplicate review
    const existingReview = await Review.findOne({
      where: {
        customer_id: customer.customer_id,
        product_id,
      },
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this product.",
      });
    }

    const review = await Review.create({
      customer_id: customer.customer_id,
      product_id,
      rating,
      comment,
    });

    const product = await Product.findByPk(product_id, {
      attributes: ["restaurant_id"],
    });
    if (product) {
      await updateRestaurantAverageRating(product.restaurant_id);
    }

    return res.status(201).json({
      message: "Review submitted successfully",
      review,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const { product_id } = req.params;

    // Check product exists
    const product = await Product.findByPk(product_id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Get reviews
    const reviews = await Review.findAll({
      where: {
        product_id,
      },
      include: [
        {
          model: Customer,
          attributes: [],
          include: [
            {
              model: User,
              attributes: ["full_name"],
            },
          ],
        },
      ],
      order: [["review_date", "DESC"]],
    });

    // Calculate average rating
    const average_rating =
      reviews.length > 0
        ? (
            reviews.reduce((sum, review) => sum + review.rating, 0) /
            reviews.length
          ).toFixed(1)
        : "0.0";

    return res.status(200).json({
      total_reviews: reviews.length,
      average_rating,
      reviews,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};