"use client";
import React, {useEffect, useState} from "react";
import TableWithPagination from "../misc/TableWithPagination";

const WishListPage = () => {
	const [cartItems, setCartItems] = useState([]);
	const [totalCount, setTotalCount] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [loading, setLoading] = useState(false); // Loading state
	const itemsPerPage = 25;

	// Fetch data whenever the current page changes
	useEffect(() => {
		fetchData(currentPage);
	}, [currentPage]);

	const fetchData = async (page) => {
		setLoading(true); // Start loading
		try {
			const response = await fetch(
				`/api/external/product/wishlist?page=${page}&limit=${itemsPerPage}`
			);
			const data = await response.json();
			setCartItems(data.data);
			setTotalCount(data.totalCount);
			setTotalPages(Math.ceil(data.totalCount / itemsPerPage));
		} catch (error) {
			console.error("Error fetching cart items:", error);
		} finally {
			setLoading(false); // End loading
		}
	};

	const handleDelete = async (id) => {
		try {
			const response = await fetch(`/api/external/product/wishlist`, {
				method: "DELETE",
				body: JSON.stringify({id}),
				headers: {"Content-Type": "application/json"},
			});
			const data = await response.json();
			if (data.success) {
				fetchData(currentPage); // Re-fetch data after deletion
			}
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
				<TableWithPagination
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

export default WishListPage;
