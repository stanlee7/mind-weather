'use server';

import { createClient } from '@/utils/supabase/server';

export interface MoodData {
    date: string;
    score: number;
    emotion: string;
}

export async function getWeeklyMoods(): Promise<MoodData[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    // Fetch last 7 days of diaries
    const { data, error } = await supabase
        .from('diaries')
        .select('created_at, score, emotion')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(7);

    if (error) {
        console.error('Error fetching moods:', error);
        return [];
    }

    return data.map(entry => {
        const d = new Date(entry.created_at);
        const dateStr = `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;

        return {
            date: dateStr,
            score: entry.score || 50,
            emotion: entry.emotion || '?'
        };
    });
}
