import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReddyBook | India's Most Trusted Online Cricket Betting Id Provider",
  description:
    "ReddyBook is India's leading platform for online cricket betting IDs. Get your Reddy Book ID instantly for IPL 2026, WPL, PSL, and live casino games on the most trusted betting app.",
  keywords: [
    "ReddyBook",
    "Reddy Book",
    "Reddy Anna",
    "Reddy Book 247",
    "ReddyBook Club",
    "Reddy Book Login",
    "Reddy Book Official",
    "IPL 2026 betting id",
    "WPL 2026 betting",
    "PSL 2026 betting id",
    "Cricket Betting ID",
    "Online Cricket ID",
    "Betting Exchange India",
    "Cricket Exchange ID",
    "Online Gambling India",
    "Live Casino India",
    "Online Baccarat India",
    "Roulette Online India",
    "Teen Patti Real Cash",
    "Andar Bahar Online",
    "Football Betting ID",
    "Tennis Betting ID",
    "Horse Racing Betting India",
    "Sky Exchange ID",
    "Lotus Book ID",
    "Diamond Exchange ID",
    "Mahadev Book ID",
    "FairPlay ID",
    "Betting App India",
    "Fastest Withdrawal Betting Site",
    "Trusted Betting ID Provider",
    "ReddyBook Customer Care Number",
    "Reddy Book WhatsApp Number"
  ],
  authors: [{ name: "ReddyBook Team" }],
  metadataBase: new URL("https://www.reddybooklive.site"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ReddyBook | India's #1 Online Cricket Betting Id Provider",
    description: "Get your Reddy Book betting ID in one click. Join the most trusted gambling platform in India.",
    url: "https://www.reddybooklive.site",
    siteName: "ReddyBook",
    images: [
      {
        url: "/assets/images/log_one.png",
        width: 1200,
        height: 630,
        alt: "ReddyBook Betting App",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ReddyBook | Online Cricket Betting Id",
    description: "The best betting and gambling app in India. Get your Reddy Book ID now.",
    images: ["/assets/images/log_one.png"],
  },
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
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "ReddyBook",
              "url": "https://www.reddybooklive.site",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.reddybooklive.site/home?q={search_term_string}",
                "query-input": "required name=search_term_string"
              },
              "description": "India's most trusted online cricket betting ID provider for IPL, WPL, PSL and Casino.",
              "publisher": {
                "@type": "Organization",
                "name": "ReddyBook",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://speedcdn.io/assets/logos/reddybook.live.png"
                }
              }
            })
          }}
        />
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
