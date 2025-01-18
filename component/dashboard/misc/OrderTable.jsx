"use client";
import React from "react";
import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Button,
	Pagination,
	Tooltip,
} from "@nextui-org/react";
import { DeleteIcon, EditIcon, EyeIcon } from "lucide-react";
import Link from "next/link";

const OrderTable = ({
	data,
	totalCount,
	totalPages,
	currentPage,
	itemsPerPage,
	onDelete,
	onPageChange,
}) => {
	const handleDelete = async (id) => {
		const isConfirmed = window.confirm(
			"Are you sure you want to delete this item?"
		);

		if (!isConfirmed) {
			return;
		}

		try {
			await onDelete(id);
			alert("Item deleted successfully");
		} catch (error) {
			console.error(error);
			alert("Failed to delete item");
		}
	};

	const handlePageChange = (page) => {
		onPageChange(page);
	};

	return (
		<div className="bg-white text-black">
			<Table aria-label="Cart or Wishlist Items">
				<TableHeader>
					<TableColumn>OrderID</TableColumn>
					<TableColumn>Customer Name</TableColumn>
					<TableColumn>Email</TableColumn>
					<TableColumn>Payment Type</TableColumn>
					<TableColumn>Payment Status</TableColumn>
					<TableColumn>Delivery Status</TableColumn>
					<TableColumn>Order Date</TableColumn>
					<TableColumn>Actions</TableColumn>
				</TableHeader>
				<TableBody>
					{data.map((item) => (
						<TableRow key={item.id}>
							<TableCell>{item.orderID || "1"}</TableCell>
							<TableCell>{item.fullName}</TableCell>
							<TableCell>{item.email}</TableCell>
							<TableCell>{item.paymentType}</TableCell>
							<TableCell>{item.paymentStatus}</TableCell>
							<TableCell>{item.deliveryStatus}</TableCell>
							<TableCell>
								{new Date(item.createdAt).toLocaleString()}
							</TableCell>
							<TableCell>
								<div className="relative flex items-center gap-2">
									<Link
										className="cursor-pointer"
										href={`/dashboard/orders/${item.id}`}
									>
										<Tooltip content="View product">
											<span className="text-lg text-default-400 cursor-pointer active:opacity-50">
												<EyeIcon />
											</span>
										</Tooltip>
									</Link>
									<Tooltip
										color="danger"
										content="Delete product"
									>
										<span
											onClick={() =>
												handleDelete(item.id)
											}
											className="text-lg text-danger cursor-pointer active:opacity-50"
										>
											<DeleteIcon />
										</span>
									</Tooltip>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			{/* Pagination component */}
			<div className="flex mt-10 justify-center">
				<Pagination
					total={totalPages}
					initialPage={currentPage}
					onChange={handlePageChange}
					aria-label="Pagination"
				/>
			</div>
		</div>
	);
};

export default OrderTable;
