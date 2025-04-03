const Order = require("../Models/orderModel");
const asyncHandler = require("express-async-handler");
const Product = require("../Models/ProductModel");

// create new Order
const newOrder = asyncHandler(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    taxPrice,
    itemsPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

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
  res.status(200).json({
    success: true,
    order,
    user: req.user.id,
  });
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

// get logedin user order   ( get user orders)
const getLogedInUserOrder = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id });
  res.status(200).json({
    success: true,
    orders,
    message: " Loggin User Order found successfully",
  });
});

// get all orders only admin
const getAllOrdersAdmin = asyncHandler(async (req, res, next) => {
  const orders = await Order.find();
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
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: true,
      message: " order not found by this id",
    });
  }

  if (order.orderStatus === "Delivered") {
    return res.status(200).json({
      message: " you have  already  delivered  this order",
    });
  }
  order.orderItems.forEach(async (ord) => {
    await updateStock(ord.product, ord.quantity);
  });
  order.orderStatus = req.body.status;
  if (req.body.status === "Delivered") {
    order.deliverAt = Date.now();
  }
  await order.save({
    validateBeforeSave: false,
  });

  res.status(200).json({
    success: true,
    message: "Order status upadate successfully",
  });
});
async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.Stock = quantity;
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

module.exports = {
  newOrder,
  getSingleOrder,
  getLogedInUserOrder,
  getAllOrdersAdmin,
  updateOrdersAdmin,
  deleteOrdersAdmin,
};
