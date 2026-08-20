"use client";

import React from "react";

const Loading = () => {
    return (
        <div
            style={{
                minHeight: "70vh",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#FAF9FF",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                {/* Truck area */}
                <div
                    style={{
                        position: "relative",
                        width: "230px",
                        height: "130px",
                        overflow: "hidden",
                    }}
                >
                    {/* Road */}
                    <div
                        style={{
                            position: "absolute",
                            left: 0,
                            bottom: "18px",
                            width: "100%",
                            height: "2px",
                            background: "rgba(46,26,71,0.15)",
                        }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                width: "40px",
                                height: "2px",
                                background: "#8B5CF6",
                                animation: "loadingRoad 0.7s linear infinite",
                            }}
                        />
                    </div>

                    {/* Truck */}
                    <div
                        style={{
                            position: "absolute",
                            left: "45px",
                            bottom: "20px",
                            width: "145px",
                            height: "70px",
                            animation: "loadingTruck 0.8s ease-in-out infinite",
                        }}
                    >
                        {/* Main truck body */}
                        <div
                            style={{
                                position: "absolute",
                                left: 0,
                                top: 0,
                                width: "95px",
                                height: "60px",
                                border: "3px solid #2E1A47",
                                borderRadius: "8px",
                                background: "#8B5CF6",
                                boxSizing: "border-box",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {/* Sunshine logo */}
                            <div
                                style={{
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "50%",
                                    background: "#F5B700",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#2E1A47",
                                    fontWeight: "700",
                                    fontSize: "16px",
                                }}
                            >
                                S
                            </div>
                        </div>

                        {/* Cabin */}
                        <div
                            style={{
                                position: "absolute",
                                right: 0,
                                top: "18px",
                                width: "52px",
                                height: "42px",
                                border: "3px solid #2E1A47",
                                borderLeft: 0,
                                borderRadius: "0 8px 8px 0",
                                background: "#F5B700",
                                boxSizing: "border-box",
                            }}
                        >
                            {/* Window */}
                            <div
                                style={{
                                    position: "absolute",
                                    left: "7px",
                                    top: "6px",
                                    width: "32px",
                                    height: "18px",
                                    border: "2px solid #2E1A47",
                                    borderRadius: "4px",
                                    background: "#F6F1FF",
                                    boxSizing: "border-box",
                                }}
                            />
                        </div>

                        {/* Front bumper */}
                        <div
                            style={{
                                position: "absolute",
                                right: "-6px",
                                bottom: "2px",
                                width: "8px",
                                height: "8px",
                                background: "#2E1A47",
                                borderRadius: "0 4px 4px 0",
                            }}
                        />

                        {/* Left wheel */}
                        <div
                            style={{
                                position: "absolute",
                                left: "14px",
                                bottom: "-9px",
                                width: "27px",
                                height: "27px",
                                borderRadius: "50%",
                                background: "#2E1A47",
                                border: "3px solid #2E1A47",
                                boxSizing: "border-box",
                                animation: "loadingWheel 0.8s linear infinite",
                            }}
                        >
                            <div
                                style={{
                                    position: "absolute",
                                    left: "6px",
                                    top: "6px",
                                    width: "9px",
                                    height: "9px",
                                    borderRadius: "50%",
                                    background: "#F6F1FF",
                                }}
                            />
                        </div>

                        {/* Right wheel */}
                        <div
                            style={{
                                position: "absolute",
                                right: "14px",
                                bottom: "-9px",
                                width: "27px",
                                height: "27px",
                                borderRadius: "50%",
                                background: "#2E1A47",
                                border: "3px solid #2E1A47",
                                boxSizing: "border-box",
                                animation: "loadingWheel 0.8s linear infinite",
                            }}
                        >
                            <div
                                style={{
                                    position: "absolute",
                                    left: "6px",
                                    top: "6px",
                                    width: "9px",
                                    height: "9px",
                                    borderRadius: "50%",
                                    background: "#F6F1FF",
                                }}
                            />
                        </div>
                    </div>

                    {/* Sparkles */}
                    <div
                        style={{
                            position: "absolute",
                            left: "20px",
                            top: "45px",
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: "#F5B700",
                            animation: "loadingSparkle 1.3s ease-in-out infinite",
                        }}
                    />

                    <div
                        style={{
                            position: "absolute",
                            left: "8px",
                            top: "72px",
                            width: "4px",
                            height: "4px",
                            borderRadius: "50%",
                            background: "#8B5CF6",
                            animation: "loadingSparkle 1.3s ease-in-out infinite",
                            animationDelay: "0.3s",
                        }}
                    />

                    <div
                        style={{
                            position: "absolute",
                            right: "18px",
                            top: "32px",
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: "#F5B700",
                            animation: "loadingSparkle 1.3s ease-in-out infinite",
                            animationDelay: "0.6s",
                        }}
                    />
                </div>

                {/* Text */}
                <div
                    style={{
                        marginTop: "10px",
                        display: "flex",
                        alignItems: "center",
                        gap: "7px",
                    }}
                >
                    <span
                        style={{
                            fontSize: "11px",
                            fontWeight: "600",
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            color: "rgba(46,26,71,0.55)",
                        }}
                    >
                        Preparing your order
                    </span>

                    <span style={{ display: "flex", gap: "4px" }}>
                        <span
                            style={{
                                width: "4px",
                                height: "4px",
                                borderRadius: "50%",
                                background: "#8B5CF6",
                                animation: "loadingDot 1.2s ease-in-out infinite",
                            }}
                        />

                        <span
                            style={{
                                width: "4px",
                                height: "4px",
                                borderRadius: "50%",
                                background: "#8B5CF6",
                                animation: "loadingDot 1.2s ease-in-out infinite",
                                animationDelay: "0.15s",
                            }}
                        />

                        <span
                            style={{
                                width: "4px",
                                height: "4px",
                                borderRadius: "50%",
                                background: "#8B5CF6",
                                animation: "loadingDot 1.2s ease-in-out infinite",
                                animationDelay: "0.3s",
                            }}
                        />
                    </span>
                </div>

                <p
                    style={{
                        marginTop: "8px",
                        fontSize: "10px",
                        letterSpacing: "0.12em",
                        color: "rgba(91,75,117,0.4)",
                    }}
                >
                    SUNSHINE FANCY COSTUMES
                </p>
            </div>

            {/* Animations */}
            <style>
                {`
                    @keyframes loadingTruck {
                        0%, 100% {
                            transform: translateY(0);
                        }

                        50% {
                            transform: translateY(-3px);
                        }
                    }

                    @keyframes loadingWheel {
                        from {
                            transform: rotate(0deg);
                        }

                        to {
                            transform: rotate(360deg);
                        }
                    }

                    @keyframes loadingRoad {
                        from {
                            transform: translateX(-45px);
                        }

                        to {
                            transform: translateX(230px);
                        }
                    }

                    @keyframes loadingSparkle {
                        0%, 100% {
                            opacity: 0.2;
                            transform: scale(0.7);
                        }

                        50% {
                            opacity: 1;
                            transform: scale(1.3);
                        }
                    }

                    @keyframes loadingDot {
                        0%, 80%, 100% {
                            opacity: 0.3;
                            transform: translateY(0);
                        }

                        40% {
                            opacity: 1;
                            transform: translateY(-3px);
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default Loading;