// app/api/external/products/one/route.js
import {prisma} from "../../../../../lib/prisma"; // Prisma client

export async function GET(req) {

	const url = new URL(req.url);
	const slug = url.searchParams.get("slug");

	if (!slug) {
		return new Response(JSON.stringify({message: "Slug is required."}), {
			status: 400,
		});
	}

	try {
		const product = await prisma.product.findUnique({
			where: {slug},
			include: {
				design: true,
				sizes: true,
				colors: true,
				category: true,
				style: true,
				ratings: true,
				reviews: {
					include: {
						rating: true,
					}
				},
			},
		});

		if (!product) {
			return new Response(
				JSON.stringify({message: "Product not found."}),
				{status: 404}
			);
		}

		await prisma.product.update({
			where: { slug },
			data: {
			  views: product.views + 1,
			},
		  });

		  const averageRating = product.ratings.reduce((acc, rating) => acc + rating.value, 0) / product.ratings.length;
	  
		const recommendedProducts = await prisma.product.findMany({
			where: {
				categoryId: product.categoryId,
				slug: {not: product.slug},
			},
			take: 4,
		});

		return new Response(
			JSON.stringify({
				success: true,
				product,
				recommendedProducts,
				averageRating
			}),
			{
				status: 200,
			}
		);
	} catch (error) {
		return new Response(
			JSON.stringify({message: "Error fetching product.", error}),
			{status: 500}
		);
	}
}
