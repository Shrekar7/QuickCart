import connectDB from "@/config/db";
import Product from "@/models/Product";
import Review from "@/models/Review";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();

        // =====================================================
        // GET PRODUCTS
        // Newest products first
        // =====================================================

        const products = await Product.find({})
            .sort({ date: -1 })
            .lean();

        // =====================================================
        // GET ALL REVIEW STATISTICS
        // =====================================================

        const ratingStats = await Review.aggregate([
            {
                $group: {
                    _id: "$productId",
                    averageRating: {
                        $avg: "$rating",
                    },
                    reviewCount: {
                        $sum: 1,
                    },
                },
            },
        ]);

        // =====================================================
        // CREATE RATING MAP
        // =====================================================

        const ratingMap = {};

        ratingStats.forEach((stat) => {
            ratingMap[stat._id] = {
                averageRating: Number(
                    stat.averageRating.toFixed(1)
                ),
                reviewCount:
                    stat.reviewCount,
            };
        });

        // =====================================================
        // ADD RATINGS TO PRODUCTS
        // =====================================================

        const productsWithRatings =
            products.map((product) => ({
                ...product,

                averageRating:
                    ratingMap[
                        product._id.toString()
                    ]?.averageRating || 0,

                reviewCount:
                    ratingMap[
                        product._id.toString()
                    ]?.reviewCount || 0,
            }));

        // =====================================================
        // RESPONSE
        // =====================================================

        return NextResponse.json({
            success: true,
            products: productsWithRatings,
        });
    } catch (error) {
        console.error(
            "PRODUCT LIST ERROR:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    error.message ||
                    "Something went wrong",
            },
            {
                status: 500,
            }
        );
    }
}