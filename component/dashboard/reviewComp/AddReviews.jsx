"use client";
import Image from "next/image";
import {useState, useEffect} from "react";

export default function SubmitReview() {
	const [products, setProducts] = useState([]);
	const [selectedProduct, setSelectedProduct] = useState("");
	const [review, setReview] = useState({
		ratingValue: "",
		content: "",
		user_name: "",
	});
	const [loading, setLoading] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	// Fetch list of products
	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await fetch("/api/product/product-list");
				if (response.ok) {
					const data = await response.json();
					setProducts(data.products || []);
				} else {
					setErrorMessage("Failed to fetch products");
				}
			} catch (error) {
				setErrorMessage("Error fetching products");
			}
		};

		fetchProducts();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setSuccessMessage("");
		setErrorMessage("");

		try {
			const response = await fetch("/api/product/reviews", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
				body: JSON.stringify({
					productId: selectedProduct,
					...review,
				}),
			});

			if (response.ok) {
				setSuccessMessage("Review submitted successfully!");
				setReview({ratingValue: "", content: "", user_name: ""});
				setSelectedProduct("");
			} else {
				const errorData = await response.json();
				setErrorMessage(errorData.error || errorData.message || "Failed to submit review");
			}
		} catch (error) {
			setErrorMessage("Error submitting review, please try contacting dev");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className=''>
			{errorMessage && (
				<div className='mb-4 p-2 bg-red-100 text-red-700 rounded'>
					{errorMessage}
				</div>
			)}
			{successMessage && (
				<div className='mb-4 p-2 bg-green-100 text-green-700 rounded'>
					{successMessage}
				</div>
			)}

			<form onSubmit={handleSubmit} className='space-y-4'>
				<div>
					<label
						htmlFor='user_name'
						className='block mb-2 text-sm font-medium text-gray-900 '
					>
						User Name
					</label>
					<input
						type='text'
						id='user_name'
						className='block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 '
						value={review.user_name}
						onChange={(e) =>
							setReview((prev) => ({
								...prev,
								user_name: e.target.value,
							}))
						}
						required
					/>
				</div>
				<div>
					<label
						htmlFor='product'
						className='block mb-2 text-sm font-medium text-gray-900 '
					>
						Select Product 
					</label>
					<select
						id='product'
						className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 '
						value={selectedProduct}
						onChange={(e) => setSelectedProduct(e.target.value)}
						required
					>
						<option value='' disabled>
							Select a product
						</option>
						{products.map((product) => (
							<option key={product.id} value={product.id}>
								{product.title}
							</option>
						))}
					</select>
				</div>

				{/* Rating Input */}
				<div>
					<label
						htmlFor='ratingValue'
						className='block mb-2 text-sm font-medium text-gray-900 '
					>
						Rating (1-5)
					</label>
					<input
						type='number'
						id='ratingValue'
						className='block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 '
						value={review.ratingValue}
						onChange={(e) =>
							setReview((prev) => ({
								...prev,
								ratingValue: e.target.value,
							}))
						}
						min='1'
						max='5'
						required
					/>
				</div>

				{/* Content Input */}
				<div>
					<label
						htmlFor='content'
						className='block mb-2 text-sm font-medium text-gray-900 '
					>
						Review Content
					</label>
					<textarea
						id='content'
						className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500'
						value={review.content}
						onChange={(e) =>
							setReview((prev) => ({
								...prev,
								content: e.target.value,
							}))
						}
						rows='4'
						required
					/>
				</div>

				{/* User Name Input */}

				{/* Submit Button */}
				<div>
					<button
						type='submit'
						className='w-full mt-10 py-2 px-4 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400'
						disabled={loading}
					>
						{loading ? "Submitting..." : "Submit Review"}
					</button>
				</div>
			</form>
		</div>
	);
}
