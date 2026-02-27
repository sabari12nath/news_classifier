'use client';

import { useEffect, useState } from 'react';

export default function HeroScene() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    return (
        <div className="w-full h-full flex items-center justify-center" style={{ perspective: '1000px' }}>
            <div
                className={`relative transition-all duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}
                style={{
                    width: '320px',
                    height: '320px',
                    transformStyle: 'preserve-3d',
                    animation: 'heroRotate 20s linear infinite',
                }}
            >
                {/* Core sphere */}
                <div
                    className="absolute inset-[60px] rounded-full"
                    style={{
                        background: 'radial-gradient(circle at 35% 35%, #669DF6, #4285F4 50%, #1a5cd8 100%)',
                        boxShadow: '0 0 60px rgba(66, 133, 244, 0.3), inset -20px -20px 40px rgba(0,0,0,0.3), inset 10px 10px 30px rgba(255,255,255,0.1)',
                        animation: 'heroPulse 4s ease-in-out infinite',
                    }}
                />

                {/* Orbit ring 1 */}
                <div
                    className="absolute inset-0"
                    style={{
                        border: '1px solid rgba(66, 133, 244, 0.2)',
                        borderRadius: '50%',
                        transform: 'rotateX(70deg) rotateZ(0deg)',
                        animation: 'orbitSpin 8s linear infinite',
                    }}
                >
                    <div
                        className="absolute w-3 h-3 rounded-full"
                        style={{
                            background: '#34A853',
                            boxShadow: '0 0 12px rgba(52, 168, 83, 0.6)',
                            top: '0%', left: '50%',
                            transform: 'translate(-50%, -50%)',
                        }}
                    />
                </div>

                {/* Orbit ring 2 */}
                <div
                    className="absolute inset-[-20px]"
                    style={{
                        border: '1px solid rgba(102, 157, 246, 0.15)',
                        borderRadius: '50%',
                        transform: 'rotateX(60deg) rotateY(30deg)',
                        animation: 'orbitSpin 12s linear infinite reverse',
                    }}
                >
                    <div
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                            background: '#FBBC04',
                            boxShadow: '0 0 10px rgba(251, 188, 4, 0.6)',
                            top: '0%', left: '50%',
                            transform: 'translate(-50%, -50%)',
                        }}
                    />
                </div>

                {/* Orbit ring 3 */}
                <div
                    className="absolute inset-[-45px]"
                    style={{
                        border: '1px solid rgba(66, 133, 244, 0.1)',
                        borderRadius: '50%',
                        transform: 'rotateX(75deg) rotateY(-20deg)',
                        animation: 'orbitSpin 16s linear infinite',
                    }}
                >
                    <div
                        className="absolute w-2.5 h-2.5 rounded-full"
                        style={{
                            background: '#EA4335',
                            boxShadow: '0 0 10px rgba(234, 67, 53, 0.5)',
                            bottom: '0%', left: '50%',
                            transform: 'translate(-50%, 50%)',
                        }}
                    />
                </div>

                {/* Floating particles */}
                {[...Array(12)].map((_, i) => {
                    const angle = (i / 12) * Math.PI * 2;
                    const radius = 140 + (i % 3) * 25;
                    const x = Math.cos(angle) * radius + 160;
                    const y = Math.sin(angle) * radius + 160;
                    const size = 2 + (i % 3);
                    const delay = i * 0.3;
                    return (
                        <div
                            key={i}
                            className="absolute rounded-full"
                            style={{
                                width: `${size}px`,
                                height: `${size}px`,
                                left: `${x}px`,
                                top: `${y}px`,
                                background: 'rgba(102, 157, 246, 0.4)',
                                animation: `particleFloat 3s ease-in-out ${delay}s infinite`,
                            }}
                        />
                    );
                })}
            </div>

            <style>{`
                @keyframes heroRotate {
                    from { transform: rotateY(0deg) rotateX(5deg); }
                    to { transform: rotateY(360deg) rotateX(5deg); }
                }
                @keyframes heroPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.03); }
                }
                @keyframes orbitSpin {
                    from { transform: rotateX(70deg) rotateZ(0deg); }
                    to { transform: rotateX(70deg) rotateZ(360deg); }
                }
                @keyframes particleFloat {
                    0%, 100% { opacity: 0.3; transform: translateY(0px); }
                    50% { opacity: 0.8; transform: translateY(-8px); }
                }
            `}</style>
        </div>
    );
}
