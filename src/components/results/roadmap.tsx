import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { RoadmapPhase } from "@/types/analysis";
import { motion } from "framer-motion";

interface RoadmapProps {
    roadmap: RoadmapPhase[];
    title?: string;
}

export function Roadmap({ roadmap, title }: RoadmapProps) {
    return (
        <Card className="bg-white/5 border-white/10 overflow-hidden relative">
            <div className="absolute top-0 right-0 h-64 w-64 bg-primary/5 blur-[80px] -z-10" />

            <CardHeader className="pb-2">
                <CardTitle className="text-white flex items-center gap-2 text-xl font-bold">
                    <Calendar className="h-6 w-6 text-primary" />
                    {title || "Actionable Career Roadmap"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative border-l-2 border-dashed border-white/10 ml-4 space-y-10 pb-8 mt-4">
                    {roadmap.map((phase, index) => (
                        <div key={index} className="relative pl-10">
                            {/* Animated indicator */}
                            <div className={cn(
                                "absolute -left-[11px] top-1 h-5 w-5 rounded-full border-4 bg-black flex items-center justify-center",
                                index === 0 ? "border-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" : "border-white/20"
                            )}>
                                {index === 0 && <div className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />}
                            </div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.15 }}
                            >
                                <h3 className={cn(
                                    "font-bold text-xl mb-1",
                                    index === 0 ? "text-primary" : "text-white"
                                )}>{phase.phase}</h3>

                                <div className="flex items-center gap-2 mb-4">
                                    <div className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                                        Duration: {phase.duration}
                                    </div>
                                </div>

                                <div className="grid gap-6">
                                    <div>
                                        <p className="text-[10px] font-bold text-primary uppercase mb-2 tracking-widest opacity-80">Focus Skills</p>
                                        <div className="flex flex-wrap gap-2">
                                            {phase.focus.map((skill, i) => (
                                                <span key={i} className="text-[10px] px-2 py-1 rounded-full bg-primary/5 border border-primary/20 text-white font-medium">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-white/5 rounded-xl border border-white/10 p-4 space-y-4">
                                        <ul className="space-y-3">
                                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-1">Required Actions</p>
                                            {phase.actions.map((item: string, i: number) => (
                                                <li key={i} className="flex items-start gap-3 text-sm text-balance text-muted-foreground group">
                                                    <ArrowRight className="h-4 w-4 text-primary shrink-0 transition-transform group-hover:translate-x-1" />
                                                    <span className="group-hover:text-white transition-colors">{item}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="bg-primary/10 rounded-lg border border-primary/20 p-3 pt-2">
                                            <p className="text-[10px] font-bold text-primary uppercase mb-1.5 tracking-widest flex items-center gap-2">
                                                <Sparkles className="h-3 w-3" />
                                                Success Metrics
                                            </p>
                                            <ul className="grid gap-2 text-xs text-primary/90 font-medium">
                                                {phase.successMetrics.map((sm, i) => (
                                                    <li key={i} className="flex items-center gap-2">
                                                        <div className="h-1 w-1 rounded-full bg-primary shrink-0" />
                                                        {sm}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
