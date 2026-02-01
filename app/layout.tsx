import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_KR, Inter, Playfair_Display } from "next/font/google"; // Added fonts
import "./globals.css";

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
  title: "Mind Weather - 당신의 마음 날씨",
  description: "AI가 당신의 일기를 분석해 마음의 날씨를 알려줍니다.",
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
        <div className="fixed inset-0 z-[-1] pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-900/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px]" />
        </div>
        {children}
      </body>
    </html>
  );
}
