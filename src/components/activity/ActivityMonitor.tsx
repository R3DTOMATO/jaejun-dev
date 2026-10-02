"use client";

import {
  useMemo,
} from "react";

import AppIcon from "../../components/icons/AppIcon";

import type {
  Post,
  PostStatus,
} from "../../types/post";

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

type ActivityMonitorProps = {
  posts: Post[];

  onOpenPost: (
    postId: string,
    title: string
  ) => void;
};

type CategoryStat = {
  id: string;

  name: string;

  count: number;

  percentage: number;
};

type StatusStat = {
  status: PostStatus;

  count: number;

  percentage: number;
};

type TagStat = {
  tag: string;

  count: number;
};

/*
|--------------------------------------------------------------------------
| Status Order
|--------------------------------------------------------------------------
*/

const STATUS_ORDER: PostStatus[] = [
  "Learning",
  "Reviewing",
  "Understood",
  "Deep Dive",
];

/*
|--------------------------------------------------------------------------
| Activity Monitor
|--------------------------------------------------------------------------
*/

export default function ActivityMonitor({
  posts,
  onOpenPost,
}: ActivityMonitorProps) {
  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */

  const statistics =
    useMemo(() => {
      /*
      |--------------------------------------------------------------------------
      | Categories
      |--------------------------------------------------------------------------
      */

      const categoryMap =
        new Map<
          string,
          {
            name: string;
            count: number;
          }
        >();

      for (
        const post of posts
      ) {
        const current =
          categoryMap.get(
            post.categoryId
          );

        if (current) {
          current.count += 1;
        } else {
          categoryMap.set(
            post.categoryId,
            {
              name:
                post.category,

              count:
                1,
            }
          );
        }
      }

      const categoryStats: CategoryStat[] =
        Array.from(
          categoryMap.entries()
        )
          .map(
            ([
              id,
              value,
            ]) => ({
              id,

              name:
                value.name,

              count:
                value.count,

              percentage:
                posts.length === 0
                  ? 0
                  : Math.round(
                      (
                        value.count /
                        posts.length
                      ) *
                        100
                    ),
            })
          )
          .sort(
            (a, b) =>
              b.count -
              a.count
          );

      /*
      |--------------------------------------------------------------------------
      | Status
      |--------------------------------------------------------------------------
      */

      const statusStats: StatusStat[] =
        STATUS_ORDER.map(
          (status) => {
            const count =
              posts.filter(
                (post) =>
                  post.status ===
                  status
              ).length;

            return {
              status,

              count,

              percentage:
                posts.length === 0
                  ? 0
                  : Math.round(
                      (
                        count /
                        posts.length
                      ) *
                        100
                    ),
            };
          }
        );

      /*
      |--------------------------------------------------------------------------
      | Tags
      |--------------------------------------------------------------------------
      */

      const tagMap =
        new Map<
          string,
          number
        >();

      for (
        const post of posts
      ) {
        for (
          const tag of post.tags
        ) {
          tagMap.set(
            tag,
            (
              tagMap.get(
                tag
              ) ?? 0
            ) + 1
          );
        }
      }

      const tagStats: TagStat[] =
        Array.from(
          tagMap.entries()
        )
          .map(
            ([
              tag,
              count,
            ]) => ({
              tag,

              count,
            })
          )
          .sort(
            (a, b) => {
              if (
                b.count !==
                a.count
              ) {
                return (
                  b.count -
                  a.count
                );
              }

              return a.tag.localeCompare(
                b.tag
              );
            }
          );

      /*
      |--------------------------------------------------------------------------
      | Recent Posts
      |--------------------------------------------------------------------------
      */

      const recentPosts =
        [...posts]
          .sort(
            (a, b) =>
              b.updatedAt.localeCompare(
                a.updatedAt
              )
          )
          .slice(
            0,
            6
          );

      /*
      |--------------------------------------------------------------------------
      | Latest Update
      |--------------------------------------------------------------------------
      */

      const latestUpdate =
        recentPosts[0]
          ?.updatedAt ??
        null;

      return {
        categoryStats,

        statusStats,

        tagStats,

        recentPosts,

        latestUpdate,

        categoryCount:
          categoryMap.size,

        tagCount:
          tagMap.size,
      };
    }, [
      posts,
    ]);

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <div
      className="
        h-full
        min-h-0
        overflow-y-auto
        text-[var(--os-text)]

        md:max-h-[68vh]
      "
    >
      {/* Header */}

      <header
        className="
          mb-6
          border-b
          border-[var(--os-border)]
          pb-5
        "
      >
        <div
          className="
            flex
            items-start
            gap-3
          "
        >
          <AppIcon
            type="activity"

            className="
              h-11
              w-11
              shrink-0
              text-emerald-500
            "
          />

          <div>
            <h1
              className="
                text-xl
                font-semibold
              "
            >
              Activity Monitor
            </h1>

            <p
              className="
                mt-1
                text-sm
                leading-6
                text-[var(--os-muted)]
              "
            >
              Overview of your Knowledge OS
              learning activity.
            </p>
          </div>
        </div>
      </header>

      {/* Summary */}

      <section
        className="
          grid
          grid-cols-2
          gap-3

          lg:grid-cols-4
        "
      >
        <SummaryCard
          label="Posts"

          value={
            String(
              posts.length
            )
          }

          detail="Knowledge files"
        />

        <SummaryCard
          label="Categories"

          value={
            String(
              statistics.categoryCount
            )
          }

          detail="Study areas"
        />

        <SummaryCard
          label="Tags"

          value={
            String(
              statistics.tagCount
            )
          }

          detail="Knowledge connections"
        />

        <SummaryCard
          label="Last update"

          value={
            statistics.latestUpdate
              ? formatShortDate(
                  statistics.latestUpdate
                )
              : "—"
          }

          detail="Latest modification"
        />
      </section>

      {/* Main Statistics */}

      <div
        className="
          mt-6
          grid
          grid-cols-1
          gap-4

          lg:grid-cols-2
        "
      >
        {/* Categories */}

        <Panel
          title="Categories"

          description="Distribution of knowledge by study area."
        >
          {statistics
            .categoryStats
            .length ===
          0 ? (
            <EmptyState>
              No category data.
            </EmptyState>
          ) : (
            <div
              className="
                space-y-4
              "
            >
              {statistics.categoryStats.map(
                (
                  category
                ) => (
                  <MetricBar
                    key={
                      category.id
                    }

                    label={
                      category.name
                    }

                    value={
                      category.count
                    }

                    percentage={
                      category.percentage
                    }
                  />
                )
              )}
            </div>
          )}
        </Panel>

        {/* Status */}

        <Panel
          title="Learning status"

          description="Current state of your study notes."
        >
          <div
            className="
              space-y-4
            "
          >
            {statistics.statusStats.map(
              (
                status
              ) => (
                <MetricBar
                  key={
                    status.status
                  }

                  label={
                    status.status
                  }

                  value={
                    status.count
                  }

                  percentage={
                    status.percentage
                  }
                />
              )
            )}
          </div>
        </Panel>
      </div>

      {/* Recent Activity */}

      <div
        className="
          mt-4
          grid
          grid-cols-1
          gap-4

          lg:grid-cols-[1.4fr_1fr]
        "
      >
        <Panel
          title="Recent activity"

          description="Recently updated knowledge files."
        >
          {statistics
            .recentPosts
            .length ===
          0 ? (
            <EmptyState>
              No posts yet.
            </EmptyState>
          ) : (
            <div
              className="
                space-y-1
              "
            >
              {statistics.recentPosts.map(
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
                      group
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-xl
                      p-3
                      text-left
                      transition

                      active:bg-[var(--os-panel-soft)]

                      md:hover:bg-[var(--os-panel-soft)]
                    "
                  >
                    <AppIcon
                      type="post"

                      className="
                        h-9
                        w-9
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
                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          gap-3
                        "
                      >
                        <p
                          className="
                            truncate
                            text-sm
                            font-medium
                          "
                        >
                          {
                            post.title
                          }
                        </p>

                        <span
                          className="
                            shrink-0
                            text-[11px]
                            text-[var(--os-muted)]
                          "
                        >
                          {formatShortDate(
                            post.updatedAt
                          )}
                        </span>
                      </div>

                      <div
                        className="
                          mt-1
                          flex
                          items-center
                          gap-2
                          text-xs
                          text-[var(--os-muted)]
                        "
                      >
                        <span>
                          {
                            post.category
                          }
                        </span>

                        <span>
                          ·
                        </span>

                        <span>
                          {
                            post.status
                          }
                        </span>
                      </div>
                    </div>
                  </button>
                )
              )}
            </div>
          )}
        </Panel>

        {/* Top Tags */}

        <Panel
          title="Top tags"

          description="Most frequently used knowledge tags."
        >
          {statistics
            .tagStats
            .length ===
          0 ? (
            <EmptyState>
              Add tags to your Markdown posts.
            </EmptyState>
          ) : (
            <div
              className="
                flex
                flex-wrap
                gap-2
              "
            >
              {statistics.tagStats
                .slice(
                  0,
                  12
                )
                .map(
                  (
                    tag,
                    index
                  ) => (
                    <div
                      key={
                        tag.tag
                      }

                      className="
                        flex
                        items-center
                        gap-2
                        rounded-full
                        border
                        border-[var(--os-border)]
                        bg-[var(--os-panel-soft)]
                        px-3
                        py-2
                      "
                    >
                      <span
                        className="
                          text-xs
                          text-[var(--os-text)]
                        "
                      >
                        #
                        {
                          tag.tag
                        }
                      </span>

                      <span
                        className="
                          rounded-full
                          bg-[var(--os-accent)]
                          px-1.5
                          py-0.5
                          text-[10px]
                          text-white
                        "
                      >
                        {
                          tag.count
                        }
                      </span>

                      {index ===
                        0 && (
                        <span
                          className="
                            text-[10px]
                            text-[var(--os-muted)]
                          "
                        >
                          top
                        </span>
                      )}
                    </div>
                  )
                )}
            </div>
          )}
        </Panel>
      </div>

      {/* Completion */}

      <Panel
        className="
          mt-4
        "

        title="Knowledge progress"

        description="How much of the current knowledge base has moved beyond the initial Learning state."
      >
        <KnowledgeProgress
          posts={
            posts
          }
        />
      </Panel>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Summary Card
|--------------------------------------------------------------------------
*/

function SummaryCard({
  label,
  value,
  detail,
}: {
  label: string;

  value: string;

  detail: string;
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-[var(--os-border)]
        bg-[var(--os-panel-soft)]
        p-4
      "
    >
      <p
        className="
          text-xs
          text-[var(--os-muted)]
        "
      >
        {label}
      </p>

      <p
        className="
          mt-2
          truncate
          text-2xl
          font-semibold
          tabular-nums
        "
      >
        {value}
      </p>

      <p
        className="
          mt-1
          text-[11px]
          text-[var(--os-muted)]
        "
      >
        {detail}
      </p>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Panel
|--------------------------------------------------------------------------
*/

function Panel({
  title,
  description,
  children,
  className = "",
}: {
  title: string;

  description: string;

  children:
    React.ReactNode;

  className?: string;
}) {
  return (
    <section
      className={`
        rounded-2xl
        border
        border-[var(--os-border)]
        bg-[var(--os-panel-soft)]
        p-4

        ${className}
      `}
    >
      <div
        className="
          mb-4
        "
      >
        <h2
          className="
            text-sm
            font-semibold
          "
        >
          {title}
        </h2>

        <p
          className="
            mt-1
            text-xs
            leading-5
            text-[var(--os-muted)]
          "
        >
          {description}
        </p>
      </div>

      {children}
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Metric Bar
|--------------------------------------------------------------------------
*/

function MetricBar({
  label,
  value,
  percentage,
}: {
  label: string;

  value: number;

  percentage: number;
}) {
  return (
    <div>
      <div
        className="
          mb-2
          flex
          items-center
          justify-between
          gap-3
        "
      >
        <span
          className="
            truncate
            text-sm
          "
        >
          {label}
        </span>

        <span
          className="
            shrink-0
            font-mono
            text-xs
            text-[var(--os-muted)]
          "
        >
          {value}
          {" · "}
          {percentage}%
        </span>
      </div>

      <div
        className="
          h-2
          overflow-hidden
          rounded-full
          bg-[var(--os-border)]
        "
      >
        <div
          className="
            h-full
            rounded-full
            bg-[var(--os-accent)]
            transition-[width]
            duration-300
          "

          style={{
            width:
              `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Knowledge Progress
|--------------------------------------------------------------------------
*/

function KnowledgeProgress({
  posts,
}: {
  posts: Post[];
}) {
  const progressed =
    posts.filter(
      (post) =>
        post.status !==
        "Learning"
    ).length;

  const percentage =
    posts.length === 0
      ? 0
      : Math.round(
          (
            progressed /
            posts.length
          ) *
            100
        );

  return (
    <div>
      <div
        className="
          flex
          items-end
          justify-between
          gap-4
        "
      >
        <div>
          <p
            className="
              text-3xl
              font-semibold
              tabular-nums
            "
          >
            {percentage}%
          </p>

          <p
            className="
              mt-1
              text-xs
              text-[var(--os-muted)]
            "
          >
            {progressed} of{" "}
            {posts.length} posts
            beyond Learning
          </p>
        </div>

        <p
          className="
            text-right
            text-xs
            text-[var(--os-muted)]
          "
        >
          Reviewing
          <br />
          Understood
          <br />
          Deep Dive
        </p>
      </div>

      <div
        className="
          mt-4
          h-3
          overflow-hidden
          rounded-full
          bg-[var(--os-border)]
        "
      >
        <div
          className="
            h-full
            rounded-full
            bg-[var(--os-accent)]
            transition-[width]
            duration-300
          "

          style={{
            width:
              `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Empty State
|--------------------------------------------------------------------------
*/

function EmptyState({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <div
      className="
        py-8
        text-center
        text-sm
        text-[var(--os-muted)]
      "
    >
      {children}
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Date Formatting
|--------------------------------------------------------------------------
*/

function formatShortDate(
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
    return value;
  }

  return new Intl.DateTimeFormat(
    "ko-KR",
    {
      month:
        "short",

      day:
        "numeric",
    }
  ).format(
    date
  );
}