import type { Metadata } from "next";
import {
  Space_Grotesk,
  Fraunces,
  Inter,
  IBM_Plex_Mono,
  Caveat,
} from "next/font/google";

import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-caveat",
});

export const metadata: Metadata = {
  title:
    "PROLINE HYGIENE by Dr. Gamm — Produits professionnels de nettoyage",

  description:
    "Produits professionnels de nettoyage et hygiène pour hôtels, restaurants, hôpitaux et établissements exigeants. Fabrication tunisienne, Sousse.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body
        className={`${spaceGrotesk.variable} ${fraunces.variable} ${inter.variable} ${plexMono.variable} ${caveat.variable}`}
      >
        {children}
      </body>
    </html>
  );
}