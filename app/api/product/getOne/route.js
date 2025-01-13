import { prisma } from '@/lib/prisma';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const productId = url.searchParams.get('id');

    if (!productId) {
      return new Response(JSON.stringify({ success: false, message: 'Product ID is required' }), {
        status: 400,
      });
    }

    // Fetch the product details based on the ID
    const product = await prisma.product.findUnique({
      where: { id: Number(productId) },
      include: {
        design: true,
        category: true,
        style: true,
        sizes: true,
        colors: true,
      },
    });

    if (!product) {
      return new Response(JSON.stringify({ success: false, message: 'Product not found' }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ success: true, product }), { status: 200 });
  } catch (error) {
    console.error('Error fetching product:', error.message);
    return new Response(JSON.stringify({ message: 'Error fetching product' }), { status: 500 });
  }
}
