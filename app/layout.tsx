import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Willett Single Barrel Lookup",
  description: "Search and explore Willett Family Estate single barrel bottlings",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
