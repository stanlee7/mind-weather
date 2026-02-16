import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/private/', '/dashboard/'],
        },
        sitemap: 'https://mind-weather-lovat.vercel.app/sitemap.xml',
    };
}
