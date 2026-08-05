'use client'
import React from 'react'

const sizeMap = {
    sm: { wrapper: "w-10 h-10", inset: "inset-1", dot: "w-1.5 h-1.5", label: "text-[10px]", showLabel: false },
    md: { wrapper: "w-16 h-16", inset: "inset-1.5", dot: "w-2 h-2", label: "text-[11px]", showLabel: true },
    lg: { wrapper: "w-24 h-24", inset: "inset-2", dot: "w-3 h-3", label: "text-[13px]", showLabel: true },
    xl: { wrapper: "w-32 h-32", inset: "inset-3", dot: "w-4 h-4", label: "text-[14px]", showLabel: true },
}

const Loading = ({ size = "lg", fullHeight = true, label = "Loading" }) => {
    const s = sizeMap[size] || sizeMap.lg

    return (
        <div className={`flex flex-col justify-center items-center gap-6 ${fullHeight ? "h-[70vh]" : "py-10"}`}>

            {/* Layered spinner */}
            <div className={`relative ${s.wrapper}`}>
                {/* ambient glow pulse behind everything */}
                <div
                    className="absolute inset-0 rounded-full blur-xl opacity-40"
                    style={{
                        background: "radial-gradient(circle, #8B5CF6 0%, transparent 70%)",
                        animation: "loadingPulse 2s ease-in-out infinite",
                    }}
                />

                {/* outer ring — slow, gold */}
                <div
                    className="absolute inset-0 rounded-full border-4 border-[#F5B700]/15"
                    style={{
                        borderTopColor: "#F5B700",
                        animation: "spin 1.8s linear infinite",
                    }}
                />

                {/* middle ring — medium, purple, reverse direction */}
                <div
                    className={`absolute ${s.inset} rounded-full border-4 border-[#8B5CF6]/15`}
                    style={{
                        borderTopColor: "#8B5CF6",
                        borderRightColor: "#8B5CF6",
                        animation: "spinReverse 1.3s linear infinite",
                    }}
                />

                {/* inner core — soft breathing dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div
                        className={`${s.dot} rounded-full`}
                        style={{
                            background: "linear-gradient(135deg, #8B5CF6 0%, #F5B700 100%)",
                            animation: "corePulse 1.4s ease-in-out infinite",
                        }}
                    />
                </div>
            </div>

            {/* Animated label */}
            {s.showLabel && (
                <div className="flex items-center gap-1.5">
                    <span className={`${s.label} font-semibold tracking-[0.15em] uppercase text-[#2E1A47]/50`}>
                        {label}
                    </span>
                    <span className="flex gap-1">
                        <span
                            className="w-1 h-1 rounded-full bg-[#8B5CF6]"
                            style={{ animation: "dotBounce 1.2s ease-in-out infinite", animationDelay: "0s" }}
                        />
                        <span
                            className="w-1 h-1 rounded-full bg-[#8B5CF6]"
                            style={{ animation: "dotBounce 1.2s ease-in-out infinite", animationDelay: "0.15s" }}
                        />
                        <span
                            className="w-1 h-1 rounded-full bg-[#8B5CF6]"
                            style={{ animation: "dotBounce 1.2s ease-in-out infinite", animationDelay: "0.3s" }}
                        />
                    </span>
                </div>
            )}

            <style jsx>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes spinReverse {
                    from { transform: rotate(360deg); }
                    to { transform: rotate(0deg); }
                }
                @keyframes loadingPulse {
                    0%, 100% { opacity: 0.25; transform: scale(0.9); }
                    50% { opacity: 0.5; transform: scale(1.1); }
                }
                @keyframes corePulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.6); opacity: 0.6; }
                }
                @keyframes dotBounce {
                    0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
                    40% { transform: translateY(-4px); opacity: 1; }
                }
                @media (prefers-reduced-motion: reduce) {
                    * { animation: none !important; }
                }
            `}</style>
        </div>
    )
}

export default Loading 