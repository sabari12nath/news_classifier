'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, Loader2, BarChart3, Zap, Globe, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const }
    }),
};

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('http://127.0.0.1:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || 'Login failed');

            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userToken', data.access_token);
            localStorage.setItem('userEmail', data.user.email);
            localStorage.setItem('userName', data.user.name);
            router.push('/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex relative overflow-hidden dark">
            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center items-center p-12 bg-card">
                <div className="glow-orb glow-orb-1" />

                <motion.div className="relative z-10 max-w-sm"
                    initial="hidden" animate="visible" variants={fadeIn} custom={0}>
                    <div className="flex items-center gap-2.5 mb-8">
                        <div className="w-10 h-10 rounded-lg bg-[#4285F4] flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-semibold text-foreground tracking-tight">NewsClassify</span>
                    </div>

                    <h2 className="text-3xl font-bold text-foreground mb-3 leading-tight">
                        Analyze news with<br />
                        <span className="text-gradient">AI precision</span>
                    </h2>
                    <p className="text-sm text-muted-foreground mb-8">
                        Upload multimedia content and get instant AI-powered categorization with summaries in 12+ languages.
                    </p>

                    <div className="space-y-3">
                        {[
                            { icon: Zap, text: 'AI-powered categorization', color: 'text-[#4285F4]' },
                            { icon: Globe, text: '12+ language support', color: 'text-[#34A853]' },
                            { icon: Shield, text: 'Enterprise-grade security', color: 'text-[#FBBC04]' },
                        ].map((item, i) => (
                            <motion.div key={i} className="flex items-center gap-3"
                                initial="hidden" animate="visible" variants={fadeIn} custom={i + 2}>
                                <div className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center">
                                    <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                                </div>
                                <span className="text-sm text-muted-foreground">{item.text}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Right Panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-background">
                <motion.div className="max-w-sm w-full"
                    initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' as const }}>

                    <div className="lg:hidden text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-2">
                            <div className="w-9 h-9 rounded-lg bg-[#4285F4] flex items-center justify-center">
                                <BarChart3 className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-lg font-semibold text-foreground">NewsClassify</span>
                        </Link>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-foreground mb-1">Welcome back</h2>
                        <p className="text-sm text-muted-foreground">Sign in to continue to your dashboard</p>
                    </div>

                    <Card>
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error && (
                                    <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium mb-4">
                                        {error}
                                    </div>
                                )}
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-10 pr-3 py-2.5 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all text-foreground placeholder:text-muted-foreground/40"
                                            placeholder="you@example.com" required />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-10 pr-3 py-2.5 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all text-foreground placeholder:text-muted-foreground/40"
                                            placeholder="••••••••" required />
                                    </div>
                                </div>

                                <Button type="submit" disabled={loading} className="w-full bg-[#4285F4] hover:bg-[#669DF6] gap-2">
                                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : <><LogIn className="w-4 h-4" /> Sign In</>}
                                </Button>
                            </form>

                            <div className="mt-5 text-center">
                                <p className="text-xs text-muted-foreground">
                                    Don&apos;t have an account?{' '}
                                    <Link href="/signup" className="text-[#4285F4] hover:text-[#669DF6] font-medium transition-colors">Sign up</Link>
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mt-4 border-[#4285F4]/15 bg-[#4285F4]/5">
                        <CardContent className="p-3 text-center">
                            <p className="text-xs text-[#669DF6] font-medium">🎯 Demo — Enter any email and password</p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
