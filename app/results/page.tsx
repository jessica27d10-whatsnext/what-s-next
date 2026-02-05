"use client";

import { CareerMatches } from "@/components/results/career-matches";
import { SkillGap } from "@/components/results/skill-gap";
import { Roadmap } from "@/components/results/roadmap";
import { MarketForecast } from "@/components/results/forecast";
import { AIAssistant } from "@/components/chat/ai-assistant";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Task1Response, Task2Response, CareerRecommendation, UserProfile } from "@/types/analysis";

export default function ResultsPage() {
    const [task1Data, setTask1Data] = useState<Task1Response | null>(null);
    const [selectedCareer, setSelectedCareer] = useState<CareerRecommendation | null>(null);
    const [analysisData, setAnalysisData] = useState<Task2Response | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const storedData = localStorage.getItem("careerAnalysis");
        if (!storedData) {
            router.push("/upload");
            return;
        }
        try {
            const parsed = JSON.parse(storedData) as Task1Response;
            setTask1Data(parsed);

            // Auto-select top match if available and not yet selected
            if (parsed.careerRecommendations?.length > 0 && !selectedCareer) {
                handleCareerSelect(0, parsed.careerRecommendations);
            }
        } catch (e) {
            console.error("Failed to parse data");
            router.push("/upload");
        }
    }, [router]);

    const handleCareerSelect = useCallback(async (index: number | null, recommendationsOverride?: CareerRecommendation[]) => {
        const recommendations = recommendationsOverride || task1Data?.careerRecommendations;
        if (!recommendations || index === null) {
            setSelectedCareer(null);
            setAnalysisData(null);
            return;
        }

        const career = recommendations[index];
        setSelectedCareer(career);

        // Fetch deep analysis (Task 2)
        setIsAnalyzing(true);
        try {
            const response = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "resume", // or manual, based on profile
                    data: { profile: task1Data?.profile },
                    targetCareer: career.career
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 429) {
                    alert(`Rate limit reached: ${errorData.details || 'Please try again in a few minutes.'}`);
                } else {
                    throw new Error("Deep analysis failed");
                }
                return;
            }

            const result = await response.json();
            setAnalysisData(result);
        } catch (error) {
            console.error("Error fetching deep analysis:", error);
            alert("Failed to generate deep analysis. Please try again later.");
        } finally {
            setIsAnalyzing(false);
        }
    }, [task1Data]);

    if (!task1Data) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-white p-6 pt-24 pb-24">
            <div className="container mx-auto max-w-7xl space-y-12">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">AI Career Advisor Report</h1>
                        <p className="text-muted-foreground mt-1">
                            Expert analysis for <span className="text-white font-medium">{task1Data.profile.name}</span> • {task1Data.profile.classification === "fresher" ? "Fresher" : "Experienced"}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="gap-2 border-white/20 hover:bg-white/10" onClick={() => window.print()}>
                            <Download className="h-4 w-4" />
                            Export PDF
                        </Button>
                    </div>
                </motion.div>

                {/* 1. Career Matches (Task 1 Results) */}
                <CareerMatches
                    matches={task1Data.careerRecommendations}
                    selectedIndex={task1Data.careerRecommendations.findIndex(c => c.career === selectedCareer?.career)}
                    onSelect={(idx) => handleCareerSelect(idx)}
                />

                {/* 2. Deep Dive (Task 2 Results) */}
                <AnimatePresence mode="wait">
                    {selectedCareer && (
                        <motion.div
                            key={selectedCareer.career}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                                <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                                    <Sparkles className="h-5 w-5 text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold">Deep Dive: {selectedCareer.career}</h2>
                                {isAnalyzing && <Loader2 className="h-5 w-5 animate-spin text-primary ml-auto" />}
                            </div>

                            {!isAnalyzing && analysisData ? (
                                <div className="grid gap-6 lg:grid-cols-2 items-start">
                                    <div className="space-y-6">
                                        <SkillGap skills={analysisData.skillGapAnalysis} title={`Skill Gaps for ${selectedCareer.career}`} />
                                        <MarketForecast forecast={analysisData.jobMarketForecast} />
                                    </div>
                                    <div className="h-full">
                                        <Roadmap roadmap={analysisData.careerRoadmap} title={`Path to ${selectedCareer.career}`} />
                                    </div>
                                </div>
                            ) : isAnalyzing ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                                    <p className="text-lg font-medium text-white">Generating Expert Roadmap & Gap Analysis...</p>
                                    <p className="text-muted-foreground max-w-md">Our AI advisor is evaluating market trends and specific role requirements for this career path.</p>
                                </div>
                            ) : null}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-center text-xs text-muted-foreground mt-20">
                    <p>
                        Determined through deterministic professional alignment scoring. All insights are grounded in your profile data and current workforce intelligence.
                    </p>
                </div>

                {/* AI Chat Assistant */}
                <AIAssistant context={{
                    profile: task1Data.profile,
                    recommendations: task1Data.careerRecommendations,
                    selectedCareerAnalysis: analysisData
                }} />
            </div>
        </div>
    );
}
