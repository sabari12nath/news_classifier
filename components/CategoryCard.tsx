'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Newspaper, TrendingUp, Briefcase, Cpu, Film, Heart, Microscope, Globe2,
    ChevronDown, ChevronUp, LucideIcon
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Article { title?: string; summary?: string; confidence?: number; }
interface CategoryData { summary: string; articles: string[] | Article[]; confidence?: number; }
interface CategoryCardProps { category: string; data: CategoryData; }

const cfg: Record<string, { icon: LucideIcon; color: string; text: string; bar: string }> = {
    Politics: { icon: Newspaper, color: 'bg-red-500', text: 'text-red-400', bar: 'bg-red-500' },
    Sports: { icon: TrendingUp, color: 'bg-emerald-500', text: 'text-emerald-400', bar: 'bg-emerald-500' },
    Business: { icon: Briefcase, color: 'bg-amber-500', text: 'text-amber-400', bar: 'bg-amber-500' },
    Technology: { icon: Cpu, color: 'bg-blue-500', text: 'text-blue-400', bar: 'bg-blue-500' },
    Entertainment: { icon: Film, color: 'bg-pink-500', text: 'text-pink-400', bar: 'bg-pink-500' },
    Health: { icon: Heart, color: 'bg-teal-500', text: 'text-teal-400', bar: 'bg-teal-500' },
    Science: { icon: Microscope, color: 'bg-purple-500', text: 'text-purple-400', bar: 'bg-purple-500' },
    'World News': { icon: Globe2, color: 'bg-sky-500', text: 'text-sky-400', bar: 'bg-sky-500' },
    World: { icon: Globe2, color: 'bg-sky-500', text: 'text-sky-400', bar: 'bg-sky-500' },
};
const def = { icon: Newspaper, color: 'bg-[#4285F4]', text: 'text-[#4285F4]', bar: 'bg-[#4285F4]' };

export default function CategoryCard({ category, data }: CategoryCardProps) {
    const [open, setOpen] = useState(false);
    const c = cfg[category] || def;
    const Icon = c.icon;
    const articles = Array.isArray(data.articles) ? data.articles : [];

    return (
        <Card className="overflow-hidden hover:-translate-y-0.5 transition-all duration-300 h-full">
            <div className={`h-0.5 ${c.color}`} />
            <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-lg ${c.color} flex items-center justify-center`}>
                            <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-foreground">{category}</h3>
                            <Badge variant="secondary" className="text-[10px] mt-0.5">{articles.length} articles</Badge>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => setOpen(!open)}>
                        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                </div>

                {data.summary && (
                    <div className="p-3 rounded-md bg-secondary mb-3 border-l-2" style={{ borderColor: `var(--${c.color.replace('bg-', '')}, rgba(66,133,244,0.5))` }}>
                        <p className="text-xs leading-relaxed text-muted-foreground">{data.summary}</p>
                    </div>
                )}

                <AnimatePresence>
                    {open && articles.length > 0 && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <div className="space-y-2 mt-3">
                                <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Articles</h4>
                                {articles.map((article, i) => (
                                    <motion.div key={i} className="p-3 rounded-md bg-secondary border border-border"
                                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}>
                                        {typeof article === 'string' ? (
                                            <p className="text-xs text-muted-foreground leading-relaxed">{article}</p>
                                        ) : (
                                            <>
                                                {article.title && <h5 className="text-xs font-medium mb-1 text-foreground">{article.title}</h5>}
                                                {article.summary && <p className="text-xs text-muted-foreground leading-relaxed">{article.summary}</p>}
                                                {article.confidence && (
                                                    <div className="mt-2 flex items-center gap-2">
                                                        <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                                                            <motion.div className={`h-full rounded-full ${c.bar}`}
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${Math.round(article.confidence * 100)}%` }}
                                                                transition={{ duration: 0.8, delay: 0.2 }} />
                                                        </div>
                                                        <span className={`text-[10px] font-medium ${c.text}`}>{Math.round(article.confidence * 100)}%</span>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
}
