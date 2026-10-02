import KnowledgeOS from "../components/system/KnowledgeOS";

import {
  getAllPosts,
} from "../lib/posts";

export default function Home() {
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