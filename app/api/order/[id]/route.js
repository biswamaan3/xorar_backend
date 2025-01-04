// app/api/orders/[id]/route.js

import { prisma } from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        orderDetails: true,
      },
    });

    if (!order) {
      return new NextResponse(JSON.stringify({ message: 'Order not found' }), { status: 404 });
    }

    return new NextResponse(JSON.stringify({ success: true, order }), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: 'Error fetching order' }), { status: 500 });
  }
}
