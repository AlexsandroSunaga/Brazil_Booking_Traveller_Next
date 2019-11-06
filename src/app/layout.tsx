import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileCallButton } from "@/components/ui/MobileCallButton";
import { SITE } from "@/lib/constants";

const displayFont = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const bodyFont = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "Fixed price airport transfers to and from all major Brazilian airports. No surge pricing, 24/7 support, free flight monitoring. Book online in 60 seconds.",
  keywords: [
    "airport taxi",
    "airport transfer",
    "guarulhos transfer",
    "congonhas taxi",
    "galeao transfer",
    "fixed price taxi brazil",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: SITE.name,
    title: `${SITE.name} | ${SITE.tagline}`,
    description: "Fixed price airport transfers across Brazil. Book online in 60 seconds.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${displayFont.variable} ${bodyFont.variable} antialiased`}>
        <Header />
        <main className="min-h-screen overflow-x-hidden">{children}</main>
        <Footer />
        <MobileCallButton />
      </body>
    </html>
  );
}
