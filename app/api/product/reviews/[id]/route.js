export async function GET(req, res) {
    const { id } = req.query;
  
    if (!id) {
      return res.status(400).json({ error: 'Invalid review ID' });
    }
  
    try {
      const review = await prisma.review.findUnique({
        where: { id: parseInt(id, 10) },
        include: {
          rating: true,
          product: true,
        },
      });
  
      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }
  
      res.status(200).json({ success: true, review });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  }
  
  export async function PUT(req, res) {
    const { id } = req.query;
    const { user_name, content, ratingId } = req.body;
  
    if (!id) {
      return res.status(400).json({ error: 'Invalid review ID' });
    }
  
    try {
      const updatedReview = await prisma.review.update({
        where: { id: parseInt(id, 10) },
        data: {
          user_name,
          content,
          ratingId,
        },
      });
  
      res.status(200).json({ success: true, review: updatedReview });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update review', details: error.message });
    }
  }
  
  export async function DELETE(req, res) {
    const { id } = req.query;
  
    if (!id) {
      return res.status(400).json({ error: 'Invalid review ID' });
    }
  
    try {
      await prisma.review.delete({
        where: { id: parseInt(id, 10) },
      });
  
      res.status(200).json({ success: true, message: 'Review deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete review', details: error.message });
    }
  }