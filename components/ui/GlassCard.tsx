import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    intensity?: "low" | "medium" | "high";
    hoverEffect?: boolean;
}

export default function GlassCard({
    children,
    className,
    intensity = "medium",
    hoverEffect = false,
    ...props
}: GlassCardProps) {
    const intensityMap = {
        low: "bg-white/[0.02] border-white/5",
        medium: "bg-white/[0.05] border-white/10",
        high: "bg-white/[0.1] border-white/20"
    };

    return (
        <div
            className={cn(
                "backdrop-blur-xl border rounded-3xl shadow-xl",
                intensityMap[intensity],
                hoverEffect && "transition-all duration-300 hover:bg-white/[0.08] hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.1)] hover:-translate-y-1",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
