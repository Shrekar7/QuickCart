"use client";

import axios from "axios";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
createContext,
useContext,
useEffect,
useState,
} from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => {
return useContext(AppContext);
};

export const AppContextProvider = ({
children,
}) => {
const currency =
process.env.NEXT_PUBLIC_CURRENCY || "₹";

const router = useRouter();

const { user } = useUser();
const { getToken } = useAuth();

const [products, setProducts] = useState([]);

const [userData, setUserData] =
    useState(null);

const [isSeller, setIsSeller] =
    useState(false);

const [cartItems, setCartItems] =
    useState({});

// =====================================================
// WISHLIST
// =====================================================

const [wishlist, setWishlist] =
    useState([]);

// =====================================================
// FETCH PRODUCTS
// =====================================================

const fetchProductData = async () => {
    try {
        const { data } = await axios.get(
            "/api/product/list"
        );

        if (data.success) {
            setProducts(
                data.products || []
            );
        } else {
            toast.error(
                data.message ||
                    "Failed to load products"
            );
        }
    } catch (error) {
        console.error(
            "Fetch products error:",
            error
        );

        toast.error(
            error?.response?.data?.message ||
                error?.message ||
                "Failed to load products"
        );
    }
};

// =====================================================
// FETCH USER DATA
// =====================================================

const fetchUserData = async () => {
    try {
        if (!user) return;

        setIsSeller(
            user.publicMetadata?.role ===
                "seller"
        );

        const token = await getToken();

        if (!token) return;

        const { data } = await axios.get(
            "/api/user/data",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (data.success) {
            setUserData(data.user);

            // =================================================
            // CART
            // =================================================

            const existingCart =
                data.user?.CartItems || {};

            const convertedCart = {};

            Object.entries(
                existingCart
            ).forEach(
                ([itemId, value]) => {
                    // Old format
                    if (
                        typeof value ===
                            "number" ||
                        typeof value ===
                            "string"
                    ) {
                        convertedCart[
                            itemId
                        ] = {
                            quantity:
                                Number(
                                    value
                                ),
                            size: null,
                        };
                    }

                    // New format
                    else if (
                        value &&
                        typeof value ===
                            "object"
                    ) {
                        convertedCart[
                            itemId
                        ] = {
                            quantity:
                                Number(
                                    value.quantity
                                ) || 0,

                            size:
                                value.size ||
                                null,
                        };
                    }
                }
            );

            setCartItems(
                convertedCart
            );

            // =================================================
            // WISHLIST
            // =================================================

            const existingWishlist =
                Array.isArray(
                    data.user?.Wishlist
                )
                    ? data.user.Wishlist
                    : [];

            setWishlist(
                existingWishlist.map(
                    String
                )
            );
        } else {
            toast.error(
                data.message ||
                    "Failed to load user data"
            );
        }
    } catch (error) {
        console.error(
            "Fetch user data error:",
            error
        );

        toast.error(
            error?.response?.data?.message ||
                error?.message ||
                "Failed to load user data"
        );
    }
};

// =====================================================
// SAVE CART TO DATABASE
// =====================================================

const saveCartToDatabase = async (
    cartData
) => {
    if (!user) return;

    try {
        const token =
            await getToken();

        if (!token) {
            toast.error(
                "Please login again"
            );
            return;
        }

        await axios.post(
            "/api/cart/update",
            {
                cartData,
            },
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`,
                },
            }
        );
    } catch (error) {
        console.error(
            "Save cart error:",
            error
        );

        toast.error(
            error?.response?.data
                ?.message ||
                error?.message ||
                "Failed to save cart"
        );
    }
};

// =====================================================
// ADD TO CART
// =====================================================

const addToCart = async (
    itemId,
    selectedSize = null
) => {
    if (!itemId) {
        toast.error(
            "Invalid product"
        );
        return;
    }

    const cartData = {
        ...(cartItems || {}),
    };

    if (cartData[itemId]) {
        cartData[itemId] = {
            quantity:
                Number(
                    cartData[itemId]
                        .quantity
                ) + 1,

            size:
                selectedSize ||
                cartData[itemId]
                    .size ||
                null,
        };
    } else {
        cartData[itemId] = {
            quantity: 1,
            size:
                selectedSize || null,
        };
    }

    setCartItems(cartData);

    await saveCartToDatabase(
        cartData
    );

    toast.success(
        "Item added to cart"
    );
};

// =====================================================
// UPDATE CART QUANTITY
// =====================================================

const updateCartQuantity = async (
    itemId,
    quantity
) => {
    if (!itemId) return;

    const cartData = {
        ...(cartItems || {}),
    };

    const newQuantity =
        Number(quantity);

    if (newQuantity <= 0) {
        delete cartData[itemId];
    } else {
        const existingItem =
            cartData[itemId];

        cartData[itemId] = {
            quantity: newQuantity,

            size:
                existingItem?.size ||
                null,
        };
    }

    setCartItems(cartData);

    await saveCartToDatabase(
        cartData
    );
};

// =====================================================
// UPDATE CART SIZE
// =====================================================

const updateCartSize = async (
    itemId,
    selectedSize
) => {
    if (!itemId) return;

    const cartData = {
        ...(cartItems || {}),
    };

    if (!cartData[itemId]) return;

    cartData[itemId] = {
        quantity:
            Number(
                cartData[itemId]
                    .quantity
            ) || 1,

        size:
            selectedSize || null,
    };

    setCartItems(cartData);

    await saveCartToDatabase(
        cartData
    );
};

// =====================================================
// GET CART COUNT
// =====================================================

const getCartCount = () => {
    if (
        !cartItems ||
        typeof cartItems !==
            "object"
    ) {
        return 0;
    }

    return Object.values(
        cartItems
    ).reduce(
        (total, item) => {
            if (
                item &&
                typeof item ===
                    "object"
            ) {
                const quantity =
                    Number(
                        item.quantity
                    );

                return (
                    total +
                    (quantity > 0
                        ? quantity
                        : 0)
                );
            }

            const quantity =
                Number(item);

            return (
                total +
                (quantity > 0
                    ? quantity
                    : 0)
            );
        },
        0
    );
};

// =====================================================
// GET CART AMOUNT
// =====================================================

const getCartAmount = () => {
    let totalAmount = 0;

    if (
        !cartItems ||
        typeof cartItems !==
            "object"
    ) {
        return 0;
    }

    for (
        const itemId in cartItems
    ) {
        const cartItem =
            cartItems[itemId];

        const itemInfo =
            products.find(
                (product) =>
                    String(
                        product._id
                    ) ===
                    String(itemId)
            );

        if (!itemInfo) continue;

        let quantity = 0;
        let selectedSize = null;

        if (
            cartItem &&
            typeof cartItem ===
                "object"
        ) {
            quantity =
                Number(
                    cartItem.quantity
                ) || 0;

            selectedSize =
                cartItem.size ||
                null;
        } else {
            quantity =
                Number(cartItem) ||
                0;
        }

        if (quantity <= 0)
            continue;

        let finalPrice =
            Number(
                itemInfo.offerPrice
            ) || 0;

        if (
            selectedSize &&
            itemInfo.sizePrices
        ) {
            let sizePrice;

            if (
                itemInfo.sizePrices
                    instanceof Map
            ) {
                sizePrice =
                    itemInfo.sizePrices.get(
                        selectedSize
                    );
            } else {
                sizePrice =
                    itemInfo
                        .sizePrices[
                        selectedSize
                    ];
            }

            if (
                sizePrice !==
                    undefined &&
                sizePrice !== null
            ) {
                finalPrice =
                    Number(
                        sizePrice
                    ) ||
                    finalPrice;
            }
        }

        totalAmount +=
            finalPrice * quantity;
    }

    return (
        Math.floor(
            totalAmount * 100
        ) / 100
    );
};

// =====================================================
// GET PRODUCT PRICE
// =====================================================

const getProductPrice = (
    product,
    selectedSize = null
) => {
    if (!product) return 0;

    let finalPrice =
        Number(
            product.offerPrice
        ) || 0;

    if (
        selectedSize &&
        product.sizePrices
    ) {
        let sizePrice;

        if (
            product.sizePrices
                instanceof Map
        ) {
            sizePrice =
                product.sizePrices.get(
                    selectedSize
                );
        } else {
            sizePrice =
                product.sizePrices[
                    selectedSize
                ];
        }

        if (
            sizePrice !==
                undefined &&
            sizePrice !== null
        ) {
            finalPrice =
                Number(
                    sizePrice
                ) ||
                finalPrice;
        }
    }

    return finalPrice;
};

// =====================================================
// GET ORIGINAL PRODUCT PRICE
// =====================================================

const getProductOriginalPrice = (
    product,
    selectedSize = null
) => {
    if (!product) return 0;

    return (
        Number(
            product.price
        ) || 0
    );
};

// =====================================================
// SAVE WISHLIST
// =====================================================

const saveWishlistToDatabase =
    async (wishlistData) => {
        if (!user) return false;

        try {
            const token =
                await getToken();

            if (!token) {
                toast.error(
                    "Please login again"
                );
                return false;
            }

            const { data } =
                await axios.post(
                    "/api/wishlist/update",
                    {
                        wishlist:
                            wishlistData,
                    },
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            if (!data.success) {
                toast.error(
                    data.message ||
                        "Failed to update wishlist"
                );

                return false;
            }

            return true;
        } catch (error) {
            console.error(
                "Save wishlist error:",
                error
            );

            toast.error(
                error?.response?.data
                    ?.message ||
                    error?.message ||
                    "Failed to update wishlist"
            );

            return false;
        }
    };

// =====================================================
// TOGGLE WISHLIST
// =====================================================

const toggleWishlist = async (
    productId
) => {
    if (!user) {
        toast.error(
            "Please login to use wishlist"
        );

        return;
    }

    if (!productId) {
        toast.error(
            "Invalid product"
        );

        return;
    }

    const id = String(productId);

    const currentWishlist =
        Array.isArray(wishlist)
            ? wishlist
            : [];

    const alreadyExists =
        currentWishlist.includes(id);

    let updatedWishlist;

    if (alreadyExists) {
        updatedWishlist =
            currentWishlist.filter(
                (item) =>
                    String(item) !== id
            );
    } else {
        updatedWishlist = [
            ...currentWishlist,
            id,
        ];
    }

    // Update UI immediately
    setWishlist(
        updatedWishlist
    );

    // Save database
    const saved =
        await saveWishlistToDatabase(
            updatedWishlist
        );

    // Roll back if database failed
    if (!saved) {
        setWishlist(
            currentWishlist
        );

        return;
    }

    toast.success(
        alreadyExists
            ? "Removed from wishlist"
            : "Added to wishlist"
    );
};

// =====================================================
// CHECK WISHLIST
// =====================================================

const isInWishlist = (
    productId
) => {
    if (!productId) return false;

    return wishlist.includes(
        String(productId)
    );
};

// =====================================================
// LOAD PRODUCTS
// =====================================================

useEffect(() => {
    fetchProductData();
}, []);

// =====================================================
// LOAD USER
// =====================================================

useEffect(() => {
    if (user) {
        fetchUserData();
    } else {
        setUserData(null);
        setCartItems({});
        setWishlist([]);
        setIsSeller(false);
    }
}, [user]);

// =====================================================
// CONTEXT VALUE
// =====================================================

const value = {
    // User
    user,
    getToken,

    // General
    currency,
    router,

    // Products
    products,
    fetchProductData,

    // User data
    userData,
    fetchUserData,

    // Seller
    isSeller,
    setIsSeller,

    // Cart
    cartItems,
    setCartItems,
    addToCart,
    updateCartQuantity,
    updateCartSize,
    getCartCount,
    getCartAmount,

    // Product pricing
    getProductPrice,
    getProductOriginalPrice,

    // Wishlist
    wishlist,
    setWishlist,
    toggleWishlist,
    isInWishlist,
};

return (
    <AppContext.Provider
        value={value}
    >
        {children}
    </AppContext.Provider>
);


};
