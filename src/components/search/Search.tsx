"use client";

import {
  useMemo,
  useRef,
  useState,
} from "react";

import AppIcon from "../../components/icons/AppIcon";

import type {
  Post,
} from "../../types/post";

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

type SearchProps = {
  posts: Post[];

  onOpenPost: (
    postId: string,
    title: string
  ) => void;
};

/*
|--------------------------------------------------------------------------
| Search
|--------------------------------------------------------------------------
*/

export default function Search({
  posts,
  onOpenPost,
}: SearchProps) {
  const [
    query,
    setQuery,
  ] =
    useState("");

  const inputRef =
    useRef<HTMLInputElement | null>(
      null
    );

  /*
  |--------------------------------------------------------------------------
  | Search Results
  |--------------------------------------------------------------------------
  */

  const searchResults =
    useMemo(() => {
      const normalized =
        query
          .trim()
          .toLowerCase();

      if (!normalized) {
        return posts;
      }

      return posts.filter(
        (post) =>
          [
            post.title,

            post.description,

            post.category,

            post.categoryId,

            ...post.tags,

            post.content,
          ]
            .join(" ")
            .toLowerCase()
            .includes(
              normalized
            )
      );
    }, [
      posts,
      query,
    ]);

  return (
    <div
      className="
        flex
        h-full
        min-h-0
        flex-col
        text-[var(--os-text)]

        md:min-h-[420px]
      "
    >
      {/* Search Header */}

      <div
        className="
          shrink-0
          border-b
          border-[var(--os-border)]
          pb-4
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
            rounded-xl
            border
            border-[var(--os-border)]
            bg-[var(--os-panel-soft)]
            px-4
            py-3
          "
        >
          <AppIcon
            type="search"

            className="
              h-5
              w-5
              shrink-0
              text-violet-500
            "
          />

          <input
            ref={
              inputRef
            }

            autoFocus

            value={
              query
            }

            onChange={(
              event
            ) =>
              setQuery(
                event.target.value
              )
            }

            placeholder="Search knowledge..."

            spellCheck={
              false
            }

            className="
              min-w-0
              flex-1
              bg-transparent
              text-base
              text-[var(--os-text)]
              outline-none
              placeholder:text-[var(--os-muted)]

              md:text-sm
            "
          />

          {query && (
            <button
              type="button"

              onClick={() => {
                setQuery("");

                inputRef.current?.focus();
              }}

              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-lg
                text-[var(--os-muted)]
                transition
                active:bg-[var(--os-panel-soft)]

                md:hover:text-[var(--os-text)]
              "
            >
              ×
            </button>
          )}
        </div>

        <p
          className="
            mt-3
            text-xs
            text-[var(--os-muted)]
          "
        >
          {searchResults.length} result
          {searchResults.length ===
          1
            ? ""
            : "s"}
        </p>
      </div>

      {/* Results */}

      <div
        className="
          min-h-0
          flex-1
          overflow-y-auto
          pt-3

          md:pt-4
        "
      >
        {searchResults.length ===
        0 ? (
          <div
            className="
              flex
              min-h-64
              flex-col
              items-center
              justify-center
              text-center
            "
          >
            <AppIcon
              type="search"

              className="
                mb-3
                h-10
                w-10
                text-[var(--os-muted)]
                opacity-30
              "
            />

            <p
              className="
                text-sm
                text-[var(--os-muted)]
              "
            >
              No results for
              &nbsp;&quot;
              {query}
              &quot;
            </p>
          </div>
        ) : (
          <div
            className="
              space-y-1

              md:space-y-2
            "
          >
            {searchResults.map(
              (post) => (
                <button
                  type="button"

                  key={
                    post.id
                  }

                  onClick={() =>
                    onOpenPost(
                      post.id,
                      post.title
                    )
                  }

                  className="
                    flex
                    min-h-20
                    w-full
                    gap-3
                    rounded-xl
                    border
                    border-transparent
                    p-3
                    text-left
                    transition

                    active:bg-[var(--os-panel-soft)]

                    md:p-4
                    md:hover:border-[var(--os-border)]
                    md:hover:bg-[var(--os-panel-soft)]
                  "
                >
                  <AppIcon
                    type="post"

                    className="
                      h-10
                      w-10
                      shrink-0
                      text-slate-400
                    "
                  />

                  <div
                    className="
                      min-w-0
                      flex-1
                    "
                  >
                    <h3
                      className="
                        truncate
                        text-sm
                        font-medium
                      "
                    >
                      {
                        post.title
                      }
                    </h3>

                    <p
                      className="
                        mt-1
                        text-xs
                        text-[var(--os-accent)]
                      "
                    >
                      {
                        post.category
                      }
                    </p>

                    <p
                      className="
                        mt-2
                        line-clamp-2
                        text-sm
                        leading-6
                        text-[var(--os-muted)]
                      "
                    >
                      {post.description ||
                        createExcerpt(
                          post.content
                        )}
                    </p>
                  </div>
                </button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Excerpt
|--------------------------------------------------------------------------
*/

function createExcerpt(
  markdown: string
) {
  const text =
    markdown
      .replace(
        /```[\s\S]*?```/g,
        " "
      )
      .replace(
        /!\[[^\]]*\]\([^)]*\)/g,
        " "
      )
      .replace(
        /\[([^\]]+)\]\([^)]*\)/g,
        "$1"
      )
      .replace(
        /`([^`]+)`/g,
        "$1"
      )
      .replace(
        /[#>*_~]/g,
        " "
      )
      .replace(
        /\s+/g,
        " "
      )
      .trim();

  if (
    text.length <= 160
  ) {
    return text;
  }

  return `${text.slice(
    0,
    160
  )}...`;
}