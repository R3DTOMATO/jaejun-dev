/*
|--------------------------------------------------------------------------
| Site Identity
|--------------------------------------------------------------------------
*/

export const SITE_NAME =
  "Jaejun.dev";

export const SITE_TITLE =
  "Jaejun.dev — Knowledge Operating System";

export const SITE_DESCRIPTION =
  "Computer science, software engineering, AI, quantum computing, and projects documented inside a personal Knowledge Operating System.";

export const SITE_AUTHOR =
  "Jaejun";

/*
|--------------------------------------------------------------------------
| Site URL
|--------------------------------------------------------------------------
|
| Local:
|
| http://localhost:3000
|
| Production:
|
| NEXT_PUBLIC_SITE_URL=https://jaejun.dev
|
*/

const rawSiteUrl =
  process.env
    .NEXT_PUBLIC_SITE_URL ??
  "http://localhost:3000";

/*
 * 마지막 slash 제거
 */

export const SITE_URL =
  rawSiteUrl.replace(
    /\/+$/,
    ""
  );

/*
|--------------------------------------------------------------------------
| Absolute URL
|--------------------------------------------------------------------------
*/

export function absoluteUrl(
  pathname = "/"
) {
  return new URL(
    pathname,
    `${SITE_URL}/`
  ).toString();
}

/*
|--------------------------------------------------------------------------
| Social Metadata
|--------------------------------------------------------------------------
*/

export const SITE_LOCALE =
  "ko_KR";

export const SITE_LANGUAGE =
  "ko-KR";

/*
|--------------------------------------------------------------------------
| Theme
|--------------------------------------------------------------------------
*/

export const SITE_THEME_COLOR =
  "#050812";

export const SITE_BACKGROUND_COLOR =
  "#050812";