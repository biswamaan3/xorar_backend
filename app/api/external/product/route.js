import { prisma } from '../../../../lib/prisma'; 

export async function GET(req) { 
  const referer = req.headers.get('referer');
  const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

  if (!referer || !allowedOrigins.some(origin => referer.startsWith(origin))) {
    return new Response(JSON.stringify({ message: 'Invalid origin.' }), { status: 403 });
  }

  const url = new URL(req.url);
  const size = parseInt(url.searchParams.get('size'), 10) || 10; 
  const page = parseInt(url.searchParams.get('page'), 10) || 1;
  const skip = (page - 1) * size;

  const category = url.searchParams.get('category');
  const style = url.searchParams.get('style');
  const sizes = url.searchParams.get('sizes')?.split(','); 
  const colors = url.searchParams.get('colors')?.split(',');
  const includeReviews = url.searchParams.get('reviews') === 'true';
  const includeRatings = url.searchParams.get('ratings') === 'true';
  const includeDiscount = url.searchParams.get('discount') === 'true';

  try {
    const filters = {};

    if (category) {
      filters.categoryId = parseInt(category, 10); 
    }
    if (style) {
      filters.styleId = parseInt(style, 10); // Assuming style is passed as ID
    }
    if (sizes && sizes.length > 0) {
      filters.sizes = {
        some: {
          name: { in: sizes },
        },
      };
    }
    if (colors && colors.length > 0) {
      filters.colors = {
        some: {
          name: { in: colors },
        },
      };
    }

    // Fetch products with applied filters
    const products = await prisma.product.findMany({
      where: filters,
      skip,
      take: size,
      include: {
        sizes: true,
        colors: true,
        category: true,
        style: true,
        ...(includeReviews && { Review: true }), // Include reviews if `reviews` is true
        ...(includeRatings && { Rating: true }), // Include ratings if `ratings` is true
        ...(includeDiscount && { discount_percent: true }), // Include discount if `discount` is true
      },
    });

    const totalProducts = await prisma.product.count({
      where: filters,
    });

    return new Response(
      JSON.stringify({
        success: true,
        products,
        pagination: {
          page,
          size,
          totalProducts,
          totalPages: Math.ceil(totalProducts / size),
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error fetching products.', error: error.message }), { status: 500 });
  }
}


