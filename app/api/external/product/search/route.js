import {prisma} from "@/lib/prisma";

export async function GET(req) {
	try {
		const query = req.nextUrl.searchParams.get("query");

		if (!query || query.trim() === "") {
			return new Response(
				JSON.stringify({message: "Query parameter is required"}),
				{status: 400}
			);
		}
		const products = await prisma.product.findMany({
			where: {
				OR: [
					{title: {contains: query, mode: "insensitive"}},
					{description: {contains: query, mode: "insensitive"}},
					{
						category: {
							name: {contains: query, mode: "insensitive"},
						},
					},
				],
			},
			select: {
				title: true,
				thumbnail: true,
				price: true,
				actual_price: true,
				discount_percent: true,
				slug: true,
				averageRating: true,
				category: {
					select: {
						name: true, // Only include the category's name field
					},
				},
			},
		});

		return new Response(
			JSON.stringify({
				success: true,
				products,
			}),
			{status: 200}
		);
	} catch (error) {
		console.error("Error searching products:", error);
		return new Response(
			JSON.stringify({
				success: false,
				message: "Couldn't find the product",
			}),
			{status: 500}
		);
	}
}
