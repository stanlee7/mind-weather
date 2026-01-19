'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Wand2, Loader2 } from 'lucide-react';
import { analyzeEmotion } from '@/app/actions/analyzeEmotion';

interface DiaryInputProps {
    onBack: () => void;
    onAnalyze: (result: any, content: string) => void;
}

export default function DiaryInput({ onBack, onAnalyze }: DiaryInputProps) {
    const [text, setText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Mock Analysis for UI Demo
    // Real Gemini Analysis
    const handleAnalyze = async () => {
        if (!text.trim()) return;
        setIsAnalyzing(true);

        try {
            const result = await analyzeEmotion(text);

            if ('error' in result) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                alert((result as any).error);
                setIsAnalyzing(false);
                return;
            }

            onAnalyze(result, text);
        } catch (error) {
            console.error(error);
            alert('분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-3xl z-10"
        >
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={onBack}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-semibold text-white/90">오늘의 기록</h2>
            </div>

            <div className="glass-card rounded-3xl p-1 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-blue-500/10 pointer-events-none" />

                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="오늘 있었던 일이나 느꼈던 감정을 자유롭게 적어주세요..."
                    className="w-full h-[400px] bg-black/40 p-8 text-lg md:text-xl text-gray-200 placeholder:text-gray-600 resize-none focus:outline-none rounded-2xl focus:bg-black/50 transition-colors leading-loose"
                    spellCheck={false}
                />

                <div className="absolute bottom-6 right-6 flex items-center gap-4">
                    <span className="text-xs text-gray-600 font-mono">
                        {text.length} characters
                    </span>
                    <button
                        onClick={handleAnalyze}
                        disabled={!text.trim() || isAnalyzing}
                        className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all
              ${!text.trim() ? 'bg-white/5 text-gray-500 cursor-not-allowed' : 'bg-white text-black hover:scale-105 shadow-lg shadow-violet-500/20'}
            `}
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                분석 중...
                            </>
                        ) : (
                            <>
                                <Wand2 className="w-5 h-5" />
                                마음 날씨 분석
                            </>
                        )}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
