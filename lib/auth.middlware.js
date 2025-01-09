import jwt from "jsonwebtoken";
import {prisma} from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET;

export const authMiddleware = async (req) => {
	const token = req.headers.get("Authorization")?.split(" ")[1];

	if (!token) {
		return new Response(
			JSON.stringify({message: "Authentication token is required."}),
			{status: 401}
		);
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET);

		const user = await prisma.user.findUnique({
			where: {id: decoded.userId},
		});

		if (!user) {
			return new Response(JSON.stringify({message: "User not found."}), {
				status: 401,
			});
		}

		req.user = user;

		return null;
	} catch (error) {
		return new Response(
			JSON.stringify({message: "Invalid or expired token. Login Again"}),
			{status: 401}
		);
	}
};
