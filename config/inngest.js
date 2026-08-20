import { Inngest } from "inngest";
import { BrevoClient } from "@getbrevo/brevo";

import connectDB from "@/config/db";
import User from "@/models/User";
import Product from "@/models/Product";
import Order from "@/models/Order";
import Address from "@/models/Address";

// =====================================================
// INNGEST
// =====================================================

export const inngest = new Inngest({
    id: "Sunshine-next",
});

// =====================================================
// BREVO
// =====================================================

const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY,
});

// =====================================================
// SEND ORDER STATUS EMAIL
// =====================================================

const sendOrderStatusEmail = async ({
    user,
    order,
    status,
}) => {
    if (!user?.email) {
        console.warn(
            `Cannot send status email. No email found for user: ${user?._id}`
        );

        return {
            success: false,
            reason: "email_missing",
        };
    }

    // =====================================================
    // STATUS CONTENT
    // =====================================================

    let title = "";
    let message = "";
    let emoji = "";

    if (status === "Dispatched") {
        title = "Your order has been dispatched! 🚚";

        message =
            "Great news! Your Sunshine Fancy Costumes order has been dispatched and is now on its way to you.";

        emoji = "🚚";
    } else if (status === "Delivered") {
        title = "Your order has been delivered! 🎉";

        message =
            "Your Sunshine Fancy Costumes order has been successfully delivered. We hope you love your costume!";

        emoji = "🎉";
    } else {
        title = "Your order status has been updated";

        message =
            `Your order status is now ${status}.`;

        emoji = "📦";
    }

    // =====================================================
    // ORDER ITEMS
    // =====================================================

    const itemsHtml =
        order.items
            ?.map((item) => {
                const productName =
                    item.product?.name ||
                    item.name ||
                    "Product";

                const quantity =
                    Number(item.quantity) || 1;

                const size =
                    item.size || "";

                return `
                    <div
                        style="
                            padding: 16px 0;
                            border-bottom: 1px solid #eee8f5;
                        "
                    >

                        <div
                            style="
                                font-size: 15px;
                                font-weight: 700;
                                color: #2E1A47;
                            "
                        >
                            ${productName}
                        </div>

                        ${
                            size
                                ? `
                                    <div
                                        style="
                                            margin-top: 5px;
                                            font-size: 13px;
                                            color: #786A8F;
                                        "
                                    >
                                        Size: ${size}
                                    </div>
                                `
                                : ""
                        }

                        <div
                            style="
                                margin-top: 5px;
                                font-size: 13px;
                                color: #786A8F;
                            "
                        >
                            Quantity: ${quantity}
                        </div>

                    </div>
                `;
            })
            .join("") || "";

    // =====================================================
    // SEND EMAIL
    // =====================================================

    try {
        const emailResult =
            await brevo.transactionalEmails.sendTransacEmail(
                {
                    sender: {
                        name: "Sunshine Fancy Costumes",
                        email: "shrekarreddy6@gmail.com",
                    },

                    to: [
                        {
                            email: user.email,
                            name:
                                user.name ||
                                "Customer",
                        },
                    ],

                    subject:
                        `${title} - Sunshine Fancy Costumes`,

                    htmlContent: `
                        <!DOCTYPE html>

                        <html>

                        <head>
                            <meta charset="UTF-8" />

                            <meta
                                name="viewport"
                                content="width=device-width, initial-scale=1.0"
                            />

                            <title>
                                ${title}
                            </title>
                        </head>

                        <body
                            style="
                                margin: 0;
                                padding: 0;
                                background: #f7f5fb;
                                font-family: Arial, Helvetica, sans-serif;
                                color: #2E1A47;
                            "
                        >

                            <div
                                style="
                                    max-width: 620px;
                                    margin: 30px auto;
                                    padding: 0 12px;
                                "
                            >

                                <div
                                    style="
                                        background: #ffffff;
                                        border-radius: 22px;
                                        overflow: hidden;
                                        border: 1px solid #EDEBFB;
                                    "
                                >

                                    <!-- HEADER -->

                                    <div
                                        style="
                                            padding: 38px 25px;
                                            text-align: center;
                                            background: linear-gradient(
                                                135deg,
                                                #8B5CF6,
                                                #6D3FD6
                                            );
                                        "
                                    >

                                        <div
                                            style="
                                                font-size: 30px;
                                                font-weight: 800;
                                                color: #ffffff;
                                            "
                                        >
                                            Sunshine
                                        </div>

                                        <div
                                            style="
                                                margin-top: 7px;
                                                font-size: 14px;
                                                color: rgba(
                                                    255,
                                                    255,
                                                    255,
                                                    0.9
                                                );
                                            "
                                        >
                                            Fancy Costumes
                                        </div>

                                    </div>

                                    <!-- CONTENT -->

                                    <div
                                        style="
                                            padding: 35px 30px;
                                        "
                                    >

                                        <!-- ICON -->

                                        <div
                                            style="
                                                text-align: center;
                                            "
                                        >

                                            <div
                                                style="
                                                    width: 70px;
                                                    height: 70px;
                                                    margin: 0 auto 18px;
                                                    border-radius: 50%;
                                                    background: #F0EBFF;
                                                    line-height: 70px;
                                                    font-size: 32px;
                                                "
                                            >
                                                ${emoji}
                                            </div>

                                            <h1
                                                style="
                                                    margin: 0;
                                                    font-size: 25px;
                                                    color: #2E1A47;
                                                "
                                            >
                                                ${title}
                                            </h1>

                                        </div>

                                        <!-- GREETING -->

                                        <p
                                            style="
                                                margin: 30px 0 0;
                                                font-size: 16px;
                                                line-height: 1.7;
                                                color: #2E1A47;
                                            "
                                        >
                                            Hi
                                            <strong>
                                                ${
                                                    user.name ||
                                                    "there"
                                                }
                                            </strong>,
                                        </p>

                                        <p
                                            style="
                                                margin: 8px 0 0;
                                                font-size: 14px;
                                                line-height: 1.7;
                                                color: #665777;
                                            "
                                        >
                                            ${message}
                                        </p>

                                        <!-- STATUS -->

                                        <div
                                            style="
                                                margin-top: 25px;
                                                padding: 20px;
                                                background: #FAF9FF;
                                                border: 1px solid #EDEBFB;
                                                border-radius: 18px;
                                                text-align: center;
                                            "
                                        >

                                            <div
                                                style="
                                                    font-size: 11px;
                                                    font-weight: 800;
                                                    text-transform: uppercase;
                                                    letter-spacing: 1.5px;
                                                    color: #8B5CF6;
                                                "
                                            >
                                                Current Order Status
                                            </div>

                                            <div
                                                style="
                                                    margin-top: 9px;
                                                    font-size: 20px;
                                                    font-weight: 800;
                                                    color: #2E1A47;
                                                "
                                            >
                                                ${status}
                                            </div>

                                        </div>

                                        <!-- ORDER ITEMS -->

                                        <div
                                            style="
                                                margin-top: 20px;
                                                padding: 22px;
                                                border: 1px solid #EDEBFB;
                                                border-radius: 18px;
                                            "
                                        >

                                            <div
                                                style="
                                                    margin-bottom: 5px;
                                                    font-size: 12px;
                                                    font-weight: 800;
                                                    text-transform: uppercase;
                                                    letter-spacing: 1.5px;
                                                    color: #8B5CF6;
                                                "
                                            >
                                                Your Order
                                            </div>

                                            ${itemsHtml}

                                        </div>

                                        <!-- TOTAL -->

                                        <div
                                            style="
                                                margin-top: 20px;
                                                padding: 20px;
                                                background: #FAF9FF;
                                                border-radius: 18px;
                                                border: 1px solid #EDEBFB;
                                            "
                                        >

                                            <table
                                                width="100%"
                                                cellpadding="0"
                                                cellspacing="0"
                                                style="
                                                    border-collapse: collapse;
                                                "
                                            >

                                                <tr>

                                                    <td
                                                        style="
                                                            font-size: 14px;
                                                            color: #665777;
                                                        "
                                                    >
                                                        Order Total
                                                    </td>

                                                    <td
                                                        align="right"
                                                        style="
                                                            font-size: 18px;
                                                            font-weight: 800;
                                                            color: #2E1A47;
                                                        "
                                                    >
                                                        ₹${order.amount}
                                                    </td>

                                                </tr>

                                            </table>

                                        </div>

                                        <!-- PAYMENT -->

                                        <div
                                            style="
                                                margin-top: 15px;
                                                padding: 15px;
                                                background: #FFF9E8;
                                                border-radius: 14px;
                                                text-align: center;
                                                font-size: 13px;
                                                color: #786A8F;
                                            "
                                        >
                                            Payment Method:
                                            <strong>
                                                Cash on Delivery
                                            </strong>
                                        </div>

                                        <!-- FOOTER MESSAGE -->

                                        <div
                                            style="
                                                margin-top: 25px;
                                                padding: 20px;
                                                background: #F6F1FF;
                                                border-radius: 16px;
                                                text-align: center;
                                            "
                                        >

                                            <p
                                                style="
                                                    margin: 0;
                                                    font-size: 14px;
                                                    line-height: 1.7;
                                                    color: #5B4B75;
                                                "
                                            >
                                                ${
                                                    status ===
                                                    "Delivered"
                                                        ? "Thank you for shopping with Sunshine Fancy Costumes! ❤️"
                                                        : "Thank you for choosing Sunshine Fancy Costumes! ❤️"
                                                }
                                            </p>

                                        </div>

                                        <!-- FOOTER -->

                                        <div
                                            style="
                                                margin-top: 30px;
                                                padding-top: 22px;
                                                border-top: 1px solid #eee8f5;
                                                text-align: center;
                                            "
                                        >

                                            <p
                                                style="
                                                    margin: 0;
                                                    font-size: 13px;
                                                    color: #786A8F;
                                                "
                                            >
                                                Thank you for shopping with us
                                            </p>

                                            <p
                                                style="
                                                    margin: 7px 0 0;
                                                    font-size: 14px;
                                                    font-weight: 700;
                                                    color: #8B5CF6;
                                                "
                                            >
                                                Sunshine Fancy Costumes
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </body>

                        </html>
                    `,
                }
            );

        console.log(
            `ORDER STATUS EMAIL SENT: ${status}`,
            emailResult
        );

        return {
            success: true,
        };

    } catch (error) {
        console.error(
            `ORDER STATUS EMAIL ERROR (${status}):`,
            error
        );

        return {
            success: false,
            error: error.message,
        };
    }
};

// =====================================================
// SYNC USER CREATION
// =====================================================

export const syncUserCreation =
    inngest.createFunction(
        {
            id: "sync-user-from-clerk",
        },

        {
            event: "clerk/user.created",
        },

        async ({ event }) => {
            const {
                id,
                first_name,
                last_name,
                email_addresses,
                image_url,
            } = event.data;

            await connectDB();

            const email =
                email_addresses?.[0]?.email_address;

            if (!email) {
                console.error(
                    "Cannot create user: email address is missing"
                );

                return {
                    success: false,
                    reason: "email_missing",
                };
            }

            const userData = {
                _id: id,

                email,

                name:
                    `${first_name ?? ""} ${
                        last_name ?? ""
                    }`.trim(),

                imageUrl: image_url || "",
            };

            const existingByEmail =
                await User.findOne({
                    email,
                });

            if (
                existingByEmail &&
                existingByEmail._id !== id
            ) {
                console.warn(
                    `Email ${email} already belongs to another user`
                );

                return {
                    success: false,
                    reason: "email_conflict",
                };
            }

            await User.findByIdAndUpdate(
                id,
                userData,
                {
                    upsert: true,
                    new: true,
                    setDefaultsOnInsert: true,
                }
            );

            console.log(
                "USER CREATED/SYNCED:",
                id
            );

            return {
                success: true,
            };
        }
    );

// =====================================================
// SYNC USER UPDATE
// =====================================================

export const syncUserUpdation =
    inngest.createFunction(
        {
            id: "update-user-from-clerk",
        },

        {
            event: "clerk/user.updated",
        },

        async ({ event }) => {
            const {
                id,
                first_name,
                last_name,
                email_addresses,
                image_url,
            } = event.data;

            await connectDB();

            const userData = {
                email:
                    email_addresses?.[0]
                        ?.email_address,

                name:
                    `${first_name ?? ""} ${
                        last_name ?? ""
                    }`.trim(),

                imageUrl: image_url || "",
            };

            await User.findByIdAndUpdate(
                id,
                userData
            );

            console.log(
                "USER UPDATED:",
                id
            );

            return {
                success: true,
            };
        }
    );

// =====================================================
// SYNC USER DELETION
// =====================================================

export const syncUserDeletion =
    inngest.createFunction(
        {
            id: "delete-user-with-clerk",
        },

        {
            event: "clerk/user.deleted",
        },

        async ({ event }) => {
            const { id } = event.data;

            await connectDB();

            await User.findByIdAndDelete(id);

            console.log(
                "USER DELETED:",
                id
            );

            return {
                success: true,
            };
        }
    );

// =====================================================
// CREATE USER ORDER
// =====================================================

export const createUserOrder =
    inngest.createFunction(
        {
            id: "create-user-order",
        },

        {
            event: "order/created",
        },

        async ({ event }) => {
            try {
                console.log(
                    "================================="
                );

                console.log(
                    "CREATE USER ORDER FUNCTION STARTED"
                );

                console.log(
                    "EVENT:",
                    JSON.stringify(
                        event.data,
                        null,
                        2
                    )
                );

                console.log(
                    "================================="
                );

                await connectDB();

                const {
                    userId,
                    items,
                    amount,
                    address,
                    date,
                } = event.data;

                // =================================================
                // VALIDATE EVENT
                // =================================================

                if (
                    !userId ||
                    !Array.isArray(items) ||
                    items.length === 0
                ) {
                    throw new Error(
                        "Invalid order event data"
                    );
                }

                // =================================================
                // FIND USER
                // =================================================

                const user =
                    await User.findById(userId);

                if (!user) {
                    throw new Error(
                        `User not found: ${userId}`
                    );
                }

                // =================================================
                // FIND ADDRESS
                // =================================================

                let deliveryAddress = null;

                try {
                    if (
                        typeof address ===
                        "string"
                    ) {
                        deliveryAddress =
                            await Address.findById(
                                address
                            );
                    } else if (
                        address &&
                        typeof address ===
                            "object"
                    ) {
                        deliveryAddress =
                            address;
                    }
                } catch (addressError) {
                    console.error(
                        "ADDRESS LOOKUP ERROR:",
                        addressError
                    );
                }

                // =================================================
                // DECREASE INVENTORY
                // =================================================

                for (const item of items) {
                    const product =
                        await Product.findById(
                            item.product
                        );

                    if (!product) {
                        throw new Error(
                            `Product not found: ${item.product}`
                        );
                    }

                    const quantity =
                        Number(item.quantity) || 1;

                    const size =
                        item.size?.trim() || "";

                    console.log(
                        "================================="
                    );

                    console.log(
                        "PROCESSING INVENTORY"
                    );

                    console.log(
                        "PRODUCT:",
                        product.name
                    );

                    console.log(
                        "PRODUCT ID:",
                        product._id.toString()
                    );

                    console.log(
                        "SIZE:",
                        size || "NO SIZE"
                    );

                    console.log(
                        "QUANTITY:",
                        quantity
                    );

                    console.log(
                        "INVENTORY BEFORE:",
                        product.inventory
                    );

                    // =================================================
                    // SIZE INVENTORY
                    // =================================================

                    if (size) {
                        if (
                            !product.inventory
                        ) {
                            throw new Error(
                                `${product.name} does not have inventory configured`
                            );
                        }

                        let currentStock;

                        if (
                            product.inventory instanceof
                            Map
                        ) {
                            currentStock =
                                product.inventory.get(
                                    size
                                );
                        } else {
                            currentStock =
                                product.inventory[
                                    size
                                ];
                        }

                        console.log(
                            "CURRENT STOCK:",
                            currentStock
                        );

                        if (
                            currentStock ===
                                undefined ||
                            currentStock === null
                        ) {
                            throw new Error(
                                `Size ${size} is not available for ${product.name}`
                            );
                        }

                        if (
                            Number(
                                currentStock
                            ) < quantity
                        ) {
                            throw new Error(
                                `Not enough stock for ${product.name} (${size}). Available: ${currentStock}`
                            );
                        }

                        const newStock =
                            Number(
                                currentStock
                            ) - quantity;

                        // =================================================
                        // UPDATE MAP
                        // =================================================

                        if (
                            product.inventory instanceof
                            Map
                        ) {
                            product.inventory.set(
                                size,
                                newStock
                            );
                        } else {
                            product.inventory[
                                size
                            ] = newStock;
                        }

                        product.markModified(
                            "inventory"
                        );

                        console.log(
                            "NEW STOCK:",
                            newStock
                        );
                    }

                    // =================================================
                    // NON-SIZE INVENTORY
                    // =================================================

                    else {
                        let currentStock =
                            Number(
                                product.inventory
                            );

                        if (
                            Number.isNaN(
                                currentStock
                            )
                        ) {
                            throw new Error(
                                `Invalid inventory for ${product.name}`
                            );
                        }

                        if (
                            currentStock <
                            quantity
                        ) {
                            throw new Error(
                                `Not enough stock for ${product.name}. Available: ${currentStock}`
                            );
                        }

                        product.inventory =
                            currentStock -
                            quantity;
                    }

                    // =================================================
                    // SAVE PRODUCT
                    // =================================================

                    await product.save();

                    console.log(
                        "INVENTORY UPDATED:",
                        product.name,
                        size
                            ? `Size: ${size}`
                            : "No size",
                        quantity
                    );

                    console.log(
                        "INVENTORY AFTER:",
                        product.inventory
                    );

                    console.log(
                        "================================="
                    );
                }

                // =================================================
                // GET PRODUCT DETAILS
                // =================================================

                const emailItems =
                    await Promise.all(
                        items.map(
                            async (item) => {
                                const product =
                                    await Product.findById(
                                        item.product
                                    );

                                return {
                                    name:
                                        product?.name ||
                                        "Product",

                                    quantity:
                                        Number(
                                            item.quantity
                                        ) || 1,

                                    price:
                                        Number(
                                            product?.offerPrice
                                        ) || 0,

                                    size:
                                        item.size ||
                                        "",
                                };
                            }
                        )
                    );

                // =================================================
                // CREATE ORDER
                // =================================================

                const orderData = {
                    userId,

                    items,

                    amount,

                    address,

                    date:
                        date ||
                        Date.now(),
                };

                const createdOrder =
                    await Order.create(
                        orderData
                    );

                console.log(
                    "================================="
                );

                console.log(
                    "ORDER CREATED SUCCESSFULLY"
                );

                console.log(
                    "ORDER ID:",
                    createdOrder._id.toString()
                );

                console.log(
                    "================================="
                );

                // =================================================
                // ORDER ITEMS HTML
                // =================================================

                const itemsHtml =
                    emailItems
                        .map((item) => {
                            const itemTotal =
                                item.price *
                                item.quantity;

                            return `
                                <div
                                    style="
                                        padding: 18px 0;
                                        border-bottom: 1px solid #eee8f5;
                                    "
                                >

                                    <div
                                        style="
                                            font-size: 15px;
                                            font-weight: 700;
                                            color: #2E1A47;
                                        "
                                    >
                                        ${item.name}
                                    </div>

                                    ${
                                        item.size
                                            ? `
                                                <div
                                                    style="
                                                        margin-top: 5px;
                                                        font-size: 13px;
                                                        color: #786A8F;
                                                    "
                                                >
                                                    Size: ${item.size}
                                                </div>
                                            `
                                            : ""
                                    }

                                    <div
                                        style="
                                            margin-top: 5px;
                                            font-size: 13px;
                                            color: #786A8F;
                                        "
                                    >
                                        Quantity:
                                        ${item.quantity}
                                    </div>

                                    <div
                                        style="
                                            margin-top: 8px;
                                            font-size: 15px;
                                            font-weight: 700;
                                            color: #2E1A47;
                                        "
                                    >
                                        ₹${itemTotal}
                                    </div>

                                </div>
                            `;
                        })
                        .join("");

                // =================================================
                // ADDRESS VALUES
                // =================================================

                const fullName =
                    deliveryAddress?.fullName ||
                    "";

                const phoneNumber =
                    deliveryAddress?.phoneNumber ||
                    "";

                const area =
                    deliveryAddress?.area ||
                    "";

                const city =
                    deliveryAddress?.city ||
                    "";

                const state =
                    deliveryAddress?.state ||
                    "";

                const pincode =
                    deliveryAddress?.pincode ||
                    "";

                const country =
                    deliveryAddress?.country ||
                    "India";

                // =================================================
                // ADDRESS HTML
                // =================================================

                const addressHtml = `
                    <div
                        style="
                            margin-top: 28px;
                            padding: 24px;
                            background: #FAF9FF;
                            border: 1px solid #EDEBFB;
                            border-radius: 18px;
                        "
                    >

                        <div
                            style="
                                margin-bottom: 18px;
                                font-size: 12px;
                                font-weight: 800;
                                text-transform: uppercase;
                                letter-spacing: 1.5px;
                                color: #8B5CF6;
                            "
                        >
                            Delivery Address
                        </div>

                        ${
                            fullName
                                ? `
                                    <div
                                        style="
                                            margin-bottom: 12px;
                                            font-size: 16px;
                                            font-weight: 700;
                                            color: #2E1A47;
                                        "
                                    >
                                        ${fullName}
                                    </div>
                                `
                                : ""
                        }

                        ${
                            phoneNumber
                                ? `
                                    <div
                                        style="
                                            margin-bottom: 9px;
                                            font-size: 14px;
                                            color: #5B4B75;
                                        "
                                    >
                                        <strong>Phone:</strong>
                                        ${phoneNumber}
                                    </div>
                                `
                                : ""
                        }

                        ${
                            area
                                ? `
                                    <div
                                        style="
                                            margin-bottom: 7px;
                                            font-size: 14px;
                                            line-height: 1.6;
                                            color: #5B4B75;
                                        "
                                    >
                                        ${area}
                                    </div>
                                `
                                : ""
                        }

                        ${
                            city
                                ? `
                                    <div
                                        style="
                                            margin-bottom: 7px;
                                            font-size: 14px;
                                            color: #5B4B75;
                                        "
                                    >
                                        ${city}
                                    </div>
                                `
                                : ""
                        }

                        ${
                            state ||
                            pincode
                                ? `
                                    <div
                                        style="
                                            margin-bottom: 7px;
                                            font-size: 14px;
                                            color: #5B4B75;
                                        "
                                    >
                                        ${state}${
                                            state &&
                                            pincode
                                                ? " - "
                                                : ""
                                        }${pincode}
                                    </div>
                                `
                                : ""
                        }

                        ${
                            country
                                ? `
                                    <div
                                        style="
                                            font-size: 14px;
                                            color: #5B4B75;
                                        "
                                    >
                                        ${country}
                                    </div>
                                `
                                : ""
                        }

                    </div>
                `;

                // =================================================
                // SEND ORDER CONFIRMATION EMAIL
                // =================================================

                if (user.email) {
                    try {
                        await brevo.transactionalEmails.sendTransacEmail(
                            {
                                sender: {
                                    name: "Sunshine Fancy Costumes",
                                    email: "shrekarreddy6@gmail.com",
                                },

                                to: [
                                    {
                                        email:
                                            user.email,

                                        name:
                                            user.name ||
                                            "Customer",
                                    },
                                ],

                                subject:
                                    "Your Sunshine Fancy Costumes order is confirmed 🎉",

                                htmlContent: `
                                    <!DOCTYPE html>

                                    <html>

                                    <head>
                                        <meta charset="UTF-8" />

                                        <meta
                                            name="viewport"
                                            content="width=device-width, initial-scale=1.0"
                                        />
                                    </head>

                                    <body
                                        style="
                                            margin: 0;
                                            padding: 0;
                                            background: #f7f5fb;
                                            font-family: Arial, Helvetica, sans-serif;
                                            color: #2E1A47;
                                        "
                                    >

                                        <div
                                            style="
                                                max-width: 620px;
                                                margin: 30px auto;
                                                padding: 0 12px;
                                            "
                                        >

                                            <div
                                                style="
                                                    background: #ffffff;
                                                    border-radius: 22px;
                                                    overflow: hidden;
                                                    border: 1px solid #EDEBFB;
                                                "
                                            >

                                                <div
                                                    style="
                                                        padding: 38px 25px;
                                                        text-align: center;
                                                        background: linear-gradient(
                                                            135deg,
                                                            #8B5CF6,
                                                            #6D3FD6
                                                        );
                                                    "
                                                >

                                                    <div
                                                        style="
                                                            font-size: 30px;
                                                            font-weight: 800;
                                                            color: #ffffff;
                                                        "
                                                    >
                                                        Sunshine
                                                    </div>

                                                    <div
                                                        style="
                                                            margin-top: 7px;
                                                            font-size: 14px;
                                                            color: rgba(
                                                                255,
                                                                255,
                                                                255,
                                                                0.9
                                                            );
                                                        "
                                                    >
                                                        Fancy Costumes
                                                    </div>

                                                </div>

                                                <div
                                                    style="
                                                        padding: 35px 30px;
                                                    "
                                                >

                                                    <div
                                                        style="
                                                            text-align: center;
                                                        "
                                                    >

                                                        <div
                                                            style="
                                                                width: 64px;
                                                                height: 64px;
                                                                margin: 0 auto 16px;
                                                                border-radius: 50%;
                                                                background: #F0EBFF;
                                                                line-height: 64px;
                                                                font-size: 31px;
                                                                color: #8B5CF6;
                                                            "
                                                        >
                                                            ✓
                                                        </div>

                                                        <h1
                                                            style="
                                                                margin: 0;
                                                                font-size: 26px;
                                                                color: #2E1A47;
                                                            "
                                                        >
                                                            Order Confirmed!
                                                        </h1>

                                                        <p
                                                            style="
                                                                margin: 10px 0 0;
                                                                font-size: 14px;
                                                                color: #786A8F;
                                                            "
                                                        >
                                                            Thank you for shopping with Sunshine.
                                                        </p>

                                                    </div>

                                                    <p
                                                        style="
                                                            margin: 30px 0 0;
                                                            font-size: 16px;
                                                            line-height: 1.7;
                                                        "
                                                    >
                                                        Hi
                                                        <strong>
                                                            ${
                                                                user.name ||
                                                                "there"
                                                            }
                                                        </strong>,
                                                    </p>

                                                    <p
                                                        style="
                                                            margin: 8px 0 0;
                                                            font-size: 14px;
                                                            line-height: 1.7;
                                                            color: #665777;
                                                        "
                                                    >
                                                        Your order has been successfully placed.
                                                        Here are your order details.
                                                    </p>

                                                    <div
                                                        style="
                                                            margin-top: 25px;
                                                            padding: 22px;
                                                            border: 1px solid #EDEBFB;
                                                            border-radius: 18px;
                                                        "
                                                    >

                                                        <div
                                                            style="
                                                                margin-bottom: 4px;
                                                                font-size: 12px;
                                                                font-weight: 800;
                                                                text-transform: uppercase;
                                                                letter-spacing: 1.5px;
                                                                color: #8B5CF6;
                                                            "
                                                        >
                                                            Your Items
                                                        </div>

                                                        ${itemsHtml}

                                                    </div>

                                                    <div
                                                        style="
                                                            margin-top: 20px;
                                                            padding: 22px;
                                                            background: #FAF9FF;
                                                            border-radius: 18px;
                                                            border: 1px solid #EDEBFB;
                                                        "
                                                    >

                                                        <table
                                                            width="100%"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            style="
                                                                border-collapse: collapse;
                                                            "
                                                        >

                                                            <tr>

                                                                <td
                                                                    style="
                                                                        font-size: 14px;
                                                                        color: #665777;
                                                                    "
                                                                >
                                                                    Total
                                                                </td>

                                                                <td
                                                                    align="right"
                                                                    style="
                                                                        font-size: 18px;
                                                                        font-weight: 800;
                                                                        color: #2E1A47;
                                                                    "
                                                                >
                                                                    ₹${amount}
                                                                </td>

                                                            </tr>

                                                        </table>

                                                    </div>

                                                    ${addressHtml}

                                                    <div
                                                        style="
                                                            margin-top: 28px;
                                                            padding: 20px;
                                                            background: #F6F1FF;
                                                            border-radius: 16px;
                                                            text-align: center;
                                                        "
                                                    >

                                                        <p
                                                            style="
                                                                margin: 0;
                                                                font-size: 14px;
                                                                line-height: 1.7;
                                                                color: #5B4B75;
                                                            "
                                                        >
                                                            We'll start preparing your costume soon.
                                                            Thank you for choosing Sunshine Fancy Costumes! ❤️
                                                        </p>

                                                    </div>

                                                </div>

                                            </div>

                                        </div>

                                    </body>

                                    </html>
                                `,
                            }
                        );

                        console.log(
                            "ORDER CONFIRMATION EMAIL SENT"
                        );

                    } catch (emailError) {
                        console.error(
                            "ORDER CONFIRMATION EMAIL ERROR:",
                            emailError
                        );

                        // IMPORTANT:
                        // Email failure must NOT cancel the order.
                    }
                }

                // =================================================
                // COMPLETE
                // =================================================

                console.log(
                    "================================="
                );

                console.log(
                    "CREATE USER ORDER COMPLETED"
                );

                console.log(
                    "ORDER ID:",
                    createdOrder._id.toString()
                );

                console.log(
                    "================================="
                );

                return {
                    success: true,

                    orderId:
                        createdOrder._id.toString(),

                    processed: true,
                };

            } catch (error) {
                console.error(
                    "================================="
                );

                console.error(
                    "CREATE USER ORDER ERROR:"
                );

                console.error(error);

                console.error(
                    "================================="
                );

                throw error;
            }
        }
    );

// =====================================================
// ORDER STATUS UPDATED
// =====================================================

export const orderStatusUpdated =
    inngest.createFunction(
        {
            id: "order-status-updated",
        },

        {
            event: "order/status-updated",
        },

        async ({ event }) => {
            try {
                await connectDB();

                const {
                    orderId,
                    status,
                } = event.data;

                console.log(
                    "================================="
                );

                console.log(
                    "ORDER STATUS EVENT:"
                );

                console.log(
                    "ORDER ID:",
                    orderId
                );

                console.log(
                    "STATUS:",
                    status
                );

                console.log(
                    "================================="
                );

                // =================================================
                // ONLY EMAIL THESE STATUSES
                // =================================================

                if (
                    status !== "Dispatched" &&
                    status !== "Delivered"
                ) {
                    console.log(
                        "STATUS EMAIL SKIPPED:",
                        status
                    );

                    return {
                        success: true,
                        skipped: true,
                    };
                }

                // =================================================
                // FIND ORDER
                // =================================================

                const order =
                    await Order.findById(
                        orderId
                    );

                if (!order) {
                    throw new Error(
                        `Order not found: ${orderId}`
                    );
                }

                // =================================================
                // FIND USER
                // =================================================

                const user =
                    await User.findById(
                        order.userId
                    );

                if (!user) {
                    throw new Error(
                        `User not found: ${order.userId}`
                    );
                }

                // =================================================
                // SEND STATUS EMAIL
                // =================================================

                const result =
                    await sendOrderStatusEmail({
                        user,
                        order,
                        status,
                    });

                console.log(
                    "ORDER STATUS EMAIL RESULT:",
                    result
                );

                return {
                    success: true,

                    status,

                    orderId,

                    email:
                        result.success,
                };

            } catch (error) {
                console.error(
                    "================================="
                );

                console.error(
                    "ORDER STATUS EMAIL FUNCTION ERROR:"
                );

                console.error(error);

                console.error(
                    "================================="
                );

                throw error;
            }
        }
    );
    export const testInngest = inngest.createFunction(
    {
        id: "test-inngest",
    },
    {
        event: "test/hello",
    },
    async ({ event }) => {
        console.log("=================================");
        console.log("🔥 TEST INNGEST FUNCTION RAN");
        console.log("EVENT:", event);
        console.log("=================================");

        return {
            success: true,
            message: "Inngest is working",
        };
    }
);