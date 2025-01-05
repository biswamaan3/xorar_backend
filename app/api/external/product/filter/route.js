import { prisma } from "../../../../../lib/prisma";

export async function POST(req) {
  const body = await req.json();
  const {
    price_min,
    price_max,
    color,
    size,
    category,
    style,
    subcategories,
    type,
    showHome,
    sort_by, // Unified sorting field
    page = 1,
    size_per_page = 12,
  } = body;

  const skip = (page - 1) * size_per_page;

  // Initialize filters object
  const filters = {};

  // Price range filter
  if (price_min || price_max) {
    filters.price = {};
    if (price_min) filters.price.gte = price_min;
    if (price_max) filters.price.lte = price_max;
  }

  // Color filter
  if (color && Array.isArray(color) && color.length > 0) {
    filters.colors = {
      some: {
        id: { in: color },
      },
    };
  }

  // Size filter
  if (size && Array.isArray(size) && size.length > 0) {
    filters.sizes = {
      some: {
        id: { in: size },
      },
    };
  }

  // Category filter
  if (category && Array.isArray(category) && category.length > 0) {
    filters.categoryId = { in: category };
  }

  // Style filter
  if (style && Array.isArray(style) && style.length > 0) {
    filters.styleId = { in: style };
  }

  // Show on home filter
  if (showHome !== undefined) {
    filters.showOnHome = showHome;
  }

  // Subcategory filter
  if (subcategories && Array.isArray(subcategories) && subcategories.length > 0) {
    filters.subcategories = {
      some: {
        id: { in: subcategories },
      },
    };
  }

  // Type filter
  if (type) {
    filters.type = type;
  }

  // Sorting criteria
  const orderBy = [];
 

  // Unified sorting logic
   
 if (sort_by === "most_popular") {
    orderBy.push({ views: { _count: "desc" } });
  } else if (sort_by === "low_to_high") {
    orderBy.push({ price: "asc" });
  } else if (sort_by === "high_to_low") {
    orderBy.push({ price: "desc" });
  }else{
    orderBy.push({ createdAt: "desc" });
  }

  console.log("Received filters:", JSON.stringify(body, null, 2));

  try {
    const products = await prisma.product.findMany({
      where: filters,
      skip,
      take: size_per_page,
      orderBy: orderBy.length > 0 ? orderBy : undefined,
      include: {
        category: true,
        ratings: true,
        colors: true,
        sizes: true,
      },
    });

    // Count total products for pagination
    const totalProducts = await prisma.product.count({
      where: filters,
    });

    return new Response(
      JSON.stringify({
        success: true,
        totalProducts,
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
    console.error("Error fetching products:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error fetching products.",
        error: error.message || error,
      }),
      { status: 500 }
    );
  }
}
