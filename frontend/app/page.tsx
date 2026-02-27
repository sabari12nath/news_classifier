'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import HeroScene from '@/components/HeroScene';
import {
    ArrowRight, Shield, Zap, Globe, Upload, Brain,
    BarChart3, Languages, ChevronRight, Github, Twitter, Linkedin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ScrollReveal from '@/components/ScrollReveal';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' as const }
    }),
};

export default function LandingPage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (localStorage.getItem('isLoggedIn') === 'true') router.push('/dashboard');
    }, [router]);

    return (
        <div className="min-h-screen bg-grid-pattern relative overflow-hidden dark">
            <div className="glow-orb glow-orb-1" />
            <div className="glow-orb glow-orb-2" />

            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#4285F4] flex items-center justify-center">
                            <BarChart3 className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-lg font-semibold text-foreground tracking-tight">NewsClassify</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/login">Sign In</Link>
                        </Button>
                        <Button size="sm" className="bg-[#4285F4] hover:bg-[#669DF6]" asChild>
                            <Link href="/signup">Get Started</Link>
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative z-10 pt-24 pb-10 px-4">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
                    {/* Left — Text */}
                    <div className="text-center lg:text-left">
                        <motion.div
                            initial="hidden" animate={mounted ? "visible" : "hidden"} variants={fadeUp} custom={0}
                        >
                            <Badge variant="outline" className="mb-5 border-[#4285F4]/30 bg-[#4285F4]/8 text-[#669DF6] text-xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#34A853] mr-2 inline-block" />
                                AI-Powered News Intelligence
                            </Badge>
                        </motion.div>

                        <motion.h1
                            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-5 tracking-tight leading-[1.1]"
                            initial="hidden" animate={mounted ? "visible" : "hidden"} variants={fadeUp} custom={1}
                        >
                            <span className="text-foreground">Classify news</span>
                            <br />
                            <span className="text-gradient">intelligently</span>
                        </motion.h1>

                        <motion.p
                            className="text-base md:text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed"
                            initial="hidden" animate={mounted ? "visible" : "hidden"} variants={fadeUp} custom={2}
                        >
                            Upload multimedia content — PDFs, videos, audio — and get instant AI categorization with summaries in 12+ languages.
                        </motion.p>

                        <motion.div
                            className="flex items-center justify-center lg:justify-start gap-3 flex-wrap"
                            initial="hidden" animate={mounted ? "visible" : "hidden"} variants={fadeUp} custom={3}
                        >
                            <Button size="lg" className="bg-[#4285F4] hover:bg-[#669DF6] gap-2 group" asChild>
                                <Link href="/signup">
                                    Start Analyzing
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            </Button>
                            <Button variant="outline" size="lg" className="gap-1.5" asChild>
                                <Link href="/login">
                                    Sign In <ChevronRight className="w-4 h-4" />
                                </Link>
                            </Button>
                        </motion.div>
                    </div>

                    {/* Right — 3D Scene */}
                    <motion.div
                        className="h-[350px] md:h-[450px] lg:h-[500px] relative"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={mounted ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 1, delay: 0.3, ease: "easeOut" as const }}
                    >
                        <HeroScene />
                    </motion.div>
                </div>
            </section>

            {/* Stats */}
            <ScrollReveal className="relative z-10 py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <Card className="bg-card/50 border-border">
                        <CardContent className="p-0">
                            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
                                {[
                                    { value: '100K+', label: 'Articles', color: 'text-[#4285F4]' },
                                    { value: '12+', label: 'Languages', color: 'text-[#34A853]' },
                                    { value: '8', label: 'Categories', color: 'text-[#FBBC04]' },
                                    { value: '99.2%', label: 'Accuracy', color: 'text-[#669DF6]' },
                                ].map((stat, i) => (
                                    <div key={i} className="text-center py-5 px-3">
                                        <p className={`text-2xl md:text-3xl font-bold ${stat.color} mb-0.5`}>{stat.value}</p>
                                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </ScrollReveal>

            {/* Features */}
            <section className="relative z-10 py-16 px-4">
                <ScrollReveal className="text-center mb-12">
                    <p className="text-xs font-semibold text-[#34A853] uppercase tracking-widest mb-2">Features</p>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground">Powerful Capabilities</h2>
                </ScrollReveal>

                <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-5">
                    {[
                        { icon: Zap, title: 'AI-Powered Analysis', desc: 'Google Gemini AI categorizes news into 8 categories with state-of-the-art accuracy.', color: 'bg-[#4285F4]' },
                        { icon: Globe, title: 'Multilingual Support', desc: 'Get summaries in 12+ languages including English, Hindi, Spanish, and more.', color: 'bg-[#34A853]' },
                        { icon: Shield, title: 'Secure & Private', desc: 'Your data is encrypted end-to-end. Full GDPR compliance guaranteed.', color: 'bg-[#FBBC04]' },
                    ].map((feature, i) => (
                        <ScrollReveal key={i} delay={i * 0.15}>
                            <Card className="bg-card/50 hover:bg-card border-border hover:border-[#4285F4]/20 transition-all duration-300 hover:-translate-y-1 group h-full">
                                <CardContent className="p-6">
                                    <div className={`w-10 h-10 rounded-lg ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <feature.icon className={`w-5 h-5 ${feature.color === 'bg-[#FBBC04]' ? 'text-black' : 'text-white'}`} />
                                    </div>
                                    <h3 className="text-base font-semibold mb-2 text-foreground">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                                </CardContent>
                            </Card>
                        </ScrollReveal>
                    ))}
                </div>
            </section>

            {/* How It Works */}
            <section className="relative z-10 py-16 px-4">
                <ScrollReveal className="text-center mb-12">
                    <p className="text-xs font-semibold text-[#4285F4] uppercase tracking-widest mb-2">Workflow</p>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground">How It Works</h2>
                </ScrollReveal>

                <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 relative">
                    <div className="hidden md:block absolute top-8 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                    {[
                        { step: '1', icon: Upload, title: 'Upload Content', desc: 'Drag & drop PDFs, videos, or audio files.', color: 'bg-[#4285F4]' },
                        { step: '2', icon: Brain, title: 'AI Processes', desc: 'Gemini AI extracts and categorizes content.', color: 'bg-[#34A853]' },
                        { step: '3', icon: BarChart3, title: 'Get Results', desc: 'Receive summaries in your chosen language.', color: 'bg-[#FBBC04]' },
                    ].map((item, i) => (
                        <ScrollReveal key={i} delay={i * 0.2} direction="up">
                            <div className="text-center relative z-10">
                                <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center mx-auto mb-4 shadow-lg group`}>
                                    <item.icon className={`w-7 h-7 ${item.color === 'bg-[#FBBC04]' ? 'text-black' : 'text-white'}`} />
                                </div>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1 block">Step {item.step}</span>
                                <h3 className="text-base font-semibold mb-2 text-foreground">{item.title}</h3>
                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <ScrollReveal className="relative z-10 py-16 px-4">
                <div className="max-w-3xl mx-auto">
                    <Card className="bg-card/50 border-[#4285F4]/15 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#4285F4]/[0.04] to-transparent pointer-events-none" />
                        <CardContent className="p-10 md:p-14 text-center relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-[#4285F4] flex items-center justify-center mx-auto mb-5">
                                <Languages className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">Ready to get started?</h2>
                            <p className="text-base text-muted-foreground mb-7 max-w-md mx-auto">
                                Join thousands analyzing news intelligently with NewsClassify.
                            </p>
                            <Button size="lg" className="bg-[#4285F4] hover:bg-[#669DF6] gap-2 group" asChild>
                                <Link href="/signup">
                                    Create Free Account
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </ScrollReveal>

            {/* Footer */}
            <footer className="relative z-10 border-t border-border pt-12 pb-6 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-7 h-7 rounded-md bg-[#4285F4] flex items-center justify-center">
                                    <BarChart3 className="w-3.5 h-3.5 text-white" />
                                </div>
                                <span className="font-semibold text-foreground text-sm">NewsClassify</span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">AI-powered news analysis for intelligent categorization.</p>
                        </div>
                        {[
                            { title: 'Product', items: ['Features', 'Pricing', 'API'] },
                            { title: 'Resources', items: ['Docs', 'Blog', 'Support'] },
                            { title: 'Company', items: ['About', 'Privacy', 'Terms'] },
                        ].map((col) => (
                            <div key={col.title}>
                                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{col.title}</h4>
                                <ul className="space-y-2">
                                    {col.items.map(item => (
                                        <li key={item}><span className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors cursor-pointer">{item}</span></li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <Separator />
                    <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
                        <p className="text-xs text-muted-foreground/50">&copy; 2026 NewsClassify</p>
                        <div className="flex items-center gap-2">
                            {[Github, Twitter, Linkedin].map((Icon, i) => (
                                <Button key={i} variant="ghost" size="icon" className="w-8 h-8">
                                    <Icon className="w-3.5 h-3.5" />
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
