import type {
  MetadataRoute,
} from "next";

import {
  absoluteUrl,
} from "../lib/site";

/*
|--------------------------------------------------------------------------
| robots.txt
|--------------------------------------------------------------------------
*/

export default function robots(): MetadataRoute.Robots {
  return {
    /*
     * 모든 정상 페이지
     * 검색 엔진 크롤링 허용
     */

    rules: {
      userAgent:
        "*",

      allow:
        "/",
    },

    /*
     * Sitemap 위치
     */

    sitemap:
      absoluteUrl(
        "/sitemap.xml"
      ),
  };
}