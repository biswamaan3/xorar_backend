import { prisma } from '../../../../lib/prisma'; // Prisma client

export async function POST(req) {
  const referer = req.headers.get('referer');
  const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

  if (!referer || !allowedOrigins.some(origin => referer.startsWith(origin))) {
    return new Response(JSON.stringify({ message: 'Invalid origin.' }), { status: 403 });
  }

  const { price_min, price_max, color, size, category, subcategories, type, showHome, recently_added, most_popular, page = 1, size_per_page = 10 } = await req.json();

  const skip = (page - 1) * size_per_page;

  // Build the filter criteria
  const filters = {};

  if (price_min || price_max) {
    filters.price = { gte: price_min || 0, lte: price_max || Infinity };
  }
  if (color) {
    filters.colors = { has: color }; // Color is an array, so we check for its existence
  }
  if (size) {
    filters.size = size; // Size is a single value, not an array in your schema
  }
  if (category) {
    filters.categoryId = category; // Category is an ID reference
  }
  if(showHome){
    filters.showOnHome = showHome;
  }
  if (subcategories && subcategories.length > 0) {
    filters.subcategories = {
      some: {
        id: { in: subcategories }, // Filtering based on subcategory IDs
      },
    };
  }
  if (type) {
    filters.type = type; // Product type filter
  }

  // Sorting logic
  let orderBy = {};

  if (recently_added) {
    orderBy.createdAt = 'desc'; // Sort by most recent
  }

  if (most_popular) {
    orderBy.ratings = { _count: 'desc' }; // Sort by ratings count (most popular)
  }

  try {
    // Fetch filtered and sorted products
    const products = await prisma.product.findMany({
      where: filters,
      skip,
      take: size_per_page,
      orderBy: orderBy,
      include: {
        category: true,  // Include category data in the result
        subcategories: true, // Include subcategories
        ratings: true, // Include ratings for popularity
        reviews: true, // Include reviews
      },
    });

    // Get the total count of products based on filters
    const totalProducts = await prisma.product.count({
      where: filters,
    });

    return new Response(
      JSON.stringify({
        success: true,
        products,
        pagination: {
          page,
          size: size_per_page,
          totalProducts,
          totalPages: Math.ceil(totalProducts / size_per_page),
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error fetching products.' }), { status: 500 });
  }
}
