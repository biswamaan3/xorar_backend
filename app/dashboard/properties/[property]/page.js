"use client";
import React, {useState, useEffect} from "react";
import {PageHeader} from "@/component/text";
import {Button, Input} from "@nextui-org/react";
import {Trash2Icon} from "lucide-react";

export default function Page({params}) {
	const slug = React.use(params).property;
	const [properties, setProperties] = useState([]);
	const [newProperty, setNewProperty] = useState({name: "", colorCode: ""});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Fetch existing properties on component load
	useEffect(() => {
		const fetchProperties = async () => {
			try {
				const res = await fetch(
					`/api/product/add-properties?type=${slug.toLowerCase()}`
				);
				const data = await res.json();
				if (data.success) {
					setProperties(data.properties);
				} else {
					throw new Error(data.message);
				}
			} catch (err) {
				console.error(err);
				setError("Failed to fetch properties");
			}
		};

		fetchProperties();
	}, [slug]);

	// Add new property
	const handleAddProperty = async () => {
		if (!newProperty.name || (slug === "color" && !newProperty.colorCode)) {
			setError("Please fill all required fields");
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const res = await fetch(`/api/product/add-properties`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
				body: JSON.stringify({
					type: slug.toLowerCase(),
					...newProperty,
				}),
			});

			const data = await res.json();
			if (data.success) {
				setProperties([...properties, data.property]);
				setNewProperty({name: "", colorCode: ""});
			} else {
				throw new Error(data.message);
			}
		} catch (err) {
			console.error(err);
			setError("Failed to add property");
		} finally {
			setLoading(false);
		}
	};

	// Delete property
	const handleDeleteProperty = async (id) => {
		setLoading(true);
		setError(null);

		try {
			const res = await fetch(`/api/product/add-properties`, {
				method: "DELETE",
                headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
				body: JSON.stringify({type: slug.toLowerCase(), id}),
			});

			const data = await res.json();
			if (data.success) {
				setProperties(
					properties.filter((property) => property.id !== id)
				);
			} else {
				throw new Error(data.message);
			}
		} catch (err) {
			console.error(err);
			setError("Failed to delete property");
		} finally {
			setLoading(false);
		}
	};
	const handleColorCode = (e) => {
		setNewProperty({...newProperty, colorCode: e.target.value});
	};

	return (
		<div>
			<PageHeader title={slug} />
			<div className='flex flex-col gap-4'>
				<h3 className='text-lg font-bold'>Add New {slug}</h3>
				<Input
					className='max-w-xs'
					label={`Enter ${slug} Below`}
					placeholder={`e.g. ${slug === "Color" ? "Red" : "T-Shirt"}`}
					type='text'
                    description={`Enter ${slug} name`}
					value={newProperty.name}
					onChange={(e) =>
						setNewProperty({...newProperty, name: e.target.value})
					}
					endContent={
						slug === "Color" && (
							<input
								className='max-w-xs'
								label='Color Code (e.g. #FF5733)'
								type='color'
								value={newProperty.colorCode}
								onChange={handleColorCode}
							/>
						)
					}
				/>

				<Button
					className='max-w-xs'
					color='primary'
					onClick={handleAddProperty}
					isLoading={loading}
				>
					Save
				</Button>
				{error && <p className='text-red-500'>{error}</p>}
			</div>

			<div className='flex flex-col gap-4 max-w-xs mt-10'>
				<h3 className='text-lg font-bold'>
					Previously Added{" "}
					{slug.charAt(0).toUpperCase() + slug.slice(1)}s
				</h3>
				<div className='flex flex-col gap-2 pl-3'>
					{properties.map((property) => (
						<div
							key={property.id}
							className='flex justify-between items-center'
						>
							<p className='font-bold flex items-center gap-3'>
								{property.code && (
									<div
										className='flex items-center gap-2 rounded-full p-4 w-3 h-3'
										style={{backgroundColor: property.code}}
									></div>
								)}

								{property.name}
							</p>
							<div className='flex gap-2'>
								
								<Button
									variant='solid'
									color='danger'
									onClick={() =>
										handleDeleteProperty(property.id)
									}
									isLoading={loading}
								>
									<Trash2Icon />
								</Button>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
