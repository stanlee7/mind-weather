'use client';

import { CloudRain, Sparkles, MessageCircleHeart } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
    {
        icon: CloudRain,
        title: "1. 오늘의 기분 선택",
        desc: "복잡한 글쓰기 없이, 지금 느끼는 감정을 날씨 아이콘으로 직관적으로 선택하세요."
    },
    {
        icon: Sparkles,
        title: "2. AI 심층 분석",
        desc: "당신의 짧은 기록을 AI가 공감하며 분석하여 숨겨진 감정까지 헤아려줍니다."
    },
    {
        icon: MessageCircleHeart,
        title: "3. 맞춤형 치유 처방",
        desc: "분석 결과에 따라 마음을 달래줄 따뜻한 조언과 행동 지침을 받아보세요."
    }
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-40 px-6 md:px-12 relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold font-serif text-white mb-4">마음 날씨를 돌보는 3단계</h2>
                    <p className="text-gray-400">단순한 기록을 넘어, 마음을 이해하고 치유하는 과정을 경험하세요.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-colors"
                        >
                            <div className="w-16 h-16 bg-violet-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-violet-400">
                                <step.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                            <p className="text-gray-400 leading-relaxed text-sm">
                                {step.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
