import type { Metadata } from "next";
import "./fonts.css";
import "./globals.css";
import "./responsive.css";
import "./interactions.css";
import "./polish.css";
import "./soundtrack.css";
import "./qa-fixes.css";
import "./rolls.css";

export const metadata: Metadata = {
  title: "The Shuga Archives — Birthday Edition",
  description: "An interactive birthday archive by Iwinosa and Maroh.",
  robots: { index: false, follow: false, nocache: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" as="image" href="/optimized/images/hero-portrait.avif" type="image/avif" />
        <meta name="theme-color" content="#351e28" />
      </head>
      <body>{children}</body>
    </html>
  );
}
