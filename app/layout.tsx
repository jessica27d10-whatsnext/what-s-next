import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/navbar";
import { Chatbot } from "@/components/shared/chatbot";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "What's Next - AI Career Intelligence",
  description: "Analyze your skills, identify gaps, and forecast future career opportunities with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(inter.variable, "font-sans antialiased min-h-screen bg-background text-foreground")}>
        <Navbar />
        {children}
        <Chatbot />
      </body>
    </html>
  );
}
