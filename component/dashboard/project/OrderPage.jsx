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

	const handleDelete = async (id) => {
		try {
		return;
		} catch (error) {
			console.error("Error deleting item:", error);
		}
	};

	const handlePageChange = (page) => {
		setCurrentPage(page); // Update the current page state
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
