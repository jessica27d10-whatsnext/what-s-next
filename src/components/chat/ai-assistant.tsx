"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Loader2, User, Bot, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Message {
    role: "user" | "assistant";
    content: string;
}

interface AIAssistantProps {
    context: any;
}

export function AIAssistant({ context }: AIAssistantProps) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hello! I'm your AI Career Advisor. Ask me anything about your report or career path!" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userMsg }]);
        setIsLoading(true);

        try {
            console.log("Sending request to /api/chat...");
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMsg,
                    history: messages.slice(-5), // Only last few messages for context
                    context: context
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 429) throw new Error("RATE_LIMIT");
                throw new Error("API_ERROR");
            }

            const data = await response.json();
            console.log("Received AI response:", data.message);
            setMessages(prev => [...prev, { role: "assistant", content: data.message }]);
        } catch (error: any) {
            console.error("❌ Chatbot Error:", error);
            const errorMsg = error.message === "RATE_LIMIT"
                ? "I've reached my message limit for now. Please wait a few minutes before asking more questions! ⏳"
                : "I'm having trouble connecting. Please try again in a moment.";
            setMessages(prev => [...prev, { role: "assistant", content: errorMsg }]);
        } finally {
            console.log("Chat flow complete.");
            setIsLoading(false);
        }
    };

    if (!mounted) return null;

    const content = (
        <>
            {/* Floating Bubble */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-6 right-6 z-[9999]"
            >
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "h-14 w-14 rounded-full shadow-2xl p-0 transition-all",
                        isOpen ? "bg-red-500 hover:bg-red-600 rotate-90" : "bg-primary hover:bg-primary/90"
                    )}
                >
                    {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
                </Button>
            </motion.div>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-6 z-[9999] w-[90vw] max-w-[400px] h-[600px] max-h-[70vh] flex flex-col bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
                    >
                        {/* Header */}
                        <div className="bg-primary/10 p-4 border-b border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                                    <Sparkles className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm text-white">Career Assistant</h3>
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-[10px] text-muted-foreground uppercase font-semibold">Online</span>
                                    </div>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 text-muted-foreground hover:text-white">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        "flex gap-3",
                                        msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                    )}
                                >
                                    <div className={cn(
                                        "h-8 w-8 rounded-full flex items-center justify-center shrink-0 border",
                                        msg.role === "user" ? "bg-white/5 border-white/10" : "bg-primary/20 border-primary/20"
                                    )}>
                                        {msg.role === "user" ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-primary" />}
                                    </div>
                                    <div className={cn(
                                        "max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed",
                                        msg.role === "user"
                                            ? "bg-primary text-white rounded-tr-none"
                                            : "bg-white/5 text-muted-foreground rounded-tl-none border border-white/5"
                                    )}>
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-3">
                                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                        <Bot className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/5">
                                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-white/10 bg-black/40 z-[60]">
                            <div className="relative flex items-center group">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => {
                                        console.log("Input changed:", e.target.value);
                                        setInput(e.target.value);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            console.log("Enter key fired");
                                            e.preventDefault();
                                            handleSend();
                                        }
                                    }}
                                    placeholder="Ask about your roadmap..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/30 z-[70] pointer-events-auto"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    disabled={isLoading || !input.trim()}
                                    onClick={(e) => {
                                        console.log("CLICK event on button");
                                        handleSend();
                                    }}
                                    className={cn(
                                        "absolute right-2 top-1.5 h-8 w-8 bg-primary rounded-lg flex items-center justify-center transition-all z-[80] pointer-events-auto active:scale-95 shadow-lg",
                                        (isLoading || !input.trim()) ? "opacity-30 cursor-not-allowed grayscale" : "opacity-100 cursor-pointer hover:bg-primary/80"
                                    )}
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                                    ) : (
                                        <Send className="h-4 w-4 text-white" />
                                    )}
                                </button>
                            </div>
                            <p className="text-[10px] text-center text-muted-foreground/40 mt-3 uppercase tracking-[0.2em] font-medium pointer-events-none">
                                AI Assistant • Built with Intelligence
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );

    return createPortal(content, document.body);
}
