import connectDB from "@/config/db";
import Address from "@/models/Address";
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
                {
                    status: 401,
                }
            );
        }

        const { address } = await request.json();

        if (!address) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Address is required",
                },
                {
                    status: 400,
                }
            );
        }

        await connectDB();

        const newAddress = await Address.create({
            ...address,
            userId,
        });

        return NextResponse.json({
            success: true,
            message: "Address added successfully",
            addressId: newAddress._id.toString(),
        });
    } catch (error) {
        console.error("ADD ADDRESS ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            {
                status: 500,
            }
        );
    }
}