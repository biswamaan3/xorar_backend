import { cloudinary } from "@/lib/cloudinary";
import { NextResponse } from "next/server";

const uploadToCloudinary = (fileUri, fileName) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload(fileUri, {
        invalidate: true,
        resource_type: "auto",
        filename_override: fileName,
        folder: "Xorars",
        use_filename: true,
      })
      .then((result) => {
        resolve({ success: true, result });
      })
      .catch((error) => {
        reject({ success: false, error });
      });
  });
};

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
  }

  // Convert the file to base64
  const fileBuffer = await file.arrayBuffer();
  const mimeType = file.type;
  const encoding = "base64";
  const base64Data = Buffer.from(fileBuffer).toString("base64");

  const fileUri = `data:${mimeType};${encoding},${base64Data}`;

  try {
    const res = await uploadToCloudinary(fileUri, file.name);
    if (res.success && res.result) {
      return NextResponse.json({
        message: "success",
        imgUrl: res.result.secure_url,
      });
    } else {
      return NextResponse.json({ message: "failure" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return NextResponse.json({ message: "failure" }, { status: 500 });
  }
}



const deleteFromCloudinary = (publicId) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .destroy(publicId, {
          invalidate: true, 
        })
        .then((result) => {
          resolve({ success: true, result });
        })
        .catch((error) => {
          reject({ success: false, error });
        });
    });
  };
  
  export async function DELETE(req) {
    const { publicId } = await req.json();
  
    if (!publicId) {
      return NextResponse.json({ message: "No public ID provided" }, { status: 400 });
    }
  
    try {
      const res = await deleteFromCloudinary(publicId);
      if (res.success) {
        return NextResponse.json({ message: "Image deleted successfully" });
      } else {
        return NextResponse.json({ message: "Error deleting image" }, { status: 500 });
      }
    } catch (error) {
      console.error("Error deleting from Cloudinary:", error);
      return NextResponse.json({ message: "Error deleting image" }, { status: 500 });
    }
  }