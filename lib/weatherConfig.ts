import { Sun, CloudRain, CloudFog, Zap } from 'lucide-react';

export const weatherConfig = {
    sunny: {
        icon: Sun,
        text: "맑음",
        gradient: "from-orange-400 via-amber-200 to-blue-300",
        bgClass: "bg-gradient-to-br from-blue-400/20 to-orange-400/20",
        description: "긍정적인 에너지가 가득한 상태"
    },
    rainy: {
        icon: CloudRain,
        text: "비",
        gradient: "from-blue-700 via-slate-500 to-gray-400",
        bgClass: "bg-gradient-to-br from-slate-900/40 to-blue-900/40",
        description: "차분하고 감성적인 상태"
    },
    cloudy: {
        icon: CloudFog,
        text: "흐림",
        gradient: "from-gray-400 via-gray-300 to-white",
        bgClass: "bg-gradient-to-br from-gray-500/20 to-white/10",
        description: "생각이 많고 복잡한 상태"
    },
    lightning: {
        icon: Zap,
        text: "번개",
        gradient: "from-yellow-400 via-purple-500 to-indigo-900",
        bgClass: "bg-gradient-to-br from-purple-900/40 to-yellow-500/10",
        description: "강렬한 감정이 휘몰아치는 상태"
    }
};

export type WeatherType = keyof typeof weatherConfig;
