'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CloudRain, Sun, CloudFog, Zap, RotateCcw, Share2, Quote, Check, Link as LinkIcon, Loader2 } from 'lucide-react';
import { saveDiary } from '@/app/actions/saveDiary';

interface MindWeatherCardProps {
    result: {
        weather: 'sunny' | 'rainy' | 'cloudy' | 'lightning';
        emotion: string;
        summary: string;
        keywords: string[];
        advice: string[];
        score: number;
    };
    content?: string;
    isShared?: boolean;
    onReset: () => void;
}

const weatherConfig = {
    sunny: {
        icon: Sun,
        text: "맑음",
        gradient: "from-orange-400 via-amber-200 to-blue-300",
        bgClass: "bg-gradient-to-br from-blue-400/20 to-orange-400/20",
        description: "긍정적인 에너지가 가득한 상태"
    },
    rainy: {
        icon: CloudRain,
        text: "비",
        gradient: "from-blue-700 via-slate-500 to-gray-400",
        bgClass: "bg-gradient-to-br from-slate-900/40 to-blue-900/40",
        description: "차분하고 감성적인 상태"
    },
    cloudy: {
        icon: CloudFog,
        text: "흐림",
        gradient: "from-gray-400 via-gray-300 to-white",
        bgClass: "bg-gradient-to-br from-gray-500/20 to-white/10",
        description: "생각이 많고 복잡한 상태"
    },
    lightning: {
        icon: Zap,
        text: "번개",
        gradient: "from-yellow-400 via-purple-500 to-indigo-900",
        bgClass: "bg-gradient-to-br from-purple-900/40 to-yellow-500/10",
        description: "강렬한 감정이 휘몰아치는 상태"
    }
};

export default function MindWeatherCard({ result, content, isShared = false, onReset }: MindWeatherCardProps) {
    const config = weatherConfig[result.weather] || weatherConfig.sunny;
    const WeatherIcon = config.icon;

    const [isSaving, setIsSaving] = useState(false);
    const [shareUrl, setShareUrl] = useState<string | null>(null);

    const handleShare = async () => {
        if (!content) return;
        setIsSaving(true);

        try {
            const { success, id, error } = await saveDiary(content, result);

            if (success && id) {
                const url = `${window.location.origin}/share/${id}`;
                setShareUrl(url);
                navigator.clipboard.writeText(url);
                alert('공유 링크가 클립보드에 복사되었습니다!');
            } else {
                alert('저장에 실패했습니다: ' + error);
            }
        } catch (e) {
            console.error(e);
            alert('오류가 발생했습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg z-10"
        >
            <div className={`glass-card rounded-[2rem] overflow-hidden relative border-t border-white/20 shadow-2xl shadow-${result.weather === 'sunny' ? 'orange' : 'slate'}-500/20`}>

                {/* Dynamic Weather Background */}
                <div className={`absolute inset-0 opacity-50 ${config.bgClass}`} />

                {/* Weather Animation Layer */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {result.weather === 'rainy' && (
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                    )}
                </div>

                <div className="relative p-8 md:p-10 flex flex-col items-center text-center">

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                        className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 bg-gradient-to-br ${config.gradient} shadow-lg`}
                    >
                        <WeatherIcon className="w-12 h-12 text-white drop-shadow-md" />
                    </motion.div>

                    <h2 className="text-3xl font-bold text-white mb-2">{config.text}</h2>
                    <p className="text-violet-200 mb-8 font-medium">{config.description}</p>

                    <div className="w-full bg-black/20 rounded-2xl p-6 backdrop-blur-sm mb-8 border border-white/5">
                        <Quote className="w-6 h-6 text-violet-400 mb-4 opacity-50" />
                        <p className="text-gray-200 leading-relaxed text-lg">
                            {result.summary}
                        </p>
                        <div className="mt-6 flex flex-wrap gap-2 justify-center">
                            {result.keywords.map((keyword, idx) => (
                                <span key={idx} className="px-3 py-1 rounded-full bg-white/10 text-xs text-violet-200 border border-white/10">
                                    #{keyword}
                                </span>
                            ))}
                        </div>
                    </div>

                    {!isShared && (
                        <div className="flex gap-4 w-full">
                            <button
                                onClick={onReset}
                                className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <RotateCcw className="w-4 h-4" />
                                다시 쓰기
                            </button>

                            {shareUrl ? (
                                <button
                                    className="flex-1 py-3 rounded-xl bg-green-500/20 text-green-200 font-medium flex items-center justify-center gap-2 cursor-default border border-green-500/30"
                                >
                                    <Check className="w-4 h-4" />
                                    복사 완료
                                </button>
                            ) : (
                                <button
                                    onClick={handleShare}
                                    disabled={isSaving}
                                    className="flex-1 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-violet-600/30 disabled:opacity-50"
                                >
                                    {isSaving ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Share2 className="w-4 h-4" />
                                    )}
                                    공유하기
                                </button>
                            )}
                        </div>
                    )}

                    {/* Share URL Display (Optional: if user wants to see the link explicitly) */}
                    {shareUrl && (
                        <div className="mt-4 p-2 bg-black/30 rounded-lg text-xs text-gray-400 break-all w-full flex items-center gap-2">
                            <LinkIcon className="w-3 h-3 flex-shrink-0" />
                            {shareUrl}
                        </div>
                    )}

                </div>
            </div>
        </motion.div>
    );
}
