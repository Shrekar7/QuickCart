import connectDB from "@/config/db";
import Review from "@/models/Review";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get("productId");

        if (!productId) {
            return NextResponse.json(
                { success: false, message: "productId is required" },
                { status: 400 }
            );
        }

        await connectDB();

        const reviews = await Review.find({ productId }).sort({ date: -1 });

        const average =
            reviews.length > 0
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                : 0;

        return NextResponse.json({
            success: true,
            reviews,
            average: Number(average.toFixed(1)),
            count: reviews.length,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: error.message || "Something went wrong" },
            { status: 500 }
        );
    }
}