"use client";
import {Tooltip} from "@nextui-org/react";
import {DeleteIcon, EditIcon, EyeIcon} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Home() {
	const [products, setProducts] = React.useState(null);
	const [loading, setLoading] = React.useState(true);

	React.useEffect(() => {
		fetch("/api/product")
			.then((res) => res.json())
			.then((data) => {
				setProducts(data.products);
				setLoading(false);
			})
			.catch((error) => {
				console.error("Error:", error);
				setLoading(false);
			});
	}, []);

	const handleDelete = async (productId) => {
		const confirmDelete = window.confirm(
			"Are you sure you want to delete this product?"
		);
		if (confirmDelete) {
			try {
				const response = await fetch(`/api/product`, {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem(
							"token"
						)}`,
					},
					body: JSON.stringify({id: productId}),
				});

				const result = await response.json();
				if (response.ok) {
					alert("Product deleted successfully!");
					setProducts((prevProducts) =>
						prevProducts.filter(
							(product) => product.id !== productId
						)
					);
				} else {
					alert(result.message || "Failed to delete the product.");
				}
			} catch (error) {
				console.error("Error:", error);
				alert("An error occurred while deleting the product.");
			}
		}
	};

	return (
		<div className='p-6'>
			<table className='table-auto w-full border-collapse border border-gray-300'>
				<thead>
					<tr className='bg-gray-100'>
						<th className='border border-gray-300 px-4 py-2 text-left'>
							Title
						</th>
						<th className='border border-gray-300 px-4 py-2 text-left'>
							Category
						</th>
						<th className='border border-gray-300 px-4 py-2 text-left'>
							Style
						</th>
						<th className='border border-gray-300 px-4 py-2 text-left'>
							Price
						</th>
						<th className='border border-gray-300 px-4 py-2 text-left'>
							Views
						</th>
						<th className='border border-gray-300 px-4 py-2 text-left'>
							Sizes
						</th>
						<th className='border border-gray-300 px-4 py-2 text-left'>
							Colors
						</th>
						<th className='border border-gray-300 px-4 py-2 text-left'>
							Actions
						</th>
					</tr>
				</thead>
				<tbody>
					{loading && "Loading..."}
					{!loading &&
						products?.map((product) => (
							<tr
								key={product.id}
								className='bg-white hover:bg-gray-50 relative'
							>
								<td className='border group cursor-pointer hover:bg-gray-50 border-gray-300 px-4 py-2'>
									{product.title}
									<Image
										src={product.thumbnail}
										alt={product.title}
										width={150}
										height={200}
										className='hidden absolute left-24 top-0 rounded-lg object-contain group-hover:block z-[999] '
									/>
								</td>
								<td className='border border-gray-300 px-4 py-2'>
									{product.category.name}
								</td>
								<td className='border border-gray-300 px-4 py-2'>
									{product.style.name}
								</td>
								<td className='border border-gray-300 px-4 py-2'>
									${product.price.toFixed(2)}
								</td>
								<td className='border border-gray-300 px-4 py-2'>
									{product.views}
								</td>
								<td className='border border-gray-300 px-4 py-2'>
									{product.sizes
										.map((size) => size.name)
										.join(", ")}
								</td>
								<td className='border border-gray-300 px-4 py-2'>
									{product.colors.map((color) => (
										<span
											key={color.id}
											className='inline-block w-5 h-5 mr-2 border border-gray-400 rounded-full'
											style={{
												backgroundColor: color.code,
											}}
										></span>
									))}
								</td>
								<td className='border border-gray-300 px-4 py-2'>
									<div className='relative flex items-center gap-2'>
										<Tooltip content='View product'>
											<span className='text-lg text-default-400 cursor-pointer active:opacity-50'>
												<EyeIcon />
											</span>
										</Tooltip>
										<Link
											className='cursor-pointer'
											href={`/dashboard/products/${product.id}`}
										>
											<Tooltip content='Edit product'>
												<span className='text-lg text-default-400 cursor-pointer active:opacity-50'>
													<EditIcon />
												</span>
											</Tooltip>
										</Link>
										<Tooltip
											color='danger'
											content='Delete product'
										>
											<span
												onClick={() =>
													handleDelete(product.id)
												}
												className='text-lg text-danger cursor-pointer active:opacity-50'
											>
												<DeleteIcon />
											</span>
										</Tooltip>
									</div>
								</td>
							</tr>
						))}
				</tbody>
			</table>
			<span className='mt-5 text-sm'>
				Total Products: {products?.length}{" "}
			</span>
		</div>
	);
}
