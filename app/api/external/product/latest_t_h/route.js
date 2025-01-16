import {prisma} from "../../../../../lib/prisma";

export async function GET() {
	try {
		// Fetch the latest 4 t-shirts and 4 hoodies
		const tShirts = await prisma.product.findMany({
			where: {
				category: {
					name: "T-Shirt",
				},
			},
			take: 4,
			orderBy: {
				createdAt: "desc",
			},
		});

		const hoodies = await prisma.product.findMany({
			where: {
				category: {
					name: "Hoodies",
				},
			},
			take: 4, 
			orderBy: {
				createdAt: "desc",
			},
		});

		const women = await prisma.product.findMany({
			where: {
				category: {
					name: "Women",
				},
			},
			take: 4,
			orderBy: {
				createdAt: "desc",
			},
		});

		return new Response(
			JSON.stringify({
				success: true,
				data: {
					tShirts,
					hoodies,
					women,
				},
			}),
			{status: 200}
		);
	} catch (error) {
		console.error("Error fetching products:", error);
		return new Response(
			JSON.stringify({
				success: false,
				message: "Error fetching products",
			}),
			{status: 500}
		);
	}
}
