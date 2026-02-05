"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { TrendingUp, ShieldCheck, Target, Zap } from "lucide-react";

const features = [
    {
        icon: Target,
        title: "AI-Driven Recommendations",
        description: "Get matched with careers that fit your true potential, not just your past job titles.",
    },
    {
        icon: Zap,
        title: "Skill Gap Detection",
        description: "Identify exactly what skills you're missing and where to learn them.",
    },
    {
        icon: TrendingUp,
        title: "Market Trend Forecasting",
        description: "See which jobs are growing and which are at risk of automation.",
    },
    {
        icon: ShieldCheck,
        title: "Personalized Roadmap",
        description: "A step-by-step plan tailored to your speed and learning style.",
    },
];

export function Features() {
    return (
        <section className="container mx-auto py-24 px-6">
            <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Why Use What's Next?
                </h2>
                <p className="mt-4 text-muted-foreground">
                    Built with advanced probabilistic matching to reduce career uncertainty.
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                        viewport={{ once: true }}
                    >
                        <Card className="h-full border-white/10 bg-white/5 hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <feature.icon className="h-8 w-8 text-primary mb-2" />
                                <CardTitle className="text-lg">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    {feature.description}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
