import connectDB from "@/config/db";
import { inngest } from "@/config/inngest";
import Product from "@/models/Product";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const { address, items } = await request.json();

        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not authenticated",
                },
                { status: 401 }
            );
        }

        if (!address || !items || items.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid data",
                },
                { status: 400 }
            );
        }

        await connectDB();

        // Calculate total amount
        const amounts = await Promise.all(
            items.map(async (item) => {
                const product = await Product.findById(item.product);

                if (!product) {
                    throw new Error(`Product not found: ${item.product}`);
                }

                return await product.offerPrice * item.quantity;
            })
        );

        const amount = amounts.reduce(
            (total, currentAmount) => total + currentAmount,
            0
        );

        // Add 2% tax
        const totalAmount = amount + Math.floor(amount * 0.02);

        // Create order event
        await inngest.send({
            name: "order/created",
            data: {
                userId,
                address,
                items,
                amount: totalAmount,
                date: Date.now(),
            },
        });

        // Clear user's cart
        const user = await User.findById(userId);

        if (user) {
            user.CartItems = {};
            await user.save();
        }

        return NextResponse.json({
            success: true,
            message: "Order placed",
        });

    } catch (error) {
        console.error("CREATE ORDER ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: error.message || "Something went wrong",
            },
            { status: 500 }
        );
    }
}