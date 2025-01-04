// app/api/orders/create/route.js

import { prisma } from '../../../../lib/prisma';
// import { sendOrderConfirmationEmail } from '../../../../lib/email';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const data = await req.json();

  const {
    fullName,
    email,
    address,
    city,
    country,
    state,
    orderDetails, // Array of products being purchased
    paymentStatus,
    deliveryStatus,
  } = data;

  try {
    // Create a new order
    const order = await prisma.order.create({
      data: {
        fullName,
        email,
        address,
        city,
        country,
        state,
        paymentStatus,
        deliveryStatus,
        orderDetails: {
          create: orderDetails.map((detail) => ({
            productName: detail.productName,
            productUrl: detail.productUrl,
            quantity: detail.quantity,
            price: detail.price,
            totalPrice: detail.price * detail.quantity,
          })),
        },
      },
    });

    // Send order confirmation email
    // await sendOrderConfirmationEmail(order);

    return new NextResponse(JSON.stringify({ success: true, message: 'Order created and email sent' }), { status: 201 });
  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ message: 'Error placing order' }), { status: 500 });
  }
}
