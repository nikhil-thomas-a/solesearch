import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { RegionProvider } from "@/lib/regionContext";

export const metadata: Metadata = {
  title: { template: "%s — SoleSearch", default: "SoleSearch — Data-driven shoe discovery" },
  description: "Find your perfect shoe with in-depth lab data, fit matching, and AI-powered recommendations. Covering every shoe from road runners to work boots.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RegionProvider>
          <Navbar />
          <main>{children}</main>
        </RegionProvider>
      </body>
    </html>
  );
}
