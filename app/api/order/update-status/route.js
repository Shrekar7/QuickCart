import connectDB from "@/config/db";
import Order from "@/models/Order";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not authenticated",
                },
                { status: 401 }
            );
        }

        const { orderId, status } = await request.json();

        if (!orderId || !status) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Order ID and status are required",
                },
                { status: 400 }
            );
        }

        const allowedStatuses = [
            "Order placed",
            "Dispatched",
            "Delivered",
        ];

        if (!allowedStatuses.includes(status)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid order status",
                },
                { status: 400 }
            );
        }

        await connectDB();

        const order = await Order.findById(orderId);

        if (!order) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Order not found",
                },
                { status: 404 }
            );
        }

        order.status = status;

        await order.save();

        return NextResponse.json({
            success: true,
            message: `Order ${status.toLowerCase()} successfully`,
            order,
        });

    } catch (error) {
        console.error("UPDATE ORDER STATUS ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: error.message || "Something went wrong",
            },
            { status: 500 }
        );
    }
}