// app/api/orders/[id]/route.js

import {prisma} from "../../../../lib/prisma";
import {NextResponse} from "next/server";

export async function GET(req, {params}) {
	const {id} = (await params);

	try {
		const order = await prisma.order.findUnique({
			where: {id: parseInt(id)},
			include: {
				orderDetails: {
					include: {
						product: true,
						size: true,
						color: true,
						design: true,
					},
				},
			},
		});

		if (!order) {
			return new NextResponse(
				JSON.stringify({message: "Order not found"}),
				{status: 404}
			);
		}

		return new NextResponse(JSON.stringify({success: true, order}), {
			status: 200,
		});
	} catch (error) {
		return new NextResponse(
			JSON.stringify({message: "Error fetching order"}),
			{status: 500}
		);
	}
}


export async function PUT(req, { params }) {
	const { id } = await params;
	const body = await req.json();
  
	try {
	  const orderExists = await prisma.order.findUnique({
		where: { id: parseInt(id) },
		include: {
		  orderDetails: true, // Fetch the existing orderDetails
		},
	  });
  
	  if (!orderExists) {
		return new NextResponse(
		  JSON.stringify({ message: "Order not found" }),
		  { status: 404 }
		);
	  }
  
	  // Update the main order details
	  const updatedOrder = await prisma.order.update({
		where: { id: parseInt(id) },
		data: {
		  fullName: body.fullName || orderExists.fullName,
		  email: body.email || orderExists.email,
		  country: body.country || orderExists.country,
		  phone: body.phone || orderExists.phone,
		  address: body.address || orderExists.address,
		  city: body.city || orderExists.city,
		  state: body.state || orderExists.state,
		  pinCode: body.pinCode || orderExists.pinCode,
		  paymentStatus: body.paymentStatus || orderExists.paymentStatus,
		  deliveryStatus: body.deliveryStatus || orderExists.deliveryStatus,
		},
	  });
  
	  // Update the orderDetails (products) linked to the order
	  const updatedOrderDetails = await Promise.all(
		body.orderDetails.map(async (detail) => {
		  // If the orderDetail has an ID, it's an update; otherwise, it's a new detail to create
		  if (detail.id) {
			return await prisma.orderDetail.update({
			  where: { id: detail.id },
			  data: {
				quantity: detail.quantity || undefined,
				price: detail.price || undefined,
				// Add more fields if needed
			  },
			});
		  } else {
			return await prisma.orderDetail.create({
			  data: {
				orderId: updatedOrder.id, // Ensure the order ID is linked
				productId: detail.productId,
				quantity: detail.quantity,
				price: detail.price,
				// Add more fields if needed
			  },
			});
		  }
		})
	  );
  
	  return new NextResponse(
		JSON.stringify({ success: true, updatedOrder, updatedOrderDetails }),
		{ status: 200 }
	  );
	} catch (error) {
	  return new NextResponse(
		JSON.stringify({ message: "Error updating order", error: error.message }),
		{ status: 500 }
	  );
	}
  }
  
  // DELETE endpoint to delete an order along with its orderDetails
  export async function DELETE(req, { params }) {
	const { id } = await params;
  
	try {
	  const orderExists = await prisma.order.findUnique({
		where: { id: parseInt(id) },
		include: {
		  orderDetails: true, // Fetch the related order details
		},
	  });
  
	  if (!orderExists) {
		return new NextResponse(
		  JSON.stringify({ message: "Order not found" }),
		  { status: 404 }
		);
	  }
  
	  // First, delete the orderDetails related to this order
	  await prisma.orderDetail.deleteMany({
		where: { orderId: parseInt(id) },
	  });
  
	  // Now, delete the order itself
	  await prisma.order.delete({
		where: { id: parseInt(id) },
	  });
  
	  return new NextResponse(
		JSON.stringify({ success: true, message: "Order and its details deleted successfully" }),
		{ status: 200 }
	  );
	} catch (error) {
	  return new NextResponse(
		JSON.stringify({ message: "Error deleting order", error: error.message }),
		{ status: 500 }
	  );
	}
  }
  