"use client";

import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useEffect } from "react";

const OrderPlaced = () => {
    const { router } = useAppContext();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push("/my-orders");
        }, 5000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="min-h-screen flex flex-col justify-center items-center gap-5">
            <div className="relative flex justify-center items-center">
                <Image
                    className="absolute p-5"
                    src={assets.checkmark}
                    alt="Order placed"
                    width={96}
                    height={96}
                />

                <div className="animate-spin rounded-full h-24 w-24 border-4 border-t-green-300 border-gray-200" />
            </div>

            <h1 className="text-2xl font-semibold">
                Order Placed Successfully
            </h1>

            <p className="text-gray-500">
                Redirecting to your orders...
            </p>
        </div>
    );
};

export default OrderPlaced;