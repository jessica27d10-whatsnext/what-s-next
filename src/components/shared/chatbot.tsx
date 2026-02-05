"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, X, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

export function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="mb-4 w-80 sm:w-96"
                    >
                        <Card className="border-primary/20 bg-black/80 backdrop-blur-xl shadow-2xl">
                            <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-white/10">
                                <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                    AI Career Assistant
                                </CardTitle>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsOpen(false)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent className="p-4 h-80 flex flex-col justify-between">
                                <div className="space-y-4 overflow-y-auto pr-2">
                                    <div className="bg-white/10 p-3 rounded-lg rounded-tl-none text-sm text-white/90">
                                        Hello! I've analyzed your profile. Ask me anything about your career path or skill gaps.
                                    </div>
                                </div>
                                <div className="mt-4 relative">
                                    <Input placeholder="Ask a question..." className="pr-10 bg-white/5 border-white/10" />
                                    <Button size="icon" variant="ghost" className="absolute right-0 top-0 text-primary hover:text-primary/80">
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <Button
                onClick={() => setIsOpen(!isOpen)}
                size="lg"
                className="h-14 w-14 rounded-full bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all hover:scale-110"
            >
                <MessageSquare className="h-6 w-6" />
            </Button>
        </div>
    );
}
