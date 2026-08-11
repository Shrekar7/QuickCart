import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(request) {
    try {
        await connectDB();

        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        const body = await request.json();

        const wishlist = Array.isArray(body.wishlist)
            ? body.wishlist.map(String)
            : [];

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                Wishlist: wishlist,
            },
            {
                new: true,
            }
        );

        if (!updatedUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Wishlist updated successfully",
            wishlist: updatedUser.Wishlist,
        });
    } catch (error) {
        console.error("Wishlist update error:", error);

        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to update wishlist",
            },
            { status: 500 }
        );
    }
}