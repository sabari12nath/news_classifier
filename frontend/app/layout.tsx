import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "NEWSCLASSIFY - AI-Powered News Analysis Platform",
    description: "Advanced multimedia news categorization with AI. Upload PDFs, videos, audio files, and get intelligent summaries in 12+ languages.",
    keywords: ["NEWSCLASSIFY", "AI", "news analysis", "categorization", "NLP", "multimedia", "Gemini AI"],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    );
}
