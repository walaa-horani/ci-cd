import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CI/CD Demo - Next.js App",
  description: "Minimal Next.js app for CI/CD demonstration with cart logic and health API route",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
