import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Historia",
  description:
    "Historia is a chatbot designed to help users identify and learn about old and historical images. By analyzing visual details and providing context, it offers quick insights into the origins, significance, and background of photographs, artifacts, and historical scenes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..400,0..1,-50..200&display=block"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
