"use client";
import React, { useState, useEffect } from "react";
import ImageUploadComp from "./imageUpload/ImageComp";
import {
  Button,
  Checkbox,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";

const ProductInput = ({ label, placeholder, type, value, onChange, name, ...props }) => (
  <Input
    label={label}
    placeholder={placeholder}
    type={type}
    value={value}
    onChange={(e) => onChange(name, e.target.value)}
    labelPlacement="outside"
    className="pt-5"
    {...props}
  />
);

const ProductSelect = ({ label, options, isMultiple, value, onChange, name, ...props }) => (
  <Select
    label={label}
    placeholder={`Select ${label}`}
    labelPlacement="outside"
    selectionMode={isMultiple ? "multiple" : undefined}
    value={value}
    onChange={(selected) => onChange(name, selected)}
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

const ProductCheckbox = ({ label, value, onChange, name, ...props }) => (
  <Checkbox
    color="primary"
    className="pt-5"
    checked={value}
    onChange={(e) => onChange(name, e.target.checked)}
    {...props}
  >
    {label}
  </Checkbox>
);

function ProductForm({ formData, setFormData, onSubmit, properties }) {
  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-5 mx-auto">
      <ImageUploadComp
        images={formData?.images}
        setImages={(images) => handleInputChange("images", images)}
      />

      <div className="mt-8 max-w-4/5 mx-auto">
        <p className="text-2xl font-semibold text-gray-800">Product Details</p>

        <ProductInput
          label="Product Name"
          placeholder="Product Title"
          type="text"
          value={formData.title}
          onChange={handleInputChange}
          name="title"
        />
        <ProductInput
          label="Product Discounted Price"
          placeholder="e.g., 2000 Rs"
          type="text"
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
          onChange={handleInputChange}
          name="category"
        />
        <ProductSelect
          label="Product Style"
          options={properties.styles}
          value={formData.style}
          onChange={handleInputChange}
          name="style"
        />
        <ProductSelect
          label="Product Size (Multiple selection allowed)"
          options={properties.sizes}
          isMultiple
          value={formData.sizes}
          onChange={handleInputChange}
          name="sizes"
        />
        <Select
          label="Product Colors Option (Multiple selection allowed)"
          placeholder={`Select Product Colors`}
          labelPlacement="outside"
          selectionMode="multiple"
          name="colors"
          className="pt-5"
          value={formData.colors}
          onChange={(selected) => handleInputChange("colors", selected)}
        >
          {properties.colors.map((option) => (
            <SelectItem
              key={option.id}
              value={option.id}
              startContent={
                <div
                  className="w-5 h-5 rounded-full"
                  style={{ backgroundColor: option.code }}
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
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          name="description"
        />

        <div className="flex flex-col items-start gap-4 mt-8">
          <ProductCheckbox
            onChange={handleInputChange}
            value={formData.showOnHome}
            label="Display on Home Page?"
            name="showOnHome"
          />
          <Button
            color="primary"
            type="submit"
            className="py-5 w-full sm:w-2/4"
            onClick={() => onSubmit(formData)}
          >
            {formData.id ? "Update Product" : "Publish Product"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProductForm;
