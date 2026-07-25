import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    productId: { type: String, required: true, ref: "product" },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    date: { type: Number, required: true },
});

// One review per user per product — resubmitting updates their existing review
reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

const Review = mongoose.models.review || mongoose.model("review", reviewSchema);

export default Review;