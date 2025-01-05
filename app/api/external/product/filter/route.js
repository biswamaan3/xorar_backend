import { prisma } from "../../../../../lib/prisma";

export async function POST(req) {
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
    recently_added,
    most_popular,
    page = 1,
    size_per_page = 10,
  } = await req.json();

  const skip = (page - 1) * size_per_page;

  const filters = {};

  if (price_min !== undefined || price_max !== undefined) {
    filters.price = {};
    if (price_min !== undefined) filters.price.gte = price_min;
    if (price_max !== undefined) filters.price.lte = price_max;
  }

  if (color && Array.isArray(color) && color.length > 0) {
    filters.colors = {
      some: {
        id: { in: color },
      },
    };
  }

  if (size && Array.isArray(size) && size.length > 0) {
    filters.sizes = {
      some: {
        id: { in: size },
      },
    };
  }

  if (category && Array.isArray(category) && category.length > 0) {
    filters.categoryId = { in: category }; 
  }

  if (style && Array.isArray(style) && style.length > 0) {
    filters.styleId = { in: style };
  }

  if (showHome !== undefined) {
    filters.showOnHome = showHome;
  }

  if (subcategories && Array.isArray(subcategories) && subcategories.length > 0) {
    filters.subcategories = {
      some: {
        id: { in: subcategories },
      },
    };
  }

  if (type) {
    filters.type = type;
  }

  const orderBy = [];
  if (recently_added) {
    orderBy.push({ createdAt: 'desc' });
  }
  if (most_popular) {
    orderBy.push({ ratings: { _count: 'desc' } });
  }

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
        sizes: true
      },
    });

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
    return new Response(
      JSON.stringify({
        message: 'Error fetching products.',
        error: error.message || error,
      }),
      { status: 500 }
    );
  }
}
