import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Seenior - Rapid Codebase Onboarding",
    template: "%s | Seenior",
  },
  description: "Understand any codebase in 60 seconds. Get instant documentation, UML diagrams, and comprehension quizzes from any GitHub repository.",
  keywords: ["codebase analysis", "documentation generator", "UML diagrams", "code onboarding", "GitHub analyzer", "developer tools"],
  authors: [{ name: "Seenior Team" }],
  creator: "Seenior",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://seenior.app",
    title: "Seenior - Rapid Codebase Onboarding",
    description: "Understand any codebase in 60 seconds. Get instant documentation, UML diagrams, and comprehension quizzes.",
    siteName: "Seenior",
  },
  twitter: {
    card: "summary_large_image",
    title: "Seenior - Rapid Codebase Onboarding",
    description: "Understand any codebase in 60 seconds.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="flex flex-col">{children}</body>
    </html>
  );
}
