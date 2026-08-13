import connectDB from "@/config/db";
import { inngest } from "@/config/inngest";
import Product from "@/models/Product";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        // =====================================================
        // GET AUTHENTICATED USER
        // =====================================================

        const { userId } = getAuth(request);

        // =====================================================
        // GET REQUEST DATA
        // =====================================================

        const { address, items } = await request.json();

        // =====================================================
        // CHECK AUTHENTICATION
        // =====================================================

        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not authenticated",
                },
                {
                    status: 401,
                }
            );
        }

        // =====================================================
        // VALIDATE DATA
        // =====================================================

        if (
            !address ||
            !items ||
            !Array.isArray(items) ||
            items.length === 0
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid order data",
                },
                {
                    status: 400,
                }
            );
        }

        // =====================================================
        // CONNECT DATABASE
        // =====================================================

        await connectDB();

        // =====================================================
        // CALCULATE SUBTOTAL
        // =====================================================

        const amounts = await Promise.all(
            items.map(async (item) => {
                const product = await Product.findById(
                    item.product
                );

                if (!product) {
                    throw new Error(
                        `Product not found: ${item.product}`
                    );
                }

                const quantity =
                    Number(item.quantity) || 1;

                const price =
                    Number(product.offerPrice) || 0;

                return price * quantity;
            })
        );

        const subtotal = amounts.reduce(
            (total, currentAmount) =>
                total + currentAmount,
            0
        );

        // =====================================================
        // CALCULATE TAX
        // =====================================================

        const tax = Math.floor(
            subtotal * 0.02
        );

        // =====================================================
        // FINAL TOTAL
        // =====================================================

        const totalAmount =
            subtotal + tax;

        // =====================================================
        // SEND ORDER EVENT TO INNGEST
        // =====================================================

        await inngest.send({
            name: "order/created",

            data: {
                userId,

                address,

                items,

                subtotal,

                tax,

                amount: totalAmount,

                date: Date.now(),
            },
        });

        // =====================================================
        // CLEAR USER CART
        // =====================================================

        const user =
            await User.findById(userId);

        if (user) {
            user.CartItems = {};
            await user.save();
        }

        // =====================================================
        // RESPONSE
        // =====================================================

        return NextResponse.json({
            success: true,

            message:
                "Order placed successfully",

            subtotal,

            tax,

            totalAmount,
        });
    } catch (error) {
        console.error(
            "CREATE ORDER ERROR:",
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