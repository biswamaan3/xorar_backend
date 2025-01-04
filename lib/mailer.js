// lib/email.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use other email services
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendOrderConfirmationEmail = async (order) => {
  const { fullName, email, orderDetails } = order;
  
  let productDetails = orderDetails.map(detail => `
    <p><strong>${detail.productName}</strong> - ${detail.quantity} x $${detail.price}</p>
  `).join('');

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Order Confirmation for ${fullName}`,
    html: `
      <h1>Thank you for your order, ${fullName}!</h1>
      <h2>Order Details:</h2>
      ${productDetails}
      <p>Total: $${orderDetails.reduce((total, detail) => total + (detail.price * detail.quantity), 0)}</p>
      <p>Status: ${order.paymentStatus}</p>
      <p>We will notify you once the order is shipped!</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};
