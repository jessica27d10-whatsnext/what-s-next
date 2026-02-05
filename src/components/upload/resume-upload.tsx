"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, CheckCircle } from "lucide-react";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ResumeUploadProps {
    onFileSelect: (file: File) => void;
}

export function ResumeUpload({ onFileSelect }: ResumeUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                const selectedFile = e.dataTransfer.files[0];
                setFile(selectedFile);
                onFileSelect(selectedFile);
            }
        },
        [onFileSelect]
    );

    const handleFileInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files[0]) {
                const selectedFile = e.target.files[0];
                setFile(selectedFile);
                onFileSelect(selectedFile);
            }
        },
        [onFileSelect]
    );

    return (
        <Card className="w-full max-w-2xl bg-white/5 border-white/10">
            <CardContent className="p-8">
                <label
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={cn(
                        "relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300",
                        isDragging
                            ? "border-primary bg-primary/10"
                            : "border-white/20 hover:border-primary/50 hover:bg-white/5",
                        file ? "border-green-500/50 bg-green-500/5" : ""
                    )}
                >
                    <input type="file" className="hidden" onChange={handleFileInput} accept=".pdf,.doc,.docx" />

                    <AnimatePresence mode="wait">
                        {file ? (
                            <motion.div
                                key="file-selected"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex flex-col items-center text-center p-4"
                            >
                                <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4 text-green-500">
                                    <CheckCircle className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-semibold text-white">{file.name}</h3>
                                <p className="text-sm text-green-400 mt-2">Ready to analyze</p>
                                <p className="text-xs text-muted-foreground mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="upload-prompt"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex flex-col items-center text-center p-4"
                            >
                                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 text-primary">
                                    <Upload className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">
                                    Upload your resume
                                </h3>
                                <p className="text-sm text-muted-foreground max-w-sm">
                                    Drag and drop your PDF or DOCX file here, or click to browse.
                                </p>
                                <p className="text-xs text-primary/70 mt-4 font-mono uppercase tracking-wider">
                                    AI-Powered Parsing
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </label>
            </CardContent>
        </Card>
    );
}
