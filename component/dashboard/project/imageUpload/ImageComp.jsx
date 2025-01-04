import { DeleteIcon, ImageUpIcon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

// Skeleton Loader Component
const SkeletonLoader = () => (
  <div className="bg-gray-300 h-full w-36 rounded-lg animate-pulse"></div>
);

// ImageUpload Component for selecting files
const ImageUpload = ({ onFileChange }) => {
  return (
    <div className="max-w-md mx-auto rounded-lg overflow-hidden md:max-w-xl">
      <div className="md:flex">
        <div className="w-full p-3">
          <div className="relative h-48 rounded-lg border-dashed border-2 border-blue-700 bg-gray-100 flex justify-center items-center">
            <div className="absolute">
              <div className="flex flex-col items-center">
                <ImageUpIcon className="h-8 w-8" />
                <span className="block text-gray-400 font-normal">
                  Upload Product Images
                </span>
              </div>
            </div>
            <input
              type="file"
              className="h-full w-full opacity-0"
              onChange={onFileChange} // Handle file upload here
            />
          </div>
        </div>
      </div>
    </div>
  );
};

function ImageUploadComp({ images, setImages }) {
  const [uploading, setUploading] = useState(false);

  const handleDragStart = (event, index) => {
    event.dataTransfer.setData("draggedIndex", index);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event, dropIndex) => {
    const draggedIndex = event.dataTransfer.getData("draggedIndex");
    if (draggedIndex === undefined || draggedIndex === null) return;

    const updatedImages = [...images];
    const [draggedItem] = updatedImages.splice(draggedIndex, 1);
    updatedImages.splice(dropIndex, 0, draggedItem);

    setImages(updatedImages);
  };

  const handleDelete = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      console.error("No file selected");
      return;
    }

    setUploading(true); // Start uploading process

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/image_uploader", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.message === "success" && data.imgUrl) {
        console.log("File uploaded successfully: ", data.imgUrl);
        setImages((prevImages) => [...prevImages, data.imgUrl]); // Add new image URL
      } else {
        console.error("Error uploading file:", data.message);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false); // End uploading process
    }
  };

  return (
    <div>
      <div className="grid grid-cols-5 justify-between items-center">
        <div className="col-span-1">
          {/* Image upload component */}
          <ImageUpload onFileChange={handleFileChange} />
        </div>
        <div className="col-span-4 h-48 p-3 bg-gray-100 overflow-x-scroll scroll-m-1 rounded-lg flex 
        gap-3 items-center">
          {images.length === 0 && uploading
            ? 
              Array(5)
                .fill(0)
                .map((_, index) => <SkeletonLoader key={index} />)
            : images.map((image, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className="relative group flex-shrink-0 h-full bg-slate-300 border-1 border-slate-300 rounded-lg"
                >
                  <Image
                    src={image}
                    width={150}
                    height={100}
                    className="h-full w-22 rounded-lg object-cover"
                    alt={`Image ${index}`}
                  />
                  <div
                    className="absolute hidden group-hover:inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -right-2 cursor-pointer"
                    onClick={() => handleDelete(index)}
                  >
                    <DeleteIcon className="h-4 w-4" />
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}

export default ImageUploadComp;
