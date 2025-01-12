// app/api/products/route.js
import {authMiddleware} from "../../../lib/auth.middlware";
import {prisma} from "../../../lib/prisma";
import {slugify} from "../../../lib/slugify"; // Helper function to create slugs

export async function GET(req) {
	try {
		const products = await prisma.product.findMany({
			include: {
				category: true,
				style: true,
				sizes: true,
				colors: true,
			},
		});

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

export async function POST(req) {
	const authError = await authMiddleware(req);
	if (authError) return authError;
	console.log("data", req.body);
	const {
		title,
		category,
		sizes,
		colors,
		designs,
		description,
		price,
		style,
		actualPrice,
		discountedPrice,
		discount,
		images,
		showOnHome,
	} = await req.json();

	if (
		!title ||
		!category ||
		!sizes ||
		!colors ||
		!images ||
		images.length === 0
	) {
		return new Response(
			JSON.stringify({message: "Missing required fields or images."}),
			{status: 400}
		);
	}

	try {
		let slug = slugify(title);

		let uniqueSlug = slug;
		let existingProduct = await prisma.product.findUnique({
			where: {slug: uniqueSlug},
		});

		let counter = 1;
		while (existingProduct) {
			uniqueSlug = `${slug}-${counter}`;
			existingProduct = await prisma.product.findUnique({
				where: {slug: uniqueSlug},
			});
			counter++;
		}

		const categoryObj = await prisma.category.findUnique({
			where: {id: category},
		});
		const styleObj = await prisma.style.findUnique({where: {id: style}});
		if (!categoryObj || !styleObj) {
			return new Response(
				JSON.stringify({message: "Invalid category or style."}),
				{status: 400}
			);
		}

		const sizeObjs = await prisma.size.findMany({
			where: {
				id: {in: sizes},
			},
		});

		if (sizeObjs.length !== sizes.length) {
			return new Response(
				JSON.stringify({message: "One or more sizes are invalid."}),
				{status: 400}
			);
		}

		const colorIds = await prisma.color.findMany({
			where: {
				id: {in: colors},
			},
			select: {id: true},
		});

		if (colorIds.length !== colors.length) {
			return new Response(
				JSON.stringify({message: "One or more colors are invalid."}),
				{status: 400}
			);
		}

		const thumbnail = images[0];
		const productImages = images.slice(1);
		let designConnections = [];
		if (designs && designs.length > 0) {
			for (const designUrl of designs) {
				const design = await prisma.design.upsert({
					where: {image: designUrl},
					update: {},
					create: {image: designUrl},
				});
				designConnections.push({id: design.id});
			}
		}

		const product = await prisma.product.create({
			data: {
				title,
				categoryId: categoryObj.id,
				styleId: styleObj.id,

				sizes: {
					connect: sizeObjs.map((size) => ({id: size.id})),
				},
				colors: {
					connect: colorIds.map((color) => ({id: color.id})),
				},
				designs: {
					connect: designConnections,
				},
				description,
				price,
				actual_price: actualPrice,
				discounted_price: discountedPrice,
				discount_percent: discount,
				slug: uniqueSlug,
				views: 0,
				averageRating: 0,
				thumbnail,
				showOnHome: showOnHome || false,
				images: productImages,
			},
		});

		return new Response(JSON.stringify({success: true, product}), {
			status: 201,
		});
	} catch (error) {
		console.error("Error creating product:", error.message);
		return new Response(
			JSON.stringify({
				message: "Error creating product.",
				error: error.message,
			}),
			{status: 500}
		);
	}
}

export async function PUT(req) {
	const authError = await authMiddleware(req);
	if (authError) return authError;

	const {id, ...updateData} = await req.json();

	if (!id) {
		return new Response(
			JSON.stringify({message: "Product ID is required for update."}),
			{status: 400}
		);
	}

	if (Object.keys(updateData).length === 0) {
		return new Response(
			JSON.stringify({message: "No fields provided to update."}),
			{status: 400}
		);
	}

	try {
		// Validate if category, size, style, or colors need to be updated
		if (updateData.category) {
			const categoryObj = await prisma.category.findUnique({
				where: {id: updateData.category},
			});
			if (!categoryObj) {
				return new Response(
					JSON.stringify({message: "Invalid category name."}),
					{status: 400}
				);
			}
			updateData.categoryId = categoryObj.id;
			delete updateData.category;
		}

		if (updateData.sizes) {
			const sizeObj = await prisma.size.findMany({
				where: {id: {in: updateData.sizes}},
			});
			if (sizeObj.length !== updateData.sizes.length) {
				return new Response(
					JSON.stringify({message: "One or more sizes are invalid."}),
					{status: 400}
				);
			}
			updateData.sizes = {
				connect: sizeObj.map((size) => ({id: size.id})),
			};
		}

		if (updateData.style) {
			const styleObj = await prisma.style.findUnique({
				where: {id: updateData.style},
			});
			if (!styleObj) {
				return new Response(
					JSON.stringify({message: "Invalid style name."}),
					{status: 400}
				);
			}
			updateData.styleId = styleObj.id;
			delete updateData.style;
		}

		if (updateData.colors) {
			const colorIds = await prisma.color.findMany({
				where: {id: {in: updateData.colors}},
				select: {id: true},
			});
			if (colorIds.length !== updateData.colors.length) {
				return new Response(
					JSON.stringify({
						message: "One or more colors are invalid.",
					}),
					{status: 400}
				);
			}
			updateData.colors = {
				connect: colorIds.map((color) => ({id: color.id})),
			};
		}
		const IntID = parseInt(id, 10);
		const product = await prisma.product.update({
			where: {id: IntID},
			data: updateData,
		});

		return new Response(JSON.stringify({success: true, product}), {
			status: 200,
		});
	} catch (error) {
		console.error("Error updating product:", error.message);
		return new Response(
			JSON.stringify({
				message: "Error updating product.",
				error: error.message,
			}),
			{status: 500}
		);
	}
}

export async function DELETE(req) {
	const authError = await authMiddleware(req);
	if (authError) return authError;

	const {id} = await req.json();

	if (!id) {
		return new Response(
			JSON.stringify({message: "Product ID is required to delete."}),
			{status: 400}
		);
	}

	try {
		const product = await prisma.product.delete({
			where: {id},
		});

		return new Response(
			JSON.stringify({
				success: true,
				message: "Product deleted successfully.",
			}),
			{status: 200}
		);
	} catch (error) {
		console.error("Error deleting product:", error.message);
		return new Response(
			JSON.stringify({message: "Error deleting product."}),
			{status: 500}
		);
	}
}
