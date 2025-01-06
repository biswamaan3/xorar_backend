import { prisma } from '../../../../../lib/prisma'; 



export async function POST(req) {
  try {
    const { user_string, productId, productName, quantity, country, city } = await req.json();

   
    const addedToWishlist = await prisma.addedToWishlist.create({
      data: {
        user_string,
        productId,
        productName,
        quantity,
        country,
        city,
      },
    });

    return new Response(JSON.stringify({
      message: 'Item added to wishlist successfully',
      data: addedToWishlist
    }), { status: 201 });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to add item to wishlist' }), { status: 500 });
  }
}


export async function DELETE(req) {
  try {
    const { id } = await req.json(); // id of the wishlist item to be deleted

    const deletedItem = await prisma.addedToWishlist.delete({
      where: {
        id: id,
      },
    });

    return new Response(
      JSON.stringify({
        message: 'Item removed from wishlist successfully',
        data: deletedItem,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: 'Failed to remove item from wishlist' }),
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

    // Fetch wishlist items with pagination
    const wishlistItems = await prisma.addedToWishlist.findMany({
      skip: skip,
      take: limit,
    });

    const totalCount = await prisma.addedToWishlist.count();

    const totalPages = Math.ceil(totalCount / limit);

    return new Response(
      JSON.stringify({
        message: 'Wishlist items retrieved successfully',
        data: wishlistItems,
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
      JSON.stringify({ error: 'Failed to fetch wishlist items' }),
      { status: 500 }
    );
  }
}
