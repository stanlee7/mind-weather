'use server';

import { supabase } from '@/lib/supabase';
import { AnalysisResult } from './analyzeEmotion';

export async function saveDiary(content: string, analysis: AnalysisResult) {
    try {
        const { data, error } = await supabase
            .from('diaries')
            .insert([
                {
                    content,
                    weather: analysis.weather,
                    emotion: analysis.emotion,
                    summary: analysis.summary,
                    keywords: analysis.keywords,
                    score: analysis.score,
                },
            ])
            .select('id') // Return the ID of the new row
            .single();

        if (error) {
            console.error('Supabase Insert Error:', error);
            throw new Error(error.message);
        }

        return { success: true, id: data.id };
    } catch (error) {
        console.error('Save Diary Error:', error);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return { success: false, error: (error as any).message };
    }
}
