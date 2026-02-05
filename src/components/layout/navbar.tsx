"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/5 backdrop-blur-md transition-all">
            <div className="container mx-auto flex h-16 items-center justify-between px-6">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
                        <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">
                        What's Next
                    </span>
                </Link>

                <div className="flex items-center gap-4">
                    <Link href="/upload">
                        <Button variant="premium" size="sm" className="hidden sm:flex">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
