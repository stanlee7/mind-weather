'use client';

import { createClient } from '@/utils/supabase/client'; // Import client
import { useState, useEffect, useRef } from 'react';
import { Sun, CloudRain, CloudFog, Flame, ArrowLeft, Image as ImageIcon, Mic, Loader2, Settings, X } from 'lucide-react';

// ... imports ...

export default function MoodDashboard() {
    const [selectedWeather, setSelectedWeather] = useState<string | null>(null);
    const [journalText, setJournalText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [isSaved, setIsSaved] = useState(false);
    const [moodData, setMoodData] = useState<MoodData[]>([]);
    const [isListening, setIsListening] = useState(false);

    // Image Upload States
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ... useEffect ...

    // Image Handlers
    const handleImageTrigger = () => {
        fileInputRef.current?.click();
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                alert("이미지 크기는 5MB 이하여야 합니다.");
                return;
            }
            setSelectedImage(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // ... voice input ...

    const handleAnalyze = async () => {
        if (!journalText.trim()) return;
        setIsAnalyzing(true);
        setIsSaved(false);

        try {
            let imageUrl = undefined;

            // Upload Image if exists
            if (selectedImage) {
                const supabase = createClient();
                const fileExt = selectedImage.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('diary-images')
                    .upload(fileName, selectedImage);

                if (uploadError) {
                    throw new Error('Image upload failed');
                }

                const { data: publicUrlData } = supabase.storage
                    .from('diary-images')
                    .getPublicUrl(fileName);

                imageUrl = publicUrlData.publicUrl;
            }

            const res = await analyzeEmotion(journalText, imageUrl);
            if ('error' in res) {
                alert(res.error);
            } else {
                setResult(res);
                if (res.savedId) {
                    setIsSaved(true);
                }
            }
        } catch (e) {
            console.error(e);
            alert('분석에 실패했습니다. (이미지 업로드 문제일 수 있습니다)');
        } finally {
            setIsAnalyzing(false);
        }
    };

    // ... rest of code ...

    return (
        // ... inside JSX ...
        {/* Journal Entry */ }
        < div className = "space-y-4" >
            {/* ... header ... */ }

            < GlassCard className = "p-1 min-h-[400px] relative flex flex-col" >

                {/* Image Preview Area */ }
    {
        previewUrl && (
            <div className="relative h-48 w-full bg-black/20 rounded-t-xl overflow-hidden group">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover opacity-80" />
                <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-red-500/80 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        )
    }

    <textarea
        value={journalText}
        onChange={(e) => setJournalText(e.target.value)}
        placeholder="무엇이 오늘의 구름을 만들었나요? 모두 털어놓으세요..."
        className="w-full flex-1 bg-transparent p-6 text-gray-200 placeholder:text-gray-600 resize-none focus:outline-none text-lg leading-relaxed"
    />

    {/* Hidden File Input */ }
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleImageSelect} 
                            accept="image/*" 
                            className="hidden" 
                        />

                        <div className="p-4 border-t border-white/5 flex items-center justify-between">
                            <div className="flex gap-2">
                                <button
                                    onClick={handleImageTrigger}
                                    title="사진 첨부"
                                    className={`p-2 rounded-lg transition-colors ${selectedImage ? 'bg-violet-500/20 text-violet-300' : 'bg-white/5 hover:bg-white/10 text-gray-400'}`}
                                >
                                    <ImageIcon className="w-4 h-4" />
                                </button>
                                {/* ... existing mic button ... */}
                                <button
                                    onClick={handleVoiceInput}
                                    title={isListening ? "듣고 있어요... (클릭하여 중지)" : "음성으로 기록하기"}
                                    className={`p-2 rounded-lg transition-all ${isListening ? 'bg-red-500/20 text-red-400 animate-pulse ring-2 ring-red-500/50' : 'bg-white/5 hover:bg-white/10 text-gray-400'}`}
                                >
                                    <Mic className={`w-4 h-4 ${isListening ? 'animate-bounce' : ''}`} />
                                </button>
                            </div>
                            <span className="text-xs text-gray-600">{journalText.length} 자</span>
                        </div>
                    </GlassCard >

        <div className="flex justify-end items-center gap-4">
            {isSaved && (
                <span className="text-green-400 text-sm font-medium animate-pulse">
                    ✓ 클라우드에 저장됨
                </span>
            )}
            <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !journalText.trim()}
                className="px-8 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold rounded-xl shadow-lg shadow-violet-900/40 transition-all hover:scale-105 flex items-center gap-2"
            >
                {isAnalyzing ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        분석 중...
                    </>
                ) : isSaved ? (
                    <>다시 분석하기</>
                ) : (
                    <>오늘의 기록 완료</>
                )}
            </button>
        </div>
                </div >

            </div >

        {/* Right Column: Sidebar Widgets */ }
        < aside className = "lg:w-96 space-y-6" >

            {/* Current Atmosphere Card */ }
            < div className = {`rounded-3xl p-8 bg-gradient-to-br ${currentConfig.gradient} relative overflow-hidden text-white min-h-[320px] flex flex-col justify-center transition-all duration-1000 shadow-2xl bg-[length:200%_200%] animate-gradient-xy`
}>
    <div className="relative z-10 bg-black/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
        <span className="inline-block px-3 py-1 rounded-full bg-black/20 text-xs font-semibold backdrop-blur-sm mb-4 text-white">현재 대기 상태</span>
        <h2 className="text-4xl font-bold font-serif mb-2 transition-all duration-500 capitalize text-white drop-shadow-md">
            {result ? result.emotion : (weatherOptions.find(o => o.id === selectedWeather)?.label || '맑음')}
        </h2>
        <p className="leading-relaxed text-sm text-white/90 font-medium drop-shadow-sm">
            {result ? result.summary : '날씨를 선택하거나 일기를 작성하여 당신의 내면 분위기를 알아보세요.'}
        </p>
    </div>
{/* Noise overlay */ }
<div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
                </div >

    {/* Weekly Trend Widget */ }
    < GlassCard className = "p-6" >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-white">감정 흐름 (최근 7일)</h3>
                        <button onClick={showFeatureNotReady}>
                            <Settings className="w-4 h-4 text-gray-500 hover:text-white transition-colors" />
                        </button>
                    </div>

                    <div className="mb-6">
                        <MoodChart data={moodData} />
                    </div>

                    <p className="text-xs text-gray-400 italic mb-4">
                        {moodData.length > 0
                            ? "당신의 감정 패턴이 기록되고 있습니다."
                            : "일기를 작성하면 여기에 감정 흐름이 나타납니다."}
                    </p>

                    <button
                        onClick={showFeatureNotReady}
                        className="w-full py-2 rounded-lg border border-white/10 hover:bg-white/5 text-xs text-violet-300 transition-colors"
                    >
                        평온 연습 탐색하기
                    </button>
                </GlassCard >

    {/* Mindful Moments */ }
{/* Mindful Moments (Dynamic Advice) */ }
<div className="space-y-4">
    <div className="flex items-center gap-2 pl-1">
        <div className="w-1 h-4 bg-violet-500 rounded-full" />
        <h4 className={`font-bold uppercase tracking-wide transition-colors ${result ? 'text-violet-300 text-sm' : 'text-gray-500 text-xs'}`}>
            {result ? 'AI 맞춤 처방전' : '마음챙김의 순간'}
        </h4>
    </div>

    {(result?.advice || ['10분 명상', '호흡 패턴', '기분 패턴 보기']).map((item, i) => (
        <GlassCard
            key={i}
            className="p-4 flex items-center gap-3 hover:bg-white/[0.08] cursor-pointer"
            hoverEffect={false}
            onClick={showFeatureNotReady}
        >
            <div className={`p-2 rounded-full ${i === 0 ? 'bg-indigo-500/20 text-indigo-400' : i === 1 ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                {/* Use different icons based on index or content? Keeping simple for now */}
                <div className="w-4 h-4 rounded-full border-2 border-current" />
            </div>
            <span className="text-sm text-gray-200">{item}</span>
        </GlassCard>
    ))}

    {!result && (
        <p className="text-xs text-gray-500 pl-1 mt-2">
            일기를 작성하고 분석하면 맞춤형 조언이 여기에 나타납니다.
        </p>
    )}
</div>

            </aside >

        </div >
    );
}
