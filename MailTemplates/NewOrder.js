export const NewOrder = ({
	fullName,
	address,
	city,
	state,
	country,
	email,
	orderDetails,
	paymentStatus,
	deliveryStatus,
}) => {
	return `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Xorar</h2>
        <p>Dear ${fullName},</p>
        <p>Thank you for your order! Here are your order details:</p>
        <h3>Shipping Information</h3>
        <p>
          <strong>Address:</strong> ${address}, ${city}, ${state}, ${country}<br>
          <strong>Email:</strong> ${email}
        </p>
        <h3>Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px;">Thumbnail</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Product</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Price</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${orderDetails
				.map(
					(detail) => `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">
                    <img src="${detail.thumbnail}" alt="${
						detail.productName
					}" style="width: 50px; height: 50px; object-fit: cover;" />
                  </td>
                  <td style="border: 1px solid #ddd; padding: 8px;">
                    <a href="${detail.productUrl}" target="_blank">${
						detail.productName
					}</a>
                  </td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${
						detail.quantity
					}</td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">₹ ${detail.price.toFixed(
						2
					)}</td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">₹ ${(
						detail.quantity * detail.price
					).toFixed(2)}</td>
                </tr>
              `
				)
				.join("")}
          </tbody>
        </table>
        <h3>Order Details</h3>
        <p>
          <strong>Payment Status:</strong> ${paymentStatus}<br>
          <strong>Delivery Status:</strong> ${deliveryStatus}
        </p>
        <p>If you have any questions about your order, feel free to contact us.</p>
        <p>Best regards,<br>Your Company</p>
      </div>
    `;
};




export const OwnerOrderDetails = ({
  fullName,
  email,
  address,
  city,
  state,
  country,
  orderDetails,
  paymentStatus,
  deliveryStatus,
}) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>New Order Received</h2>
      <p>A new order has been placed by <strong>${fullName}</strong> (<a href="mailto:${email}">${email}</a>).</p>
      <h3>Shipping Information</h3>
      <p>
        <strong>Address:</strong> ${address}, ${city}, ${state}, ${country}
      </p>
      <h3>Order Summary</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px;">Product</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Price</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${orderDetails
            .map(
              (detail) => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  ${detail.productName}
                </td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">
                  ${detail.quantity}
                </td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">
                  ₹ ${detail.price.toFixed(2)}
                </td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">
                  ₹ ${(detail.quantity * detail.price).toFixed(2)}
                </td>
              </tr>
            `
            )
            .join('')}
        </tbody>
      </table>
      <h3>Order Details</h3>
      <p>
        <strong>Payment Status:</strong> ${paymentStatus}<br>
        <strong>Delivery Status:</strong> ${deliveryStatus}
      </p>
      <p>Please review the order in the admin panel for further processing.</p>
      <p>Best regards,<br>Your Team</p>
    </div>
  `;
};
