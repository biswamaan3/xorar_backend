export async function GET(req, res) {
    try {
      const { productId } = req.json();
  
      if (!productId) {
        return res.status(400).json({ success: false, error: 'Product ID is required' });
      }
  
      const reviews = await prisma.review.findMany({
        where: {
          productId: parseInt(productId), 
        },
        include: {
          rating: true,
        },
      });
  
      if (reviews.length === 0) {
        return res.status(404).json({ success: false, message: 'No reviews found for this product' });
      }
  
      res.status(200).json({ success: true, reviews });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Internal server error', details: error.message });
    }
  }