import { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import MindWeatherCard from '@/components/MindWeatherCard';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Props = {
    params: Promise<{ id: string }>;
};

// Generate Metadata for better sharing (SEO)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const supabase = await createClient(); // Use server client
    const { data: diary } = await supabase
        .from('diaries')
        .select('*')
        .eq('id', id)
        .single();

    if (!diary) {
        return { title: 'Mind Weather - 페이지를 찾을 수 없음' };
    }

    return {
        title: `누군가의 마음 날씨: ${diary.weather === 'sunny' ? '맑음 ☀️' : diary.weather === 'rainy' ? '비 ☔' : diary.weather === 'cloudy' ? '흐림 ☁️' : '번개 ⚡'}`,
        description: diary.summary,
    };
}

export default async function SharePage({ params }: Props) {
    const { id } = await params;
    const supabase = await createClient(); // Use server client

    const { data: diary, error } = await supabase
        .from('diaries')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !diary) {
        notFound();
    }

    // Construct the result object for the card
    const result: any = {
        weather: diary.weather,
        emotion: diary.emotion,
        summary: diary.summary,
        keywords: diary.keywords,
        score: diary.score,
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[#0f0c29]">
            {/* Background Objects (Static for share page to match theme) */}
            <div className="fixed inset-0 z-[-1] pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-900/20 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px]" />
            </div>

            <div className="z-10 w-full max-w-lg space-y-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">공유된 마음 날씨</h1>
                    <p className="text-gray-400 text-sm">AI가 분석한 감정 기록입니다</p>
                </div>

                <MindWeatherCard
                    result={result}
                    content={diary.content}
                    isShared={true}
                    onReset={() => { }}
                />

                <div className="text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-violet-300 hover:text-white transition-colors border-b border-transparent hover:border-white"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        나도 마음 날씨 분석하러 가기
                    </Link>
                </div>
            </div>
        </main>
    );
}
