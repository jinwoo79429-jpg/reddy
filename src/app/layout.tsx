import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReddyBook | India's Most Trusted Online Cricket Betting Id Provider",
  description:
    "Searching for Online Betting Id Then You Came To Right Place. We Are The leading Online Betting Id Platform Get Your Cricket Id in one click.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Titillium+Web:wght@200;400;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Bootstrap 5 */}
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        {/* Bootstrap Icons */}
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
          rel="stylesheet"
        />
        {/* Swiper */}
        <link
          href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"
          rel="stylesheet"
        />
        {/* Original ReddyBook CSS */}
        <link rel="stylesheet" href="/assets/css/styles.css" />
        <link rel="stylesheet" href="/assets/css/common_style.css" />
        <link rel="stylesheet" href="/assets/css/theme_master.css" />
      </head>
      <body>
        {children}
        {/* Bootstrap JS bundle */}
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
          async
        />
        {/* Swiper JS */}
        <script
          src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"
          async
        />
      </body>
    </html>
  );
}
