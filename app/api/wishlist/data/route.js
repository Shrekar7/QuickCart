import connectDB from "@/config/db";
import User from "@/models/User";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        // =====================================================
        // GET LOGGED-IN USER
        // =====================================================

        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please login",
                },
                {
                    status: 401,
                }
            );
        }

        // =====================================================
        // CONNECT DATABASE
        // =====================================================

        await connectDB();

        // =====================================================
        // GET USER
        // =====================================================

        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found",
                },
                {
                    status: 404,
                }
            );
        }

        // =====================================================
        // GET WISHLIST IDS
        // =====================================================

        const wishlistIds =
            Array.isArray(user.Wishlist)
                ? user.Wishlist
                : [];

        // =====================================================
        // GET PRODUCTS
        // =====================================================

        const products =
            wishlistIds.length > 0
                ? await Product.find({
                      _id: {
                          $in: wishlistIds,
                      },
                  })
                : [];

        // =====================================================
        // RESPONSE
        // =====================================================

        return NextResponse.json({
            success: true,
            wishlist: wishlistIds,
            products,
        });

    } catch (error) {
        console.error(
            "GET WISHLIST ERROR:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    error?.message ||
                    "Something went wrong",
            },
            {
                status: 500,
            }
        );
    }
}
