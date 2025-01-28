"use client";
import React, {useEffect, useState} from "react";
import TableWithPagination from "../misc/TableWithPagination";
import OrderTable from "../misc/OrderTable";

const OrderPage = () => {
	const [cartItems, setCartItems] = useState([]);
	const [totalCount, setTotalCount] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [loading, setLoading] = useState(false); // Loading state
	const itemsPerPage = 10;

	useEffect(() => {
		fetchData(currentPage);
	}, [currentPage]);

	const fetchData = async (page) => {
		setLoading(true);
		try {
			const response = await fetch(
				`/api/order?page=${page}&size=${itemsPerPage}`
			);
			const data = await response.json();
			setCartItems(data.orders);
			setTotalCount(data.pagination.totalOrders);
			setTotalPages(data.pagination.totalPages);
		} catch (error) {
			console.error("Error fetching cart items:", error);
		} finally {
			setLoading(false); // End loading
		}
	};

	const handleDelete = async ({id}) => {
		console.log("Deleting item with id:", id);
		try {
			const isConfirmed = window.confirm(
				"Are you sure you want to delete this item?"
			);
	
			if (!isConfirmed) {
				return;
			}

			const response = await fetch(`/api/order`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({id}),
			});

			if (response.status == 200) {
				setCartItems((prevItems) =>
					prevItems.filter((item) => item.id !== id)
				);
				alert("Item deleted successfully");

				console.log("Item deleted successfully");
			} else {
				const errorData = await response.json();
				console.error("Error deleting item:", errorData.message);
				alert("Error deleting item");
			}
		} catch (error) {
			console.error("Error deleting item:", error);
			alert("Error deleting item");
		} 
	};

	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	return (
		<div>
			{loading ? (
				<div>Loading...</div> // Loading indicator
			) : (
				<OrderTable
					data={cartItems}
					totalCount={totalCount}
					totalPages={totalPages}
					currentPage={currentPage}
					itemsPerPage={itemsPerPage}
					onDelete={handleDelete}
					onPageChange={handlePageChange}
				/>
			)}
		</div>
	);
};

export default OrderPage;
