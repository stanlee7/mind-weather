'use client';

import GlassCard from './ui/GlassCard';
import { Sun, CloudRain } from 'lucide-react';

export default function WeeklyOutlook() {
    return (
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-24">

            {/* Left Text */}
            <div className="flex-1 space-y-8">
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight">
                    주간 감정 전망
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed">
                    우리의 정교한 차트 엔진이 당신의 하루 기록을 시각적인 "날씨 지도"로 매핑하여, 감정 전선이 도착하기 전에 미리 파악할 수 있게 도와줍니다.
                </p>

                <div className="space-y-4 pt-4">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-yellow-500/10 rounded-xl">
                            <Sun className="w-6 h-6 text-yellow-500" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white">맑음 (명료함)</h4>
                            <p className="text-sm text-gray-500">안정적인 기분과 생산적인 흐름</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl">
                            <CloudRain className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white">보슬비 (안개)</h4>
                            <p className="text-sm text-gray-500">사색적이고 차분한 에너지</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Chart Card */}
            <div className="flex-1 w-full relative">
                <GlassCard className="p-8 pb-12 w-full aspect-[4/3] flex flex-col justify-end relative overflow-hidden group">

                    {/* Chart Title */}
                    <div className="absolute top-8 left-8 flex justify-between w-[calc(100%-4rem)] items-center mb-8">
                        <div>
                            <h3 className="font-bold text-xl text-white">기분 예보</h3>
                            <div className="flex gap-2 mt-2">
                                <span className="text-xs font-semibold text-blue-400">현재: 안정적</span>
                                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-violet-500/20 text-violet-300">+12% 명료도</span>
                            </div>
                        </div>
                        <div className="text-gray-500">...</div>
                    </div>

                    {/* Fake Chart Lines */}
                    <div className="w-full h-40 relative mt-20">
                        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                            {/* Smooth Curve */}
                            <path
                                d="M0,100 C60,100 120,40 180,40 C240,40 300,100 360,100 C420,100 480,40 540,40 C600,40 660,100 720,100"
                                fill="none"
                                stroke="url(#gradient)"
                                strokeWidth="3"
                                strokeLinecap="round"
                                className="drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                            />

                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#8b5cf6" />
                                    <stop offset="50%" stopColor="#3b82f6" />
                                    <stop offset="100%" stopColor="#8b5cf6" />
                                </linearGradient>
                            </defs>

                            {/* Area under curve (faked opacity) */}
                            <path
                                d="M0,100 C60,100 120,40 180,40 C240,40 300,100 360,100 C420,100 480,40 540,40 C600,40 660,100 720,100 L720,160 L0,160 Z"
                                fill="url(#gradientArea)"
                                className="opacity-20"
                            />
                            <defs>
                                <linearGradient id="gradientArea" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#8b5cf6" />
                                    <stop offset="100%" stopColor="transparent" />
                                </linearGradient>
                            </defs>

                            {/* Dots on curve */}
                            <circle cx="180" cy="40" r="4" fill="#60a5fa" className="animate-pulse" />
                            <circle cx="360" cy="100" r="4" fill="#8b5cf6" />
                            <circle cx="540" cy="40" r="4" fill="#d946ef" />
                        </svg>
                    </div>

                    {/* X Axis Labels */}
                    <div className="flex justify-between text-xs text-gray-500 mt-4 uppercase font-mono tracking-wider">
                        <span>월</span>
                        <span>화</span>
                        <span>수</span>
                        <span>목</span>
                        <span>금</span>
                        <span>토</span>
                        <span>일</span>
                    </div>

                </GlassCard>
            </div>
        </section>
    );
}
