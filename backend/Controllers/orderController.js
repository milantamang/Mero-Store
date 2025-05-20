const Order = require("../Models/orderModel");
const asyncHandler = require("express-async-handler");
const Product = require("../Models/ProductModel");
const User = require("../Models/UserSchema");
const emailService = require("../utils/emailService");
const { ImTerminal } = require("react-icons/im");
const ALL_SIZES = ["S", "M", "L", "XL", "XXL"];
// create new Order
const newOrder = asyncHandler(async (req, res) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      taxPrice,
      itemsPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    // Create the order
    const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      taxPrice,
      itemsPrice,
      shippingPrice,
      totalPrice,
      paidAt: Date.now(),
      user: req.user.id,
    });

    // Deduct stock from each ordered product
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) continue;
      const sizeIndex = ALL_SIZES.indexOf(item.size);
      if (sizeIndex === -1) continue;
      // Initialize stock if missing
      if (!product.stock || product.stock.length < ALL_SIZES.length) {
        product.stock = Array(ALL_SIZES.length).fill(0);
      }
      // Reduce stock safely
      product.stock[sizeIndex] = Math.max(0, product.stock[sizeIndex] - item.quantity);

      if (product.stock[sizeIndex] === 0) {
        product.size = product.size.filter((s) => s !== item.size);
      } else {
        // Ensure size is in the list if there's stock (in case it's missing)
        if (!product.size.includes(item.size)) {
          product.size.push(item.size);
        }
      }
      await product.save();
    }

    // Send confirmation email
    const user = await User.findById(req.user.id);
    if (user && user.email) {
      await emailService.sendOrderConfirmationEmail(user, order);
    }

    res.status(200).json({
      success: true,
      order,
      user: req.user.id,
    });

  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
});


const getSingleOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return res.status(404).json({
      message: "Order not found with this id",
    });
  }
  res.status(200).json({
    success: true,
    order,
    message: "Single Order retrieved successfully",
  });
});

// get logged in user order (get user orders)
const getLogedInUserOrder = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });  
  res.status(200).json(orders);
});

// get all orders only admin
const getAllOrdersAdmin = asyncHandler(async (req, res, next) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });
  res.status(200).json({
    success: true,
    orders,
    totalAmount,
    message: "All orders get successfully",
  });
});

// update orders status only admin
const updateOrdersAdmin = asyncHandler(async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found by this id",
      });
    }

    const previousStatus = order.orderStatus;
    order.orderStatus = req.body.orderStatus;
    
    if (req.body.orderStatus === "Delivered") {
      order.deliveredAt = Date.now();
    }
    
    await order.save();

    // If status changed to "Shipped" or "Delivered", send status update email
    if (previousStatus !== req.body.orderStatus && 
        (req.body.orderStatus === "Shipped" || req.body.orderStatus === "Delivered")) {
      // Get user details
      const user = await User.findById(order.user);
      
      if (user) {
        // Send email notification about order status change
        await sendOrderStatusUpdateEmail(user, order);
      }
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message
    });
  }
});

// Send order status update email
const sendOrderStatusUpdateEmail = async (user, order) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #201658;">Order Status Update</h1>
      </div>
      
      <p style="font-size: 16px; color: #333;">Hello <strong>${user.username}</strong>,</p>
      
      <p style="font-size: 16px; color: #333;">Your order has been <strong>${order.orderStatus}</strong>!</p>
      
      <div style="margin: 20px 0; padding: 15px; background-color: #f7f7f7; border-radius: 5px;">
        <h2 style="color: #201658; margin-top: 0;">Order Details</h2>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
        <p><strong>Current Status:</strong> <span style="color: #201658; font-weight: bold;">${order.orderStatus}</span></p>
      </div>
      
      ${order.orderStatus === "Shipped" ? `
        <p style="font-size: 16px; color: #333;">Your order is on its way! You should receive it within the estimated delivery timeframe.</p>
      ` : ''}
      
      ${order.orderStatus === "Delivered" ? `
        <p style="font-size: 16px; color: #333;">Your order has been delivered. We hope you enjoy your purchase!</p>
        <p style="font-size: 16px; color: #333;">If you're not completely satisfied, please let us know within 7 days for our return policy.</p>
      ` : ''}
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL}/orders" style="background-color: #201658; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Order Details</a>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px;">
        <p>Thank you for shopping with us!</p>
        <p>The Mero Store Team</p>
      </div>
    </div>
  `;
  
  return emailService.sendEmail({
    to: user.email,
    subject: `Mero Store - Order ${order.orderStatus} - #${order._id}`,
    html,
  });
};

async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.Stock = product.Stock-quantity;
  await product.save({ validateBeforeSave: false });
}

// delete orders status only admin
const deleteOrdersAdmin = asyncHandler(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: true,
      message: " order not found by this id",
    });
  }

  res.status(200).json({
    success: true,
    message: "Order deleted successfully",
  });
});

const cancelOrder = asyncHandler(async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found by this id",
      });
    }

    // Check if order belongs to the current user
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to cancel this order",
      });
    }

    // Only allow cancellation of orders that are in "Processing" state
    if (order.orderStatus !== "Processing") {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled as it is already ${order.orderStatus}`,
      });
    }

    order.orderStatus = "Cancelled";
    await order.save();

    // Get user details for email notification
    const user = await User.findById(req.user.id);
    
    // Send order cancellation email
    if (user) {
      await sendOrderCancellationEmail(user, order);
    }

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
      error: error.message
    });
  }
});

// Send order cancellation email
const sendOrderCancellationEmail = async (user, order) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #201658;">Order Cancellation Confirmation</h1>
      </div>
      
      <p style="font-size: 16px; color: #333;">Hello <strong>${user.username}</strong>,</p>
      
      <p style="font-size: 16px; color: #333;">Your order has been <strong>cancelled</strong> as requested.</p>
      
      <div style="margin: 20px 0; padding: 15px; background-color: #f7f7f7; border-radius: 5px;">
        <h2 style="color: #201658; margin-top: 0;">Order Details</h2>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
        <p><strong>Cancellation Date:</strong> ${new Date().toLocaleDateString()}</p>
      </div>
      
      <p style="font-size: 16px; color: #333;">If you paid for this order, a refund will be processed according to our refund policy. The refund should appear in your account within 5-7 business days, depending on your payment method.</p>
      
      <p style="font-size: 16px; color: #333;">If you have any questions about your cancellation or refund, please don't hesitate to contact our customer service team.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL}" style="background-color: #201658; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">Continue Shopping</a>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px;">
        <p>Thank you for your understanding.</p>
        <p>The Mero Store Team</p>
      </div>
    </div>
  `;
  
  return emailService.sendEmail({
    to: user.email,
    subject: `Mero Store - Order Cancellation Confirmation - #${order._id}`,
    html,
  });
};

module.exports = {
  newOrder,
  getSingleOrder,
  getLogedInUserOrder,
  getAllOrdersAdmin,
  updateOrdersAdmin,
  deleteOrdersAdmin,
  cancelOrder,
};