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

  // Add To Cart
  const addToCart = async (itemId) => {
    const cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
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

  // Update Cart Quantity
  const updateCartQuantity = async (itemId, quantity) => {
    const cartData = structuredClone(cartItems);

    if (quantity === 0) {
      delete cartData[itemId];
    } else {
      cartData[itemId] = quantity;
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
  if (!cartItems || typeof cartItems !== "object") {
    return 0;
  }

  return Object.values(cartItems).reduce((total, quantity) => {
    return total + (Number(quantity) > 0 ? Number(quantity) : 0);
  }, 0);
};

  // Cart Amount
  const getCartAmount = () => {
    let totalAmount = 0;

    for (const item in cartItems) {
      const itemInfo = products.find(
        (product) => product._id === item
      );

      if (itemInfo && cartItems[item] > 0) {
        totalAmount += itemInfo.offerPrice * cartItems[item];
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