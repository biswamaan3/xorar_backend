"use client"
import React, { useState, useEffect } from "react";

export default function EmailTable() {
	const [emails, setEmails] = useState([]);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Fetch emails from the API
	const fetchEmails = async (pageNumber = 1) => {
		setLoading(true);
		setError(null);

		try {
			const response = await fetch(`/api/external/email?page=${pageNumber}&size=200`);
			const data = await response.json();

			if (data.success) {
				setEmails(data.subscribers);
			} else {
				setError(data.message || "Failed to fetch emails.");
			}
		} catch (err) {
			setError("An error occurred while fetching emails.");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	// Handle page change
	const handlePageChange = (newPage) => {
		setPage(newPage);
		fetchEmails(newPage);
	};

	// Fetch emails on component mount and when the page changes
	useEffect(() => {
		fetchEmails(page);
	}, [page]);

	return (
		<div className="container mx-auto p-6">

			{loading ? (
				<p className="text-gray-500">Loading...</p>
			) : error ? (
				<p className="text-red-500">{error}</p>
			) : (
				<div className="overflow-x-auto">
					<table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
						<thead className="bg-gray-100">
							<tr>
								<th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
									ID
								</th>
								<th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
									Email
								</th>
								<th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
									Created At
								</th>
							</tr>
						</thead>
						<tbody>
							{emails.map((subscriber, index) => (
								<tr
									key={subscriber.id}
									className="border-t hover:bg-gray-50 transition ease-in-out duration-150"
								>
									<td className="px-6 py-4 text-sm text-gray-700">
										{subscriber.id}
									</td>
									<td className="px-6 py-4 text-sm text-gray-700">
										{subscriber.email}
									</td>
									<td className="px-6 py-4 text-sm text-gray-500">
										{new Date(subscriber.createdAt).toLocaleString()}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			{/* Pagination */}
			<div className="mt-4 flex justify-between items-center">
				<button
					onClick={() => handlePageChange(page - 1)}
					disabled={page === 1}
					className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
				>
					Previous
				</button>
				<span className="text-sm text-gray-600">Page {page}</span>
				<button
					onClick={() => handlePageChange(page + 1)}
					className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded transition duration-150 ease-in-out"
				>
					Next
				</button>
			</div>
		</div>
	);
}
