"use client";

import { useEffect } from "react";

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

interface GoogleAdProps {
    slot: string;
    style?: React.CSSProperties;
    format?: string;
    responsive?: string;
}

const GoogleAd = ({ slot, style, format = "auto", responsive = "true" }: GoogleAdProps) => {
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error("AdSense error", e);
        }
    }, []);

    if (process.env.NODE_ENV === "development") {
        return (
            <div
                style={{
                    ...style,
                    background: "#f0f0f0",
                    color: "#888",
                    padding: "20px",
                    textAlign: "center",
                    border: "1px dashed #ccc",
                    margin: "20px 0",
                }}
            >
                <p className="text-sm font-bold">Google AdSense Placeholder</p>
                <p className="text-xs">Slot ID: {slot}</p>
                <p className="text-xs text-red-500">광고는 배포 환경(Production)에서만 보입니다</p>
            </div>
        );
    }

    return (
        <div style={{ overflow: "hidden", margin: "20px 0", ...style }}>
            <ins
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive}
            />
        </div>
    );
};

export default GoogleAd;
