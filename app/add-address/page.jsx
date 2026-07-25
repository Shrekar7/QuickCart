'use client';

import axios from "axios";
import { assets } from "@/assets/assets";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";

const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir",
    "Ladakh", "Lakshadweep", "Puducherry",
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
    const { getToken, router } = useAppContext();

    const [address, setAddress] = useState({
        fullName: "",
        phoneNumber: "",
        pincode: "",
        area: "",
        city: "",
        state: "",
        country: "India",
    });

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            const token = await getToken();

            const { data } = await axios.post(
                "/api/user/add-address",
                { address },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (data.success) {
                toast.success(data.message);
                router.push("/cart");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const inputClass =
        "px-4 py-3 bg-[#FAF9FF] focus:bg-white border border-transparent focus:border-[#8B5CF6]/40 focus:shadow-[0_0_0_4px_rgba(139,92,246,0.08)] transition-all rounded-xl outline-none w-full text-[#2E1A47] placeholder:text-[#5B4B75]/40 text-sm";

    const selectClass = `${inputClass} appearance-none cursor-pointer`;

    return (
        <>
            <Navbar />

            <div className="relative overflow-hidden">
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

                <div className="relative px-6 md:px-16 lg:px-32 py-14 md:py-20 max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-0 bg-white rounded-3xl shadow-xl ring-1 ring-[#EDEBFB] overflow-hidden">

                        <div className="hidden md:flex flex-col items-center justify-center bg-[#FAF9FF] p-12 relative">
                            <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-[#8B5CF6] mb-6">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#F5B700]" />
                                Almost there
                            </span>

                            <Image
                                className="max-w-[280px] w-full h-auto"
                                src={assets.my_location_image}
                                alt="my_location_image"
                            />

                            <p className="text-[#5B4B75]/60 text-sm text-center mt-6 max-w-xs">
                                Tell us where to send your order — we'll take care of the rest.
                            </p>
                        </div>

                        <div className="p-8 md:p-12">
                            <p className="text-2xl md:text-3xl font-serif tracking-tight text-[#2E1A47]">
                                Shipping Address
                            </p>

                            <div className="w-10 h-1 rounded-full bg-[#F5B700] mt-3 mb-8" />

                            <form onSubmit={onSubmitHandler} className="space-y-4">

                                <input
                                    className={inputClass}
                                    type="text"
                                    placeholder="Full name"
                                    value={address.fullName}
                                    onChange={(e) =>
                                        setAddress({ ...address, fullName: e.target.value })
                                    }
                                    required
                                />

                                <input
                                    className={inputClass}
                                    type="text"
                                    placeholder="Phone number"
                                    value={address.phoneNumber}
                                    onChange={(e) =>
                                        setAddress({
                                            ...address,
                                            phoneNumber: e.target.value,
                                        })
                                    }
                                    required
                                />

                                <input
                                    className={inputClass}
                                    type="text"
                                    placeholder="Pin code"
                                    value={address.pincode}
                                    onChange={(e) =>
                                        setAddress({
                                            ...address,
                                            pincode: e.target.value,
                                        })
                                    }
                                    required
                                />

                                <textarea
                                    className={`${inputClass} resize-none`}
                                    rows={3}
                                    placeholder="Address (Area and Street)"
                                    value={address.area}
                                    onChange={(e) =>
                                        setAddress({
                                            ...address,
                                            area: e.target.value,
                                        })
                                    }
                                    required
                                />

                                <input
                                    className={inputClass}
                                    type="text"
                                    placeholder="City/District/Town"
                                    value={address.city}
                                    onChange={(e) =>
                                        setAddress({
                                            ...address,
                                            city: e.target.value,
                                        })
                                    }
                                    required
                                />

                                <div className="flex gap-4">
                                    <div className="relative w-full">
                                        <select
                                            className={selectClass}
                                            value={address.state}
                                            onChange={(e) =>
                                                setAddress({
                                                    ...address,
                                                    state: e.target.value,
                                                })
                                            }
                                            required
                                        >
                                            <option value="">State</option>

                                            {indianStates.map((state) => (
                                                <option key={state} value={state}>
                                                    {state}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="relative w-full">
                                        <select
                                            className={selectClass}
                                            value={address.country}
                                            onChange={(e) =>
                                                setAddress({
                                                    ...address,
                                                    country: e.target.value,
                                                })
                                            }
                                        >
                                            {countries.map((country) => (
                                                <option key={country} value={country}>
                                                    {country}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full mt-4 py-3.5 rounded-full font-semibold text-white text-sm transition-transform hover:scale-[1.02] shadow-md"
                                    style={{
                                        background:
                                            "linear-gradient(135deg, #8B5CF6 0%, #6D3FD6 100%)",
                                    }}
                                >
                                    Save Address
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* <Footer /> */}
        </>
    );
};

export default AddAddress; 