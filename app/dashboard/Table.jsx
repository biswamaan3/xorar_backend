import Image from "next/image";
import React, {useState} from "react";

const OrderDetailsTable = ({orderDetails}) => {
	if (!orderDetails) {
		return <div>Loading order details...</div>;
	}
	console.log("Order Details:", orderDetails);

	const [editedData, setEditedData] = useState(null);

	const handleEdit = (id) => {
		const editedRow = orderDetails.find((item) => item.id === id);
		setEditedData(editedRow);
	};

	const handleUpdate = async (id) => {
		try {
			if (!editedData) {
				throw new Error("No data to update");
			}
	
			const response = await fetch(`/api/order/1/edit?id=${editedData.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(editedData),
			});
	
			if (!response.ok) {
				alert("Failed to update order details");
				throw new Error("Failed to update order details");
			}
	
			const updatedDetails = await response.json();
			console.log("Updated Data:", updatedDetails);
	
			setEditedData(null);
	
			// Optionally, refresh or update the orderDetails list here
		} catch (error) {
			console.error("Error updating order:", error);
			// Optionally, handle errors and show an error message to the user
		}
	};
	

	// Function to handle delete
	const handleDelete = async (id) => {
		try {
			const response = await fetch(`/api/order/${id}/delete`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Failed to delete order");
			}

			const updatedDetails = await response.json();
			console.log("Updated Data after Delete:", updatedDetails);
		} catch (error) {
			console.error("Error deleting order:", error);
		}
	};

	return (
		<div className='w-full'>
			<table className='full'>
				<thead className='bg-gray-100'>
					<tr>
						<th className='px-4 py-2 text-left'>Order ID</th>
						<th className='px-4 py-2 text-left'>Product Name</th>
						<th className='px-4 py-2 text-left'>Size</th>
						<th className='px-4 py-2 text-left'>Color</th>
						<th className='px-4 py-2 text-left'>Design</th>

						<th className='px-4 py-2 text-left'>Quantity</th>
						<th className='px-4 py-2 text-left'>Price</th>
						<th className='px-4 py-2 text-left'>Total Price</th>
						<th className='px-4 py-2 text-left'>Actions</th>
					</tr>
				</thead>
				<tbody>
					{orderDetails?.map((order) => (
						<tr key={order.id} className='border-b relative'>
							<td>
								<div className='group relative'>
									{order.orderId}

									<Image
										src={order.product.thumbnail}
										alt={order.productName}
										width={250}
										height={200}
										className='hidden absolute left-10 top-0 rounded-lg object-cover group-hover:block z-[999]'
									/>
								</div>
							</td>
							<td className='px-4 py-2'>
								{editedData?.id === order.id ? (
									<input
										type='text'
										value={editedData.productName}
										onChange={(e) =>
											setEditedData({
												...editedData,
												productName: e.target.value,
											})
										}
										className='px-2 py-1 border border-gray-300 rounded'
									/>
								) : (
									order.productName
								)}
							</td>
							<td className='px-4 py-2'>
								{editedData?.id === order.id ? (
									<input
										type='text'
										value={editedData.sizeId || "N/A"}
										onChange={(e) =>
											setEditedData({
												...editedData,
												sizeId: e.target.value,
											})
										}
										className='px-2 py-1 border border-gray-300 rounded'
									/>
								) : (
									order.size.name || "N/A"
								)}
							</td>

							<td className='px-4 py-2'>
								{editedData?.id === order.id ? (
									<input
										type='text'
										value={editedData.colorId || "N/A"}
										onChange={(e) =>
											setEditedData({
												...editedData,
												colorId: e.target.value,
											})
										}
										className='px-2 py-1 border border-gray-300 rounded'
									/>
								) : (
									<div
										className='w-7 h-7 rounded-full'
										style={{
											backgroundColor: order.color.code,
										}}
									></div>
								)}
							</td>
							<td className='px-4 py-2'>
								{editedData?.id === order.id ? (
									<input
										type='text'
										value={editedData.designId || "N/A"}
										onChange={(e) =>
											setEditedData({
												...editedData,
												designId: e.target.value,
											})
										}
										className='px-2 py-1 border border-gray-300 rounded'
									/>
								) : (
									order.design ? 
									<Image
										src={order?.design?.image || ""}
										alt={order.designId || "N/A"}
										width={50}
										height={50}
									/>
									:
									"N/A"
									
								)}
							</td>
							<td className='px-4 py-2'>
								{editedData?.id === order.id ? (
									<input
										type='number'
										value={editedData.quantity}
										onChange={(e) =>
											setEditedData({
												...editedData,
												quantity: e.target.value,
											})
										}
										className='px-2 py-1 border border-gray-300 rounded'
									/>
								) : (
									order.quantity
								)}
							</td>
							<td className='px-4 py-2'>{order.price}</td>
							<td className='px-4 py-2'>{order.totalPrice}</td>
							<td className='px-4 py-2'>
								{editedData?.id === order.id ? (
									<button
										onClick={() => handleUpdate(order.id)}
										className='text-white bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded'
									>
										Save
									</button>
								) : (
									<button
										onClick={() => handleEdit(order.id)}
										className='text-white bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded'
									>
										Edit
									</button>
								)}
								<button
									onClick={() => handleDelete(order.id)}
									className='text-white bg-red-700 hover:bg-red-800 px-4 py-2 rounded ml-2'
								>
									Delete
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default OrderDetailsTable;
