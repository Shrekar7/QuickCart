import { Inngest } from "inngest";
import { BrevoClient } from "@getbrevo/brevo";

import connectDB from "./db";
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

            const userData = {
                _id: id,

                email:
                    email_addresses?.[0]
                        ?.email_address,

                name:
                    `${first_name ?? ""} ${last_name ?? ""}`
                        .trim(),

                imageUrl:
                    image_url || "",
            };

            await connectDB();

            if (!userData.email) {
                console.error(
                    "Cannot create user: email address is missing"
                );

                return {
                    success: false,
                    reason: "email_missing",
                };
            }

            const existingByEmail =
                await User.findOne({
                    email: userData.email,
                });

            if (
                existingByEmail &&
                existingByEmail._id !== id
            ) {
                console.warn(
                    `Skipping create: email ${userData.email} already exists under a different id`
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

            return {
                success: true,
            };
        }
    );

// =====================================================
// SYNC USER UPDATION
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

            const userData = {
                _id: id,

                email:
                    email_addresses?.[0]
                        ?.email_address,

                name:
                    `${first_name ?? ""} ${last_name ?? ""}`
                        .trim(),

                imageUrl:
                    image_url || "",
            };

            await connectDB();

            if (!userData.email) {
                console.error(
                    "Cannot update user: email address is missing"
                );

                return {
                    success: false,
                    reason: "email_missing",
                };
            }

            await User.findByIdAndUpdate(
                id,
                userData
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

            batchEvents: {
                maxSize: 5,
                timeout: "5s",
            },
        },

        {
            event: "order/created",
        },

        async ({ events }) => {
            try {
                // =================================================
                // CONNECT DATABASE
                // =================================================

                await connectDB();

                const orders = [];

                // =================================================
                // PROCESS EVENTS
                // =================================================

                for (const event of events) {
                    const {
                        userId,
                        items,
                        amount,
                        subtotal,
                        tax,
                        address,
                        date,
                    } = event.data;

                    // =============================================
                    // FIND USER
                    // =============================================

                    const user =
                        await User.findById(
                            userId
                        );

                    if (!user) {
                        console.error(
                            `User not found: ${userId}`
                        );

                        continue;
                    }

                    // =============================================
                    // FIND ACTUAL ADDRESS
                    // =============================================

                    let deliveryAddress = null;

                    try {
                        // If checkout sent an address ID
                        if (
                            typeof address ===
                            "string"
                        ) {
                            deliveryAddress =
                                await Address.findById(
                                    address
                                );
                        }

                        // If an address object was already sent
                        else if (
                            address &&
                            typeof address ===
                                "object"
                        ) {
                            deliveryAddress =
                                address;
                        }

                        if (
                            !deliveryAddress
                        ) {
                            console.warn(
                                `Address not found: ${address}`
                            );
                        }
                    } catch (addressError) {
                        console.error(
                            "ADDRESS LOOKUP ERROR:",
                            addressError
                        );
                    }

                    // =============================================
                    // GET PRODUCT DETAILS
                    // =============================================

                    const emailItems =
                        await Promise.all(
                            items.map(
                                async (item) => {
                                    const product =
                                        await Product.findById(
                                            item.product
                                        );

                                    if (!product) {
                                        return {
                                            name:
                                                "Product",

                                            quantity:
                                                Number(
                                                    item.quantity
                                                ) || 1,

                                            price: 0,

                                            size:
                                                item.size ||
                                                "",
                                        };
                                    }

                                    return {
                                        name:
                                            product.name,

                                        quantity:
                                            Number(
                                                item.quantity
                                            ) || 1,

                                        price:
                                            Number(
                                                product.offerPrice
                                            ) || 0,

                                        size:
                                            item.size ||
                                            "",
                                    };
                                }
                            )
                        );

                    // =============================================
                    // CREATE ORDER
                    //
                    // IMPORTANT:
                    // We still save the original address ID.
                    // So your existing Order schema continues
                    // working exactly as before.
                    // =============================================

                    const order = {
                        userId,

                        items,

                        amount,

                        address,

                        date,
                    };

                    orders.push(order);

                    // =============================================
                    // CREATE ITEMS HTML
                    // =============================================

                    const itemsHtml =
                        emailItems
                            .map(
                                (item) => {
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
                                }
                            )
                            .join("");

                    // =============================================
                    // ADDRESS VALUES
                    // =============================================

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

                    // =============================================
                    // ADDRESS HTML
                    // =============================================

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

                    // =============================================
                    // SEND EMAIL
                    // =============================================

                    if (!user.email) {
                        console.warn(
                            `No email found for user: ${userId}`
                        );

                        continue;
                    }

                    try {
                        const emailResult =
                            await brevo.transactionalEmails.sendTransacEmail(
                                {
                                    sender: {
                                        name:
                                            "Sunshine Fancy Costumes",

                                        email:
                                            "shrekarreddy6@gmail.com",
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

                                            <meta
                                                charset="UTF-8"
                                            />

                                            <meta
                                                name="viewport"
                                                content="width=device-width, initial-scale=1.0"
                                            />

                                            <title>
                                                Order Confirmed
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
                                                            background: linear-gradient(135deg, #8B5CF6, #6D3FD6);
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
                                                                color: rgba(255,255,255,0.9);
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

                                                        <!-- SUCCESS -->

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
                                                                ${user.name || "there"}
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

                                                        <!-- ITEMS -->

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

                                                        <!-- TOTAL -->

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
                                                                            padding-bottom: 11px;
                                                                            font-size: 14px;
                                                                            color: #665777;
                                                                        "
                                                                    >
                                                                        Subtotal
                                                                    </td>

                                                                    <td
                                                                        align="right"
                                                                        style="
                                                                            padding-bottom: 11px;
                                                                            font-size: 14px;
                                                                            color: #665777;
                                                                        "
                                                                    >
                                                                        ₹${subtotal}
                                                                    </td>

                                                                </tr>

                                                                <tr>

                                                                    <td
                                                                        style="
                                                                            padding-bottom: 14px;
                                                                            border-bottom: 1px solid #EDEBFB;
                                                                            font-size: 14px;
                                                                            color: #665777;
                                                                        "
                                                                    >
                                                                        Tax
                                                                    </td>

                                                                    <td
                                                                        align="right"
                                                                        style="
                                                                            padding-bottom: 14px;
                                                                            border-bottom: 1px solid #EDEBFB;
                                                                            font-size: 14px;
                                                                            color: #665777;
                                                                        "
                                                                    >
                                                                        ₹${tax}
                                                                    </td>

                                                                </tr>

                                                                <tr>

                                                                    <td
                                                                        style="
                                                                            padding-top: 15px;
                                                                            font-size: 18px;
                                                                            font-weight: 800;
                                                                            color: #2E1A47;
                                                                        "
                                                                    >
                                                                        Total
                                                                    </td>

                                                                    <td
                                                                        align="right"
                                                                        style="
                                                                            padding-top: 15px;
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

                                                        <!-- ADDRESS -->

                                                        ${addressHtml}

                                                        <!-- MESSAGE -->

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
                            "ORDER EMAIL SENT:",
                            emailResult
                        );

                    } catch (emailError) {
                        console.error(
                            "ORDER EMAIL ERROR:",
                            emailError
                        );
                    }
                }

                // =================================================
                // SAVE ORDERS
                // =================================================

                if (orders.length > 0) {
                    await Order.insertMany(
                        orders
                    );
                }

                return {
                    success: true,

                    processed:
                        orders.length,
                };

            } catch (error) {
                console.error(
                    "CREATE USER ORDER ERROR:",
                    error
                );

                throw error;
            }
        }
    );