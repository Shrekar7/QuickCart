import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    userId: { type: String, required: true, ref: "user" },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    sizingMode: {
        type: String,
        enum: ["age", "size"],
        required: true,
    },
    sizes: {
        type: [String],
        required: true,
        validate: {
            validator: (arr) => arr.length > 0,
            message: "At least one size or age range is required",
        },
    },
    date: { type: Number, required: true },
});

const Product = mongoose.models.product || mongoose.model("product", productSchema);

export default Product;