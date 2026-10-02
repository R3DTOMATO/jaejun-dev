import type {
  Metadata,
} from "next";

import {
  notFound,
} from "next/navigation";

import KnowledgeOS from "../../../components/system/KnowledgeOS";

import {
  getAllPosts,
  getPostById,
} from "../../../lib/posts";

import {
  SITE_AUTHOR,
  SITE_NAME,
  absoluteUrl,
} from "../../../lib/site";

/*
|--------------------------------------------------------------------------
| Props
|--------------------------------------------------------------------------
*/

type PostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

/*
|--------------------------------------------------------------------------
| Generate Static Params
|--------------------------------------------------------------------------
|
| Markdown 파일을 기반으로
| Next.js가 글 URL들을 미리 알 수 있게 한다.
|
*/

export function generateStaticParams() {
  const posts =
    getAllPosts();

  return posts.map(
    (post) => ({
      slug:
        post.id,
    })
  );
}

/*
|--------------------------------------------------------------------------
| Generate Metadata
|--------------------------------------------------------------------------
*/

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const {
    slug,
  } =
    await params;

  const post =
    getPostById(
      slug
    );

  /*
   * 없는 글
   */

  if (!post) {
    return {
      title:
        "Post Not Found",

      robots: {
        index:
          false,

        follow:
          false,
      },
    };
  }

  /*
   * Canonical Path
   */

  const postPath =
    `/posts/${encodeURIComponent(
      post.id
    )}`;

  /*
   * Absolute URL
   */

  const postUrl =
    absoluteUrl(
      postPath
    );

  /*
  |--------------------------------------------------------------------------
  | Metadata
  |--------------------------------------------------------------------------
  */

  return {
    /*
     * Root layout의 template:
     *
     * %s | Jaejun.dev
     *
     * 가 자동 적용됨
     */

    title:
      post.title,

    description:
      post.description,

    /*
     * Tags
     */

    keywords:
      post.tags,

    /*
     * Author
     */

    authors: [
      {
        name:
          SITE_AUTHOR,
      },
    ],

    /*
     * Canonical
     */

    alternates: {
      canonical:
        postPath,
    },

    /*
     * Open Graph
     */

    openGraph: {
      type:
        "article",

      url:
        postUrl,

      siteName:
        SITE_NAME,

      title:
        post.title,

      description:
        post.description,

      publishedTime:
        toIsoDate(
          post.createdAt
        ),

      modifiedTime:
        toIsoDate(
          post.updatedAt
        ),

      section:
        post.category,

      tags:
        post.tags,

      authors: [
        SITE_AUTHOR,
      ],
    },

    /*
     * Twitter / X
     */

    twitter: {
      card:
        "summary",

      title:
        post.title,

      description:
        post.description,
    },
  };
}

/*
|--------------------------------------------------------------------------
| Page
|--------------------------------------------------------------------------
*/

export default async function PostPage({
  params,
}: PostPageProps) {
  const {
    slug,
  } =
    await params;

  /*
   * 해당 Markdown 존재 확인
   */

  const post =
    getPostById(
      slug
    );

  if (!post) {
    notFound();
  }

  /*
   * Knowledge OS 전체에
   * 필요한 글 데이터
   */

  const posts =
    getAllPosts();

  return (
    <KnowledgeOS
      posts={
        posts
      }
    />
  );
}

/*
|--------------------------------------------------------------------------
| Date → ISO
|--------------------------------------------------------------------------
|
| 2026-10-02
|
| ↓
|
| 2026-10-02T00:00:00.000Z
|
*/

function toIsoDate(
  value: string
) {
  const date =
    new Date(
      value
    );

  /*
   * 날짜가 잘못됐다면
   * 원래 값 유지
   */

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return date.toISOString();
}