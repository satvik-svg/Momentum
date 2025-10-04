import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { PillNavbar } from "@/components/PillNavbar";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Momentum - Play the Crowd",
  description: "A decentralized game of social consensus. Stake on outcomes, predict the crowd, win together.",
  keywords: ["DeFi", "Social", "Staking", "Prediction", "HeLa", "Blockchain"],
  authors: [{ name: "Momentum Team" }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased min-h-screen bg-black text-white`}>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <PillNavbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
