"use client";
import React, {useState, useEffect} from "react";
import OrderDetailsTable from "./Table";
import {PageHeader} from "@/component/text";

// Reusable Input Component
const EditableInput = ({
	label,
	id,
	value,
	onChange,
	isEditing,
	onToggleEdit,
	onSave,
}) => {
	return (
		<div>
			<label
				htmlFor={id}
				className='block mb-2 text-sm font-medium text-gray-900 no-theme:text-white'
			>
				{label}
			</label>
			{isEditing === id ? (
				<div className='relative'>
					<input
						type='text'
						id={id}
						name={id}
						className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 no-theme:bg-gray-700 no-theme:border-gray-600 no-theme:placeholder-gray-400 no-theme:text-white no-theme:focus:ring-blue-500 no-theme:focus:border-blue-500'
						value={value}
						onChange={onChange}
					/>
					<button
						className='text-white absolute end-2.5 bottom-1 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 no-theme:bg-blue-600 no-theme:hover:bg-blue-700 no-theme:focus:ring-blue-800'
						onClick={() => onSave(id, value)} // Call onSave when clicked
					>
						Save
					</button>
				</div>
			) : (
				<span
					onClick={() => onToggleEdit(id)}
					className='cursor-pointer'
				>
					{value}
				</span>
			)}
		</div>
	);
};

const OrderDetailsForm = ({data}) => {
	if (!data) {
		return <div>Loading order details...</div>;
	}

	const [isEditing, setIsEditing] = useState(null); // Track which field is being edited
	const [orderDetails, setOrderDetails] = useState({
		fullName: data?.fullName || "No Name",
		email: data?.email || "No Email",
		country: data?.country || "No Country", // Default to "No Country" if country is not provided
		phone: data?.phone || "No Phone Number", // Default to "No Phone Number" if phone is not provided
		address: data?.address || "No Address", // Default to "No Address" if address is not provided
		city: data?.city || "No City", // Default to "No City" if city is not provided
		landmark: data?.landmark || "No Landmark",
		state: data?.state || "No State", // Default to "No State" if state is not provided
		pinCode: data?.pinCode || "No Pin Code", // Default to "No Pin Code" if pinCode is not provided
		paymentStatus: data?.paymentStatus || "No Payment Status", // Default to "No Payment Status" if paymentStatus is not provided
		deliveryStatus: data?.deliveryStatus || "No Delivery Status", // Default to "No Delivery Status" if deliveryStatus is not provided
	});

	const handleEditToggle = (id) => {
		setIsEditing(isEditing === id ? null : id); // Toggle editing mode for the clicked field
	};

	const handleChange = (e) => {
		const {id, value} = e.target;
		setOrderDetails({
			...orderDetails,
			[id]: value,
		});
	};

	const handleSave = async (id, value) => {
		setOrderDetails({
			...orderDetails,
			[id]: value,
		});
		try {
			const response = await fetch(`/api/order/1/edit?id=${data.id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					[id]: value,
				}),
			});

			if (response.ok) {
				console.log("Order updated successfully");
			} else {
				console.error("Failed to update order");
			}
		} catch (error) {
			console.error("Error updating order:", error);
		}
		setIsEditing(null);
	};

	return (
		<div className='w-4/5'>
			<PageHeader
				title='Order Details'
				backbutton={"/dashboard/orders"}
			/>
			<div>
				<div className='grid gap-6 mb-6 md:grid-cols-2'>
					<EditableInput
						label='Full Name'
						id='fullName'
						value={orderDetails.fullName}
						onChange={handleChange}
						isEditing={isEditing}
						onToggleEdit={handleEditToggle}
						onSave={handleSave}
					/>
					<EditableInput
						label='Email'
						id='email'
						value={orderDetails.email}
						onChange={handleChange}
						isEditing={isEditing}
						onToggleEdit={handleEditToggle}
						onSave={handleSave}
					/>
					<EditableInput
						label='Phone number'
						id='phone'
						value={orderDetails.phone}
						onChange={handleChange}
						isEditing={isEditing}
						onToggleEdit={handleEditToggle}
						onSave={handleSave}
					/>
				</div>

				<h1 className='text-2xl font-semibold mb-6'>Address Details</h1>
				<div className='w-full mb-6'>
					<EditableInput
						label='Address'
						id='address'
						value={orderDetails.address}
						onChange={handleChange}
						isEditing={isEditing}
						onToggleEdit={handleEditToggle}
						onSave={handleSave}
					/>
				</div>

				<div className='grid grid-cols-1 gap-6 mb-6 md:grid-cols-2'>
					<EditableInput
						label='City'
						id='city'
						value={orderDetails.city}
						onChange={handleChange}
						isEditing={isEditing}
						onToggleEdit={handleEditToggle}
						onSave={handleSave}
					/>
					<EditableInput
						label='State'
						id='state'
						value={orderDetails.state}
						onChange={handleChange}
						isEditing={isEditing}
						onToggleEdit={handleEditToggle}
						onSave={handleSave}
					/>
					<EditableInput
						label='Country'
						id='country'
						value={orderDetails.country}
						onChange={handleChange}
						isEditing={isEditing}
						onToggleEdit={handleEditToggle}
						onSave={handleSave}
					/>
					<EditableInput
						label='Pin Code'
						id='pinCode'
						value={orderDetails.pinCode}
						onChange={handleChange}
						isEditing={isEditing}
						onToggleEdit={handleEditToggle}
						onSave={handleSave}
					/>
				</div>
				<div className='w-full mb-6'>
					<EditableInput
						label='Landmark'
						id='landmark'
						value={orderDetails.landmark}
						onChange={handleChange}
						isEditing={isEditing}
						onToggleEdit={handleEditToggle}
						onSave={handleSave}
					/>
				</div>

				<h1 className='text-2xl font-semibold mb-6'>
					Payment and Delivery
				</h1>
				<div className='grid grid-cols-1 gap-6 mb-6 md:grid-cols-2'>
					<EditableInput
						label='Payment Status'
						id='paymentStatus'
						value={orderDetails.paymentStatus}
						onChange={handleChange}
						isEditing={isEditing}
						onToggleEdit={handleEditToggle}
						onSave={handleSave}
					/>
					<EditableInput
						label='Delivery Status'
						id='deliveryStatus'
						value={orderDetails.deliveryStatus}
						onChange={handleChange}
						isEditing={isEditing}
						onToggleEdit={handleEditToggle}
						onSave={handleSave}
					/>
				</div>

				<h1 className='text-2xl font-semibold mb-6'>
					Products Ordered
				</h1>

				<OrderDetailsTable orderDetails={data?.orderDetails} />

				<button className='mt-10 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center no-theme:bg-blue-600 no-theme:hover:bg-blue-700 no-theme:focus:ring-blue-800'>
					Submit
				</button>
			</div>
		</div>
	);
};

export default OrderDetailsForm;
