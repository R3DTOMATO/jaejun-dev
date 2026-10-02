import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type {
  Post,
} from "../../types/post";

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

type PostContentProps = {
  post: Post;
};

/*
|--------------------------------------------------------------------------
| Post Content
|--------------------------------------------------------------------------
*/

export default function PostContent({
  post,
}: PostContentProps) {
  return (
    <article
      className="
        mx-auto
        w-full
        max-w-3xl
        text-[var(--os-text)]

        md:max-h-[65vh]
        md:overflow-y-auto
        md:pr-3
      "
    >
      {/* Header */}

      <header
        className="
          mb-6
          border-b
          border-[var(--os-border)]
          pb-5

          md:mb-7
        "
      >
        {/* Path */}

        <p
          className="
            mb-2
            break-all
            font-mono
            text-xs
            text-[var(--os-accent)]
          "
        >
          /knowledge/
          {post.categoryId}/
          {post.id}.md
        </p>

        {/* Title */}

        <h1
          className="
            text-2xl
            font-semibold
            leading-tight

            sm:text-3xl
          "
        >
          {
            post.title
          }
        </h1>

        {/* Description */}

        {post.description && (
          <p
            className="
              mt-3
              text-sm
              leading-6
              text-[var(--os-muted)]
            "
          >
            {
              post.description
            }
          </p>
        )}

        {/* Metadata */}

        <div
          className="
            mt-4
            flex
            flex-wrap
            gap-x-4
            gap-y-2
            text-xs
            text-[var(--os-muted)]

            sm:text-sm
          "
        >
          <span>
            Created:{" "}
            {
              post.createdAt
            }
          </span>

          <span>
            Updated:{" "}
            {
              post.updatedAt
            }
          </span>

          <span>
            Status:{" "}
            {
              post.status
            }
          </span>
        </div>

        {/* Tags */}

        {post.tags.length >
          0 && (
          <div
            className="
              mt-4
              flex
              flex-wrap
              gap-2
            "
          >
            {post.tags.map(
              (tag) => (
                <span
                  key={
                    tag
                  }

                  className="
                    rounded-full
                    border
                    border-[var(--os-border)]
                    bg-[var(--os-panel-soft)]
                    px-2.5
                    py-1
                    text-xs
                    text-[var(--os-muted)]
                  "
                >
                  #{tag}
                </span>
              )
            )}
          </div>
        )}
      </header>

      {/* Markdown */}

      <ReactMarkdown
        remarkPlugins={[
          remarkGfm,
        ]}

        components={{
          h1: ({
            children,
          }) => (
            <h1
              className="
                mb-4
                mt-8
                text-2xl
                font-semibold
              "
            >
              {children}
            </h1>
          ),

          h2: ({
            children,
          }) => (
            <h2
              className="
                mb-3
                mt-7
                text-xl
                font-semibold
              "
            >
              {children}
            </h2>
          ),

          h3: ({
            children,
          }) => (
            <h3
              className="
                mb-2
                mt-6
                text-lg
                font-semibold
              "
            >
              {children}
            </h3>
          ),

          p: ({
            children,
          }) => (
            <p
              className="
                mb-4
                break-words
                text-[15px]
                leading-7
                text-[var(--os-text)]

                sm:text-base
              "
            >
              {children}
            </p>
          ),

          ul: ({
            children,
          }) => (
            <ul
              className="
                mb-5
                list-disc
                space-y-2
                pl-5
                leading-7
                text-[var(--os-text)]

                sm:pl-6
              "
            >
              {children}
            </ul>
          ),

          ol: ({
            children,
          }) => (
            <ol
              className="
                mb-5
                list-decimal
                space-y-2
                pl-5
                leading-7
                text-[var(--os-text)]

                sm:pl-6
              "
            >
              {children}
            </ol>
          ),

          blockquote: ({
            children,
          }) => (
            <blockquote
              className="
                my-5
                border-l-4
                border-[var(--os-accent)]
                bg-[var(--os-panel-soft)]
                px-4
                py-3
                text-[var(--os-muted)]
              "
            >
              {children}
            </blockquote>
          ),

          code: ({
            children,
          }) => (
            <code
              className="
                break-words
                rounded
                bg-[var(--os-panel-soft)]
                px-1.5
                py-1
                font-mono
                text-[0.875em]
                text-[var(--os-accent)]
              "
            >
              {children}
            </code>
          ),

          pre: ({
            children,
          }) => (
            <pre
              className="
                my-5
                max-w-full
                overflow-x-auto
                rounded-xl
                border
                border-[var(--os-border)]
                bg-[var(--os-panel-soft)]
                p-3
                font-mono
                text-sm

                sm:p-4
              "
            >
              {children}
            </pre>
          ),

          a: ({
            children,
            href,
          }) => (
            <a
              href={
                href
              }

              target="_blank"

              rel="noreferrer"

              className="
                break-words
                text-[var(--os-accent)]
                underline
                underline-offset-4
              "
            >
              {children}
            </a>
          ),

          table: ({
            children,
          }) => (
            <div
              className="
                my-5
                max-w-full
                overflow-x-auto
              "
            >
              <table
                className="
                  min-w-full
                  border-collapse
                  text-sm
                "
              >
                {children}
              </table>
            </div>
          ),

          th: ({
            children,
          }) => (
            <th
              className="
                border
                border-[var(--os-border)]
                bg-[var(--os-panel-soft)]
                px-3
                py-2
                text-left
              "
            >
              {children}
            </th>
          ),

          td: ({
            children,
          }) => (
            <td
              className="
                border
                border-[var(--os-border)]
                px-3
                py-2
              "
            >
              {children}
            </td>
          ),
        }}
      >
        {
          post.content
        }
      </ReactMarkdown>
    </article>
  );
}