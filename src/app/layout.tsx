import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReddyBook | India's Most Trusted Online Cricket Betting Id Provider",
  description:
    "Searching for Online Betting Id Then You Came To Right Place. We Are The leading Online Betting Id Platform Get Your Cricket Id in one click.",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='31.9 30 186.2 200'%3E%3Cpolygon points='125,30 125,30 31.9,63.2 46.1,186.3 125,230 125,230 203.9,186.3 218.1,63.2' fill='%23333333'/%3E%3Cpolygon points='125,30 125,230 203.9,186.3 218.1,63.2' fill='%23000000'/%3E%3Cpath d='M125,52.1L66.8,182.6h21.7l11.7-29.2h49.4l11.7,29.2h21.7L125,52.1z M113.5,136.5l11.5-28.7l11.5,28.7H113.5z' fill='%23ffffff'/%3E%3C/svg%3E",
    apple: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='31.9 30 186.2 200'%3E%3Cpolygon points='125,30 125,30 31.9,63.2 46.1,186.3 125,230 125,230 203.9,186.3 218.1,63.2' fill='%23333333'/%3E%3Cpolygon points='125,30 125,230 203.9,186.3 218.1,63.2' fill='%23000000'/%3E%3Cpath d='M125,52.1L66.8,182.6h21.7l11.7-29.2h49.4l11.7,29.2h21.7L125,52.1z M113.5,136.5l11.5-28.7l11.5,28.7H113.5z' fill='%23ffffff'/%3E%3C/svg%3E",
  },
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
