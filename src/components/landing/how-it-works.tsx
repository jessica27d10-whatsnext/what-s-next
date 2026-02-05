"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { FileText, BrainCircuit, Map } from "lucide-react";

const steps = [
    {
        icon: FileText,
        title: "1. Upload Resume",
        description: "Simply drag & drop your resume or enter your details manually.",
    },
    {
        icon: BrainCircuit,
        title: "2. AI Analyzes Profile",
        description: "Our advanced AI identifies your skills, gaps, and hidden potential.",
    },
    {
        icon: Map,
        title: "3. Get Career Roadmap",
        description: "Receive a personalized report with career paths and learning resources.",
    },
];

export function HowItWorks() {
    return (
        <section className="container mx-auto py-24 px-6">
            <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    How It Works
                </h2>
                <p className="mt-4 text-muted-foreground">
                    Three simple steps to unlock your future potential.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                {steps.map((step, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2, duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <Card className="h-full border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                            <CardHeader>
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary">
                                    <step.icon className="h-6 w-6" />
                                </div>
                                <CardTitle>{step.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    {step.description}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
