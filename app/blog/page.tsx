import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Calendar, ArrowRight } from 'lucide-react';

export const metadata = {
    title: '마음 날씨 블로그 | 감정 관리와 멘탈 케어 가이드',
    description: '마음 날씨 서비스의 공식 블로그입니다. 감정 기록, 멘탈 케어 팁, 그리고 서비스 업데이트 소식을 확인하세요.',
};

export default async function BlogPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: posts } = await supabase
        .from('posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

    return (
        <main className="min-h-screen bg-[#0f0c29] text-gray-100 font-sans selection:bg-violet-500/30 selection:text-white">
            <Header user={user} />

            <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">마음 날씨 블로그</h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        감정을 이해하고 더 나은 하루를 만드는 이야기를 전합니다.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts?.map((post) => (
                        <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                            <article className="h-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-900/20 flex flex-col">
                                <div className="mb-4 flex items-center gap-2 text-sm text-gray-400">
                                    <Calendar className="w-4 h-4 text-violet-400" />
                                    <time dateTime={post.created_at}>
                                        {new Date(post.created_at).toLocaleDateString('ko-KR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </time>
                                </div>

                                <h2 className="text-xl font-bold text-white mb-3 group-hover:text-violet-300 transition-colors line-clamp-2">
                                    {post.title}
                                </h2>

                                <p className="text-gray-400 mb-6 line-clamp-3 flex-1">
                                    {post.excerpt}
                                </p>

                                <div className="flex items-center text-violet-400 font-medium group-hover:translate-x-1 transition-transform">
                                    읽기 <ArrowRight className="ml-2 w-4 h-4" />
                                </div>
                            </article>
                        </Link>
                    ))}

                    {posts?.length === 0 && (
                        <div className="col-span-full text-center py-20 text-gray-500">
                            <p>아직 등록된 게시글이 없습니다.</p>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </main>
    );
}
