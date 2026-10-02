import type {
  MetadataRoute,
} from "next";

import {
  SITE_BACKGROUND_COLOR,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_THEME_COLOR,
} from "../lib/site";

/*
|--------------------------------------------------------------------------
| Web App Manifest
|--------------------------------------------------------------------------
*/

export default function manifest(): MetadataRoute.Manifest {
  return {
    name:
      `${SITE_NAME} — Knowledge Operating System`,

    short_name:
      SITE_NAME,

    description:
      SITE_DESCRIPTION,

    start_url:
      "/",

    scope:
      "/",

    display:
      "standalone",

    background_color:
      SITE_BACKGROUND_COLOR,

    theme_color:
      SITE_THEME_COLOR,

    orientation:
      "any",

    categories: [
      "education",
      "productivity",
      "developer",
    ],

    icons: [
      {
        src:
          "/icon",

        sizes:
          "512x512",

        type:
          "image/png",
      },

      {
        src:
          "/icon",

        sizes:
          "512x512",

        type:
          "image/png",

        purpose:
          "maskable",
      },
    ],
  };
}