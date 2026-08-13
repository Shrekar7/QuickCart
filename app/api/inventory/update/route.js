import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);

        // =====================================================
        // CHECK SELLER
        // =====================================================

        const isSeller = await authSeller(userId);

        if (!isSeller) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Not authorized",
                },
                { status: 401 }
            );
        }

        // =====================================================
        // READ REQUEST
        // =====================================================

        const body = await request.json();

        const {
            productId,
            inventory,
        } = body;

        // =====================================================
        // VALIDATION
        // =====================================================

        if (!productId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Product ID is required",
                },
                { status: 400 }
            );
        }

        if (
            !inventory ||
            typeof inventory !== "object" ||
            Array.isArray(inventory)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid inventory data",
                },
                { status: 400 }
            );
        }

        // =====================================================
        // VALIDATE INVENTORY VALUES
        // =====================================================

        const cleanedInventory = {};

        for (const [size, value] of Object.entries(
            inventory
        )) {
            const quantity = Number(value);

            if (
                !Number.isInteger(quantity) ||
                quantity < 0
            ) {
                return NextResponse.json(
                    {
                        success: false,
                        message: `Invalid stock quantity for ${size}`,
                    },
                    { status: 400 }
                );
            }

            cleanedInventory[size] = quantity;
        }

        // =====================================================
        // CONNECT DATABASE
        // =====================================================

        await connectDB();

        // =====================================================
        // FIND PRODUCT BELONGING TO THIS SELLER
        // =====================================================

        const product = await Product.findOne({
            _id: productId,
            userId,
        });

        if (!product) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Product not found or you are not authorized to edit it",
                },
                { status: 404 }
            );
        }

        // =====================================================
        // MAKE SURE ONLY EXISTING SIZES ARE UPDATED
        // =====================================================

        const validSizes = product.sizes || [];

        for (const size of Object.keys(
            cleanedInventory
        )) {
            if (!validSizes.includes(size)) {
                return NextResponse.json(
                    {
                        success: false,
                        message:
                            `Invalid size "${size}" for this product`,
                    },
                    { status: 400 }
                );
            }
        }

        // =====================================================
        // UPDATE INVENTORY
        // =====================================================

        product.inventory = cleanedInventory;

        await product.save();

        // =====================================================
        // RESPONSE
        // =====================================================

        return NextResponse.json({
            success: true,
            message: "Inventory updated successfully",
            inventory: cleanedInventory,
        });

    } catch (error) {
        console.error(
            "UPDATE INVENTORY ERROR:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    error.message ||
                    "Failed to update inventory",
            },
            {
                status: 500,
            }
        );
    }
}