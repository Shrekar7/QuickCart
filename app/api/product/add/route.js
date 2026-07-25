import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

// configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
    try {
        const { userId } = getAuth(request);

        const isSeller = await authSeller(userId);
        if (!isSeller) {
            return NextResponse.json(
                { success: false, message: "not authorized" },
                { status: 401 }
            );
        }

        const formData = await request.formData();

        const name = formData.get("name");
        const description = formData.get("description");
        const category = formData.get("category");
        const price = formData.get("price");
        const offerPrice = formData.get("offerPrice");
        const sizingMode = formData.get("sizingMode"); // "age" | "size"
        const sizes = formData.getAll("sizes"); // multiple values under the same key

        const files = formData.getAll("images");

        if (!files || files.length === 0) {
            return NextResponse.json(
                { success: false, message: "No files uploaded" },
                { status: 400 }
            );
        }

        if (!sizingMode || sizes.length === 0) {
            return NextResponse.json(
                { success: false, message: "At least one size or age range is required" },
                { status: 400 }
            );
        }

        const result = await Promise.all(
            files.map(async (file) => {
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { resource_type: "auto" },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    stream.end(buffer);
                });
            })
        );

        const image = result.map((r) => r.secure_url);

        await connectDB();

        const newProduct = await Product.create({
            userId,
            name,
            description,
            category,
            price: Number(price),
            offerPrice: Number(offerPrice),
            image,
            sizingMode,
            sizes,
            date: Date.now(),
        });

        return NextResponse.json({ success: true, message : 'Upload successfull', newProduct });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: error.message || "Something went wrong" },
            { status: 500 }
        );
    }
}