
import { prisma } from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(req, { params }) {
  const { id } = params;
  const { paymentStatus, deliveryStatus } = await req.json();
  
  const user = req.headers.get('user'); 
  const isAdmin = user?.isAdmin;

  if (!isAdmin) {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 403 });
  }

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: {
        paymentStatus,
        deliveryStatus,
      },
    });

    return new NextResponse(JSON.stringify({ success: true, order: updatedOrder }), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: 'Error updating order' }), { status: 500 });
  }
}
