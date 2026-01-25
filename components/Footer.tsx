import Link from 'next/link';
import { Cloud, Globe, Youtube, Instagram } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="w-full py-12 px-6 md:px-12 border-t border-white/5 mt-20">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">

                <div className="flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-violet-500" />
                    <span className="font-bold text-lg">Mind Weather</span>
                </div>

                <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
                    <Link href="#" className="hover:text-gray-300 transition-colors">개인정보처리방침</Link>
                    <Link href="#" className="hover:text-gray-300 transition-colors">이용약관</Link>
                    <Link href="#" className="hover:text-gray-300 transition-colors">문의하기</Link>
                </div>

                <div className="flex items-center gap-4">
                    <a
                        href="https://www.youtube.com/@stanleestudio"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-gray-400 hover:text-red-500"
                        title="YouTube"
                    >
                        <Youtube className="w-4 h-4" />
                    </a>
                    <a
                        href="https://stanleestudio.liveklass.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-gray-400 hover:text-violet-400"
                        title="Website"
                    >
                        <Globe className="w-4 h-4" />
                    </a>
                    <a
                        href="https://www.instagram.com/stanleestudio/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-gray-400 hover:text-pink-500"
                        title="Instagram"
                    >
                        <Instagram className="w-4 h-4" />
                    </a>
                </div>

            </div>

            <div className="text-center text-xs text-gray-700 mt-12">
                © 2026 Mind Weather by 스탠리탬. 내면의 평화를 위해 차분하게 만들어졌습니다.
            </div>
        </footer>
    );
}
