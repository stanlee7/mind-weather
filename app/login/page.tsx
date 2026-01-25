import { login, signup } from './actions'
import Link from 'next/link'
import { Cloud } from 'lucide-react'
import AuthSubmitButton from '@/components/AuthSubmitButton'

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ message: string, error: string }>
}) {
    const params = await searchParams;

    return (
        <div className="min-h-screen bg-[#0f0c29] flex items-center justify-center p-4">
            {/* Background */}
            <div className="fixed inset-0 z-[-1] pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-900/20 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px]" />
            </div>

            <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 group mb-4">
                        <div className="bg-violet-600 p-2 rounded-lg group-hover:bg-violet-500 transition-colors">
                            <Cloud className="w-6 h-6 text-white" />
                        </div>
                    </Link>
                    <h1 className="text-2xl font-bold text-white font-serif mb-2">Mind Weather</h1>
                    <p className="text-gray-400 text-sm">내면의 우주로 들어오세요</p>
                </div>

                <form className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2" htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="hello@mindweather.com"
                            required
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2" htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            required
                            minLength={6}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500 transition-all"
                        />
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        <AuthSubmitButton formAction={login} className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-violet-900/40">
                            로그인
                        </AuthSubmitButton>
                        <AuthSubmitButton formAction={signup} className="w-full bg-white/5 hover:bg-white/10 text-gray-300 font-semibold py-3 rounded-xl transition-all border border-white/10">
                            회원가입
                        </AuthSubmitButton>
                    </div>

                    {params?.message && (
                        <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/50 text-blue-200 text-sm text-center animate-pulse">
                            {params.message}
                        </div>
                    )}
                    {params?.error && (
                        <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-sm text-center">
                            {params.error}
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}
