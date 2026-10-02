import type {
  MetadataRoute,
} from "next";

import {
  getAllPosts,
} from "../lib/posts";

import {
  absoluteUrl,
} from "../lib/site";

/*
|--------------------------------------------------------------------------
| Sitemap
|--------------------------------------------------------------------------
*/

export default function sitemap(): MetadataRoute.Sitemap {
  const posts =
    getAllPosts();

  /*
  |--------------------------------------------------------------------------
  | Home
  |--------------------------------------------------------------------------
  */

  const home: MetadataRoute.Sitemap[number] =
    {
      url:
        absoluteUrl(
          "/"
        ),

      lastModified:
        new Date(),

      changeFrequency:
        "weekly",

      priority:
        1,
    };

  /*
  |--------------------------------------------------------------------------
  | Posts
  |--------------------------------------------------------------------------
  */

  const postPages: MetadataRoute.Sitemap =
    posts.map(
      (post) => ({
        url:
          absoluteUrl(
            `/posts/${encodeURIComponent(
              post.id
            )}`
          ),

        lastModified:
          post.updatedAt,

        changeFrequency:
          "monthly",

        priority:
          0.8,
      })
    );

  /*
  |--------------------------------------------------------------------------
  | Result
  |--------------------------------------------------------------------------
  */

  return [
    home,

    ...postPages,
  ];
}