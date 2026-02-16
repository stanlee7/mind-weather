import { createClient } from '@/utils/supabase/server';
import type { MetadataRoute } from 'next';

export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://mind-weather-lovat.vercel.app';
    const supabase = await createClient();

    // Fetch all published posts
    const { data: posts } = await supabase
        .from('posts')
        .select('slug, created_at')
        .eq('published', true);

    const blogEntries: MetadataRoute.Sitemap = (posts || []).map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.created_at),
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        ...blogEntries,
    ];
}
