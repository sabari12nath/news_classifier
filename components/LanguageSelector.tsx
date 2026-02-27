'use client';

import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Language { code: string; name: string; flag: string; }
interface LanguageSelectorProps { selectedLanguage: string; onLanguageChange: (code: string) => void; }

const languages: Language[] = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' }
];

export default function LanguageSelector({ selectedLanguage, onLanguageChange }: LanguageSelectorProps) {
    return (
        <Card className="w-full max-w-3xl">
            <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-md bg-[#34A853] flex items-center justify-center">
                        <Globe className="w-3.5 h-3.5 text-white" />
                    </div>
                    <label className="text-sm font-semibold text-foreground">Output Language</label>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {languages.map((lang) => (
                        <motion.button
                            key={lang.code}
                            onClick={() => onLanguageChange(lang.code)}
                            className={`flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-md text-xs font-medium transition-colors
                                ${selectedLanguage === lang.code
                                    ? 'bg-[#4285F4] text-white shadow-md shadow-[#4285F4]/20'
                                    : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 border border-border'
                                }`}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <span className="text-base">{lang.flag}</span>
                            <span>{lang.name}</span>
                        </motion.button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
