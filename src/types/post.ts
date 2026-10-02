/*
|--------------------------------------------------------------------------
| Post Status
|--------------------------------------------------------------------------
*/

export type PostStatus =
  | "Learning"
  | "Understood"
  | "Reviewing"
  | "Deep Dive";

/*
|--------------------------------------------------------------------------
| Post
|--------------------------------------------------------------------------
*/

export type Post = {
  /*
   * Markdown 파일 이름
   *
   * qubit.md
   *
   * ↓
   *
   * id = "qubit"
   */

  id: string;

  /*
   * 글 제목
   */

  title: string;

  /*
   * SEO / 검색 / RSS용 설명
   *
   * Markdown front matter에 description이 없으면
   * posts.ts가 본문에서 자동 생성한다.
   */

  description: string;

  /*
   * Category
   */

  categoryId: string;

  category: string;

  /*
   * Tags
   *
   * 예:
   *
   * [
   *   "quantum-computing",
   *   "qubit"
   * ]
   */

  tags: string[];

  /*
   * Dates
   */

  createdAt: string;

  updatedAt: string;

  /*
   * Learning Status
   */

  status: PostStatus;

  /*
   * Markdown Body
   */

  content: string;
};