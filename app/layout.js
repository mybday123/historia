import "./globals.css";

export const metadata = {
  title: "Historia",
  description: "Another AI Agent",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
