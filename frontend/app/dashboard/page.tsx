'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Upload, Loader2, LogOut, User, Menu, X, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import FileUploader from '@/components/FileUploader';
import CategoryCard from '@/components/CategoryCard';
import LanguageSelector from '@/components/LanguageSelector';
import ScrollReveal from '@/components/ScrollReveal';
import { ReviewForm } from '@/components/ReviewForm';

interface CategoryData {
    summary: string;
    articles: string[] | Array<{ title?: string; summary?: string; confidence?: number }>;
    confidence?: number;
}

interface AnalysisResult {
    categories: Record<string, CategoryData>;
    metadata: { filesProcessed: number; totalArticles: number; processingTime: string; language: string; };
}

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<{ name: string; email: string } | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [processing, setProcessing] = useState(false);
    const [results, setResults] = useState<AnalysisResult | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [error, setError] = useState<string | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [showReview, setShowReview] = useState(false);
    const [hasReviewed, setHasReviewed] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (localStorage.getItem('isLoggedIn') !== 'true') { router.push('/login'); return; }
        setUser({ name: localStorage.getItem('userName') || 'User', email: localStorage.getItem('userEmail') || 'user@example.com' });
    }, [router]);

    const handleLogout = () => { localStorage.removeItem('isLoggedIn'); localStorage.removeItem('userName'); localStorage.removeItem('userEmail'); router.push('/'); };

    const handleFilesSelected = async (selectedFiles: File[]) => {
        setFiles(selectedFiles); setError(null); setProcessing(true); setResults(null);
        try {
            const token = localStorage.getItem('userToken');
            const form = new FormData();
            selectedFiles.forEach(f => form.append('files', f));
            form.append('language', selectedLanguage);
            if (token) form.append('token', token);

            const res = await fetch('http://127.0.0.1:5000/api/analyze', {
                method: 'POST',
                body: form
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || 'Failed to process files');
            setResults(data);

            // Show review prompt after a short delay if not reviewed yet
            if (!hasReviewed) {
                setTimeout(() => setShowReview(true), 1500);
            }

            // Optionally refresh history here if you add a history list
        } catch (err) { setError(err instanceof Error ? err.message : 'An error occurred'); }
        finally { setProcessing(false); }
    };

    if (!mounted || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background dark">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#4285F4] flex items-center justify-center"><BarChart3 className="w-6 h-6 text-white" /></div>
                    <Loader2 className="w-6 h-6 animate-spin text-[#4285F4]" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background dark relative overflow-hidden">
            <div className="glow-orb glow-orb-1" />

            <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#4285F4] flex items-center justify-center"><BarChart3 className="w-4 h-4 text-white" /></div>
                        <span className="text-lg font-semibold text-foreground tracking-tight hidden sm:block">NewsClassify</span>
                    </div>
                    <div className="hidden md:flex items-center gap-2">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary">
                            <div className="w-6 h-6 rounded-md bg-[#4285F4]/20 flex items-center justify-center"><User className="w-3 h-3 text-[#4285F4]" /></div>
                            <div><p className="text-xs font-medium text-foreground">{user.name}</p><p className="text-[10px] text-muted-foreground">{user.email}</p></div>
                        </div>
                        <Button variant="destructive" size="sm" onClick={handleLogout} className="gap-1.5"><LogOut className="w-3.5 h-3.5" /> Logout</Button>
                    </div>
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </Button>
                </div>
                {menuOpen && (
                    <motion.div className="md:hidden px-4 py-3 border-t border-border" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-secondary">
                                <User className="w-4 h-4 text-[#4285F4]" /><div><p className="text-xs font-medium">{user.name}</p><p className="text-[10px] text-muted-foreground">{user.email}</p></div>
                            </div>
                            <Button variant="destructive" size="sm" onClick={handleLogout} className="gap-1.5"><LogOut className="w-3.5 h-3.5" /> Logout</Button>
                        </div>
                    </motion.div>
                )}
            </nav>

            <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <ScrollReveal className="text-center mb-10">
                    <Badge variant="outline" className="mb-4 border-[#4285F4]/30 bg-[#4285F4]/8 text-[#669DF6] text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#34A853] mr-2 inline-block" /> AI-Powered Analysis
                    </Badge>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-gradient">Analyze Your News</h1>
                    <p className="text-sm text-muted-foreground max-w-lg mx-auto">Upload multimedia content for AI categorization with multilingual summaries</p>
                </ScrollReveal>

                <ScrollReveal className="mb-6 flex justify-center" delay={0.1}>
                    <LanguageSelector selectedLanguage={selectedLanguage} onLanguageChange={setSelectedLanguage} />
                </ScrollReveal>

                <ScrollReveal className="mb-6" delay={0.2}>
                    <FileUploader onFilesSelected={handleFilesSelected} />
                </ScrollReveal>

                {files.length > 0 && !processing && !results && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <Card className="mb-6">
                            <CardHeader className="pb-3"><CardTitle className="text-base">Selected Files ({files.length})</CardTitle></CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {files.map((file, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 rounded-md bg-secondary border border-border">
                                            <div className="w-8 h-8 rounded-md bg-[#4285F4]/10 flex items-center justify-center"><Upload className="w-4 h-4 text-[#4285F4]" /></div>
                                            <div className="min-w-0 flex-1"><p className="text-sm font-medium text-foreground truncate">{file.name}</p><p className="text-[10px] text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p></div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {processing && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Card className="text-center py-12">
                            <CardContent>
                                <div className="flex justify-center mb-6">
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-2xl bg-[#4285F4] flex items-center justify-center">
                                            <BarChart3 className="w-8 h-8 text-white animate-pulse" />
                                        </div>
                                        <div className="pulse-ring absolute inset-0 rounded-2xl" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-foreground">Processing Content</h3>
                                <p className="text-sm text-muted-foreground">Analyzing, categorizing, and generating summaries...</p>
                                <div className="mt-4 flex justify-center gap-1">
                                    {[0, 1, 2].map(i => (<div key={i} className="w-1.5 h-1.5 rounded-full bg-[#4285F4] animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {error && (
                    <Card className="border-destructive/20"><CardContent className="p-5">
                        <h3 className="text-base font-semibold text-destructive mb-1">Error</h3>
                        <p className="text-sm text-muted-foreground">{error}</p>
                    </CardContent></Card>
                )}

                {results && (
                    <motion.div className="space-y-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <Card className="border-[#4285F4]/12">
                            <CardContent className="p-6 flex items-center justify-between flex-wrap gap-3">
                                <div>
                                    <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
                                        <div className="w-9 h-9 rounded-lg bg-[#34A853] flex items-center justify-center"><BarChart3 className="w-4 h-4 text-white" /></div>
                                        <span className="text-foreground">Analysis Complete</span>
                                    </h2>
                                    <p className="text-sm text-muted-foreground">Categorized and summarized by AI</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-[#4285F4] text-white text-lg px-4 py-1">{Object.keys(results.categories || {}).length} Categories</Badge>
                                    <Button variant="outline" size="sm" onClick={() => { setResults(null); setFiles([]); }}>New Analysis</Button>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {results.categories && Object.entries(results.categories).map(([cat, data], i) => (
                                <ScrollReveal key={cat} delay={i * 0.1}>
                                    <CategoryCard category={cat} data={data} />
                                </ScrollReveal>
                            ))}
                        </div>

                        {results.metadata && (
                            <ScrollReveal>
                                <Card>
                                    <CardHeader className="pb-3"><CardTitle className="text-base">Processing Statistics</CardTitle></CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {[
                                                { label: 'Files', value: results.metadata.filesProcessed, color: 'text-[#4285F4]', bar: 'bg-[#4285F4]' },
                                                { label: 'Articles', value: results.metadata.totalArticles, color: 'text-[#34A853]', bar: 'bg-[#34A853]' },
                                                { label: 'Time', value: `${results.metadata.processingTime}s`, color: 'text-[#FBBC04]', bar: 'bg-[#FBBC04]' },
                                                { label: 'Language', value: results.metadata.language.toUpperCase(), color: 'text-[#669DF6]', bar: 'bg-[#669DF6]' },
                                            ].map((s, i) => (
                                                <div key={i} className="text-center p-4 rounded-md bg-secondary border border-border">
                                                    <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">{s.label}</p>
                                                    <p className={`text-2xl font-bold ${s.color} mb-1.5`}>{s.value}</p>
                                                    <div className={`w-8 h-0.5 ${s.bar} rounded-full mx-auto`} />
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </ScrollReveal>
                        )}
                    </motion.div>
                )}
            </main>

            {showReview && (
                <ReviewForm
                    onClose={() => setShowReview(false)}
                    onSuccess={() => setHasReviewed(true)}
                />
            )}
        </div>
    );
}
