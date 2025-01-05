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


  // DELETE: Remove an item from the cart
  export async function DELETE(req) {
	try {
	  const { id } = await req.json(); // id of the cart item to be deleted
  
	  const deletedItem = await prisma.addedToCart.delete({
		where: {
		  id: id,
		},
	  });
  
	  return new Response(
		JSON.stringify({
		  message: "Item removed from cart successfully",
		  data: deletedItem,
		}),
		{ status: 200 }
	  );
	} catch (error) {
	  console.error(error);
	  return new Response(
		JSON.stringify({ error: "Failed to remove item from cart" }),
		{ status: 500 }
	  );
	}
  }

  export async function GET(req) {
	try {
	  const url = new URL(req.url);
	  const page = parseInt(url.searchParams.get('page') || '1');
	  const limit = parseInt(url.searchParams.get('limit') || '25');
	  const skip = (page - 1) * limit;  // Calculate skip based on page and limit
  
	  // Fetch cart items with pagination
	  const cartItems = await prisma.addedToCart.findMany({
		skip: skip,
		take: limit,
	  });
  
	  // Get total count of items
	  const totalCount = await prisma.addedToCart.count();
  
	  // Calculate total number of pages
	  const totalPages = Math.ceil(totalCount / limit);
  
	  return new Response(
		JSON.stringify({
		  message: 'Cart items retrieved successfully',
		  data: cartItems,
		  totalCount: totalCount,
		  totalPages: totalPages,
		  currentPage: page,
		  itemsPerPage: limit,
		}),
		{ status: 200 }
	  );
	} catch (error) {
	  console.error(error);
	  return new Response(
		JSON.stringify({ error: 'Failed to fetch cart items' }),
		{ status: 500 }
	  );
	}
  }
  