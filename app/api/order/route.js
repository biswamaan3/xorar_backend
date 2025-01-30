import {sendErrorNotificationEmail, sendOrderConfirmationEmail, SendOrderDetailstoOwner} from "@/lib/mailer";
import {prisma} from "../../../lib/prisma";


export async function GET(req) {
	try {
		const url = new URL(req.url);
		const size = parseInt(url.searchParams.get("size") || "10", 10);
		const page = parseInt(url.searchParams.get("page") || "1", 10);
		const skip = (page - 1) * size;

		const orders = await prisma.order.findMany({
			skip,
			take: size,
			orderBy: {createdAt: "desc"},
			include: {
				orderDetails: {
					include: {
						product: true,
					},
				},
			},
		});

		const totalOrders = await prisma.order.count();

		return new Response(
			JSON.stringify({
				success: true,
				orders,
				pagination: {
					page,
					size,
					totalOrders,
					totalPages: Math.ceil(totalOrders / size),
				},
			}),
			{status: 200}
		);
	} catch (error) {
		return new Response(
			JSON.stringify({
				success: false,
				message: "Error fetching orders",
				error: error.message,
			}),
			{status: 500}
		);
	}
}

export async function POST(req) {
	try {
		const body = await req.json();

		const {
			name,
			email,
			phone,
			address,
			city,
			country,
			state,
			pinCode,
			landmark,
			orderId,
			totalValue,
			paymentType,
			paymentStatus,
			orderDetails,
		} = body;

		// Validate required fields
		if (
			!name ||
			!email ||
			!address ||
			!city ||
			!country ||
			!state ||
			!paymentStatus ||
			!paymentType ||
			!orderId ||
			!totalValue ||
			!phone ||
			!pinCode ||
			!Array.isArray(orderDetails) ||
			orderDetails.length === 0
		) {
			return new Response(
				JSON.stringify({
					success: false,
					message: "Missing required fields",
				}),
				{status: 400}
			);
		}

		// Type conversions
		const orderID = String(orderId);
		if (!Array.isArray(orderDetails) || orderDetails.length === 0) {
			return new Response(
				JSON.stringify({
					success: false,
					message: "`orderDetails` must be a non-empty array",
				}),
				{status: 400}
			);
		}

		const stringTotalValue = String(totalValue);
		const sizeNames = orderDetails
			.map((detail) => detail.size)
			.filter(Boolean); // Get all unique sizes
		const sizes = await prisma.size.findMany({
			where: {name: {in: sizeNames}},
		});
		const newOrder = await prisma.order.create({
			data: {
				orderID,
				fullName: name,
				email,
				phone,
				address,
				city,
				country,
				state,
				pinCode,
				landMark: landmark || null, // Handle optional fields
				totalValue: stringTotalValue,
				paymentType,
				paymentStatus,
				deliveryStatus: "Order Processing",
				orderDetails: {
					create: orderDetails.map((detail) => {
						const size = sizes.find((s) => s.name === detail.size);
						return {
							productId: detail.id,
							productName: detail.title,
							productUrl: detail.slug,
							quantity: detail.quantity,
							thumbnail: detail.thumbnail,
							sizeId: size ? size.id : null,
							designId: detail.design || null,
							colorId: detail.color || null,
							price: detail.price,
							totalPrice: detail.quantity * detail.price,
						};
					}),
				},
			},
			include: {
				orderDetails: true,
			},
		});

		(async () => {
			try {
				await sendOrderConfirmationEmail(newOrder);
				await SendOrderDetailstoOwner(newOrder)
			} catch (emailError) {
				// Log the error and notify `dipanjan@gmail.com`
				console.error("Error sending order confirmation email:", emailError.message);
				try {
					await sendErrorNotificationEmail("biswamaan3@gmail.com", emailError.message);
				} catch (notifyError) {
					console.error("Error sending error notification email:", notifyError.message);
				}
			}
		})();

		return new Response(JSON.stringify({success: true, order: newOrder}), {
			status: 200,
		});
	} catch (error) {
		return new Response(
			JSON.stringify({
				success: false,
				message: "Error creating order",
				error: error.message,
			}),
			{status: 500}
		);
	}
}

export async function PUT(req) {
	try {
		const referer = req.headers.get("referer");
		const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");

		if (
			!referer ||
			!allowedOrigins.some((origin) => referer.startsWith(origin))
		) {
			return new Response(JSON.stringify({message: "Invalid origin."}), {
				status: 403,
			});
		}

		const body = await req.json();
		const {id, ...updateData} = body;

		if (!id) {
			return new Response(
				JSON.stringify({message: "Order ID is required."}),
				{status: 400}
			);
		}

		// Check if the order exists
		const existingOrder = await prisma.order.findUnique({
			where: {id},
		});

		if (!existingOrder) {
			return new Response(JSON.stringify({message: "Order not found."}), {
				status: 404,
			});
		}

		const orderUpdateData = {};
		const orderDetailUpdates = [];

		if (updateData.fullName) orderUpdateData.fullName = updateData.fullName;
		if (updateData.email) orderUpdateData.email = updateData.email;
		if (updateData.address) orderUpdateData.address = updateData.address;
		if (updateData.city) orderUpdateData.city = updateData.city;
		if (updateData.country) orderUpdateData.country = updateData.country;
		if (updateData.state) orderUpdateData.state = updateData.state;
		if (updateData.paymentStatus)
			orderUpdateData.paymentStatus = updateData.paymentStatus;
		if (updateData.deliveryStatus)
			orderUpdateData.deliveryStatus = updateData.deliveryStatus;

		// If orderDetails are provided, validate and prepare updates
		if (updateData.orderDetails && Array.isArray(updateData.orderDetails)) {
			for (const detail of updateData.orderDetails) {
				if (!detail.id) {
					return new Response(
						JSON.stringify({
							message:
								"Each order detail must have an ID to update.",
						}),
						{status: 400}
					);
				}

				orderDetailUpdates.push({
					where: {id: detail.id},
					data: {
						...(detail.productId && {productId: detail.productId}),
						...(detail.productName && {
							productName: detail.productName,
						}),
						...(detail.productUrl && {
							productUrl: detail.productUrl,
						}),
						...(detail.quantity && {quantity: detail.quantity}),
						...(detail.price && {price: detail.price}),
						...(detail.totalPrice && {
							totalPrice: detail.totalPrice,
						}),
					},
				});
			}
		}

		const updatedOrder = await prisma.order.update({
			where: {id},
			data: {
				...orderUpdateData,
				...(orderDetailUpdates.length > 0 && {
					orderDetails: {
						update: orderDetailUpdates,
					},
				}),
			},
			include: {
				orderDetails: true,
			},
		});

		return new Response(
			JSON.stringify({success: true, order: updatedOrder}),
			{status: 200}
		);
	} catch (error) {
		return new Response(
			JSON.stringify({
				message: "Error updating order.",
				error: error.message,
			}),
			{status: 500}
		);
	}
}

export async function DELETE(req) {
	try {
		
		const body = await req.json();
		const {id} = body;
		console.log("Deleting order with ID:", id);
		if (!id) {
			return new Response(
				JSON.stringify({message: "Order ID is required."}),
				{status: 400}
			);
		}

		const existingOrder = await prisma.order.findUnique({
			where: {id},
		});
		if (!existingOrder) {
			return new Response(
				JSON.stringify({ message: "Order not found." }),
				{ status: 404 }
			);
		}

		await prisma.order.delete({
			where: { id },
		});

		return new Response(
			JSON.stringify({ message: "Order deleted successfully." }),
			{ status: 200 }
		);

	} catch (error) {
		console.error("Error deleting order:", error);

		// Return a 500 response in case of an error
		return new Response(
			JSON.stringify({ message: "An error occurred while deleting the order." }),
			{ status: 500 }
		);
	}
}
