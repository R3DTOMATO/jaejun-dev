import {
  getAllPosts,
} from "../../lib/posts";

import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  absoluteUrl,
} from "../../lib/site";

/*
|--------------------------------------------------------------------------
| GET /rss.xml
|--------------------------------------------------------------------------
*/

export function GET() {
  /*
   * RSS에서는
   * 작성 날짜 기준으로
   * 최신 글부터 보여준다.
   */

  const posts =
    [...getAllPosts()].sort(
      (a, b) =>
        b.createdAt.localeCompare(
          a.createdAt
        )
    );

  /*
  |--------------------------------------------------------------------------
  | RSS Items
  |--------------------------------------------------------------------------
  */

  const items =
    posts
      .map(
        (post) => {
          const postUrl =
            absoluteUrl(
              `/posts/${encodeURIComponent(
                post.id
              )}`
            );

          return `
    <item>
      <title>${escapeXml(
        post.title
      )}</title>

      <link>${escapeXml(
        postUrl
      )}</link>

      <guid isPermaLink="true">${escapeXml(
        postUrl
      )}</guid>

      <description>${escapeXml(
        post.description
      )}</description>

      <pubDate>${escapeXml(
        toRssDate(
          post.createdAt
        )
      )}</pubDate>

      <category>${escapeXml(
        post.category
      )}</category>

${post.tags
  .map(
    (tag) =>
      `      <category>${escapeXml(
        tag
      )}</category>`
  )
  .join("\n")}
    </item>`;
        }
      )
      .join("\n");

  /*
  |--------------------------------------------------------------------------
  | Feed Dates
  |--------------------------------------------------------------------------
  */

  const newestPost =
    posts[0];

  const lastBuildDate =
    newestPost
      ? toRssDate(
          newestPost.updatedAt
        )
      : new Date().toUTCString();

  /*
  |--------------------------------------------------------------------------
  | RSS XML
  |--------------------------------------------------------------------------
  */

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss
  version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
>
  <channel>
    <title>${escapeXml(
      SITE_TITLE
    )}</title>

    <link>${escapeXml(
      absoluteUrl("/")
    )}</link>

    <description>${escapeXml(
      SITE_DESCRIPTION
    )}</description>

    <language>ko-KR</language>

    <lastBuildDate>${escapeXml(
      lastBuildDate
    )}</lastBuildDate>

    <atom:link
      href="${escapeXml(
        absoluteUrl(
          "/rss.xml"
        )
      )}"
      rel="self"
      type="application/rss+xml"
    />

    <generator>${escapeXml(
      `${SITE_NAME} Knowledge OS`
    )}</generator>

${items}
  </channel>
</rss>`;

  /*
  |--------------------------------------------------------------------------
  | Response
  |--------------------------------------------------------------------------
  */

  return new Response(
    rss,
    {
      headers: {
        "Content-Type":
          "application/rss+xml; charset=utf-8",

        "Cache-Control":
          "public, max-age=3600, s-maxage=3600",
      },
    }
  );
}

/*
|--------------------------------------------------------------------------
| RSS Date
|--------------------------------------------------------------------------
*/

function toRssDate(
  value: string
) {
  const date =
    new Date(
      value
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return new Date().toUTCString();
  }

  return date.toUTCString();
}

/*
|--------------------------------------------------------------------------
| Escape XML
|--------------------------------------------------------------------------
|
| RSS XML 안에:
|
| &
| <
| >
| "
| '
|
| 등이 들어가 XML 문법을 깨뜨리는 것을 방지한다.
|
*/

function escapeXml(
  value: string
) {
  return value
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&apos;"
    );
}