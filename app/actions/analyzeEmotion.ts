'use server';

import Groq from 'groq-sdk';

// Define the response type for type safety
export interface AnalysisResult {
    weather: 'sunny' | 'rainy' | 'cloudy' | 'lightning';
    emotion: string;
    summary: string;
    keywords: string[];
    score: number;
}

export async function analyzeEmotion(text: string): Promise<AnalysisResult | { error: string }> {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        return { error: 'API Key not found. Please set GROQ_API_KEY in .env.local' };
    }

    try {
        const groq = new Groq({ apiKey });

        // Using Llama 3.3 70B (Latest Versatile model)
        // Updated: llama3-70b-8192 is decommissioned
        const model = 'llama-3.3-70b-versatile';

        const prompt = `
      Analyze the sentiment of the following diary entry and return a JSON object.
      
      Diary Entry: "${text}"

      Rules:
      1. 'weather': Choose one from ['sunny', 'rainy', 'cloudy', 'lightning'] based on the overall mood.
         - sunny: Positive, happy, energetic, clear
         - rainy: Sad, sentimental, calm, depressed
         - cloudy: Confused, anxious, uncertain, bored
         - lightning: Angry, intense, shocked, Stressful
      2. 'emotion': A short string describing the main emotion (in Korean).
      3. 'summary': A warm, comforting 1-sentence summary of the diary (in Korean).
      4. 'keywords': An array of 3 key words related to the entry (in Korean).
      5. 'score': Pulse score 0-100 (0=Very Negative, 100=Very Positive).

      IMPORTANT: Return ONLY valid JSON. Do not include markdown formatting like \`\`\`json.
      
      Response Format:
      {
        "weather": "sunny",
        "emotion": "행복",
        "summary": "오늘 하루 정말 고생 많으셨어요, 내일도 좋은 일이 가득할 거예요.",
        "keywords": ["희망", "내일", "미소"],
        "score": 85
      }
    `;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: 'You are a helpful AI assistant that analyzes emotions and returns JSON only.' },
                { role: 'user', content: prompt }
            ],
            model: model,
            temperature: 0.5,
            response_format: { type: 'json_object' } // Groq supports JSON mode
        });

        const content = completion.choices[0]?.message?.content || '{}';
        const analysis = JSON.parse(content) as AnalysisResult;

        return analysis;

    } catch (error) {
        console.error('Groq Analysis Error:', error);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return { error: `AI Error: ${(error as any).message || 'Unknown error'}` };
    }
}
