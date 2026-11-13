import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "UX-KB — UI/UX knowledge your AI agent can cite",
  description:
    "Cloud MCP knowledge base and UI/UX design agent. 73 cited topic docs, 6 workflow stage packs, session-scoped retrieval, citation verification, API keys, rate limits, and usage logging.",
  metadataBase: new URL("https://ux-kb-site.vercel.app"),
  openGraph: {
    title: "UX-KB — UI/UX knowledge your AI agent can cite",
    description: "Cloud MCP knowledge base for UI/UX design. 73 cited topic docs, stage packs, citation verification.",
    type: "website",
    url: "https://github.com/Vinoth82003/ux-kb-mcp",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
