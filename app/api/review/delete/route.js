import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Review from "@/models/Review";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(request) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Please sign in" },
                { status: 401 }
            );
        }

        const { reviewId } = await request.json();

        if (!reviewId) {
            return NextResponse.json(
                { success: false, message: "reviewId is required" },
                { status: 400 }
            );
        }

        await connectDB();

        const review = await Review.findById(reviewId);

        if (!review) {
            return NextResponse.json(
                { success: false, message: "Review not found" },
                { status: 404 }
            );
        }

        const isOwner = review.userId === userId;
        const isSeller = await authSeller(userId);

        if (!isOwner && !isSeller) {
            return NextResponse.json(
                { success: false, message: "Not authorized to delete this review" },
                { status: 403 }
            );
        }

        await Review.findByIdAndDelete(reviewId);

        return NextResponse.json({ success: true, message: "Review deleted" });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: error.message || "Something went wrong" },
            { status: 500 }
        );
    }
}