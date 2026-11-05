"use client";

import axios from "axios";
import { assets } from "@/assets/assets";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { useUser, useClerk } from "@clerk/nextjs";
import toast from "react-hot-toast";

const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
];

const countries = [
    "India",
    "United States",
    "United Kingdom",
    "United Arab Emirates",
    "Australia",
    "Canada",
];

const AddAddress = () => {
    // =====================================================
    // CONTEXT
    // =====================================================

    const { getToken, router } = useAppContext();

    // =====================================================
    // CLERK
    // =====================================================

    const { isSignedIn, isLoaded } = useUser();
    const { openSignIn } = useClerk();

    // =====================================================
    // ADDRESS STATE
    // =====================================================

    const [address, setAddress] = useState({
        fullName: "",
        phoneNumber: "",
        pincode: "",
        area: "",
        city: "",
        state: "",
        country: "India",
    });

    const [saving, setSaving] = useState(false);

    // =====================================================
    // CHECK LOGIN
    // =====================================================

    useEffect(() => {
        if (!isLoaded) {
            return;
        }

        // Customer is not logged in
        if (!isSignedIn) {
            openSignIn({
                afterSignInUrl: "/add-address",
            });
        }
    }, [isLoaded, isSignedIn, openSignIn]);

    // =====================================================
    // HANDLE ADDRESS INPUT
    // =====================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setAddress((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // =====================================================
    // SUBMIT ADDRESS
    // =====================================================

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        // -------------------------------------------------
        // Clerk still loading
        // -------------------------------------------------

        if (!isLoaded) {
            toast.error("Please wait...");
            return;
        }

        // -------------------------------------------------
        // User is not logged in
        // -------------------------------------------------

        if (!isSignedIn) {
            toast.error("Please sign in to save your address");

            openSignIn({
                afterSignInUrl: "/add-address",
            });

            return;
        }

        // -------------------------------------------------
        // Prevent duplicate clicks
        // -------------------------------------------------

        if (saving) {
            return;
        }

        try {
            setSaving(true);

            // -------------------------------------------------
            // Get Clerk token
            // -------------------------------------------------

            const token = await getToken();

            if (!token) {
                toast.error("Please sign in to continue");

                openSignIn({
                    afterSignInUrl: "/add-address",
                });

                return;
            }

            // -------------------------------------------------
            // Send address to backend
            // -------------------------------------------------

            const { data } = await axios.post(
                "/api/user/add-address",
                {
                    address,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // -------------------------------------------------
            // Success
            // -------------------------------------------------

            if (data.success) {
                toast.success(
                    data.message || "Address saved successfully"
                );

                router.push("/cart");
            } else {
                toast.error(
                    data.message || "Failed to save address"
                );
            }

        } catch (error) {
            console.error(
                "ADD ADDRESS ERROR:",
                error
            );

            // -------------------------------------------------
            // Unauthorized
            // -------------------------------------------------

            if (error.response?.status === 401) {
                toast.error("Please sign in to continue");

                openSignIn({
                    afterSignInUrl: "/add-address",
                });

                return;
            }

            // -------------------------------------------------
            // Other errors
            // -------------------------------------------------

            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Failed to save address"
            );

        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // INPUT STYLES
    // =====================================================

    const inputClass =
        "px-4 py-3 bg-[#FAF9FF] focus:bg-white border border-transparent focus:border-[#8B5CF6]/40 focus:shadow-[0_0_0_4px_rgba(139,92,246,0.08)] transition-all rounded-xl outline-none w-full text-[#2E1A47] placeholder:text-[#5B4B75]/40 text-sm";

    const selectClass =
        `${inputClass} appearance-none cursor-pointer`;

    // =====================================================
    // CLERK LOADING
    // =====================================================

    if (!isLoaded) {
        return (
            <>
                <Navbar />

                <div className="min-h-[70vh] flex items-center justify-center">
                    <div className="text-center">

                        <div className="w-8 h-8 border-2 border-[#8B5CF6] border-t-transparent rounded-full animate-spin mx-auto mb-4" />

                        <p className="text-sm text-[#5B4B75]/60">
                            Checking your account...
                        </p>

                    </div>
                </div>
            </>
        );
    }

    // =====================================================
    // NOT SIGNED IN
    // =====================================================

    if (!isSignedIn) {
        return (
            <>
                <Navbar />

                <div className="min-h-[70vh] flex items-center justify-center px-6">

                    <div className="text-center">

                        <div className="w-12 h-12 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center mx-auto mb-4">

                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <path
                                    d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                                    stroke="#8B5CF6"
                                    strokeWidth="1.8"
                                />

                                <path
                                    d="M4 21a8 8 0 0 1 16 0"
                                    stroke="#8B5CF6"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                />
                            </svg>

                        </div>

                        <h2 className="text-xl font-semibold text-[#2E1A47]">
                            Sign in required
                        </h2>

                        <p className="text-sm text-[#5B4B75]/60 mt-2">
                            Please sign in to add a shipping address.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                openSignIn({
                                    afterSignInUrl: "/add-address",
                                })
                            }
                            className="mt-6 px-7 py-3 rounded-full font-semibold text-white text-sm shadow-md hover:scale-[1.02] transition-transform"
                            style={{
                                background:
                                    "linear-gradient(135deg, #8B5CF6 0%, #6D3FD6 100%)",
                            }}
                        >
                            Sign In
                        </button>

                    </div>

                </div>
            </>
        );
    }

    // =====================================================
    // PAGE
    // =====================================================

    return (
        <>
            <Navbar />

            <div className="relative overflow-hidden">

                {/* =================================================
                    BACKGROUND DECORATION
                ================================================= */}

                <div
                    aria-hidden
                    className="pointer-events-none absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full opacity-[0.06] blur-3xl"
                    style={{
                        background:
                            "radial-gradient(circle, #8B5CF6 0%, transparent 70%)",
                    }}
                />

                <div
                    aria-hidden
                    className="pointer-events-none absolute bottom-0 -left-24 w-[360px] h-[360px] rounded-full opacity-[0.06] blur-3xl"
                    style={{
                        background:
                            "radial-gradient(circle, #F5B700 0%, transparent 70%)",
                    }}
                />

                {/* =================================================
                    CONTENT
                ================================================= */}

                <div className="relative px-6 md:px-16 lg:px-32 py-14 md:py-20 max-w-6xl mx-auto">

                    <div className="grid md:grid-cols-2 gap-0 bg-white rounded-3xl shadow-xl ring-1 ring-[#EDEBFB] overflow-hidden">

                        {/* =================================================
                            LEFT SIDE
                        ================================================= */}

                        <div className="hidden md:flex flex-col items-center justify-center bg-[#FAF9FF] p-12 relative">

                            <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-[#8B5CF6] mb-6">

                                <span className="w-1.5 h-1.5 rounded-full bg-[#F5B700]" />

                                Almost there

                            </span>

                            <Image
                                className="max-w-[280px] w-full h-auto"
                                src={assets.my_location_image}
                                alt="Location"
                            />

                            <p className="text-[#5B4B75]/60 text-sm text-center mt-6 max-w-xs">
                                Tell us where to send your order — we'll take care of the rest.
                            </p>

                        </div>

                        {/* =================================================
                            RIGHT SIDE
                        ================================================= */}

                        <div className="p-8 md:p-12">

                            <p className="text-2xl md:text-3xl font-serif tracking-tight text-[#2E1A47]">
                                Shipping Address
                            </p>

                            <div className="w-10 h-1 rounded-full bg-[#F5B700] mt-3 mb-8" />

                            {/* =================================================
                                FORM
                            ================================================= */}

                            <form
                                onSubmit={onSubmitHandler}
                                className="space-y-4"
                            >

                                {/* FULL NAME */}

                                <input
                                    className={inputClass}
                                    type="text"
                                    name="fullName"
                                    placeholder="Full name"
                                    value={address.fullName}
                                    onChange={handleChange}
                                    required
                                />

                                {/* PHONE */}

                                <input
                                    className={inputClass}
                                    type="tel"
                                    name="phoneNumber"
                                    placeholder="Phone number"
                                    value={address.phoneNumber}
                                    onChange={handleChange}
                                    required
                                />

                                {/* PINCODE */}

                                <input
                                    className={inputClass}
                                    type="text"
                                    name="pincode"
                                    placeholder="Pin code"
                                    value={address.pincode}
                                    onChange={handleChange}
                                    required
                                />

                                {/* AREA */}

                                <textarea
                                    className={`${inputClass} resize-none`}
                                    rows={3}
                                    name="area"
                                    placeholder="Address (Area and Street)"
                                    value={address.area}
                                    onChange={handleChange}
                                    required
                                />

                                {/* CITY */}

                                <input
                                    className={inputClass}
                                    type="text"
                                    name="city"
                                    placeholder="City/District/Town"
                                    value={address.city}
                                    onChange={handleChange}
                                    required
                                />

                                {/* STATE + COUNTRY */}

                                <div className="flex gap-4">

                                    <div className="relative w-full">

                                        <select
                                            className={selectClass}
                                            name="state"
                                            value={address.state}
                                            onChange={handleChange}
                                            required
                                        >

                                            <option value="">
                                                State
                                            </option>

                                            {indianStates.map(
                                                (state) => (
                                                    <option
                                                        key={state}
                                                        value={state}
                                                    >
                                                        {state}
                                                    </option>
                                                )
                                            )}

                                        </select>

                                    </div>

                                    <div className="relative w-full">

                                        <select
                                            className={selectClass}
                                            name="country"
                                            value={address.country}
                                            onChange={handleChange}
                                        >

                                            {countries.map(
                                                (country) => (
                                                    <option
                                                        key={country}
                                                        value={country}
                                                    >
                                                        {country}
                                                    </option>
                                                )
                                            )}

                                        </select>

                                    </div>

                                </div>

                                {/* =================================================
                                    SAVE BUTTON
                                ================================================= */}

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full mt-4 py-3.5 rounded-full font-semibold text-white text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                                    style={{
                                        background:
                                            "linear-gradient(135deg, #8B5CF6 0%, #6D3FD6 100%)",
                                    }}
                                >

                                    {saving ? (
                                        <span className="flex items-center justify-center gap-2">

                                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />

                                            Saving...

                                        </span>
                                    ) : (
                                        "Save Address"
                                    )}

                                </button>

                            </form>

                        </div>

                    </div>

                </div>

            </div>
        </>
    );
};

export default AddAddress;