
import { prisma } from '../../../../../lib/prisma';

import { NextResponse } from 'next/server';

export async function PUT(req) {
  const { id, name, value } = await req.json();

  // Check if `id`, `name`, and `value` are provided
  if (!id || !name) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'Missing required fields (id or name)' }),
      { status: 400 }
    );
  }

  const dataToUpdate = {
    [name]: value, 
  };

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: dataToUpdate
    });

    return new NextResponse(JSON.stringify({ success: true, order: updatedOrder }), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: 'Error updating order' }), { status: 500 });
  }
}
