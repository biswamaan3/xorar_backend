import {prisma} from "../../../../../lib/prisma";

export async function POST(req) {
	try {
		const {user_string, productId, productName, quantity, country, city} =
			await req.json();

		const addedToCart = await prisma.addedToCart.create({
			data: {
				user_string,
				productId,
				productName,
				quantity,
				country,
				city,
			},
		});

		return new Response(
			JSON.stringify({
				message: "Item added to cart successfully",
				data: addedToCart,
			}),
			{status: 201}
		);
	} catch (error) {
		console.error(error);
		return new Response(
			JSON.stringify({error: "Failed to add item to cart"}),
			{status: 500}
		);
	}
}
