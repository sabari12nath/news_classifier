'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Loader2, BarChart3, Zap, Globe, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const } }),
};

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const getStrength = () => {
        const len = formData.password.length;
        if (!len) return { label: '', width: '0%', color: '' };
        if (len < 4) return { label: 'Weak', width: '25%', color: 'bg-destructive' };
        if (len < 6) return { label: 'Fair', width: '50%', color: 'bg-[#FBBC04]' };
        if (len < 8) return { label: 'Good', width: '75%', color: 'bg-[#4285F4]' };
        return { label: 'Strong', width: '100%', color: 'bg-[#34A853]' };
    };

    const strength = getStrength();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); setError('');
        if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); setLoading(false); return; }
        if (formData.password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); return; }

        try {
            const res = await fetch('http://127.0.0.1:5000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || 'Signup failed');

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

    const inputCls = "w-full pl-10 pr-3 py-2.5 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all text-foreground placeholder:text-muted-foreground/40";

    return (
        <div className="min-h-screen flex relative overflow-hidden dark">
            <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center items-center p-12 bg-card">
                <div className="glow-orb glow-orb-1" />
                <motion.div className="relative z-10 max-w-sm" initial="hidden" animate="visible" variants={fadeIn} custom={0}>
                    <div className="flex items-center gap-2.5 mb-8">
                        <div className="w-10 h-10 rounded-lg bg-[#4285F4] flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-semibold text-foreground tracking-tight">NewsClassify</span>
                    </div>
                    <h2 className="text-3xl font-bold text-foreground mb-3 leading-tight">
                        Join the future of<br /><span className="text-gradient">news analysis</span>
                    </h2>
                    <p className="text-sm text-muted-foreground mb-8">Create your free account and start analyzing multimedia news content with cutting-edge AI.</p>
                    <div className="space-y-3">
                        {[
                            { icon: Zap, text: 'Instant AI categorization', color: 'text-[#4285F4]' },
                            { icon: Globe, text: 'Multilingual summaries', color: 'text-[#34A853]' },
                            { icon: Shield, text: 'Your data stays private', color: 'text-[#FBBC04]' },
                        ].map((item, i) => (
                            <motion.div key={i} className="flex items-center gap-3" initial="hidden" animate="visible" variants={fadeIn} custom={i + 2}>
                                <div className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center">
                                    <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                                </div>
                                <span className="text-sm text-muted-foreground">{item.text}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-background">
                <motion.div className="max-w-sm w-full" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                    <div className="lg:hidden text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-2">
                            <div className="w-9 h-9 rounded-lg bg-[#4285F4] flex items-center justify-center"><BarChart3 className="w-4 h-4 text-white" /></div>
                            <span className="text-lg font-semibold text-foreground">NewsClassify</span>
                        </Link>
                    </div>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-foreground mb-1">Create account</h2>
                        <p className="text-sm text-muted-foreground">Get started with your free account</p>
                    </div>
                    <Card>
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-3.5">
                                {error && <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-xs font-medium">{error}</div>}
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Full Name</label>
                                    <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" /><input type="text" name="name" value={formData.name} onChange={handleChange} className={inputCls} placeholder="John Doe" required /></div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email</label>
                                    <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" /><input type="email" name="email" value={formData.email} onChange={handleChange} className={inputCls} placeholder="you@example.com" required /></div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Password</label>
                                    <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" /><input type="password" name="password" value={formData.password} onChange={handleChange} className={inputCls} placeholder="••••••••" required minLength={6} /></div>
                                    {formData.password.length > 0 && (
                                        <div className="mt-1.5">
                                            <div className="flex justify-between mb-1"><span className="text-[10px] text-muted-foreground/60">Strength</span><span className="text-[10px] font-medium text-muted-foreground">{strength.label}</span></div>
                                            <div className="w-full h-1 bg-secondary rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all duration-500 ${strength.color}`} style={{ width: strength.width }} /></div>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Confirm Password</label>
                                    <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" /><input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={inputCls} placeholder="••••••••" required minLength={6} /></div>
                                </div>
                                <Button type="submit" disabled={loading} className="w-full bg-[#4285F4] hover:bg-[#669DF6] gap-2 mt-1">
                                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : <><UserPlus className="w-4 h-4" /> Create Account</>}
                                </Button>
                            </form>
                            <div className="mt-5 text-center"><p className="text-xs text-muted-foreground">Already have an account? <Link href="/login" className="text-[#4285F4] hover:text-[#669DF6] font-medium transition-colors">Sign in</Link></p></div>
                        </CardContent>
                    </Card>
                    <Card className="mt-4 border-[#4285F4]/15 bg-[#4285F4]/5">
                        <CardContent className="p-3 text-center"><p className="text-xs text-[#669DF6] font-medium">🎯 Demo — Enter any details to create an account</p></CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
