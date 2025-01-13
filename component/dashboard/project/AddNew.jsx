"use client";
import React, {useEffect, useState} from "react";
import ImageUploadComp from "./imageUpload/ImageComp";
import {
	Accordion,
	AccordionItem,
	Button,
	Checkbox,
	Input,
	Select,
	SelectItem,
	Textarea,
} from "@nextui-org/react";

const ProductInput = ({
	label,
	placeholder,
	type,
	isRequired,
	value,
	onChange,
	...props
}) => (
	<Input
		label={label}
		placeholder={placeholder}
		type={type}
		isRequired={isRequired}
		value={value}
		onChange={onChange}
		labelPlacement='outside'
		className='pt-5'
		{...props}
	/>
);

const ProductSelect = ({
	label,
	options,
	isMultiple,
	value,
	onChange,
	...props
}) => (
	<Select
		label={label}
		placeholder={`Select ${label}`}
		labelPlacement='outside'
		selectionMode={isMultiple ? "multiple" : undefined}
		value={value}
		onChange={onChange}
		className='pt-5'
		{...props}
	>
		{options.map((option) => (
			<SelectItem key={option.id} value={option.id}>
				{option.name}
			</SelectItem>
		))}
	</Select>
);

const ProductCheckbox = ({label, value, onChange, ...props}) => (
	<Checkbox
		color='primary'
		className='pt-5'
		checked={value}
		onChange={onChange}
		{...props}
	>
		{label}
	</Checkbox>
);

function AddNew() {
	const [images, setImages] = useState([]);
	const [properties, setProperties] = useState({
		colors: [],
		sizes: [],
		styles: [],
		categories: [],
	});
	const [design, setDesign] = useState([]);
	const [formData, setFormData] = useState({
		title: "",
		category: "",
		sizes: [],
		colors: [],
		description: "",
		price: "",
		style: "",
		actualPrice: "",
		discountedPrice: "",
		discount: "",
	});

	useEffect(() => {
		const fetchProperties = async () => {
			try {
				const response = await fetch(
					"/api/product/add-properties?type=all"
				);
				const data = await response.json();

				if (data.success) {
					setProperties(data.properties);
				} else {
					console.error("Error fetching properties:", data.message);
				}
			} catch (error) {
				console.error("Error fetching properties:", error);
			}
		};

		fetchProperties();
	}, []);

	const handleCheckboxChange = (event) => {
		const {checked} = event.target;
		setFormData((prevData) => ({
			...prevData,
			showOnHome: checked,
		}));
	};

	const handleInputChange = (e) => {
		const {name, value} = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = async () => {
		const newProduct = {
			...formData,
			price: parseFloat(formData.discountedPrice), // Ensure price is a float
			actualPrice: parseFloat(formData.actualPrice), // Ensure actual price is a float
			discountedPrice: parseFloat(formData.discountedPrice), // Ensure discounted price is a float
			discount: parseInt(formData.discount, 10), // Ensure discount is an integer
			sizes: formData.sizes.map((size) => parseInt(size, 10)), // Ensure sizes are integers (IDs)
			colors: formData.colors.map((color) => parseInt(color, 10)), // Ensure colors are integers (IDs)
			showOnHome: formData.showOnHome || false, // Ensure showOnHome is a boolean
			images: images,
			designs: design,
		};

		try {
			const response = await fetch("/api/product", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
				body: JSON.stringify(newProduct),
			});
			const data = await response.json();
			if (data.success) {
				alert("Product created successfully");
			} else {
				alert("Error creating product:", data.message);
			}
		} catch (error) {
			alert("Error creating product:", error);
			console.error("Error creating product:", error);
		}
	};

	const handleChange = (e) => {
		const {name, value} = e.target;
		if (name === "category" || name === "style") {
			setFormData({
				...formData,
				[name]: parseInt(value, 10),
			});
		} else {
			setFormData({
				...formData,
				[name]: value.split(",").map((num) => parseInt(num.trim(), 10)),
			});
		}

		console.log(name, value);
	};

	return (
		<div className='p-5 mx-auto'>
			<ImageUploadComp images={images} setImages={setImages} />

			<div className='mt-8 max-w-4/5 mx-auto'>
				<p className='text-2xl font-semibold text-gray-800'>
					Product Details
				</p>

				<ProductInput
					label='Product Name'
					placeholder='Product Title'
					type='text'
					isRequired
					value={formData.title}
					onChange={handleInputChange}
					name='title'
				/>
				<ProductInput
					label='Product Discounted Price'
					placeholder='e.g., 2000 Rs'
					type='text'
					isRequired
					value={formData.discountedPrice}
					onChange={handleInputChange}
					name='discountedPrice'
				/>
				<ProductInput
					label='% of Discount'
					placeholder='e.g., 20'
					type='number'
					value={formData.discount}
					onChange={handleInputChange}
					name='discount'
				/>
				<ProductInput
					label='Product Before Discount Price'
					placeholder='e.g., 3000 Rs'
					type='text'
					value={formData.actualPrice}
					onChange={handleInputChange}
					name='actualPrice'
				/>
				<ProductSelect
					label='Product Category'
					options={properties.categories}
					value={formData.category}
					name='category'
					onChange={handleChange}
				/>
				<ProductSelect
					label='Product Style'
					options={properties.styles}
					// isMultiple={true}
					value={formData.style}
					name='style'
					onChange={handleChange}
				/>
				<div className='my-5'>
					<Accordion>
						<AccordionItem
							key='1'
							aria-label='Add Design'
							title='Add Design'
						>
							<ImageUploadComp
								images={design}
								setImages={setDesign}
							/>
						</AccordionItem>
					</Accordion>
				</div>

				<ProductSelect
					label='Product Size (Multiple selection allowed)'
					options={properties.sizes}
					isMultiple
					value={formData.sizes}
					onChange={handleChange}
					name='sizes'
				/>
				<Select
					label={"Product Colors Option (Multiple selection allowed)"}
					placeholder={`Select Product Colors`}
					labelPlacement='outside'
					selectionMode={"multiple"}
					name='colors'
					className='pt-5'
					value={formData.colors}
					onChange={handleChange}
				>
					{properties.colors.map((option, index) => (
						<SelectItem
							key={option.id}
							value={option.id}
							startContent={
								<div
									className='w-5 h-5 rounded-full'
									style={{backgroundColor: option.code}}
								/>
							}
						>
							{option.name}
						</SelectItem>
					))}
				</Select>

				<Textarea
					label='Product Description'
					placeholder='Enter product description'
					labelPlacement='outside'
					className='pt-5'
					isRequired
					value={formData.description}
					onChange={handleInputChange}
					name='description'
				/>

				<div className='flex flex-col items-start gap-4 mt-8'>
					<ProductCheckbox
						onChange={handleCheckboxChange}
						value={formData.showOnHome}
						label='Display on Home Page?'
					/>
					<Button
						color='primary'
						type='submit'
						className='py-5 w-full sm:w-2/4'
						onClick={handleSubmit}
					>
						Publish Product
					</Button>
				</div>
			</div>
		</div>
	);
}

export default AddNew;
