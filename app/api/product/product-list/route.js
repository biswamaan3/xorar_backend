import {prisma} from "../../../../lib/prisma";

export async function GET(req) {
	try {
		const products = await prisma.product.findMany();

		return new Response(JSON.stringify({success: true, products}), {
			status: 200,
		});
	} catch (error) {
		console.error("Error fetching products:", error.message);
		return new Response(
			JSON.stringify({message: "Error fetching products"}),
			{status: 500}
		);
	}
}
