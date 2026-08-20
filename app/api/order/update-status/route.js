import connectDB from "@/config/db";
import Order from "@/models/Order";
import { inngest } from "@/config/inngest";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        // =====================================================
        // AUTHENTICATION
        // =====================================================

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

        // =====================================================
        // REQUEST DATA
        // =====================================================

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

        // =====================================================
        // ALLOWED STATUS VALUES
        // =====================================================

        const allowedStatuses = [
            "Order placed",
            "Dispatched",
            "Delivered",
            "Cancelled",
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

        // =====================================================
        // DATABASE
        // =====================================================

        await connectDB();

        // =====================================================
        // FIND ORDER
        // =====================================================

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

        // =====================================================
        // CHECK SELLER
        // =====================================================
        //
        // Your seller-orders route should already make sure
        // sellers only see their own orders.
        //
        // We also check the order items here if sellerId exists.
        //
        // If your Order model does not contain sellerId,
        // this block will simply be skipped.
        // =====================================================

        if (order.sellerId && order.sellerId !== userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "You are not authorized to update this order",
                },
                { status: 403 }
            );
        }

        // =====================================================
        // PREVENT UNNECESSARY STATUS UPDATE
        // =====================================================

        if (order.status === status) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Order is already ${status}`,
                },
                { status: 400 }
            );
        }

        const previousStatus = order.status;

        // =====================================================
        // UPDATE ORDER STATUS
        // =====================================================

        order.status = status;

        await order.save();

        console.log("=================================");
        console.log("ORDER STATUS UPDATED");
        console.log("ORDER ID:", orderId);
        console.log("FROM:", previousStatus);
        console.log("TO:", status);
        console.log("=================================");

        // =====================================================
        // SEND STATUS EMAIL EVENT
        // =====================================================

        // We only need emails for these transitions.
        if (
            status === "Dispatched" ||
            status === "Delivered"
        ) {
            try {
                await inngest.send({
                    name: "order/status-updated",

                    data: {
                        orderId: order._id.toString(),
                        status,
                        previousStatus,
                    },
                });

                console.log(
                    `STATUS EMAIL EVENT SENT: ${status}`
                );
            } catch (inngestError) {
                // Important:
                // Do NOT fail the order status update just
                // because Inngest/email has an issue.

                console.error(
                    "INNGEST STATUS EMAIL ERROR:",
                    inngestError
                );
            }
        }

        // =====================================================
        // RESPONSE
        // =====================================================

        return NextResponse.json({
            success: true,
            message: `Order ${status.toLowerCase()} successfully`,
            order: {
                _id: order._id,
                status: order.status,
            },
        });

    } catch (error) {
        console.error(
            "UPDATE ORDER STATUS ERROR:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    error.message ||
                    "Failed to update order status",
            },
            { status: 500 }
        );
    }
}