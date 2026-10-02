import type {
  Metadata,
  Viewport,
} from "next";

import "./globals.css";

import {
  SITE_AUTHOR,
  SITE_DESCRIPTION,
  SITE_LANGUAGE,
  SITE_LOCALE,
  SITE_NAME,
  SITE_THEME_COLOR,
  SITE_TITLE,
  SITE_URL,
} from "../lib/site";

/*
|--------------------------------------------------------------------------
| Metadata
|--------------------------------------------------------------------------
*/

export const metadata: Metadata =
  {
    /*
    |--------------------------------------------------------------------------
    | Base URL
    |--------------------------------------------------------------------------
    */

    metadataBase:
      new URL(
        SITE_URL
      ),

    /*
    |--------------------------------------------------------------------------
    | Title
    |--------------------------------------------------------------------------
    */

    title: {
      default:
        SITE_TITLE,

      template:
        `%s | ${SITE_NAME}`,
    },

    /*
    |--------------------------------------------------------------------------
    | Basic SEO
    |--------------------------------------------------------------------------
    */

    description:
      SITE_DESCRIPTION,

    applicationName:
      SITE_NAME,

    authors: [
      {
        name:
          SITE_AUTHOR,
      },
    ],

    creator:
      SITE_AUTHOR,

    publisher:
      SITE_AUTHOR,

    /*
    |--------------------------------------------------------------------------
    | Keywords
    |--------------------------------------------------------------------------
    */

    keywords: [
      "computer science",
      "software engineering",
      "programming",
      "artificial intelligence",
      "AI",
      "quantum computing",
      "algorithms",
      "operating systems",
      "developer blog",
      "knowledge base",
    ],

    /*
    |--------------------------------------------------------------------------
    | Canonical / RSS
    |--------------------------------------------------------------------------
    */

    alternates: {
      canonical:
        "/",

      types: {
        "application/rss+xml":
          "/rss.xml",
      },
    },

    /*
    |--------------------------------------------------------------------------
    | Manifest
    |--------------------------------------------------------------------------
    */

    manifest:
      "/manifest.webmanifest",

    /*
    |--------------------------------------------------------------------------
    | Icons
    |--------------------------------------------------------------------------
    |
    | icon.tsx / apple-icon.tsx를
    | Next.js가 자동 생성하지만 명시도 해둔다.
    |
    */

    icons: {
      icon: [
        {
          url:
            "/icon",
        },
      ],

      apple: [
        {
          url:
            "/apple-icon",
        },
      ],
    },

    /*
    |--------------------------------------------------------------------------
    | Open Graph
    |--------------------------------------------------------------------------
    */

    openGraph: {
      type:
        "website",

      locale:
        SITE_LOCALE,

      url:
        "/",

      siteName:
        SITE_NAME,

      title:
        SITE_TITLE,

      description:
        SITE_DESCRIPTION,

      images: [
        {
          url:
            "/opengraph-image",

          width:
            1200,

          height:
            630,

          alt:
            `${SITE_NAME} Knowledge Operating System`,
        },
      ],
    },

    /*
    |--------------------------------------------------------------------------
    | Twitter / X
    |--------------------------------------------------------------------------
    */

    twitter: {
      card:
        "summary_large_image",

      title:
        SITE_TITLE,

      description:
        SITE_DESCRIPTION,

      images: [
        "/opengraph-image",
      ],
    },

    /*
    |--------------------------------------------------------------------------
    | Robots
    |--------------------------------------------------------------------------
    */

    robots: {
      index:
        true,

      follow:
        true,

      googleBot: {
        index:
          true,

        follow:
          true,

        "max-image-preview":
          "large",

        "max-snippet":
          -1,

        "max-video-preview":
          -1,
      },
    },

    /*
    |--------------------------------------------------------------------------
    | Misc
    |--------------------------------------------------------------------------
    */

    category:
      "technology",
  };

/*
|--------------------------------------------------------------------------
| Viewport
|--------------------------------------------------------------------------
|
| Next.js에서는 themeColor를
| Metadata가 아니라 Viewport에서 관리한다.
|
*/

export const viewport: Viewport =
  {
    width:
      "device-width",

    initialScale:
      1,

    maximumScale:
      5,

    viewportFit:
      "cover",

    themeColor:
      SITE_THEME_COLOR,

    colorScheme:
      "dark light",
  };

/*
|--------------------------------------------------------------------------
| Root Layout
|--------------------------------------------------------------------------
*/

export default function RootLayout({
  children,
}: Readonly<{
  children:
    React.ReactNode;
}>) {
  return (
    <html
      lang={
        SITE_LANGUAGE
      }

      suppressHydrationWarning
    >
      <body>
        {children}
      </body>
    </html>
  );
}