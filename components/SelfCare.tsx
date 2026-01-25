import GlassCard from './ui/GlassCard';
import { PenLine, Activity, Users } from 'lucide-react';

export default function SelfCare() {
    const features = [
        {
            icon: PenLine,
            title: "기록 (Track)",
            desc: "매일의 감정 기후를 끊김 없이 기록하세요. 자연어나 날씨 태그를 사용하여 당신의 상태를 정의할 수 있습니다.",
            color: "bg-indigo-500/20 text-indigo-400"
        },
        {
            icon: Activity,
            title: "분석 (Analyze)",
            desc: "AI가 정신적 압박의 변화를 감지하고, 활동과 감정의 고저 사이의 상관관계를 분석합니다.",
            color: "bg-blue-500/20 text-blue-400"
        },
        {
            icon: Users,
            title: "연결 (Connect)",
            desc: "마음챙김을 실천하는 사람들의 커뮤니티에 참여하세요. 익명으로 날씨 패턴을 공유하고 서로의 여정을 응원해주세요.",
            color: "bg-violet-500/20 text-violet-400"
        }
    ];

    return (
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">섬세한 셀프 케어</h2>
                <p className="text-gray-400 text-lg">어떤 내면의 폭풍우도 우아하고 지혜롭게 헤쳐나갈 수 있도록 설계된 도구들입니다.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                {features.map((f) => (
                    <GlassCard key={f.title} className="p-8 hover:bg-white/[0.08] transition-all group" hoverEffect={true}>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${f.color}`}>
                            <f.icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4">{f.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                            {f.desc}
                        </p>
                    </GlassCard>
                ))}
            </div>
        </section>
    );
}
