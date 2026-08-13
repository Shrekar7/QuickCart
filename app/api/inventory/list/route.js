import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        // =====================================================
        // GET CURRENT USER
        // =====================================================

        const { userId } = getAuth(request);

        console.log("=================================");
        console.log("CURRENT USER ID:", userId);
        console.log("=================================");

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
        // GET ALL PRODUCTS
        //
        // TEMPORARILY using {} instead of { userId }
        // so we can check how many products exist.
        // =====================================================

        const products = await Product.find({})
            .sort({ date: -1 })
            .lean();

        // =====================================================
        // DEBUG INFORMATION
        // =====================================================

        console.log("=================================");
        console.log(
            "TOTAL PRODUCTS IN DATABASE:",
            products.length
        );

        console.log("=================================");
        console.log("PRODUCT DETAILS:");

        products.forEach((product, index) => {
            console.log(
                `${index + 1}. ${product.name}`
            );

            console.log(
                "   Product ID:",
                product._id
            );

            console.log(
                "   Seller ID:",
                product.userId
            );

            console.log(
                "   Current User:",
                userId
            );

            console.log(
                "   Sizes:",
                product.sizes
            );

            console.log(
                "   Inventory:",
                product.inventory
            );

            console.log("---------------------------------");
        });

        console.log("=================================");

        // =====================================================
        // FORMAT PRODUCTS
        // =====================================================

        const formattedProducts =
            products.map((product) => {

                let inventory = {};

                // -------------------------------------------------
                // MONGOOSE MAP
                // -------------------------------------------------

                if (
                    product.inventory instanceof Map
                ) {
                    inventory =
                        Object.fromEntries(
                            product.inventory
                        );
                }

                // -------------------------------------------------
                // NORMAL OBJECT
                // -------------------------------------------------

                else if (
                    product.inventory &&
                    typeof product.inventory ===
                        "object"
                ) {
                    inventory =
                        product.inventory;
                }

                // -------------------------------------------------
                // CREATE INVENTORY ENTRY FOR EVERY SIZE
                // -------------------------------------------------

                const finalInventory = {};

                (product.sizes || []).forEach(
                    (size) => {
                        finalInventory[size] =
                            Number(
                                inventory[size] || 0
                            );
                    }
                );

                return {
                    ...product,

                    inventory:
                        finalInventory,
                };
            });

        // =====================================================
        // RESPONSE
        // =====================================================

        return NextResponse.json({
            success: true,

            products:
                formattedProducts,

            count:
                formattedProducts.length,
        });

    } catch (error) {

        console.error(
            "================================="
        );

        console.error(
            "GET INVENTORY ERROR:"
        );

        console.error(error);

        console.error(
            "================================="
        );

        return NextResponse.json(
            {
                success: false,

                message:
                    error.message ||
                    "Failed to load inventory",
            },
            {
                status: 500,
            }
        );
    }
}