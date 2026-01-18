const Order = require('../models/Order');
const Gear = require('../models/Gear'); // Importing Gear model

exports.createOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // Loop through items to check and deduct stock
    for (const item of items) {
      const product = await Gear.findById(item.product);

      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.name} not found` });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          message: `Insufficient stock for ${item.name}. Only ${product.quantity} left.` 
        });
      }

      // Deduct the quantity
      product.quantity -= item.quantity;
      await product.save();
    }

    // Create the order only after stock is successfully deducted
    const order = await Order.create({
      user: req.user.id,
      items,
      totalAmount
    });

    res.status(201).json({
      success: true,
      message: "Order placed and inventory updated!",
      order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get orders for the logged-in user
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort('-createdAt');
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    // We use .populate('user', 'name email') to get user details instead of just an ID
    const orders = await Order.find().populate('user', 'username email').sort('-createdAt');
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch all orders" });
  }
};