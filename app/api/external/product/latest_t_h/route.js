import { prisma } from "../../../../../lib/prisma";


export async function GET() {
  try {
    // Fetch the latest 4 t-shirts and 4 hoodies
    const tShirts = await prisma.product.findMany({
      where: {
        category: {
            name: "T-Shirt",
        },
      },
      take: 4,
      orderBy: {
        createdAt: "desc", // Order by creation date descending (latest first)
      },
    });

    const hoodies = await prisma.product.findMany({
      where: {
        category: {
          name: "Hoodies", // Assuming category name is Hoodie
        },
      },
      take: 4, // Limit to the latest 4 products
      orderBy: {
        createdAt: "desc", // Order by creation date descending (latest first)
      },
    });

    // Combine the results and return them
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          tShirts,
          hoodies,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error fetching products",
      }),
      { status: 500 }
    );
  }
}
