import { createClient } from '@/utils/supabase/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: post } = await supabase
        .from('posts')
        .select('title, excerpt')
        .eq('slug', slug)
        .single();

    if (!post) {
        return {
            title: '게시글을 찾을 수 없습니다',
        };
    }

    return {
        title: `${post.title} | 마음 날씨 블로그`,
        description: post.excerpt,
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: post } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

    if (!post) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-[#0f0c29] text-gray-100 font-sans selection:bg-violet-500/30 selection:text-white">
            <Header user={user} />

            <article className="pt-32 pb-20 px-6">
                <div className="max-w-3xl mx-auto">
                    <Link href="/blog" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        블로그 목록으로
                    </Link>

                    <header className="mb-12">
                        <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
                            {post.title}
                        </h1>
                        <div className="flex items-center gap-4 text-gray-400 text-sm">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-violet-400" />
                                <time dateTime={post.created_at}>
                                    {new Date(post.created_at).toLocaleDateString('ko-KR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </time>
                            </div>
                        </div>
                    </header>

                    <div
                        className="prose prose-invert prose-lg max-w-none prose-headings:font-serif prose-headings:text-white prose-p:text-gray-300 prose-a:text-violet-400 hover:prose-a:text-violet-300 prose-strong:text-white"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>
            </article>

            <Footer />
        </main>
    );
}
