import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_KR, Inter, Playfair_Display } from "next/font/google"; // Added fonts
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "마음 날씨 - AI 감정 분석 일기장",
  description: "오늘 하루 기분을 기록하면 AI가 위로와 분석을 해줍니다.",
  keywords: ["AI 일기", "심리 분석", "마음 날씨", "무료 일기장"],
  openGraph: {
    title: "마음 날씨 - AI 감정 분석 일기장",
    description: "오늘 하루 기분을 기록하면 AI가 위로와 분석을 해줍니다.",
    url: "https://mind-weather-lovat.vercel.app/",
    siteName: "Mind Weather",
    images: [
      {
        url: "/thumbnail.png",
        width: 1200,
        height: 630,
        alt: "Mind Weather Service Preview",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "마음 날씨 - AI 감정 분석 일기장",
    description: "오늘 하루 기분을 기록하면 AI가 위로와 분석을 해줍니다.",
    images: ["/thumbnail.png"],
  },
  verification: {
    google: "sYR3FYlvLZIlFQR_hCuru7lYOUZgv4GZ9H7aYDTiZc8",
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansKR.variable} ${inter.variable} ${playfair.variable} antialiased bg-[#0f0c29] text-white overflow-x-hidden selection:bg-violet-500/30 selection:text-white font-sans`}
      >
        <Script
          id="google-adsense"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}`}
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
        <div className="fixed inset-0 z-[-1] pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-900/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px]" />
        </div>
        {children}
      </body>
    </html>
  );
}
