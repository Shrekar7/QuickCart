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

export const AppContextProvider = ({ children }) => {
    // =====================================================
    // GENERAL
    // =====================================================

    const currency =
        process.env.NEXT_PUBLIC_CURRENCY || "₹";

    const router = useRouter();

    const { user } = useUser();
    const { getToken } = useAuth();

    // =====================================================
    // PRODUCTS
    // =====================================================

    const [products, setProducts] = useState([]);

    // =====================================================
    // USER
    // =====================================================

    const [userData, setUserData] = useState(null);
    const [isSeller, setIsSeller] = useState(false);

    // =====================================================
    // CART
    // =====================================================

    const [cartItems, setCartItems] = useState({});

    // =====================================================
    // WISHLIST
    // =====================================================

    const [wishlist, setWishlist] = useState([]);

    // =====================================================
    // NEW ARRIVALS
    // =====================================================

    const newArrivals = [...products]
        .sort(
            (a, b) =>
                Number(b.date || 0) -
                Number(a.date || 0)
        )
        .slice(0, 8);

    // =====================================================
    // FETCH PRODUCTS
    // =====================================================

    const fetchProductData = async () => {
        try {
            const { data } = await axios.get(
                "/api/product/list"
            );

            if (data.success) {
                setProducts(data.products || []);
            } else {
                toast.error(
                    data.message ||
                        "Failed to load products"
                );
            }
        } catch (error) {
            console.error(
                "FETCH PRODUCTS ERROR:",
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

            // -------------------------------------------------
            // CHECK SELLER
            // -------------------------------------------------

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
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            if (!data.success) {
                toast.error(
                    data.message ||
                        "Failed to load user data"
                );

                return;
            }

            // -------------------------------------------------
            // USER DATA
            // -------------------------------------------------

            setUserData(data.user);

            // -------------------------------------------------
            // CART FROM DATABASE
            // -------------------------------------------------

            const existingCart =
                data.user?.CartItems || {};

            const convertedCart = {};

            Object.entries(
                existingCart
            ).forEach(
                ([itemId, value]) => {
                    // -----------------------------------------
                    // OLD CART FORMAT
                    // Example:
                    // "productId": 2
                    // -----------------------------------------

                    if (
                        typeof value ===
                            "number" ||
                        typeof value ===
                            "string"
                    ) {
                        const quantity =
                            Number(value);

                        if (quantity > 0) {
                            convertedCart[
                                itemId
                            ] = {
                                quantity,
                                size: null,
                            };
                        }

                        return;
                    }

                    // -----------------------------------------
                    // NEW CART FORMAT
                    // Example:
                    // "productId": {
                    //     quantity: 2,
                    //     size: "M"
                    // }
                    // -----------------------------------------

                    if (
                        value &&
                        typeof value ===
                            "object"
                    ) {
                        const quantity =
                            Number(
                                value.quantity
                            ) || 0;

                        if (quantity > 0) {
                            convertedCart[
                                itemId
                            ] = {
                                quantity,
                                size:
                                    value.size ||
                                    null,
                            };
                        }
                    }
                }
            );

            setCartItems(
                convertedCart
            );

            // -------------------------------------------------
            // WISHLIST
            // -------------------------------------------------

            const existingWishlist =
                Array.isArray(
                    data.user?.Wishlist
                )
                    ? data.user.Wishlist
                    : [];

            setWishlist(
                existingWishlist.map(String)
            );
        } catch (error) {
            console.error(
                "FETCH USER DATA ERROR:",
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
        if (!user) {
            return false;
        }

        try {
            const token = await getToken();

            if (!token) {
                toast.error(
                    "Please login again"
                );

                return false;
            }

            const { data } =
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

            if (!data.success) {
                toast.error(
                    data.message ||
                        "Failed to save cart"
                );

                return false;
            }

            return true;
        } catch (error) {
            console.error(
                "SAVE CART ERROR:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                    error?.message ||
                    "Failed to save cart"
            );

            return false;
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

            return false;
        }

        const cleanItemId =
            String(itemId).split("::")[0];

        const cartData = {
            ...(cartItems || {}),
        };

        // =================================================
        // ITEM ALREADY EXISTS
        // =================================================

        if (cartData[cleanItemId]) {
            cartData[cleanItemId] = {
                quantity:
                    Number(
                        cartData[
                            cleanItemId
                        ]?.quantity
                    ) + 1,

                size:
                    selectedSize ||
                    cartData[
                        cleanItemId
                    ]?.size ||
                    null,
            };
        }

        // =================================================
        // NEW ITEM
        // =================================================

        else {
            cartData[cleanItemId] = {
                quantity: 1,
                size:
                    selectedSize ||
                    null,
            };
        }

        // =================================================
        // UPDATE UI IMMEDIATELY
        // =================================================

        setCartItems(cartData);

        // =================================================
        // SAVE TO DATABASE
        // =================================================

        const saved =
            await saveCartToDatabase(
                cartData
            );

        if (!saved) {
            return false;
        }

        toast.success(
            "Item added to cart"
        );

        return true;
    };

    // =====================================================
    // UPDATE CART QUANTITY
    // =====================================================

    const updateCartQuantity = async (
        itemId,
        quantity
    ) => {
        if (!itemId) return false;

        const cleanItemId =
            String(itemId).split("::")[0];

        const cartData = {
            ...(cartItems || {}),
        };

        const newQuantity =
            Number(quantity);

        // =================================================
        // REMOVE ITEM
        // =================================================

        if (
            !Number.isFinite(newQuantity) ||
            newQuantity <= 0
        ) {
            delete cartData[cleanItemId];
        }

        // =================================================
        // UPDATE QUANTITY
        // =================================================

        else {
            const existingItem =
                cartData[
                    cleanItemId
                ];

            cartData[cleanItemId] = {
                quantity:
                    newQuantity,

                size:
                    existingItem?.size ||
                    null,
            };
        }

        // =================================================
        // UPDATE UI
        // =================================================

        setCartItems(cartData);

        // =================================================
        // SAVE DATABASE
        // =================================================

        const saved =
            await saveCartToDatabase(
                cartData
            );

        return saved;
    };

    // =====================================================
    // UPDATE CART SIZE
    // =====================================================

    const updateCartSize = async (
        itemId,
        selectedSize
    ) => {
        if (!itemId) return false;

        const cleanItemId =
            String(itemId).split("::")[0];

        const cartData = {
            ...(cartItems || {}),
        };

        if (
            !cartData[cleanItemId]
        ) {
            return false;
        }

        cartData[cleanItemId] = {
            quantity:
                Number(
                    cartData[
                        cleanItemId
                    ]?.quantity
                ) || 1,

            size:
                selectedSize ||
                null,
        };

        // =================================================
        // UPDATE UI
        // =================================================

        setCartItems(cartData);

        // =================================================
        // SAVE DATABASE
        // =================================================

        const saved =
            await saveCartToDatabase(
                cartData
            );

        return saved;
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
                // New format
                if (
                    item &&
                    typeof item ===
                        "object"
                ) {
                    const quantity =
                        Number(
                            item.quantity
                        ) || 0;

                    return (
                        total +
                        (quantity > 0
                            ? quantity
                            : 0)
                    );
                }

                // Old format
                const quantity =
                    Number(item) || 0;

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
            const cleanItemId =
                String(itemId).split("::")[0];

            const cartItem =
                cartItems[itemId];

            const itemInfo =
                products.find(
                    (product) =>
                        String(
                            product._id
                        ) ===
                        String(
                            cleanItemId
                        )
                );

            // Product doesn't exist
            if (!itemInfo) {
                continue;
            }

            let quantity = 0;
            let selectedSize = null;

            // =================================================
            // NEW FORMAT
            // =================================================

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
            }

            // =================================================
            // OLD FORMAT
            // =================================================

            else {
                quantity =
                    Number(
                        cartItem
                    ) || 0;
            }

            if (quantity <= 0) {
                continue;
            }

            // =================================================
            // DEFAULT PRODUCT PRICE
            // =================================================

            let finalPrice =
                Number(
                    itemInfo.offerPrice
                ) || 0;

            // =================================================
            // SIZE PRICE
            // =================================================

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
                    sizePrice !==
                        null
                ) {
                    finalPrice =
                        Number(
                            sizePrice
                        ) ||
                        finalPrice;
                }
            }

            totalAmount +=
                finalPrice *
                quantity;
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
                sizePrice !==
                    null
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
            if (!user) {
                return false;
            }

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
                    "SAVE WISHLIST ERROR:",
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

        const id =
            String(productId);

        const currentWishlist =
            Array.isArray(wishlist)
                ? wishlist
                : [];

        const alreadyExists =
            currentWishlist.includes(
                id
            );

        let updatedWishlist;

        if (alreadyExists) {
            updatedWishlist =
                currentWishlist.filter(
                    (item) =>
                        String(item) !==
                        id
                );
        } else {
            updatedWishlist = [
                ...currentWishlist,
                id,
            ];
        }

        // =================================================
        // UPDATE UI
        // =================================================

        setWishlist(
            updatedWishlist
        );

        // =================================================
        // SAVE DATABASE
        // =================================================

        const saved =
            await saveWishlistToDatabase(
                updatedWishlist
            );

        // =================================================
        // ROLLBACK IF FAILED
        // =================================================

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
        if (!productId) {
            return false;
        }

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
    // CLEAN INVALID CART PRODUCTS
    // =====================================================

    useEffect(() => {
        if (
            !user ||
            products.length === 0 ||
            !cartItems ||
            typeof cartItems !==
                "object"
        ) {
            return;
        }

        const validCart = {};

        let hasInvalidItems = false;

        Object.entries(
            cartItems
        ).forEach(
            ([itemId, value]) => {
                // -----------------------------------------
                // Remove old ::size suffix
                // -----------------------------------------

                const cleanId =
                    String(itemId).split("::")[0];

                // -----------------------------------------
                // Check whether product exists
                // -----------------------------------------

                const productExists =
                    products.some(
                        (product) =>
                            String(
                                product._id
                            ) ===
                            String(
                                cleanId
                            )
                    );

                // -----------------------------------------
                // INVALID PRODUCT
                // -----------------------------------------

                if (!productExists) {
                    console.warn(
                        "REMOVING INVALID CART PRODUCT:",
                        itemId
                    );

                    hasInvalidItems =
                        true;

                    return;
                }

                // -----------------------------------------
                // READ QUANTITY + SIZE
                // -----------------------------------------

                let quantity = 0;
                let size = null;

                if (
                    value &&
                    typeof value ===
                        "object"
                ) {
                    quantity =
                        Number(
                            value.quantity
                        ) || 0;

                    size =
                        value.size ||
                        null;
                } else {
                    quantity =
                        Number(value) || 0;
                }

                // -----------------------------------------
                // SAVE VALID ITEM
                // -----------------------------------------

                if (
                    quantity > 0
                ) {
                    validCart[
                        cleanId
                    ] = {
                        quantity,
                        size,
                    };
                }
            }
        );

        // -----------------------------------------------
        // Nothing invalid
        // -----------------------------------------------

        if (!hasInvalidItems) {
            return;
        }

        console.log(
            "CLEANED CART:",
            validCart
        );

        // -----------------------------------------------
        // UPDATE FRONTEND
        // -----------------------------------------------

        setCartItems(
            validCart
        );

        // -----------------------------------------------
        // UPDATE DATABASE
        // -----------------------------------------------

        saveCartToDatabase(
            validCart
        );
    }, [
        products,
        user,
        cartItems,
    ]);

    // =====================================================
    // CONTEXT VALUE
    // =====================================================

    const value = {
        // -------------------------------------------------
        // User
        // -------------------------------------------------

        user,
        getToken,

        // -------------------------------------------------
        // General
        // -------------------------------------------------

        currency,
        router,

        // -------------------------------------------------
        // Products
        // -------------------------------------------------

        products,
        fetchProductData,

        // -------------------------------------------------
        // New Arrivals
        // -------------------------------------------------

        newArrivals,

        // -------------------------------------------------
        // User Data
        // -------------------------------------------------

        userData,
        fetchUserData,

        // -------------------------------------------------
        // Seller
        // -------------------------------------------------

        isSeller,
        setIsSeller,

        // -------------------------------------------------
        // Cart
        // -------------------------------------------------

        cartItems,
        setCartItems,
        addToCart,
        updateCartQuantity,
        updateCartSize,
        getCartCount,
        getCartAmount,

        // -------------------------------------------------
        // Product Pricing
        // -------------------------------------------------

        getProductPrice,
        getProductOriginalPrice,

        // -------------------------------------------------
        // Wishlist
        // -------------------------------------------------

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