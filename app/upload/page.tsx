"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ResumeUpload } from "@/components/upload/resume-upload";
import { ManualForm } from "@/components/upload/manual-form";
import { AnalysisView } from "@/components/upload/analysis-view";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

import { extractTextFromPDF } from "@/lib/parser";

function UploadContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialMode = searchParams.get("mode") === "manual" ? "manual" : "upload";

    const [mode, setMode] = useState<"upload" | "manual">(initialMode);
    const [status, setStatus] = useState<"input" | "analyzing">("input");
    const [analysisResult, setAnalysisResult] = useState<any>(null);

    const handleStartAnalysis = async (data: any) => {
        setStatus("analyzing");

        try {
            let payload: any = { type: "manual", data };

            if (data instanceof File) {
                // Extract actual text from PDF
                const extractedText = await extractTextFromPDF(data);
                payload = {
                    type: "resume",
                    data: { text: extractedText }
                };
            }

            const response = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 429) {
                    alert(`Rate limit reached: ${errorData.details || 'Please try again in a few minutes.'}`);
                } else {
                    throw new Error("Analysis failed");
                }
                setStatus("input");
                return;
            }

            const result = await response.json();
            setAnalysisResult(result);

        } catch (error) {
            console.error("Error:", error);
            setStatus("input");
            alert("Something went wrong. Please try again later.");
        }
    };

    const handleAnalysisComplete = () => {
        if (analysisResult) {
            localStorage.setItem("careerAnalysis", JSON.stringify(analysisResult));
            router.push("/results");
        } else {
            setStatus("input");
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-black p-6">

            {/* Background blobs */}
            <div className="absolute top-0 left-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
            <div className="absolute bottom-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[120px]" />

            <AnimatePresence mode="wait">
                {status === "input" ? (
                    <motion.div
                        key="input-view"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-2xl"
                    >
                        <div className="mb-8 text-center">
                            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                Let's Build Your Career Profile
                            </h1>
                            <p className="mt-4 text-muted-foreground">
                                Upload your resume or enter your details manually to get started.
                            </p>
                        </div>

                        {/* Tabs */}
                        <div className="mb-8 flex justify-center">
                            <div className="flex bg-white/5 p-1 rounded-full border border-white/10">
                                <button
                                    onClick={() => setMode("upload")}
                                    className={cn(
                                        "px-6 py-2 text-sm font-medium rounded-full transition-all",
                                        mode === "upload"
                                            ? "bg-primary text-white"
                                            : "text-muted-foreground hover:text-white"
                                    )}
                                >
                                    Upload Resume
                                </button>
                                <button
                                    onClick={() => setMode("manual")}
                                    className={cn(
                                        "px-6 py-2 text-sm font-medium rounded-full transition-all",
                                        mode === "manual"
                                            ? "bg-primary text-white"
                                            : "text-muted-foreground hover:text-white"
                                    )}
                                >
                                    Manual Entry
                                </button>
                            </div>
                        </div>

                        <div className="mt-8">
                            {mode === "upload" ? (
                                <ResumeUpload onFileSelect={handleStartAnalysis} />
                            ) : (
                                <ManualForm onSubmit={handleStartAnalysis} />
                            )}
                        </div>

                    </motion.div>
                ) : (
                    <motion.div
                        key="analysis-view"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full"
                    >
                        <AnalysisView mode={mode} onComplete={handleAnalysisComplete} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function UploadPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <UploadContent />
        </Suspense>
    )
}
