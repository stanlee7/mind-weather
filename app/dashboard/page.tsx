import MoodDashboard from '@/components/MoodDashboard';
import Header from '@/components/Header';

export default function DashboardPage() {
    return (
        <main className="min-h-screen bg-[#0f0c29] overflow-x-hidden selection:bg-violet-500/30 selection:text-white pb-20">
            <div className="fixed inset-0 z-[-1] pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-900/20 blur-[120px]" />
                <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-900/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[100px]" />
            </div>

            <Header />
            <MoodDashboard />
        </main>
    );
}
