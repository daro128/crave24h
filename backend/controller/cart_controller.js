import Cart from "../models/Cart.js";
import Customer from "../models/customer.js";
import Product from "../models/Product.js";
import CartItem from "../models/CartItem.js";
import Restaurant from "../models/Restaurant.js";

export const addToCart = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;

    // Validate input
    if (!product_id || !quantity || quantity <= 0) {
      return res.status(400).json({
        message: "Product ID and valid quantity are required",
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

    // Find or create cart
    let cart = await Cart.findOne({
      where: {
        customer_id: customer.customer_id,
      },
    });

    if (!cart) {
      cart = await Cart.create({
        customer_id: customer.customer_id,
      });
    }

    // Find product
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    // Check restaurant
    const existingItem = await CartItem.findOne({
      where: {
        cart_id: cart.cart_id,
      },
      include: [
        {
          model: Product,
          attributes: ["restaurant_id"],
        },
      ],
    });

    if (
      existingItem &&
      existingItem.Product.restaurant_id !== product.restaurant_id
    ) {
      return res.status(400).json({
        message: "You can only order from one restaurant at a time.",
      });
    }
    // Check if product already exists in cart
    const cartItem = await CartItem.findOne({
      where: {
        cart_id: cart.cart_id,
        product_id,
      },
    });

    if (cartItem) {
      // Update quantity
      const newQuantity = cartItem.quantity + quantity;
      const subtotal = newQuantity * product.price;
      if (newQuantity > product.stock) {
        return res.status(400).json({
          message: "Not enough stock available",
        });
      }
      await cartItem.update({
        quantity: newQuantity,
        price: product.price,
        subtotal: newQuantity * product.price,
      });

      return res.status(200).json({
        message: "Cart updated successfully",
        cartItem,
      });
    }
    if (quantity > product.stock) {
      return res.status(400).json({
        message: "Not enough stock available",
      });
    }

    // Create new cart item
    const subtotal = quantity * product.price;
    const newCartItem = await CartItem.create({
      cart_id: cart.cart_id,
      product_id,
      price: product.price,
      quantity,
      subtotal: product.price * quantity,
    });

    return res.status(201).json({
      message: "Product added to cart successfully",
      cartItem: newCartItem,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getCart = async (req, res) => {
  try {
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

    const cart = await Cart.findOne({
      where: {
        customer_id: customer.customer_id,
      },
      include: [
        {
          model: CartItem,
          include: [
            {
              model: Product,
              attributes: [
                "product_id",
                "product_name",
                "price",
                "image",
                "stock",
                "restaurant_id",
                "description",
              ],
              include: [
                {
                  model: Restaurant,
                  attributes: ["restaurant_id", "restaurant_name", "fee"],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!cart || cart.CartItems.length === 0) {
      return res.status(404).json({
        message: "Cart is empty",
      });
    }

    const total = cart.CartItems.reduce((sum, item) => {
      return sum + Number(item.subtotal);
    }, 0);

    const deliveryFee = Number(cart.CartItems[0]?.Product?.Restaurant?.fee || 0);

    return res.status(200).json({
      cart,
      total,
      deliveryFee,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};
export const updateCartItem = async (req, res) => {
  try {
    const { cart_item_id } = req.params;
    const { quantity } = req.body;

    if (quantity < 0) {
      return res.status(400).json({
        message: "Quantity cannot be negative",
      });
    }

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

    const cart = await Cart.findOne({
      where: {
        customer_id: customer.customer_id,
      },
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const cartItem = await CartItem.findOne({
      where: {
        cart_item_id,
        cart_id: cart.cart_id,
      },
    });

    if (!cartItem) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    const product = await Product.findByPk(cartItem.product_id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (quantity === 0) {
      await cartItem.destroy();

      return res.status(200).json({
        message: "Product removed from cart",
      });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        message: "Not enough stock available",
      });
    }

    const subtotal = quantity * Number(product.price);

    await cartItem.update({
      quantity,
      price: product.price,
      subtotal,
    });

    return res.status(200).json({
      message: "Cart updated successfully",
      cartItem,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};
export const deleteCartItem = async (req, res) => {
  try {
    const { cart_item_id } = req.params;

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

    const cart = await Cart.findOne({
      where: {
        customer_id: customer.customer_id,
      },
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const cartItem = await CartItem.findOne({
      where: {
        cart_item_id,
        cart_id: cart.cart_id,
      },
    });

    if (!cartItem) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    await cartItem.destroy();

    return res.status(200).json({
      message: "Product removed from cart successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};