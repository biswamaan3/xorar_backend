// app/api/orders/route.js

import { prisma } from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const user = req.headers.get('user'); // Extract user info from headers or JWT token
  const isAdmin = user?.isAdmin; // Assuming user object has isAdmin

  if (!isAdmin) {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 403 });
  }

  try {
    const orders = await prisma.order.findMany({
      include: {
        orderDetails: true,
      },
    });
    return new NextResponse(JSON.stringify({ success: true, orders }), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: 'Error fetching orders' }), { status: 500 });
  }
}
