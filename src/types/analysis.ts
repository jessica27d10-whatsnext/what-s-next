// Basic user profile after extraction or manual entry
export interface UserProfile {
    name: string | null;
    classification: "fresher" | "experienced";
    current_role: string | null;
    years_of_experience: number;
    education: string[];
    skills: string[];
    interests: string[];
}

// TASK 1: Career Recommendations
export interface CareerRecommendation {
    rank: number;
    career: string;
    matchScore: number;
    reason: string;
    requiredCoreSkills: string[];
    industry: string;
    growthPotential: string;
    salaryRangeUSD: string;
}

export interface Task1Response {
    careerRecommendations: CareerRecommendation[];
    profile: UserProfile;
}

// TASK 2: Career-Specific Analysis
export interface SkillGapItem {
    skill: string;
    currentLevel: string;
    requiredLevel: string;
    importance: "High" | "Medium" | "Low";
    resources: string[];
}

export interface RoadmapPhase {
    phase: string;
    duration: string;
    focus: string[];
    actions: string[];
    successMetrics: string[];
}

export interface JobMarketForecast {
    demand: string;
    growthOutlook: string;
    salaryTrend: string;
    emergingSkills: string[];
}

export interface Task2Response {
    targetCareer: string;
    skillGapAnalysis: SkillGapItem[];
    careerRoadmap: RoadmapPhase[];
    jobMarketForecast: JobMarketForecast;
}
