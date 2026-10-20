// app/layout.tsx
import "./globals.css";
import { DM_Sans, Space_Grotesk, Outfit, JetBrains_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import Provider from "@/layout/Provider";
import { getCategories, getMenus, getSiteLogo, getTopBar } from "@/utils/actions";
import MessengerButton from "@/components/shared/MessengerButton";
import { GoogleTagManager } from '@next/third-parties/google';

// Import DM Sans
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

// Import Space Grotesk
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

// Section-title fonts: Outfit for headings, JetBrains Mono for eyebrow labels
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-outfit",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata = {
  title: "Lukaz Belive in Quality",
  description: "E-commerce Platform",
  icons: {
    icon: '/icon/fevicon.ico',
    apple: '/icon/fevicon.ico',
  },
};

export default async function RootLayout({ children }) {
  const categories = await getCategories();
  const mainMenus = await getMenus();
  const topBar = await getTopBar();
  const logo = await getSiteLogo();

  return (
    <html className={`${dmSans.variable} ${spaceGrotesk.variable} ${outfit.variable} ${jetbrainsMono.variable}`} lang="en">
      <body>
        <Provider>
          <Header mainMenus={mainMenus} categories={categories} topBar={topBar} logoUrl={logo?.logo_url} />
          {children}
          <Footer />
        </Provider>
        <Toaster position="top-right" />
        <MessengerButton />

        <GoogleTagManager gtmId="GTM-P2NQCNCX" />
      </body>
    </html>
  );
}
