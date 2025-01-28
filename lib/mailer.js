// lib/email.js
import { NewOrder, OwnerOrderDetails } from '@/MailTemplates/NewOrder';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendErrorNotificationEmail = async (email, error) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Error Notification',
    text: error ,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}

export const sendOrderConfirmationEmail = async (order) => {
  const { fullName, email } = order;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Order Confirmation | Thanks ${fullName} for your order!`,
    html: NewOrder(order),
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

// send to 3 owners
export const SendOrderDetailstoOwner = async (order) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_OWNERS,
    subject: `New Order Received from ${order.fullName}`,
    html: OwnerOrderDetails(order),
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}

