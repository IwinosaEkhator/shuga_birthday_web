import type { Metadata } from "next";
import "./globals.css";
import "./responsive.css";
import "./interactions.css";

export const metadata: Metadata = {
  title: "The Shuga Archives — Birthday Edition",
  description: "An interactive birthday archive by Iwinosa and Maroh.",
  robots: { index: false, follow: false, nocache: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
