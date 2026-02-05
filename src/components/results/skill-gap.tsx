import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Target } from "lucide-react";
import { SkillGapItem } from "@/types/analysis";

interface SkillGapProps {
    skills: SkillGapItem[];
    title?: string;
}

export function SkillGap({ skills, title = "Skill Gap Analysis" }: SkillGapProps) {
    // Map string levels to numeric for visualization
    const levelToPercent = (level: string) => {
        const lower = level.toLowerCase();
        if (lower.includes("expert")) return 100;
        if (lower.includes("advanced")) return 80;
        if (lower.includes("intermediate")) return 60;
        if (lower.includes("beginner")) return 30;
        if (lower.includes("none") || lower.includes("unknown")) return 10;
        return 50; // default
    };

    const data = skills.slice(0, 6).map(skill => ({
        subject: skill.skill,
        A: levelToPercent(skill.currentLevel),
        B: levelToPercent(skill.requiredLevel),
        fullMark: 100,
        currentLabel: skill.currentLevel,
        requiredLabel: skill.requiredLevel
    }));

    return (
        <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-white text-lg">
                    <Target className="h-5 w-5 text-primary" />
                    {title}
                </CardTitle>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                    You (Blue) vs. Role (Purple)
                </p>
            </CardHeader>
            <CardContent className="h-[250px] w-full pb-6">
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                            <PolarGrid stroke="rgba(255,255,255,0.1)" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar
                                name="You"
                                dataKey="A"
                                stroke="#3b82f6"
                                fill="#3b82f6"
                                fillOpacity={0.4}
                            />
                            <Radar
                                name="Required"
                                dataKey="B"
                                stroke="#a855f7"
                                fill="#a855f7"
                                fillOpacity={0.4}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                                formatter={(value: any, name: any, props: any) => {
                                    const isA = name === "You";
                                    return [isA ? props.payload.currentLabel : props.payload.requiredLabel, name];
                                }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                        Loading skill analysis...
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
