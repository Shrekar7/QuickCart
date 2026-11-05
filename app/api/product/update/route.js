import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    const { userId } = getAuth(request);
    const isSeller = await authSeller(userId);

    if (!isSeller) {
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 401 }
      );
    }

    const {
      productId,
      name,
      description,
      category,
      price,
      offerPrice,
    } = await request.json();

    const cleanName = String(name || "").trim();
    const cleanCategory = String(category || "").trim();
    const numericPrice = Number(price);
    const numericOfferPrice = Number(offerPrice);

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    if (!cleanName || !cleanCategory) {
      return NextResponse.json(
        { success: false, message: "Name and category are required" },
        { status: 400 }
      );
    }

    if (!(numericPrice > 0) || !(numericOfferPrice > 0)) {
      return NextResponse.json(
        { success: false, message: "Enter valid prices" },
        { status: 400 }
      );
    }

    if (numericOfferPrice > numericPrice) {
      return NextResponse.json(
        {
          success: false,
          message: "Offer price can't be higher than the price",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        name: cleanName,
        description: String(description || "").trim(),
        category: cleanCategory,
        price: numericPrice,
        offerPrice: numericOfferPrice,
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}