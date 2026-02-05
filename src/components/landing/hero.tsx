"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Upload, Sparkles } from "lucide-react";
import Link from "next/link";

export function Hero() {
    return (
        <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-16 text-center">

            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
            <div className="absolute bottom-0 right-0 -z-10 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[100px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center gap-6"
            >
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm">
                    <Sparkles className="h-4 w-4" />
                    <span>AI-Powered Career Intelligence</span>
                </div>

                <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-white sm:text-7xl">
                    Confused About Your Career? <br />
                    <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent inline-flex flex-wrap justify-center">
                        {"Let AI Show You What’s Next.".split(" ").map((word, i) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.5 + i * 0.1,
                                    ease: "easeOut"
                                }}
                                className="mr-[0.2em] last:mr-0 inline-block"
                            >
                                {word}
                            </motion.span>
                        ))}
                    </span>
                </h1>

                <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
                    Analyze your skills, discover career paths, and prepare for the future job market with our predictive intelligence engine.
                </p>

                <div className="mt-8 flex flex-col items-center gap-4">
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <Link href="/upload">
                            <Button variant="premium" size="lg" className="gap-2">
                                <Upload className="h-5 w-5" />
                                Upload Resume
                            </Button>
                        </Link>
                        <Link href="/upload?mode=manual">
                            <Button variant="outline" size="lg" className="gap-2 border-white/10 bg-white/5 hover:bg-white/10">
                                Enter Details
                                <ArrowRight className="h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        No resume? <span className="text-primary font-medium">No problem.</span> Just enter your details manually!
                    </p>
                </div>
            </motion.div>
        </section>
    );
}
