import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Briefcase, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { CareerRecommendation } from "@/types/analysis";

interface CareerMatchesProps {
    matches: CareerRecommendation[];
    selectedIndex: number | null;
    onSelect: (index: number | null) => void;
}

export function CareerMatches({ matches, selectedIndex, onSelect }: CareerMatchesProps) {
    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Briefcase className="h-6 w-6 text-primary" />
                    Top Career Matches
                </h2>
                <div className="text-sm text-muted-foreground flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    <Info className="h-4 w-4" />
                    Select a career for deep analysis
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
                {matches.map((match, index) => {
                    const isSelected = selectedIndex === index;
                    const isTopMatch = index === 0;

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => onSelect(isSelected ? null : index)}
                            className="cursor-pointer group h-full"
                        >
                            <Card className={cn(
                                "h-full border-t-4 bg-white/5 backdrop-blur-md transition-all duration-300 relative overflow-hidden",
                                isTopMatch && !isSelected ? "border-t-green-500 shadow-[0_0_20px_rgba(34,197,94,0.1)]" : "border-t-primary/50",
                                isSelected ? "ring-2 ring-primary scale-[1.03] shadow-2xl bg-white/10" : "hover:scale-[1.02] hover:bg-white/10"
                            )}>
                                {/* Subtle Glow for selection */}
                                {isSelected && (
                                    <div className="absolute top-0 right-0 h-32 w-32 bg-primary/10 blur-[40px] -z-10" />
                                )}

                                <CardHeader className="pb-2 relative">
                                    <div className="flex justify-between items-start gap-2">
                                        <CardTitle className="text-xl text-white leading-tight font-bold group-hover:text-primary transition-colors">{match.career}</CardTitle>
                                        <div className={cn(
                                            "flex items-center justify-center min-w-[40px] h-10 px-2 rounded-full font-bold text-xs shrink-0 shadow-lg border backdrop-blur-sm",
                                            match.matchScore > 90
                                                ? "bg-green-500/20 text-green-400 border-green-500/30"
                                                : "bg-primary/20 text-primary border-primary/30"
                                        )}>
                                            {match.matchScore}%
                                        </div>
                                    </div>
                                    <div className="text-[10px] uppercase tracking-wider text-primary font-bold mt-2 flex items-center gap-1">
                                        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                        {match.industry}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <DollarSign className="h-3 w-3 text-green-500" />
                                            {match.salaryRangeUSD}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-green-400">
                                            <TrendingUp className="h-3 w-3" />
                                            {match.growthPotential}
                                        </div>
                                    </div>

                                    <div className="rounded-lg bg-black/30 p-2 text-[10px] text-muted-foreground line-clamp-3 italic">
                                        "{match.reason}"
                                    </div>

                                    <div className="flex flex-wrap gap-1">
                                        {match.requiredCoreSkills.slice(0, 3).map((skill, si) => (
                                            <span key={si} className="px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] text-white/70">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )
                })}
            </div>
        </section>
    );
}
