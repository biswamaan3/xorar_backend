import {authMiddleware} from "@/lib/auth.middlware";
import {prisma} from "../../../../lib/prisma"; // Prisma client

export async function POST(req) {
	const authError = await authMiddleware(req);
	if (authError) return authError;

	const {type, name, colorCode} = await req.json();

	if (!type || !name) {
		return new Response(
			JSON.stringify({message: "Missing required fields"}),
			{status: 400}
		);
	}

	try {
		let property;
		if (type === "color") {
			property = await prisma.color.create({
				data: {name, code: colorCode},
			});
		} else if (type === "size") {
			property = await prisma.size.create({
				data: {name},
			});
		} else if (type === "style") {
			property = await prisma.style.create({
				data: {name},
			});
		} else if (type === "category") {
			property = await prisma.category.create({
				data: {name},
			});
		} else {
			return new Response(JSON.stringify({message: "Invalid type"}), {
				status: 400,
			});
		}

		return new Response(JSON.stringify({success: true, property}), {
			status: 200,
		});
	} catch (error) {
		console.error(error);
		return new Response(
			JSON.stringify({message: "Error adding property"}),
			{status: 500}
		);
	}
}

export async function DELETE(req) {
	const authError = await authMiddleware(req);
	if (authError) return authError;

	const {type, id} = await req.json();

	if (!type || !id) {
		return new Response(
			JSON.stringify({message: "Missing required fields"}),
			{status: 400}
		);
	}

	try {
		let property;
		if (type === "color") {
			property = await prisma.color.delete({
				where: {id},
			});
		} else if (type === "size") {
			property = await prisma.size.delete({
				where: {id},
			});
		} else if (type === "style") {
			property = await prisma.style.delete({
				where: {id},
			});
		} else {
			return new Response(JSON.stringify({message: "Invalid type"}), {
				status: 400,
			});
		}

		return new Response(JSON.stringify({success: true, property}), {
			status: 200,
		});
	} catch (error) {
		console.error(error);
		return new Response(
			JSON.stringify({message: "Error deleting property"}),
			{status: 500}
		);
	}
}

export async function PUT(req) {
	const authError = await authMiddleware(req);
	if (authError) return authError;

	const {type, id, name, colorCode} = await req.json();

	if (!type || !id || !name) {
		return new Response(
			JSON.stringify({message: "Missing required fields"}),
			{status: 400}
		);
	}

	try {
		let property;
		if (type === "color") {
			property = await prisma.color.update({
				where: {id},
				data: {name, code: colorCode},
			});
		} else if (type === "size") {
			property = await prisma.size.update({
				where: {id},
				data: {name},
			});
		} else if (type === "style") {
			property = await prisma.style.update({
				where: {id},
				data: {name},
			});
		} else {
			return new Response(JSON.stringify({message: "Invalid type"}), {
				status: 400,
			});
		}

		return new Response(JSON.stringify({success: true, property}), {
			status: 200,
		});
	} catch (error) {
		console.error(error);
		return new Response(
			JSON.stringify({message: "Error updating property"}),
			{status: 500}
		);
	}
}

export async function GET(req) {
	const {searchParams} = new URL(req.url);
	const type = searchParams.get("type").toLowerCase();

	if (!type) {
		return new Response(JSON.stringify({message: "Type is required"}), {
			status: 400,
		});
	}

	try {
		let properties;
		if (type === "all") {
			let priceRange = null;

			const [colors, sizes, styles, categories, priceData] =
				await Promise.all([
					prisma.color.findMany(),
					prisma.size.findMany(),
					prisma.style.findMany(),
					prisma.category.findMany(),
					prisma.product.aggregate({
						_min: {price: true},
						_max: {price: true},
					}),
				]);

			// If priceData exists, extract min and max price
			if (
				priceData._min.price !== null &&
				priceData._max.price !== null
			) {
				priceRange = {
					min: priceData._min.price,
					max: priceData._max.price,
				};
			}

			properties = {colors, sizes, styles, categories, priceRange};
		} else if (type === "color") {
			properties = await prisma.color.findMany();
		} else if (type === "size") {
			properties = await prisma.size.findMany();
		} else if (type === "style") {
			properties = await prisma.style.findMany();
		} else if (type === "category") {
			properties = await prisma.category.findMany();
		} else {
			return new Response(JSON.stringify({message: "Invalid type"}), {
				status: 400,
			});
		}

		return new Response(JSON.stringify({success: true, properties}), {
			status: 200,
		});
	} catch (error) {
		console.error(error);
		return new Response(
			JSON.stringify({message: "Error fetching properties"}),
			{status: 500}
		);
	}
}
