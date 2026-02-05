import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Activity, Zap } from "lucide-react";
import { JobMarketForecast } from "@/types/analysis";

interface MarketForecastProps {
    forecast: JobMarketForecast;
}

export function MarketForecast({ forecast }: MarketForecastProps) {
    return (
        <Card className="bg-white/5 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="flex items-center gap-2 text-white">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Market Forecast
                </CardTitle>
                <div className="flex items-center gap-1 text-[10px] font-bold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20 uppercase tracking-tighter">
                    <Activity className="h-3 w-3" />
                    Demand: {forecast.demand}
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="bg-black/30 p-3 rounded-lg border border-white/5 transition-colors hover:border-green-500/30">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Growth Outlook</p>
                        <p className="text-lg font-bold text-green-400 leading-tight">{forecast.growthOutlook}</p>
                    </div>
                    <div className="bg-black/30 p-3 rounded-lg border border-white/5 transition-colors hover:border-primary/30">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Salary Trend</p>
                        <p className="text-lg font-bold text-white leading-tight">{forecast.salaryTrend}</p>
                    </div>
                </div>

                <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-2 mb-2 text-primary font-bold text-[10px] uppercase tracking-wider">
                        <Zap className="h-3 w-3" />
                        Skills to Master (2-3 Yrs)
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {forecast.emergingSkills.map((skill, i) => (
                            <span key={i} className="text-[10px] bg-black/40 px-2 py-1 rounded border border-white/10 text-white/80 font-medium">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
