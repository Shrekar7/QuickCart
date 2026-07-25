import connectDB from "@/config/db";
import Review from "@/models/Review";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Please sign in to leave a review" },
                { status: 401 }
            );
        }

        const { productId, rating, comment, userName } = await request.json();

        if (!productId || !rating || !comment || !userName) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json(
                { success: false, message: "Rating must be between 1 and 5" },
                { status: 400 }
            );
        }

        await connectDB();

        // upsert — lets a user edit their existing review instead of erroring
        const review = await Review.findOneAndUpdate(
            { productId, userId },
            { productId, userId, userName, rating, comment, date: Date.now() },
            { upsert: true, new: true }
        );

        return NextResponse.json({ success: true, review });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: error.message || "Something went wrong" },
            { status: 500 }
        );
    }
}