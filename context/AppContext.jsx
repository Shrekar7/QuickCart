'use client';

import axios from "axios";
import { productsDummyData } from "@/assets/assets";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

// Cart items are keyed as "productId" (no size) or "productId::size" (sized items)
// so that different sizes of the same product are tracked as separate cart lines.
export const makeCartKey = (productId, size) =>
  size ? `${productId}::${size}` : productId;

export const parseCartKey = (key) => {
  const [productId, size] = key.split("::");
  return { productId, size: size || null };
};

export const AppContextProvider = ({ children }) => {

  const currency = process.env.NEXT_PUBLIC_CURRENCY;
  const router = useRouter();

  const { user } = useUser();
  const { getToken } = useAuth();

  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [cartItems, setCartItems] = useState({});

  // Fetch Products
  const fetchProductData = async () => {
    try {
      const { data } = await axios.get("/api/product/list");

      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch Logged In User
  const fetchUserData = async () => {
    try {
      if (!user) return;

      if (user.publicMetadata?.role === "seller") {
        setIsSeller(true);
      }

      const token = await getToken();

      const { data } = await axios.get("/api/user/data", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setUserData(data.user);
        setCartItems(data.user.CartItems || {});
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  // Add To Cart — itemId is the product _id, size is optional (pass null/undefined if the product has no sizes)
  const addToCart = async (itemId, size) => {
    const key = makeCartKey(itemId, size);
    const cartData = structuredClone(cartItems);

    if (cartData[key]) {
      cartData[key] += 1;
    } else {
      cartData[key] = 1;
    }

    setCartItems(cartData);

    if (user) {
      try {
        const token = await getToken();

        await axios.post(
          "/api/cart/update",
          { cartData },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success("Item added to cart");
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  // Update Cart Quantity — key is the cart key (productId or productId::size)
  const updateCartQuantity = async (key, quantity) => {
    const cartData = structuredClone(cartItems);

    if (quantity === 0) {
      delete cartData[key];
    } else {
      cartData[key] = quantity;
    }

    setCartItems(cartData);

    if (user) {
      try {
        const token = await getToken();

        await axios.post(
          "/api/cart/update",
          { cartData },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  // Cart Count
  const getCartCount = () => {
    let totalCount = 0;

    for (const key in cartItems) {
      if (cartItems[key] > 0) {
        totalCount += cartItems[key];
      }
    }

    return totalCount;
  };

  // Cart Amount
  const getCartAmount = () => {
    let totalAmount = 0;

    for (const key in cartItems) {
      const { productId } = parseCartKey(key);
      const itemInfo = products.find(
        (product) => product._id === productId
      );

      if (itemInfo && cartItems[key] > 0) {
        totalAmount += itemInfo.offerPrice * cartItems[key];
      }
    }

    return Math.floor(totalAmount * 100) / 100;
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const value = {
    user,
    getToken,
    currency,
    router,

    products,
    fetchProductData,

    userData,
    fetchUserData,

    isSeller,
    setIsSeller,

    cartItems,
    setCartItems,

    addToCart,
    updateCartQuantity,

    getCartCount,
    getCartAmount,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};