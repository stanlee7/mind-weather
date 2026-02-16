'use client';

import Link from 'next/link';
import { Cloud, Menu, LogOut, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '@/app/login/actions';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { usePathname } from 'next/navigation';

interface HeaderProps {
    user?: SupabaseUser | null;
}

export default function Header({ user }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Hide header on dashboard page as it has its own navigation/controls
    if (pathname === '/dashboard') return null;

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'py-3 bg-[#0f0c29]/80 backdrop-blur-xl shadow-sm px-6 md:px-12'
                : 'py-6 px-6 md:px-12 bg-transparent'
                }`}
        >
            <nav
                className={`flex items-center justify-between max-w-7xl mx-auto transition-all duration-300 ${isScrolled
                    ? 'w-full bg-transparent border-none p-0'
                    : 'backdrop-blur-md bg-black/20 md:bg-transparent rounded-full px-6 py-3 border border-white/10 md:border-none'
                    }`}
            >

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-violet-600 p-2 rounded-lg group-hover:bg-violet-500 transition-colors">
                        <Cloud className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">Mind Weather</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
                    {['내 다이어리', '트렌드', '블로그'].map((item) => (
                        <Link
                            key={item}
                            href={item === '내 다이어리' ? '/dashboard' : item === '블로그' ? '/blog' : '#'}
                            className="hover:text-white transition-colors relative group"
                        >
                            {item}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-violet-500 transition-all group-hover:w-full" />
                        </Link>
                    ))}
                </div>

                {/* CTA & Mobile Menu */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="hidden md:flex items-center gap-4">
                            <span className="text-sm text-gray-300 flex items-center gap-2">
                                <User className="w-4 h-4" />
                                {user.email?.split('@')[0]}님
                            </span>
                            <form action={logout}>
                                <button className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                                    <LogOut className="w-3 h-3" />
                                    로그아웃
                                </button>
                            </form>
                            <Link
                                href="/dashboard"
                                className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-full shadow-lg shadow-violet-900/40 transition-all hover:scale-105"
                            >
                                대시보드
                            </Link>
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center gap-4">
                            <Link
                                href="/login"
                                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                            >
                                로그인
                            </Link>
                            <Link
                                href="/login?mode=signup"
                                className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-full shadow-lg shadow-violet-900/40 transition-all hover:scale-105"
                            >
                                시작하기
                            </Link>
                        </div>
                    )}

                    <button
                        className="md:hidden text-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-24 left-6 right-6 p-6 rounded-3xl bg-[#0f0c29]/95 backdrop-blur-xl border border-white/10 md:hidden flex flex-col gap-4 text-center z-50"
                    >
                        {['내 다이어리', '트렌드', '블로그'].map((item) => (
                            <Link
                                key={item}
                                href={item === '내 다이어리' ? '/dashboard' : item === '블로그' ? '/blog' : '#'}
                                className="text-gray-300 hover:text-white py-2 block"
                            >

                                {item}
                            </Link>
                        ))}

                        {user ? (
                            <>
                                <Link href="/dashboard" className="text-white font-semibold py-2 block bg-violet-600/20 rounded-xl">대시보드 바로가기</Link>
                                <form action={logout} className="w-full">
                                    <button className="text-gray-400 py-2 block w-full hover:text-white">로그아웃</button>
                                </form>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="text-gray-300 hover:text-white py-2 block">로그인</Link>
                                <Link
                                    href="/login?mode=signup"
                                    className="mt-2 w-full px-5 py-3 bg-violet-600 text-white rounded-xl font-semibold block"
                                >
                                    시작하기
                                </Link>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
