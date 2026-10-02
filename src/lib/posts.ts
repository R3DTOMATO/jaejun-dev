import fs from "fs";
import path from "path";
import matter from "gray-matter";

import type {
  Post,
  PostStatus,
} from "../types/post";

/*
|--------------------------------------------------------------------------
| Posts Directory
|--------------------------------------------------------------------------
*/

const postsDirectory =
  path.join(
    process.cwd(),
    "src",
    "content",
    "posts"
  );

/*
|--------------------------------------------------------------------------
| Post Status Validation
|--------------------------------------------------------------------------
*/

function isPostStatus(
  value: unknown
): value is PostStatus {
  return (
    value === "Learning" ||
    value === "Understood" ||
    value === "Reviewing" ||
    value === "Deep Dive"
  );
}

/*
|--------------------------------------------------------------------------
| Tags Validation
|--------------------------------------------------------------------------
*/

function normalizeTags(
  value: unknown
): string[] {
  if (
    !Array.isArray(
      value
    )
  ) {
    return [];
  }

  return value
    .filter(
      (
        tag
      ): tag is string =>
        typeof tag ===
          "string"
    )
    .map(
      (tag) =>
        tag.trim()
    )
    .filter(Boolean);
}

/*
|--------------------------------------------------------------------------
| Create Post Description
|--------------------------------------------------------------------------
|
| description front matter가 없을 경우
| Markdown 본문에서 자동으로 생성한다.
|
*/

export function createPostDescription(
  content: string,
  maxLength = 160
): string {
  /*
   * Code Block 제거
   */

  const withoutCodeBlocks =
    content.replace(
      /```[\s\S]*?```/g,
      " "
    );

  /*
   * Markdown Image 제거
   */

  const withoutImages =
    withoutCodeBlocks.replace(
      /!\[[^\]]*\]\([^)]*\)/g,
      " "
    );

  /*
   * Markdown Link
   *
   * [OpenQASM](...)
   *
   * ↓
   *
   * OpenQASM
   */

  const withoutLinks =
    withoutImages.replace(
      /\[([^\]]+)\]\([^)]*\)/g,
      "$1"
    );

  /*
   * Inline Code
   */

  const withoutInlineCode =
    withoutLinks.replace(
      /`([^`]+)`/g,
      "$1"
    );

  /*
   * Markdown Syntax 제거
   */

  const plainText =
    withoutInlineCode
      .replace(
        /[#>*_~]+/g,
        " "
      )
      .replace(
        /^\s*[-+]\s+/gm,
        " "
      )
      .replace(
        /\s+/g,
        " "
      )
      .trim();

  /*
   * 빈 글
   */

  if (!plainText) {
    return "";
  }

  /*
   * 160자 이하
   */

  if (
    plainText.length <=
    maxLength
  ) {
    return plainText;
  }

  /*
   * 최대 길이 제한
   */

  return `${plainText
    .slice(
      0,
      maxLength
    )
    .trim()}...`;
}

/*
|--------------------------------------------------------------------------
| Read Post File
|--------------------------------------------------------------------------
*/

function readPostFile(
  fileName: string
): Post {
  /*
   * algorithms.md
   *
   * ↓
   *
   * algorithms
   */

  const id =
    fileName.replace(
      /\.md$/,
      ""
    );

  /*
   * 실제 파일 위치
   */

  const fullPath =
    path.join(
      postsDirectory,
      fileName
    );

  /*
   * Markdown 원문
   */

  const fileContents =
    fs.readFileSync(
      fullPath,
      "utf8"
    );

  /*
   * Front Matter / Body 분리
   */

  const {
    data,
    content,
  } =
    matter(
      fileContents
    );

  /*
  |--------------------------------------------------------------------------
  | Required Metadata Validation
  |--------------------------------------------------------------------------
  */

  if (
    typeof data.title !==
    "string"
  ) {
    throw new Error(
      `${fileName}: title이 필요합니다.`
    );
  }

  if (
    typeof data.categoryId !==
    "string"
  ) {
    throw new Error(
      `${fileName}: categoryId가 필요합니다.`
    );
  }

  if (
    typeof data.category !==
    "string"
  ) {
    throw new Error(
      `${fileName}: category가 필요합니다.`
    );
  }

  if (
    typeof data.createdAt !==
      "string" ||
    typeof data.updatedAt !==
      "string"
  ) {
    throw new Error(
      `${fileName}: createdAt / updatedAt이 필요합니다.`
    );
  }

  if (
    !isPostStatus(
      data.status
    )
  ) {
    throw new Error(
      `${fileName}: 잘못된 status입니다.`
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Optional Description
  |--------------------------------------------------------------------------
  */

  const description =
    typeof data.description ===
      "string" &&
    data.description.trim()
      ? data.description.trim()
      : createPostDescription(
          content
        );

  /*
  |--------------------------------------------------------------------------
  | Optional Tags
  |--------------------------------------------------------------------------
  */

  const tags =
    normalizeTags(
      data.tags
    );

  /*
  |--------------------------------------------------------------------------
  | Post Object
  |--------------------------------------------------------------------------
  */

  return {
    id,

    title:
      data.title,

    description,

    categoryId:
      data.categoryId,

    category:
      data.category,

    tags,

    createdAt:
      data.createdAt,

    updatedAt:
      data.updatedAt,

    status:
      data.status,

    content,
  };
}

/*
|--------------------------------------------------------------------------
| Get All Posts
|--------------------------------------------------------------------------
*/

export function getAllPosts(): Post[] {
  /*
   * 디렉터리가 없으면
   * 빈 배열 반환
   */

  if (
    !fs.existsSync(
      postsDirectory
    )
  ) {
    return [];
  }

  /*
   * Files
   */

  const fileNames =
    fs.readdirSync(
      postsDirectory
    );

  /*
   * Markdown만 사용
   */

  const markdownFiles =
    fileNames.filter(
      (fileName) =>
        fileName
          .toLowerCase()
          .endsWith(
            ".md"
          )
    );

  /*
   * Markdown → Post
   */

  const posts =
    markdownFiles.map(
      readPostFile
    );

  /*
   * 최근 수정된 글부터
   */

  return posts.sort(
    (a, b) =>
      b.updatedAt.localeCompare(
        a.updatedAt
      )
  );
}

/*
|--------------------------------------------------------------------------
| Get Post By ID
|--------------------------------------------------------------------------
*/

export function getPostById(
  id: string
): Post | undefined {
  return getAllPosts().find(
    (post) =>
      post.id === id
  );
}