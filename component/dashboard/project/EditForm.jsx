"use client";

import React, { useEffect, useState } from "react";
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
    labelPlacement="outside"
    className="pt-5"
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
    labelPlacement="outside"
    selectionMode={isMultiple ? "multiple" : undefined}
    value={value}
    onChange={onChange}
    className="pt-5"
    {...props}
  >
    {options.map((option) => (
      <SelectItem key={option.id} value={option.id}>
        {option.name}
      </SelectItem>
    ))}
  </Select>
);

const ProductCheckbox = ({ label, value, onChange, ...props }) => (
  <Checkbox
    color="primary"
    className="pt-5"
    checked={value}
    onChange={onChange}
    {...props}
  >
    {label}
  </Checkbox>
);

function EditProduct({ id }) {
  const [images, setImages] = useState([]);
  const [properties, setProperties] = useState({
    colors: [],
    sizes: [],
    styles: [],
    categories: [],
  });
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
    showOnHome: false,
  });
  const [design, setDesign] = useState([]);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/product/add-properties?type=all");
        const newResponse = await fetch(`/api/product/getOne?id=${id}`);

        const data = await response.json();
        const newData = await newResponse.json();

        if (data.success && newData.success) {
          const colorNames = newData.product.colors.map((color) =>
            String(color.id)
          );
          const sizeNames = newData.product.sizes.map((size) =>
            String(size.id)
          );

          setProperties(data.properties);

          setFormData({
            ...newData.product,
            colors: colorNames,
            category: [String(newData.product.categoryId)], // Ensure it's in array form as a string
            style: [String(newData.product.styleId)], // Ensure it's in array form as a string
            sizes: sizeNames,
            discount: newData.product.discount_percent,
            discountedPrice: newData.product.price,
            actualPrice: newData.product.actual_price,
          });
          const designImages = newData.product.design.map((designItem) => designItem.image);

          setImages([newData.product.thumbnail, ...newData.product.images]);
          setDesign(designImages);
          setLoading(false);
        } else {
          console.error("Error fetching properties:", data.message);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
        setLoading(false);
      }
    };

    fetchProperties();
  }, [id]);

  const handleCheckboxChange = (event) => {
    const { checked } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      showOnHome: checked,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    const updatedProduct = {
      id, // Product ID
      title: formData.title,
      category: parseInt(formData.category, 10), // Convert category to an integer
      sizes: formData.sizes.map((size) => parseInt(size, 10)), // Ensure sizes are integers
      colors: formData.colors.map((color) => parseInt(color, 10)), // Ensure colors are integers
      description: formData.description,
      price: parseFloat(formData.discountedPrice),
      style: parseInt(formData.style, 10), // Convert style to an integer
      actual_price: parseFloat(formData.actualPrice), // Ensure correct naming as actual_price
      discounted_price: parseFloat(formData.discountedPrice),
      discount_percent: parseInt(formData.discount, 10), // Discount as an integer
      thumbnail: images[0],
      images: images.slice(1),
      showOnHome: formData.showOnHome,
      design: design,
    };
  
    try {
      const response = await fetch("/api/product", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedProduct),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log("Product updated successfully:", result);
        alert("Product updated successfully!");
      } else {
        console.error("Error updating product:", result.message);
        alert(result.message || "Error updating product");
      }
    } catch (error) {
      console.error("Error sending request:", error);
      alert("An error occurred while updating the product.");
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "category" || name === "style") {
      setFormData({
        ...formData,
        [name]: value, // Ensure the value is stored correctly
      });
    } else if (name === "sizes" || name === "colors") {
      setFormData({
        ...formData,
        [name]: value.split(",").map((item) => String(item.trim())), // Ensure multiple selections are handled as strings
      });
    }
  };

  return (
    <div className="p-5 mx-auto">
      {!loading ? (
        <>
          <ImageUploadComp images={images} setImages={setImages} />

          <div className="mt-8 max-w-4/5 mx-auto">
            <p className="text-2xl font-semibold text-gray-800">Product Details</p>

            <ProductInput
              label="Product Name"
              placeholder="Product Title"
              type="text"
              isRequired
              value={formData.title}
              onChange={handleInputChange}
              name="title"
            />
            <ProductInput
              label="Product Discounted Price"
              placeholder="e.g., 2000 Rs"
              type="text"
              isRequired
              value={formData.discountedPrice}
              onChange={handleInputChange}
              name="discountedPrice"
            />
            <ProductInput
              label="% of Discount"
              placeholder="e.g., 20"
              type="number"
              value={formData.discount}
              onChange={handleInputChange}
              name="discount"
            />
            <ProductInput
              label="Product Before Discount Price"
              placeholder="e.g., 3000 Rs"
              type="text"
              value={formData.actualPrice}
              onChange={handleInputChange}
              name="actualPrice"
            />
            <ProductSelect
              label="Product Category"
              options={properties.categories}
              value={formData.category}
              name="category"
              onChange={handleChange}
              defaultSelectedKeys={formData.category}
            />
            <ProductSelect
              label="Product Style"
              options={properties.styles}
              value={formData.style}
              name="style"
              onChange={handleChange}
              defaultSelectedKeys={formData.style}
            />
            <div className='my-5 bg-gray-200 rounded-lg'>
					<Accordion>
						<AccordionItem
							key='1'
							aria-label='Edit Design'
							title='Edit Design'
						>
							<ImageUploadComp
								images={design}
								setImages={setDesign}
							/>
						</AccordionItem>
					</Accordion>
				</div>
            <ProductSelect
              label="Product Size (Multiple selection allowed)"
              options={properties.sizes}
              isMultiple
              value={formData.sizes}
              onChange={handleChange}
              name="sizes"
              selectedKeys={formData.sizes}
            />
            <Select
              label="Product Colors Option (Multiple selection allowed)"
              placeholder="Select Product Colors"
              labelPlacement="outside"
              selectionMode="multiple"
              name="colors"
              className="pt-5"
              value={formData.colors}
              selectedKeys={formData.colors}
              onChange={handleChange}
            >
              {properties.colors.map((option) => (
                <SelectItem
                  key={option.id}
                  value={option.id}
                  startContent={
                    <div
                      className="w-5 h-5 rounded-full"
                      style={{
                        backgroundColor: option.code,
                      }}
                    />
                  }
                >
                  {option.name}
                </SelectItem>
              ))}
            </Select>

            <Textarea
              label="Product Description"
              placeholder="Enter product description"
              labelPlacement="outside"
              className="pt-5"
              isRequired
              value={formData.description}
              onChange={handleInputChange}
              name="description"
            />

            <div className="flex flex-col items-start gap-4 mt-8">
              <ProductCheckbox
                onChange={handleCheckboxChange}
                value={formData.showOnHome}
                label="Display on Home Page?"
              />
              <Button
                color="primary"
                type="submit"
                className="py-5 w-full sm:w-2/4"
                onPress={handleSubmit}
              >
                Update Product
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default EditProduct;
