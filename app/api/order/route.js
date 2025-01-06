import { sendOrderConfirmationEmail } from "@/lib/mailer";
import { prisma } from "../../../lib/prisma";
function generateOrderID() {
  const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  let orderID = '';
  for (let i = 0; i < 3; i++) {
    orderID += alphabets.charAt(Math.floor(Math.random() * alphabets.length)); 
  }
  for (let i = 0; i < 3; i++) {
    orderID += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  return orderID;
}


export async function GET(req) {
  try {
    const url = new URL(req.url);
    const size = parseInt(url.searchParams.get('size') || '10', 10);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const skip = (page - 1) * size;

    const orders = await prisma.order.findMany({
      skip,
      take: size,
      orderBy: { createdAt: 'desc' },
      include: {
        orderDetails: {
          include:{
            product:true
          }
        },
        
      },
    });

    const totalOrders = await prisma.order.count();

    return new Response(
      JSON.stringify({
        success: true,
        orders,
        pagination: {
          page,
          size,
          totalOrders,
          totalPages: Math.ceil(totalOrders / size),
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error fetching orders',
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      fullName,
      email,
      address,
      city,
      country,
      state,
      paymentStatus,
      orderDetails,
    } = body;

    if (
      !fullName ||
      !email ||
      !address ||
      !city ||
      !country ||
      !state ||
      !paymentStatus ||
      !Array.isArray(orderDetails) ||
      orderDetails.length === 0
    ) {
      return new Response(
        JSON.stringify({ success: false, message: 'Missing required fields' }),
        { status: 400 }
      );
    }
    const orderID = generateOrderID();


    const newOrder = await prisma.order.create({
      data: {
        orderID,
        fullName,
        email,
        address,
        city,
        country,
        state,
        paymentStatus,
        
        deliveryStatus: "Order Processing",
        orderDetails: {
          create: orderDetails.map((detail) => ({
            productId: detail.productId,
            productName: detail.productName,
            productUrl: detail.productUrl,
            quantity: detail.quantity,
            sizeId: detail.sizeId,
            colorId: detail.colorId,
            price: detail.price,
            totalPrice: detail.quantity * detail.price,
          })),
        },
      },
      include: {
        orderDetails: true, 
      },
    });
    const productIds = orderDetails.map((detail) => detail.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, thumbnail: true },
    });

    const orderDetailsWithThumbnails = orderDetails.map((detail) => {
      const product = products.find((prod) => prod.id === detail.productId);
      return {
        ...detail,
        thumbnail: product?.thumbnail || '',
      };
    });

    sendOrderConfirmationEmail({...newOrder, orderDetailsWithThumbnails});
    return new Response(JSON.stringify({ success: true, order: newOrder }), {
      status: 201,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error creating order',
        error: error.message,
      }),
      { status: 500 }
    );
  }
}


export async function PUT(req) {
  try {
    const referer = req.headers.get('referer');
    const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

    if (!referer || !allowedOrigins.some((origin) => referer.startsWith(origin))) {
      return new Response(JSON.stringify({ message: 'Invalid origin.' }), { status: 403 });
    }

    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return new Response(JSON.stringify({ message: 'Order ID is required.' }), { status: 400 });
    }

    // Check if the order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return new Response(JSON.stringify({ message: 'Order not found.' }), { status: 404 });
    }

    // Prepare data for updating the order
    const orderUpdateData= {};
    const orderDetailUpdates= [];

    // Update fields in the Order model if provided
    if (updateData.fullName) orderUpdateData.fullName = updateData.fullName;
    if (updateData.email) orderUpdateData.email = updateData.email;
    if (updateData.address) orderUpdateData.address = updateData.address;
    if (updateData.city) orderUpdateData.city = updateData.city;
    if (updateData.country) orderUpdateData.country = updateData.country;
    if (updateData.state) orderUpdateData.state = updateData.state;
    if (updateData.paymentStatus) orderUpdateData.paymentStatus = updateData.paymentStatus;
    if (updateData.deliveryStatus) orderUpdateData.deliveryStatus = updateData.deliveryStatus;

    // If orderDetails are provided, validate and prepare updates
    if (updateData.orderDetails && Array.isArray(updateData.orderDetails)) {
      for (const detail of updateData.orderDetails) {
        if (!detail.id) {
          return new Response(
            JSON.stringify({ message: 'Each order detail must have an ID to update.' }),
            { status: 400 }
          );
        }

        orderDetailUpdates.push({
          where: { id: detail.id },
          data: {
            ...(detail.productId && { productId: detail.productId }),
            ...(detail.productName && { productName: detail.productName }),
            ...(detail.productUrl && { productUrl: detail.productUrl }),
            ...(detail.quantity && { quantity: detail.quantity }),
            ...(detail.price && { price: detail.price }),
            ...(detail.totalPrice && { totalPrice: detail.totalPrice }),
          },
        });
      }
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        ...orderUpdateData,
        ...(orderDetailUpdates.length > 0 && {
          orderDetails: {
            update: orderDetailUpdates,
          },
        }),
      },
      include: {
        orderDetails: true,
      },
    });

    return new Response(JSON.stringify({ success: true, order: updatedOrder }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Error updating order.', error: error.message }),
      { status: 500 }
    );
  }
}
