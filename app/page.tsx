'use client';

import { useState } from 'react';
import { Sparkles, CloudRain, Sun, CloudFog, Zap, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DiaryInput from '@/components/DiaryInput';
import MindWeatherCard from '@/components/MindWeatherCard';

export default function Home() {
  const [viewState, setViewState] = useState<'landing' | 'writing' | 'result'>('landing');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [diaryContent, setDiaryContent] = useState<string>('');

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">

      <AnimatePresence mode="wait">

        {/* LANDING VIEW */}
        {viewState === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center z-10 max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-violet-200 text-sm font-medium mb-8 animate-float">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>AI 감정 날씨 분석</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-200 to-indigo-200 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              오늘 당신의 마음은<br />어떤 날씨인가요?
            </h1>

            <p className="text-lg text-gray-400 mb-12 leading-relaxed">
              복잡한 마음을 글로 적어보세요.<br />
              AI가 당신의 감정을 분석해 날씨로 보여드립니다.
            </p>

            <button
              onClick={() => setViewState('writing')}
              className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                시작하기 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-violet-200 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            {/* Floating Icons Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] -z-10 pointer-events-none">
              <Sun className="absolute top-0 right-20 w-12 h-12 text-yellow-500/20 animate-pulse-slow" />
              <CloudRain className="absolute bottom-20 left-20 w-16 h-16 text-blue-400/20 animate-float" style={{ animationDelay: '1s' }} />
              <Zap className="absolute top-40 left-10 w-8 h-8 text-yellow-500/10 animate-pulse" />
            </div>
          </motion.div>
        )}

        {/* WRITING VIEW */}
        {viewState === 'writing' && (
          <DiaryInput
            onBack={() => setViewState('landing')}
            onAnalyze={(result, content) => {
              setAnalysisResult(result);
              setDiaryContent(content);
              setViewState('result');
            }}
          />
        )}

        {/* RESULT VIEW */}
        {viewState === 'result' && analysisResult && (
          <MindWeatherCard
            result={analysisResult}
            content={diaryContent}
            onReset={() => {
              setAnalysisResult(null);
              setDiaryContent('');
              setViewState('landing');
            }}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
