import connectDB from "@/config/db";
import Product from "@/models/Product";
import Review from "@/models/Review";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();

        const products = await Product.find({}).lean();

        // one aggregation for all products' reviews, instead of a query per product
        const ratingStats = await Review.aggregate([
            {
                $group: {
                    _id: "$productId",
                    averageRating: { $avg: "$rating" },
                    reviewCount: { $sum: 1 },
                },
            },
        ]);

        const ratingMap = {};
        ratingStats.forEach((stat) => {
            ratingMap[stat._id] = {
                averageRating: Number(stat.averageRating.toFixed(1)),
                reviewCount: stat.reviewCount,
            };
        });

        const productsWithRatings = products.map((product) => ({
            ...product,
            averageRating: ratingMap[product._id.toString()]?.averageRating || 0,
            reviewCount: ratingMap[product._id.toString()]?.reviewCount || 0,
        }));

        return NextResponse.json({ success: true, products: productsWithRatings });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: error.message || "Something went wrong" },
            { status: 500 }
        );
    }
}