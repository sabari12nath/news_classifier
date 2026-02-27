'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, X, CheckCircle2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ReviewFormProps {
    onClose: () => void;
    onSuccess?: () => void;
}

export function ReviewForm({ onClose, onSuccess }: ReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            setErrorMsg('Please select a rating');
            return;
        }

        setStatus('loading');
        try {
            const token = localStorage.getItem('userToken');
            const res = await fetch('http://127.0.0.1:5000/api/reviews/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ rating, comment }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || 'Failed to submit review');
            }

            setStatus('success');
            setTimeout(() => {
                if (onSuccess) onSuccess();
                onClose();
            }, 2000);
        } catch (err) {
            setStatus('error');
            setErrorMsg(err instanceof Error ? err.message : 'An error occurred');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            >
                <Card className="w-full max-w-md relative overflow-hidden border-primary/20 bg-card shadow-2xl">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 p-1 rounded-full hover:bg-secondary transition-colors"
                    >
                        <X className="w-4 h-4 text-muted-foreground" />
                    </button>

                    <CardContent className="p-8">
                        {status === 'success' ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center py-6 text-center"
                            >
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                    <CheckCircle2 className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Thank you!</h3>
                                <p className="text-muted-foreground">Your feedback helps us improve our AI models.</p>
                            </motion.div>
                        ) : (
                            <>
                                <div className="text-center mb-8">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                        <MessageSquare className="w-6 h-6 text-primary" />
                                    </div>
                                    <h2 className="text-2xl font-bold">Rate Experience</h2>
                                    <p className="text-sm text-muted-foreground mt-1">How accurate was the AI classification?</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="flex justify-center gap-2">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => setRating(s)}
                                                onMouseEnter={() => setHover(s)}
                                                onMouseLeave={() => setHover(0)}
                                                className="focus:outline-none transition-transform active:scale-95"
                                            >
                                                <Star
                                                    className={`w-10 h-10 transition-colors ${(hover || rating) >= s
                                                            ? 'fill-primary text-primary'
                                                            : 'text-muted-foreground/30'
                                                        }`}
                                                />
                                            </button>
                                        ))}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            Optional Comment
                                        </label>
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="What could we improve?"
                                            className="w-full min-h-[100px] p-3 rounded-lg bg-secondary/50 border border-border focus:ring-2 focus:ring-primary/20 outline-none resize-none text-sm transition-all"
                                        />
                                    </div>

                                    {status === 'error' && (
                                        <p className="text-xs text-destructive text-center font-medium animate-pulse">
                                            {errorMsg}
                                        </p>
                                    )}

                                    <Button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="w-full h-12 text-sm font-semibold gap-2 shadow-lg shadow-primary/10"
                                    >
                                        {status === 'loading' ? (
                                            'Submitting...'
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                Submit Feedback
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </AnimatePresence>
    );
}
