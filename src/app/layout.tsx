import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans, Roboto_Slab } from "next/font/google";
import "./globals.css";
import "@/styles/legacy-theme.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const robotoSlab = Roboto_Slab({
  variable: "--font-roboto-slab",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "AICT Global Bangladesh",
  description:
    "AICT Global Bangladesh — donate to active campaigns, calculate your Zakat, join events, and volunteer with us.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${plusJakarta.variable} ${robotoSlab.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
        />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
