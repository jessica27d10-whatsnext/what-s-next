"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { User, Briefcase, GraduationCap, Code } from "lucide-react";
import { cn } from "@/lib/utils";

interface ManualFormProps {
    onSubmit: (data: any) => void;
}

export function ManualForm({ onSubmit }: ManualFormProps) {
    const [type, setType] = useState<"fresher" | "experienced">("fresher");
    const [formData, setFormData] = useState({
        name: "",
        currentRole: "",
        yearsOfExperience: "",
        education: "",
        skills: "",
        targetRole: "",
        interests: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ type, ...formData });
    };

    return (
        <Card className="w-full max-w-2xl bg-white/5 border-white/10">
            <CardContent className="p-8">
                {/* Toggle */}
                <div className="flex bg-black/20 p-1 rounded-lg mb-8">
                    <button
                        type="button"
                        onClick={() => setType("fresher")}
                        className={cn(
                            "flex-1 py-2 text-sm font-medium rounded-md transition-all",
                            type === "fresher"
                                ? "bg-primary text-white shadow-lg"
                                : "text-muted-foreground hover:text-white"
                        )}
                    >
                        I'm a Student / Fresher
                    </button>
                    <button
                        type="button"
                        onClick={() => setType("experienced")}
                        className={cn(
                            "flex-1 py-2 text-sm font-medium rounded-md transition-all",
                            type === "experienced"
                                ? "bg-primary text-white shadow-lg"
                                : "text-muted-foreground hover:text-white"
                        )}
                    >
                        I'm Experienced
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input name="name" onChange={handleChange} placeholder="John Doe" className="pl-9 bg-black/20 border-white/10" required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Target Role</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input name="targetRole" onChange={handleChange} placeholder="e.g. Data Scientist" className="pl-9 bg-black/20 border-white/10" required />
                                </div>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {type === "fresher" ? (
                                <motion.div
                                    key="fresher-fields"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">Education / Degree</label>
                                        <div className="relative">
                                            <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input name="education" onChange={handleChange} placeholder="B.Tech Computer Science" className="pl-9 bg-black/20 border-white/10" />
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="experienced-fields"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-4"
                                >
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-muted-foreground">Current Role</label>
                                            <Input name="currentRole" onChange={handleChange} placeholder="Junior Developer" className="bg-black/20 border-white/10" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-muted-foreground">Years of Exp</label>
                                            <Input name="yearsOfExperience" onChange={handleChange} type="number" placeholder="2" className="bg-black/20 border-white/10" />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Key Skills (comma separated)</label>
                            <div className="relative">
                                <Code className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input name="skills" onChange={handleChange} placeholder="Python, React, AWS..." className="pl-9 bg-black/20 border-white/10" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Interests / Hobbies</label>
                            <Input name="interests" onChange={handleChange} placeholder="Robotics, Open Source, Blogging..." className="bg-black/20 border-white/10" />
                        </div>

                        <div className="pt-4">
                            <Button type="submit" variant="premium" className="w-full h-12 text-lg">
                                Analyze Profile
                            </Button>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
