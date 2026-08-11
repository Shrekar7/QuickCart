import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
    try {
        const { userId } = getAuth(request);

        // Check seller authorization
        const isSeller = await authSeller(userId);

        if (!isSeller) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Not authorized",
                },
                { status: 401 }
            );
        }

        // Get form data
        const formData = await request.formData();

        const name = formData.get("name");
        const description = formData.get("description");
        const category = formData.get("category");

        const price = formData.get("price");
        const offerPrice = formData.get("offerPrice");

        const sizingMode = formData.get("sizingMode");

        // --------------------------------------------------
        // GET SIZES
        // --------------------------------------------------

        const sizesData = formData.get("sizes");

        let sizes = [];

        if (sizesData) {
            try {
                sizes = JSON.parse(sizesData);
            } catch (error) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Invalid sizes data",
                    },
                    { status: 400 }
                );
            }
        }

        // --------------------------------------------------
        // GET SIZE PRICES
        // --------------------------------------------------

        const sizePricesData = formData.get("sizePrices");

        let sizePrices = {};

        if (sizePricesData) {
            try {
                sizePrices = JSON.parse(sizePricesData);
            } catch (error) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Invalid size pricing data",
                    },
                    { status: 400 }
                );
            }
        }

        // --------------------------------------------------
        // VALIDATION
        // --------------------------------------------------

        if (
            !name ||
            !description ||
            !category ||
            !price ||
            !offerPrice
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please fill all required product details",
                },
                { status: 400 }
            );
        }

        if (
            !sizingMode ||
            !Array.isArray(sizes) ||
            sizes.length === 0
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "At least one size or age range is required",
                },
                { status: 400 }
            );
        }

        // --------------------------------------------------
        // VALIDATE SIZE PRICES
        // --------------------------------------------------

        for (const size of sizes) {
            const selectedPrice = Number(sizePrices[size]);

            if (
                !Number.isFinite(selectedPrice) ||
                selectedPrice <= 0
            ) {
                return NextResponse.json(
                    {
                        success: false,
                        message: `Please provide a valid price for ${size}`,
                    },
                    { status: 400 }
                );
            }
        }

        // --------------------------------------------------
        // IMAGES
        // --------------------------------------------------

        const files = formData.getAll("images");

        if (!files || files.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No files uploaded",
                },
                { status: 400 }
            );
        }

        // --------------------------------------------------
        // UPLOAD IMAGES TO CLOUDINARY
        // --------------------------------------------------

        const result = await Promise.all(
            files.map(async (file) => {
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                return new Promise((resolve, reject) => {
                    const stream =
                        cloudinary.uploader.upload_stream(
                            {
                                resource_type: "auto",
                            },
                            (error, result) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    resolve(result);
                                }
                            }
                        );

                    stream.end(buffer);
                });
            })
        );

        const image = result.map(
            (item) => item.secure_url
        );

        // --------------------------------------------------
        // CONNECT DATABASE
        // --------------------------------------------------

        await connectDB();

        // --------------------------------------------------
        // CREATE PRODUCT
        // --------------------------------------------------

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

            sizePrices,

            date: Date.now(),
        });

        // --------------------------------------------------
        // RESPONSE
        // --------------------------------------------------

        return NextResponse.json({
            success: true,
            message: "Upload successful",
            newProduct,
        });

    } catch (error) {
        console.error("ADD PRODUCT ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message:
                    error.message ||
                    "Something went wrong",
            },
            { status: 500 }
        );
    }
}

