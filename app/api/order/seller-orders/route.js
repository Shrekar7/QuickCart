import connectDB from "@/config/db";
import Address from "@/models/Address";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import authSeller from "@/lib/authSeller";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Not authenticated",
                },
                { status: 401 }
            );
        }

        const isSeller = await authSeller(userId);

        if (!isSeller) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Not authorized",
                },
                { status: 403 }
            );
        }

        await connectDB();

        // Make sure the Address and Product models are registered
        // before using populate().
        Address;
        Product;

        // Only show active orders.
        // Delivered orders remain safely stored in MongoDB
        // but are removed from the seller's active orders list.
        const orders = await Order.find({
            status: { $ne: "Delivered" }
        })
            .populate("address")
            .populate("items.product")
            .sort({ date: -1 });

        return NextResponse.json({
            success: true,
            orders,
        });

    } catch (error) {
        console.error("SELLER ORDERS ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    }
}