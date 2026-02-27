'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { CloudUpload, FileText, Video, Music, File } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FileUploaderProps {
    onFilesSelected: (files: File[]) => void;
}

export default function FileUploader({ onFilesSelected }: FileUploaderProps) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) onFilesSelected(acceptedFiles);
    }, [onFilesSelected]);

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'video/*': ['.mp4', '.avi', '.mov', '.mkv', '.webm'],
            'audio/*': ['.mp3', '.wav', '.m4a', '.aac', '.ogg'],
            'text/*': ['.txt']
        },
        multiple: true
    });

    return (
        <Card
            {...getRootProps()}
            className={`cursor-pointer transition-all duration-300 group ${isDragActive ? 'border-[#4285F4] scale-[1.01] bg-[#4285F4]/5' : 'hover:border-[#4285F4]/30'}`}
            style={{ borderStyle: 'dashed', borderWidth: '2px' }}
        >
            <CardContent className="p-10 text-center">
                <input {...getInputProps()} />

                <motion.div
                    className="flex justify-center mb-4"
                    animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <div className="w-14 h-14 rounded-xl bg-[#4285F4] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <CloudUpload className="w-7 h-7 text-white" />
                    </div>
                </motion.div>

                <h3 className="text-lg font-semibold mb-1 text-foreground">
                    {isDragActive ? 'Drop files here' : 'Upload Multimedia Files'}
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                    {isDragReject ? 'Some files are not supported' : 'Drag & drop files here, or click to browse'}
                </p>

                <div className="flex flex-wrap justify-center gap-2">
                    {[
                        { icon: FileText, label: 'PDF', color: 'text-[#4285F4]' },
                        { icon: Video, label: 'Video', color: 'text-[#34A853]' },
                        { icon: Music, label: 'Audio', color: 'text-[#FBBC04]' },
                        { icon: File, label: 'Text', color: 'text-[#669DF6]' },
                    ].map((t, i) => (
                        <Badge key={i} variant="outline" className="gap-1.5 py-1.5">
                            <t.icon className={`w-3 h-3 ${t.color}`} />
                            {t.label}
                        </Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
