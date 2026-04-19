import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import { MotionBackground } from "@/components/ui/MotionBackground";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "ReviewIQ - Customer Review Intelligence Platform",
  description: "Turn thousands of raw customer reviews into actionable insights for Product, Marketing, and QC teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${firaCode.variable} font-sans relative`}>
        <MotionBackground />
        {children}
      </body>
    </html>
  );
}
