// app/api/external/products/one/route.js
import { prisma } from "../../../../../lib/prisma"; // Prisma client

export async function GET(req) {
  const referer = req.headers.get('referer');
  const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

  // if (!referer || !allowedOrigins.some(origin => referer.startsWith(origin))) {
  //   return new Response(JSON.stringify({ message: 'Invalid origin.' }), { status: 403 });
  // }


  const url = new URL(req.url);
  const slug = url.searchParams.get('slug');

  if (!slug) {
    return new Response(JSON.stringify({ message: 'Slug is required.' }), { status: 400 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        sizes: true,
        colors: true,
        category: true,
        style: true
      }
    });

    if (!product) {
      return new Response(JSON.stringify({ message: 'Product not found.' }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, product }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error fetching product.', error }), { status: 500 });
  }
}
