import { authMiddleware } from "@/lib/auth.middlware";

export async function POST(req) {
    const authError = await authMiddleware(req);
    if (authError) return authError;
  
    const { productId, ratingValue, content, user_name } = await req.json();
  
    if (!productId || !ratingValue || !content) {
      return new Response(
        JSON.stringify({ message: "Missing required fields." }),
        { status: 400 }
      );
    }
  
    if (ratingValue < 1 || ratingValue > 5) {
      return new Response(
        JSON.stringify({ message: "Rating value must be between 1 and 5." }),
        { status: 400 }
      );
    }
  
    try {
      const rating = await prisma.rating.create({
        data: {
          value: ratingValue,
          productId: productId,
        },
      });
  
      const review = await prisma.review.create({
        data: {
          content,
          user_name: user_name,
          ratingId: rating.id,
          productId: productId,
        },
      });
  
      const ratings = await prisma.rating.findMany({
        where: { productId: productId },
      });
  
      const averageRating =
        ratings.reduce((acc, rating) => acc + rating.value, 0) / ratings.length;
  
      await prisma.product.update({
        where: { id: productId },
        data: {
          averageRating: averageRating,
        },
      });
  
      return new Response(
        JSON.stringify({ success: true, review, rating }),
        { status: 201 }
      );
    } catch (error) {
      console.error("Error creating review and rating:", error.message);
      return new Response(
        JSON.stringify({ message: "Error creating review and rating.", error: error.message }),
        { status: 500 }
      );
    }
  }
  