import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://vld.oxog.dev"),
  title: { default: "VLD — Good data. Great things.", template: "%s · VLD" },
  description:
    "Fast, lightweight TypeScript validation. Zero runtime dependencies, familiar schemas, and confidence in every byte. Meet VLD.",
  openGraph: {
    title: "VLD — Good data. Great things.",
    description: "A little validation. A lot of possibility.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{document.documentElement.dataset.theme=localStorage.getItem('vld-theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}catch{document.documentElement.dataset.theme='light'}`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
