"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BrainCircuit, Search, LineChart, FileText, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface AnalysisViewProps {
    mode: "upload" | "manual";
    onComplete: () => void;
}

export function AnalysisView({ mode, onComplete }: AnalysisViewProps) {
    const steps = [
        {
            icon: FileText,
            text: mode === "upload" ? "Parsing Document..." : "Processing Profile..."
        },
        {
            icon: Search,
            text: mode === "upload" ? "Extracting Skills..." : "Analyzing Skillset..."
        },
        { icon: BrainCircuit, text: "Mapping Career Graph..." },
        { icon: LineChart, text: "Forecasting Market Trends..." },
        { icon: CheckCircle, text: "Generating Roadmap..." },
    ];

    const [currentStep, setCurrentStep] = useState(0);
    const router = useRouter();

    useEffect(() => {
        if (currentStep < steps.length) {
            const timer = setTimeout(() => {
                setCurrentStep((prev) => prev + 1);
            }, 1000); // 1.5 seconds per step
            return () => clearTimeout(timer);
        } else {
            setTimeout(() => {
                onComplete();
            }, 500)
        }
    }, [currentStep, onComplete, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] w-full max-w-2xl mx-auto space-y-8">

            <div className="relative h-32 w-32 flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-pulse" />
                <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin" />
                <BrainCircuit className="h-12 w-12 text-primary" />
            </div>

            <div className="space-y-4 w-full">
                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isActive = index === currentStep;

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: isActive || isCompleted ? 1 : 0.3, x: 0 }}
                            className="flex items-center gap-4"
                        >
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center border transition-colors ${isCompleted ? "bg-green-500 border-green-500 text-black" :
                                isActive ? "bg-primary border-primary text-white" :
                                    "border-white/20 text-muted-foreground"
                                }`}>
                                {isCompleted ? <CheckCircle className="h-4 w-4" /> : <step.icon className="h-4 w-4" />}
                            </div>
                            <span className={`text-lg ${isActive ? "text-white font-medium" : "text-muted-foreground"}`}>
                                {step.text}
                            </span>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    );
}
