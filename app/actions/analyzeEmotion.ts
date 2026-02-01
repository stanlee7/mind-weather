'use server';

import Groq from 'groq-sdk';
import { createClient } from '@/utils/supabase/server';

// Define the response type for type safety
export interface AnalysisResult {
    weather: 'sunny' | 'rainy' | 'cloudy' | 'lightning';
    emotion: string;
    summary: string;
    keywords: string[];
    advice: string[]; // Added advice
    score: number;
    savedId?: string;
}

export async function analyzeEmotion(text: string, imageUrl?: string): Promise<AnalysisResult | { error: string }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: '로그인이 필요한 서비스입니다.' };
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        return { error: 'API Key not found. Please set GROQ_API_KEY in .env.local' };
    }

    try {
        const groq = new Groq({ apiKey });
        const model = 'llama-3.3-70b-versatile';

        const prompt = `
          Analyze the sentiment of the following diary entry and return a JSON object.
          
          Diary Entry: "${text}"
    
          Rules:
          1. 'weather': Choose one from ['sunny', 'rainy', 'cloudy', 'lightning'] based on the overall mood.
          2. 'emotion': A short string describing the main emotion (in Korean).
          3. 'summary': A warm, deeply empathetic 2-3 sentence summary (in Korean).
             - Speak like a supportive friend or counselor.
             - Validate their feelings first, then offer comfort or shared joy.
             - Use soft, kind honorifics (e.g., "~하셨군요", "~셨네요").
          4. 'keywords': An array of 3 key words related to the entry (in Korean).
          5. 'advice': An array of 3 specific, actionable suggestions (in Korean).
             - MUST be complete sentences.
             - Tone: Very kind and encouraging.
          6. 'score': Pulse score 0-100 (0=Very Negative, 100=Very Positive).

          STRICT LANGUAGE RULE:
          - Output MUST be 100% natural Korean (Hangul).
          - NEVER use Japanese (Kanji/Hiragana/Katakana) or Chinese characters.
          - Even if the input contains foreign languages, the summary and advice MUST be in Korean.
    
          IMPORTANT: Return ONLY valid JSON.
          
          Response Format:
          {
            "weather": "sunny",
            "emotion": "행복",
            "summary": "오늘 하루 정말 고생 많으셨어요.",
            "keywords": ["희망", "내일"],
            "advice": ["가벼운 산책을 하며 바람을 느껴보세요", "오늘의 감정을 사진으로 남겨보세요", "자신에게 칭찬 한마디를 건네보세요"],
            "score": 85
          }
        `;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: 'You are a helpful AI counselor that analyzes emotions. You MUST respond in Korean (Hangul) only.' },
                { role: 'user', content: prompt }
            ],
            model: model,
            temperature: 0.5,
            response_format: { type: 'json_object' }
        });

        const content = completion.choices[0]?.message?.content || '{}';
        const analysis = JSON.parse(content) as AnalysisResult;

        // Save to Supabase (User is guaranteed to exist here)
        const { data: insertedData, error } = await supabase.from('diaries').insert({
            user_id: user.id,
            content: text,
            image_url: imageUrl || null,
            weather: analysis.weather,
            emotion: analysis.emotion,
            summary: `${analysis.summary}\n\n💡 AI 추천: ${analysis.advice?.join(', ') || ''}`,
            keywords: analysis.keywords,
            score: analysis.score
        }).select().single();

        if (!error && insertedData) {
            analysis.savedId = insertedData.id;
        } else {
            console.error('Failed to save diary:', error);
        }

        return analysis;

    } catch (error) {
        console.error('Groq Analysis Error:', error);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return { error: `AI Error: ${(error as any).message || 'Unknown error'}` };
    }
}
