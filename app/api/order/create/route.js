import connectDB from "@/config/db";
import { inngest } from "@/config/inngest";
import Product from "@/models/Product";
import User from "@/models/User";
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

        const { address, items } = await request.json();

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
                { status: 400 }
            );
        }

        // =====================================================
        // CONNECT DATABASE
        // =====================================================

        await connectDB();

        // =====================================================
        // NORMALIZE ITEMS
        // =====================================================

        const normalizedItems = items.map((item) => {
            let productId = item.product;
            let size = item.size || "";

            // -------------------------------------------------
            // SUPPORT OLD productId::size FORMAT
            // -------------------------------------------------

            if (
                typeof productId === "string" &&
                productId.includes("::")
            ) {
                const parts = productId.split("::");

                productId = parts[0];

                if (!size) {
                    size = parts[1] || "";
                }
            }

            return {
                product: productId,

                quantity:
                    Number(item.quantity) > 0
                        ? Number(item.quantity)
                        : 1,

                size: size?.trim() || "",
            };
        });

        // =====================================================
        // DEBUG - NORMALIZED ORDER ITEMS
        // =====================================================

        console.log("=================================");
        console.log("NORMALIZED ORDER ITEMS");
        console.log(
            JSON.stringify(
                normalizedItems,
                null,
                2
            )
        );
        console.log("=================================");

        // =====================================================
        // GET PRODUCTS
        // =====================================================

        const productIds = normalizedItems.map(
            (item) => item.product
        );

        const products = await Product.find({
            _id: { $in: productIds },
        }).lean();

        console.log("=================================");
        console.log(
            "PRODUCTS FOUND:",
            products.length
        );
        console.log("=================================");

        // =====================================================
        // CALCULATE SUBTOTAL
        // VALIDATE PRODUCTS
        // VALIDATE SIZES
        // VALIDATE STOCK
        // =====================================================

        let subtotal = 0;

        for (const item of normalizedItems) {
            const product = products.find(
                (p) =>
                    p._id.toString() ===
                    item.product.toString()
            );

            // -------------------------------------------------
            // PRODUCT NOT FOUND
            // -------------------------------------------------

            if (!product) {
                return NextResponse.json(
                    {
                        success: false,
                        message: `Product not found: ${item.product}`,
                    },
                    { status: 400 }
                );
            }

            const quantity = item.quantity;

            // =================================================
            // DEBUG PRODUCT
            // =================================================

            console.log("=================================");
            console.log(
                "ORDER PRODUCT:",
                product.name
            );
            console.log(
                "PRODUCT ID:",
                product._id.toString()
            );
            console.log(
                "SIZE:",
                item.size || "NO SIZE"
            );
            console.log(
                "QUANTITY:",
                quantity
            );
            console.log(
                "CURRENT INVENTORY:",
                product.inventory
            );
            console.log("=================================");

            // =================================================
            // SIZE PRICE
            // =================================================

            let price =
                Number(product.offerPrice) || 0;

            if (
                item.size &&
                product.sizePrices
            ) {
                const sizePrices =
                    product.sizePrices;

                let sizePrice;

                if (
                    sizePrices instanceof Map
                ) {
                    sizePrice =
                        sizePrices.get(
                            item.size
                        );
                } else {
                    sizePrice =
                        sizePrices[item.size];
                }

                if (
                    sizePrice !== undefined &&
                    sizePrice !== null
                ) {
                    price =
                        Number(sizePrice);
                }
            }

            // =================================================
            // INVENTORY VALIDATION
            // =================================================

            if (item.size) {
                if (!product.inventory) {
                    return NextResponse.json(
                        {
                            success: false,
                            message:
                                `${product.name} does not have inventory configured.`,
                        },
                        { status: 400 }
                    );
                }

                let currentStock;

                if (
                    product.inventory instanceof Map
                ) {
                    currentStock =
                        product.inventory.get(
                            item.size
                        );
                } else {
                    currentStock =
                        product.inventory[
                            item.size
                        ];
                }

                // -------------------------------------------------
                // SIZE DOES NOT EXIST
                // -------------------------------------------------

                if (
                    currentStock === undefined ||
                    currentStock === null
                ) {
                    return NextResponse.json(
                        {
                            success: false,
                            message:
                                `Size ${item.size} is not available for ${product.name}.`,
                        },
                        { status: 400 }
                    );
                }

                // -------------------------------------------------
                // NOT ENOUGH STOCK
                // -------------------------------------------------

                if (
                    Number(currentStock) <
                    quantity
                ) {
                    return NextResponse.json(
                        {
                            success: false,
                            message:
                                `Only ${currentStock} available for ${product.name} - Size ${item.size}.`,
                        },
                        { status: 400 }
                    );
                }

                // -------------------------------------------------
                // DEBUG STOCK VALIDATION
                // -------------------------------------------------

                console.log("=================================");
                console.log(
                    "STOCK VALIDATION PASSED"
                );
                console.log(
                    "PRODUCT:",
                    product.name
                );
                console.log(
                    "SIZE:",
                    item.size
                );
                console.log(
                    "CURRENT STOCK:",
                    currentStock
                );
                console.log(
                    "ORDER QUANTITY:",
                    quantity
                );
                console.log(
                    "EXPECTED NEW STOCK:",
                    Number(currentStock) -
                        quantity
                );
                console.log("=================================");
            }

            // =================================================
            // ADD TO SUBTOTAL
            // =================================================

            subtotal +=
                price * quantity;
        }

        // =====================================================
        // TAX
        // =====================================================

        const tax = Math.floor(
            subtotal * 0.02
        );

        // =====================================================
        // TOTAL
        // =====================================================

        const totalAmount =
            subtotal + tax;

        // =====================================================
        // DEBUG BEFORE INNGEST
        // =====================================================

        console.log("=================================");
        console.log(
            "SENDING ORDER TO INNGEST"
        );
        console.log(
            "USER ID:",
            userId
        );
        console.log(
            "ORDER ITEMS:"
        );
        console.log(
            JSON.stringify(
                normalizedItems,
                null,
                2
            )
        );
        console.log(
            "SUBTOTAL:",
            subtotal
        );
        console.log(
            "TAX:",
            tax
        );
        console.log(
            "TOTAL:",
            totalAmount
        );
        console.log("=================================");

        // =====================================================
        // SEND ORDER TO INNGEST
        // =====================================================

        const inngestResponse =
            await inngest.send({
                name: "order/created",

                data: {
                    userId,

                    address,

                    items: normalizedItems,

                    subtotal,

                    tax,

                    amount: totalAmount,

                    date: Date.now(),
                },
            });

        // =====================================================
        // DEBUG INNGEST RESPONSE
        // =====================================================

        console.log("=================================");
        console.log(
            "INNGEST EVENT SENT SUCCESSFULLY"
        );
        console.log(
            "INNGEST RESPONSE:",
            inngestResponse
        );
        console.log("=================================");

        // =====================================================
        // CLEAR CART
        // =====================================================

        const user =
            await User.findById(userId);

        if (user) {
            user.CartItems = {};

            await user.save();

            console.log(
                "CART CLEARED FOR USER:",
                userId
            );
        }

        // =====================================================
        // SUCCESS
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
        // =====================================================
        // ERROR
        // =====================================================

        console.error(
            "================================="
        );

        console.error(
            "CREATE ORDER ERROR:"
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
                    "Something went wrong",
            },
            { status: 500 }
        );
    }
}