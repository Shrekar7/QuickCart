import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        ref: "user",
    },

    name: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    // Default/base MRP
    price: {
        type: Number,
        required: true,
    },

    // Default/base offer price
    offerPrice: {
        type: Number,
        required: true,
    },

    image: {
        type: Array,
        required: true,
    },

    category: {
        type: String,
        required: true,
    },

    // "age" for age ranges
    // "size" for S, M, L, XL etc.
    sizingMode: {
        type: String,
        enum: ["age", "size"],
        required: true,
    },

    // Example:
    // ["S", "M", "L", "XL"]
    //
    // or:
    // ["2-3 Years", "4-5 Years", "6-7 Years"]
    sizes: {
        type: [String],
        required: true,
        validate: {
            validator: (arr) => arr.length > 0,
            message: "At least one size or age range is required",
        },
    },

    // Price for each size / age range
    //
    // Example:
    // {
    //     "S": 499,
    //     "M": 599,
    //     "L": 699,
    //     "XL": 799
    // }
    //
    sizePrices: {
        type: Map,
        of: Number,
        default: {},
    },

    // =====================================================
    // INVENTORY
    // =====================================================
    //
    // Stock is stored separately for every size / age range.
    //
    // Example:
    //
    // inventory: {
    //     "S": 5,
    //     "M": 8,
    //     "L": 2,
    //     "XL": 0
    // }
    //
    // For a product without meaningful size variations,
    // we can still use the first/default size as the
    // inventory key.
    //
    inventory: {
        type: Map,
        of: {
            type: Number,
            min: 0,
            default: 0,
        },
        default: {},
    },

    date: {
        type: Number,
        required: true,
    },
});

const Product =
    mongoose.models.product ||
    mongoose.model("product", productSchema);

export default Product;