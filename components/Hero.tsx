'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { PlayCircle } from 'lucide-react';
import GlassCard from './ui/GlassCard';

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center pt-20 pb-32 overflow-hidden text-center">

            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/20 blur-[130px] rounded-full pointer-events-none" />
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto px-6 flex flex-col items-center">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 backdrop-blur-md mb-8"
                >
                    <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                    <span className="text-xs font-semibold tracking-wider text-violet-200 uppercase">감정 예보</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight mb-8 tracking-tight"
                >
                    <span className="block sm:inline">오늘, 당신의</span>{' '}
                    <span className="whitespace-nowrap relative px-2">
                        <span className="absolute inset-0 blur-xl bg-violet-600/50 animate-pulse rounded-full" />
                        <span className="relative z-10 text-white font-serif drop-shadow-[0_0_20px_rgba(167,139,250,0.8)]">
                            마음 날씨
                        </span>
                        <span>는 어떤가요?</span>
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-lg md:text-xl text-gray-300 max-w-2xl mb-12 leading-relaxed"
                >
                    복잡한 감정을 날씨 아이콘으로 쉽게 기록하고,<br className="hidden md:block" /> 나만의 감정 패턴을 한눈에 확인해보세요.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row items-center gap-4"
                >
                    <Link href="/dashboard" className="group relative px-8 py-4 bg-violet-600 rounded-lg font-semibold text-white overflow-hidden transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(124,58,237,0.5)]">
                        <span className="relative z-10">감정 기록 시작하기</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>

                    <button
                        onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                        className="px-8 py-4 rounded-lg border border-white/10 hover:bg-white/5 transition-all flex items-center gap-2 text-white font-medium group"
                    >
                        <PlayCircle className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                        작동 방식
                    </button>
                </motion.div>

            </div>
        </section>
    );
}
