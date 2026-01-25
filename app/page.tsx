import Header from '@/components/Header';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import WeeklyOutlook from '@/components/WeeklyOutlook';
import SelfCare from '@/components/SelfCare';
import Footer from '@/components/Footer';
import { createClient } from '@/utils/supabase/server';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-[#0f0c29] overflow-x-hidden selection:bg-violet-500/30 selection:text-white">
      <Header user={user} />
      <Hero />
      <HowItWorks />
      <WeeklyOutlook />
      <SelfCare />

      {/* Call to Action Section */}
      {/* Call to Action Section */}
      <section className="py-32 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-violet-900/20 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10 p-12 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-xl">
          <h2 className="text-2xl md:text-4xl font-serif font-bold text-white mb-6 whitespace-nowrap">당신의 마음 날씨, 함께 나누세요</h2>
          <p className="text-gray-300 text-lg mb-10 leading-relaxed">
            비밀스러운 고민부터 소소한 일상까지,<br className="hidden sm:block" />
            익명으로 편안하게 이야기할 수 있는 공간이 열려있습니다.
          </p>

          <div className="flex justify-center">
            <a
              href="https://open.kakao.com/o/g6I89ddi"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 bg-[#F7E600] hover:bg-[#EAC900] text-[#3A1D1D] font-bold rounded-xl transition-all shadow-lg shadow-yellow-400/20 flex items-center gap-2 hover:scale-105"
            >
              <span className="text-xl">💬</span>
              오픈카톡 커뮤니티 참여하기
            </a>
          </div>

          <div className="absolute top-10 right-10 opacity-20 animate-float">
            <div className="w-24 h-12 bg-gray-400 rounded-full blur-xl" />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
