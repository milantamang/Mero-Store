const nodemailer = require('nodemailer');
require('dotenv').config();

/**
 * Email Service
 * Utility for sending various types of emails in the application
 */

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send email
 * @param {Object} options - Email options (to, subject, html)
 * @returns {Promise} - Resolves with info about sent email or rejects with error
 */
const sendEmail = async (options) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: `Mero Store <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };
  
  return transporter.sendMail(mailOptions);
};

/**
 * Send registration confirmation email
 * @param {Object} user - User object with email and username
 * @param {string} verificationToken - Token for email verification
 */
const sendRegistrationEmail = async (user, verificationToken) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verifyemail/${user._id}/${verificationToken}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #201658;">Welcome to Mero Store!</h1>
      </div>
      
      <p style="font-size: 16px; color: #333;">Hello <strong>${user.username}</strong>,</p>
      
      <p style="font-size: 16px; color: #333;">Thank you for creating an account with us. To complete your registration, please verify your email by clicking the button below:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" style="background-color: #201658; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email Address</a>
      </div>
      
      <p style="font-size: 16px; color: #333;">This verification link will expire in 24 hours.</p>
      
      <p style="font-size: 16px; color: #333;">If you didn't create an account, please ignore this email.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px;">
        <p>Thank you,<br>The Mero Store Team</p>
      </div>
    </div>
  `;
  
  return sendEmail({
    to: user.email,
    subject: 'Verify Your Email for Mero Store',
    html,
  });
};

/**
 * Send password reset email
 * @param {Object} user - User object with email and username
 * @param {string} resetToken - Token for password reset
 */
const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${user._id}/${resetToken}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #201658;">Password Reset Request</h1>
      </div>
      
      <p style="font-size: 16px; color: #333;">Hello <strong>${user.username}</strong>,</p>
      
      <p style="font-size: 16px; color: #333;">You recently requested to reset your password. Click on the button below to reset it:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #201658; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
      </div>
      
      <p style="font-size: 16px; color: #333;">This password reset link will expire in 1 hour.</p>
      
      <p style="font-size: 16px; color: #333;">If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px;">
        <p>Thank you,<br>The Mero Store Team</p>
      </div>
    </div>
  `;
  
  return sendEmail({
    to: user.email,
    subject: 'Reset Your Mero Store Password',
    html,
  });
};

/**
 * Send order confirmation email
 * @param {Object} user - User object with email and username
 * @param {Object} order - Order details
 */
const sendOrderConfirmationEmail = async (user, order) => {
  // Format order items for display in email
  const orderItemsHtml = order.orderItems.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">
        <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover;">
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.size}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">Rs. ${item.price}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">Rs. ${item.price * item.quantity}</td>
    </tr>
  `).join('');
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #201658;">Your Order Confirmation</h1>
      </div>
      
      <p style="font-size: 16px; color: #333;">Hello <strong>${user.username}</strong>,</p>
      
      <p style="font-size: 16px; color: #333;">Thank you for your order! We're pleased to confirm that we've received your order and it's being processed.</p>
      
      <div style="margin: 20px 0; padding: 15px; background-color: #f7f7f7; border-radius: 5px;">
        <h2 style="color: #201658; margin-top: 0;">Order Summary</h2>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
        <p><strong>Payment Method:</strong> ${order.paymentInfo}</p>
        <p><strong>Order Status:</strong> ${order.orderStatus}</p>
      </div>
      
      <h3 style="color: #201658;">Order Items</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="padding: 10px; text-align: left;">Image</th>
            <th style="padding: 10px; text-align: left;">Product</th>
            <th style="padding: 10px; text-align: left;">Size</th>
            <th style="padding: 10px; text-align: left;">Quantity</th>
            <th style="padding: 10px; text-align: left;">Price</th>
            <th style="padding: 10px; text-align: left;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${orderItemsHtml}
        </tbody>
      </table>
      
      <div style="margin-top: 20px; text-align: right;">
        <p><strong>Subtotal:</strong> Rs. ${order.itemsPrice}</p>
        <p><strong>Shipping:</strong> Rs. ${order.shippingPrice}</p>
        <p><strong>Tax:</strong> Rs. ${order.taxPrice}</p>
        <p style="font-size: 18px; color: #201658;"><strong>Grand Total:</strong> Rs. ${order.totalPrice}</p>
      </div>
      
      <div style="margin-top: 20px; padding: 15px; background-color: #f7f7f7; border-radius: 5px;">
        <h3 style="color: #201658; margin-top: 0;">Shipping Address</h3>
        <p>${order.shippingInfo.address}</p>
        <p>${order.shippingInfo.city}, ${order.shippingInfo.pincode}</p>
        <p>${order.shippingInfo.country}</p>
        <p>Phone: ${order.shippingInfo.phone}</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL}/orders" style="background-color: #201658; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Order Details</a>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px;">
        <p>Thank you for shopping with us!</p>
        <p>The Mero Store Team</p>
      </div>
    </div>
  `;
  
  return sendEmail({
    to: user.email,
    subject: `Mero Store - Order Confirmation #${order._id}`,
    html,
  });
};

/**
 * Send OTP verification email
 * @param {Object} user - User object with email and username
 * @param {string} otp - One-time password
 */
const sendOtpEmail = async (user, otp) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #201658;">Your Verification Code</h1>
      </div>
      
      <p style="font-size: 16px; color: #333;">Hello <strong>${user.username}</strong>,</p>
      
      <p style="font-size: 16px; color: #333;">Please use the following verification code to complete your action:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <div style="display: inline-block; padding: 15px 30px; background-color: #f2f2f2; border-radius: 5px; font-size: 24px; font-weight: bold; letter-spacing: 5px;">
          ${otp}
        </div>
      </div>
      
      <p style="font-size: 16px; color: #333;">This code will expire in 10 minutes.</p>
      
      <p style="font-size: 16px; color: #333;">If you didn't request this code, please ignore this email or contact support if you have concerns.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px;">
        <p>Thank you,<br>The Mero Store Team</p>
      </div>
    </div>
  `;
  
  return sendEmail({
    to: user.email,
    subject: 'Verification Code for Mero Store',
    html,
  });
};

/**
 * Send welcome email after successful registration
 * @param {Object} user - User object with email and username
 */
const sendWelcomeEmail = async (user) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #201658;">Welcome to Mero Store!</h1>
      </div>
      
      <p style="font-size: 16px; color: #333;">Hello <strong>${user.username}</strong>,</p>
      
      <p style="font-size: 16px; color: #333;">Thank you for joining Mero Store! Your account has been successfully created and verified.</p>
      
      <p style="font-size: 16px; color: #333;">With your new account, you can:</p>
      <ul style="font-size: 16px; color: #333;">
        <li>Browse our latest collections</li>
        <li>Save your favorite items to your wishlist</li>
        <li>Track your orders</li>
        <li>Enjoy a personalized shopping experience</li>
      </ul>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL}" style="background-color: #201658; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">Start Shopping</a>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px;">
        <p>Thank you for choosing Mero Store!</p>
        <p>The Mero Store Team</p>
      </div>
    </div>
  `;
  
  return sendEmail({
    to: user.email,
    subject: 'Welcome to Mero Store!',
    html,
  });
};

module.exports = {
  sendEmail,
  sendRegistrationEmail,
  sendPasswordResetEmail,
  sendOrderConfirmationEmail,
  sendOtpEmail,
  sendWelcomeEmail,
};