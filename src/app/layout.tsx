import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "1Fi Marketplace",
  description: "Shop with flexible EMIs backed by mutual funds.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
