"use client";

import {
  useMemo,
  useState,
} from "react";

import AppIcon from "../../components/icons/AppIcon";

import type {
  Post,
} from "../../types/post";

/*
|--------------------------------------------------------------------------
| Constants
|--------------------------------------------------------------------------
*/

const GRAPH_WIDTH =
  1000;

const GRAPH_HEIGHT =
  680;

const GRAPH_CENTER_X =
  GRAPH_WIDTH / 2;

const GRAPH_CENTER_Y =
  GRAPH_HEIGHT / 2;

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

type KnowledgeGraphProps = {
  posts: Post[];

  onOpenPost: (
    postId: string,
    title: string
  ) => void;
};

type CategoryInfo = {
  id: string;

  name: string;
};

type CategoryNode = {
  id: string;

  kind: "category";

  categoryId: string;

  label: string;

  x: number;

  y: number;
};

type PostNode = {
  id: string;

  kind: "post";

  postId: string;

  label: string;

  categoryId: string;

  x: number;

  y: number;
};

type GraphNode =
  | CategoryNode
  | PostNode;

type GraphEdge = {
  id: string;

  sourceId: string;

  targetId: string;

  kind:
    | "category"
    | "tag";

  label?: string;
};

type SelectedNode =
  | {
      kind:
        "category";

      categoryId:
        string;
    }
  | {
      kind:
        "post";

      postId:
        string;
    }
  | null;

/*
|--------------------------------------------------------------------------
| Knowledge Graph
|--------------------------------------------------------------------------
*/

export default function KnowledgeGraph({
  posts,
  onOpenPost,
}: KnowledgeGraphProps) {
  /*
  |--------------------------------------------------------------------------
  | Category Filter
  |--------------------------------------------------------------------------
  */

  const [
    selectedCategory,
    setSelectedCategory,
  ] =
    useState<string | null>(
      null
    );

  /*
  |--------------------------------------------------------------------------
  | Selected Node
  |--------------------------------------------------------------------------
  */

  const [
    selectedNode,
    setSelectedNode,
  ] =
    useState<SelectedNode>(
      null
    );

  /*
  |--------------------------------------------------------------------------
  | Categories
  |--------------------------------------------------------------------------
  */

  const categories =
    useMemo<
      CategoryInfo[]
    >(() => {
      const map =
        new Map<
          string,
          string
        >();

      for (
        const post of posts
      ) {
        if (
          !map.has(
            post.categoryId
          )
        ) {
          map.set(
            post.categoryId,
            post.category
          );
        }
      }

      return Array.from(
        map.entries()
      )
        .map(
          ([id, name]) => ({
            id,

            name,
          })
        )
        .sort(
          (a, b) =>
            a.name.localeCompare(
              b.name
            )
        );
    }, [
      posts,
    ]);

  /*
  |--------------------------------------------------------------------------
  | Visible Posts
  |--------------------------------------------------------------------------
  */

  const visiblePosts =
    useMemo(() => {
      if (
        !selectedCategory
      ) {
        return posts;
      }

      return posts.filter(
        (post) =>
          post.categoryId ===
          selectedCategory
      );
    }, [
      posts,
      selectedCategory,
    ]);

  /*
  |--------------------------------------------------------------------------
  | Visible Categories
  |--------------------------------------------------------------------------
  */

  const visibleCategories =
    useMemo(() => {
      if (
        !selectedCategory
      ) {
        return categories;
      }

      return categories.filter(
        (category) =>
          category.id ===
          selectedCategory
      );
    }, [
      categories,
      selectedCategory,
    ]);

  /*
  |--------------------------------------------------------------------------
  | Graph Data
  |--------------------------------------------------------------------------
  */

  const {
    nodes,
    edges,
  } =
    useMemo(() => {
      return createGraph(
        visibleCategories,
        visiblePosts
      );
    }, [
      visibleCategories,
      visiblePosts,
    ]);

  /*
  |--------------------------------------------------------------------------
  | Node Lookup
  |--------------------------------------------------------------------------
  */

  const nodeMap =
    useMemo(() => {
      return new Map(
        nodes.map(
          (node) => [
            node.id,
            node,
          ]
        )
      );
    }, [
      nodes,
    ]);

  /*
  |--------------------------------------------------------------------------
  | Selected Post
  |--------------------------------------------------------------------------
  */

  const selectedPost =
    selectedNode?.kind ===
    "post"
      ? posts.find(
          (post) =>
            post.id ===
            selectedNode.postId
        )
      : undefined;

  /*
  |--------------------------------------------------------------------------
  | Selected Category Info
  |--------------------------------------------------------------------------
  */

  const selectedCategoryInfo =
    selectedNode?.kind ===
    "category"
      ? categories.find(
          (category) =>
            category.id ===
            selectedNode.categoryId
        )
      : undefined;

  /*
  |--------------------------------------------------------------------------
  | Category Post Count
  |--------------------------------------------------------------------------
  */

  const selectedCategoryPostCount =
    selectedCategoryInfo
      ? posts.filter(
          (post) =>
            post.categoryId ===
            selectedCategoryInfo.id
        ).length
      : 0;

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <div
      className="
        flex
        h-full
        min-h-0
        flex-col
        text-[var(--os-text)]

        md:min-h-[500px]
      "
    >
      {/* Toolbar */}

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
            flex-col
            gap-3

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <h1
              className="
                text-lg
                font-semibold
              "
            >
              Knowledge Graph
            </h1>

            <p
              className="
                mt-1
                text-xs
                text-[var(--os-muted)]
              "
            >
              Explore relationships between
              categories, posts, and tags.
            </p>
          </div>

          <div
            className="
              text-xs
              text-[var(--os-muted)]
            "
          >
            {visiblePosts.length} posts
            {" · "}
            {edges.length} links
          </div>
        </div>

        {/* Category Filter */}

        <div
          className="
            mt-4
            flex
            gap-2
            overflow-x-auto
            pb-1
          "
        >
          <FilterButton
            selected={
              selectedCategory ===
              null
            }

            onClick={() => {
              setSelectedCategory(
                null
              );

              setSelectedNode(
                null
              );
            }}
          >
            All
          </FilterButton>

          {categories.map(
            (category) => (
              <FilterButton
                key={
                  category.id
                }

                selected={
                  selectedCategory ===
                  category.id
                }

                onClick={() => {
                  setSelectedCategory(
                    category.id
                  );

                  setSelectedNode(
                    null
                  );
                }}
              >
                {
                  category.name
                }
              </FilterButton>
            )
          )}
        </div>
      </div>

      {/* Main */}

      <div
        className="
          grid
          min-h-0
          flex-1
          grid-cols-1

          lg:grid-cols-[1fr_260px]
        "
      >
        {/* Graph */}

        <div
          className="
            min-h-0
            overflow-auto
            py-4

            lg:pr-4
          "
        >
          {nodes.length ===
          0 ? (
            <div
              className="
                flex
                h-full
                min-h-64
                items-center
                justify-center
                text-sm
                text-[var(--os-muted)]
              "
            >
              No graph data.
            </div>
          ) : (
            <div
              className="
                mx-auto
                w-full
                min-w-[640px]
                max-w-[1000px]
              "
            >
              <svg
                viewBox={`
                  0
                  0
                  ${GRAPH_WIDTH}
                  ${GRAPH_HEIGHT}
                `}

                className="
                  h-auto
                  w-full
                  overflow-visible
                "

                role="img"

                aria-label="Knowledge graph"
              >
                {/* Background */}

                <rect
                  x="0"
                  y="0"

                  width={
                    GRAPH_WIDTH
                  }

                  height={
                    GRAPH_HEIGHT
                  }

                  rx="28"

                  fill="var(--os-panel-soft)"
                />

                {/* Edges */}

                {edges.map(
                  (edge) => {
                    const source =
                      nodeMap.get(
                        edge.sourceId
                      );

                    const target =
                      nodeMap.get(
                        edge.targetId
                      );

                    if (
                      !source ||
                      !target
                    ) {
                      return null;
                    }

                    return (
                      <line
                        key={
                          edge.id
                        }

                        x1={
                          source.x
                        }

                        y1={
                          source.y
                        }

                        x2={
                          target.x
                        }

                        y2={
                          target.y
                        }

                        stroke={
                          edge.kind ===
                          "tag"
                            ? "var(--os-accent)"
                            : "var(--os-muted)"
                        }

                        strokeOpacity={
                          edge.kind ===
                          "tag"
                            ? 0.36
                            : 0.22
                        }

                        strokeWidth={
                          edge.kind ===
                          "tag"
                            ? 2
                            : 1.5
                        }

                        strokeDasharray={
                          edge.kind ===
                          "tag"
                            ? "6 7"
                            : undefined
                        }
                      />
                    );
                  }
                )}

                {/* Nodes */}

                {nodes.map(
                  (node) => {
                    const selected =
                      isNodeSelected(
                        node,
                        selectedNode
                      );

                    if (
                      node.kind ===
                      "category"
                    ) {
                      return (
                        <CategoryGraphNode
                          key={
                            node.id
                          }

                          node={
                            node
                          }

                          selected={
                            selected
                          }

                          onSelect={() =>
                            setSelectedNode(
                              {
                                kind:
                                  "category",

                                categoryId:
                                  node.categoryId,
                              }
                            )
                          }
                        />
                      );
                    }

                    return (
                      <PostGraphNode
                        key={
                          node.id
                        }

                        node={
                          node
                        }

                        selected={
                          selected
                        }

                        onSelect={() =>
                          setSelectedNode(
                            {
                              kind:
                                "post",

                              postId:
                                node.postId,
                            }
                          )
                        }

                        onOpen={() => {
                          const post =
                            posts.find(
                              (
                                item
                              ) =>
                                item.id ===
                                node.postId
                            );

                          if (!post) {
                            return;
                          }

                          onOpenPost(
                            post.id,
                            post.title
                          );
                        }}
                      />
                    );
                  }
                )}
              </svg>
            </div>
          )}
        </div>

        {/* Inspector */}

        <aside
          className="
            border-t
            border-[var(--os-border)]
            pt-4

            lg:border-l
            lg:border-t-0
            lg:pl-4
            lg:pt-4
          "
        >
          {selectedPost ? (
            <PostInspector
              post={
                selectedPost
              }

              onOpen={() =>
                onOpenPost(
                  selectedPost.id,
                  selectedPost.title
                )
              }
            />
          ) : selectedCategoryInfo ? (
            <CategoryInspector
              category={
                selectedCategoryInfo
              }

              postCount={
                selectedCategoryPostCount
              }

              onFilter={() =>
                setSelectedCategory(
                  selectedCategoryInfo.id
                )
              }
            />
          ) : (
            <GraphInspectorEmpty />
          )}
        </aside>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Graph Creation
|--------------------------------------------------------------------------
*/

function createGraph(
  categories: CategoryInfo[],
  posts: Post[]
): {
  nodes: GraphNode[];

  edges: GraphEdge[];
} {
  const nodes: GraphNode[] =
    [];

  const edges: GraphEdge[] =
    [];

  if (
    categories.length ===
    0
  ) {
    return {
      nodes,
      edges,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Category Positions
  |--------------------------------------------------------------------------
  |
  | Category들을 큰 원 위에 배치한다.
  |
  */

  const categoryRadius =
    categories.length ===
    1
      ? 0
      : 225;

  categories.forEach(
    (
      category,
      categoryIndex
    ) => {
      const angle =
        categories.length ===
        1
          ? -Math.PI / 2
          : -Math.PI / 2 +
            (
              categoryIndex /
              categories.length
            ) *
              Math.PI *
              2;

      const categoryX =
        GRAPH_CENTER_X +
        Math.cos(
          angle
        ) *
          categoryRadius;

      const categoryY =
        GRAPH_CENTER_Y +
        Math.sin(
          angle
        ) *
          categoryRadius;

      const categoryNodeId =
        `category-${category.id}`;

      /*
       * Category Node
       */

      nodes.push({
        id:
          categoryNodeId,

        kind:
          "category",

        categoryId:
          category.id,

        label:
          category.name,

        x:
          categoryX,

        y:
          categoryY,
      });

      /*
       * 해당 Category의 Posts
       */

      const categoryPosts =
        posts.filter(
          (post) =>
            post.categoryId ===
            category.id
        );

      /*
       * 글 수가 많아질수록
       * 배치 반지름 확대
       */

      const postRadius =
        Math.min(
          135,
          78 +
            Math.max(
              0,
              categoryPosts.length -
                4
            ) *
              7
        );

      categoryPosts.forEach(
        (
          post,
          postIndex
        ) => {
          const postAngle =
            categoryPosts.length ===
            1
              ? 0
              : (
                  postIndex /
                  categoryPosts.length
                ) *
                Math.PI *
                2;

          const postX =
            categoryX +
            Math.cos(
              postAngle
            ) *
              postRadius;

          const postY =
            categoryY +
            Math.sin(
              postAngle
            ) *
              postRadius;

          const postNodeId =
            `post-${post.id}`;

          /*
           * Post Node
           */

          nodes.push({
            id:
              postNodeId,

            kind:
              "post",

            postId:
              post.id,

            label:
              post.title,

            categoryId:
              post.categoryId,

            x:
              clamp(
                postX,
                70,
                GRAPH_WIDTH -
                  70
              ),

            y:
              clamp(
                postY,
                70,
                GRAPH_HEIGHT -
                  70
              ),
          });

          /*
           * Category → Post
           */

          edges.push({
            id:
              `${categoryNodeId}-${postNodeId}`,

            sourceId:
              categoryNodeId,

            targetId:
              postNodeId,

            kind:
              "category",
          });
        }
      );
    }
  );

  /*
  |--------------------------------------------------------------------------
  | Shared Tag Edges
  |--------------------------------------------------------------------------
  |
  | 두 글이 같은 tag를 하나 이상 공유하면
  | 글 ↔ 글 edge 생성
  |
  */

  for (
    let leftIndex = 0;
    leftIndex <
    posts.length;
    leftIndex += 1
  ) {
    for (
      let rightIndex =
        leftIndex + 1;
      rightIndex <
      posts.length;
      rightIndex += 1
    ) {
      const leftPost =
        posts[leftIndex];

      const rightPost =
        posts[rightIndex];

      const sharedTags =
        leftPost.tags.filter(
          (tag) =>
            rightPost.tags.includes(
              tag
            )
        );

      if (
        sharedTags.length ===
        0
      ) {
        continue;
      }

      edges.push({
        id:
          `tag-${leftPost.id}-${rightPost.id}`,

        sourceId:
          `post-${leftPost.id}`,

        targetId:
          `post-${rightPost.id}`,

        kind:
          "tag",

        label:
          sharedTags.join(
            ", "
          ),
      });
    }
  }

  return {
    nodes,
    edges,
  };
}

/*
|--------------------------------------------------------------------------
| Category Node
|--------------------------------------------------------------------------
*/

function CategoryGraphNode({
  node,
  selected,
  onSelect,
}: {
  node: CategoryNode;

  selected: boolean;

  onSelect: () => void;
}) {
  return (
    <g
      role="button"

      tabIndex={0}

      transform={`
        translate(
          ${node.x},
          ${node.y}
        )
      `}

      onClick={
        onSelect
      }

      onKeyDown={(
        event
      ) => {
        if (
          event.key ===
            "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();

          onSelect();
        }
      }}

      className="
        cursor-pointer
        outline-none
      "
    >
      <circle
        r={
          selected
            ? 44
            : 40
        }

        fill="var(--os-accent)"

        fillOpacity={
          selected
            ? 0.95
            : 0.75
        }

        stroke="var(--os-text)"

        strokeOpacity={
          selected
            ? 0.55
            : 0.15
        }

        strokeWidth={
          selected
            ? 3
            : 1.5
        }
      />

      <text
        textAnchor="middle"

        dominantBaseline="middle"

        fill="white"

        fontSize="12"

        fontWeight="600"

        pointerEvents="none"
      >
        {truncateLabel(
          node.label,
          16
        )}
      </text>
    </g>
  );
}

/*
|--------------------------------------------------------------------------
| Post Node
|--------------------------------------------------------------------------
*/

function PostGraphNode({
  node,
  selected,
  onSelect,
  onOpen,
}: {
  node: PostNode;

  selected: boolean;

  onSelect: () => void;

  onOpen: () => void;
}) {
  return (
    <g
      role="button"

      tabIndex={0}

      transform={`
        translate(
          ${node.x},
          ${node.y}
        )
      `}

      onClick={
        onSelect
      }

      onDoubleClick={
        onOpen
      }

      onKeyDown={(
        event
      ) => {
        if (
          event.key ===
          "Enter"
        ) {
          event.preventDefault();

          onOpen();
        }

        if (
          event.key === " "
        ) {
          event.preventDefault();

          onSelect();
        }
      }}

      className="
        cursor-pointer
        outline-none
      "
    >
      <circle
        r={
          selected
            ? 31
            : 27
        }

        fill="var(--os-panel)"

        stroke={
          selected
            ? "var(--os-accent)"
            : "var(--os-border)"
        }

        strokeWidth={
          selected
            ? 4
            : 2
        }
      />

      <circle
        r="19"

        fill="var(--os-panel-soft)"
      />

      <text
        y="-3"

        textAnchor="middle"

        dominantBaseline="middle"

        fill="var(--os-text)"

        fontSize="11"

        fontWeight="700"

        pointerEvents="none"
      >
        MD
      </text>

      <text
        y="43"

        textAnchor="middle"

        dominantBaseline="middle"

        fill="var(--os-text)"

        fontSize="11"

        pointerEvents="none"
      >
        {truncateLabel(
          node.label,
          18
        )}
      </text>
    </g>
  );
}

/*
|--------------------------------------------------------------------------
| Post Inspector
|--------------------------------------------------------------------------
*/

function PostInspector({
  post,
  onOpen,
}: {
  post: Post;

  onOpen: () => void;
}) {
  return (
    <div>
      <div
        className="
          flex
          items-center
          gap-3
        "
      >
        <AppIcon
          type="post"

          className="
            h-11
            w-11
            shrink-0
            text-slate-400
          "
        />

        <div
          className="
            min-w-0
          "
        >
          <p
            className="
              truncate
              text-sm
              font-semibold
            "
          >
            {
              post.title
            }
          </p>

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
        </div>
      </div>

      {post.description && (
        <p
          className="
            mt-4
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

      <div
        className="
          mt-4
          flex
          flex-wrap
          gap-2
        "
      >
        {post.tags.length >
        0 ? (
          post.tags.map(
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
                  px-2
                  py-1
                  text-xs
                  text-[var(--os-muted)]
                "
              >
                #{tag}
              </span>
            )
          )
        ) : (
          <span
            className="
              text-xs
              text-[var(--os-muted)]
            "
          >
            No tags
          </span>
        )}
      </div>

      <div
        className="
          mt-5
          space-y-1
          text-xs
          text-[var(--os-muted)]
        "
      >
        <p>
          Status:{" "}
          {
            post.status
          }
        </p>

        <p>
          Updated:{" "}
          {
            post.updatedAt
          }
        </p>
      </div>

      <button
        type="button"

        onClick={
          onOpen
        }

        className="
          mt-5
          w-full
          rounded-xl
          bg-[var(--os-accent)]
          px-4
          py-2.5
          text-sm
          font-medium
          text-white
          transition
          active:scale-[0.98]
        "
      >
        Open post
      </button>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Category Inspector
|--------------------------------------------------------------------------
*/

function CategoryInspector({
  category,
  postCount,
  onFilter,
}: {
  category: CategoryInfo;

  postCount: number;

  onFilter: () => void;
}) {
  return (
    <div>
      <div
        className="
          flex
          items-center
          gap-3
        "
      >
        <AppIcon
          type="folder"

          className="
            h-11
            w-11
            text-blue-400
          "
        />

        <div>
          <p
            className="
              text-sm
              font-semibold
            "
          >
            {
              category.name
            }
          </p>

          <p
            className="
              mt-1
              text-xs
              text-[var(--os-muted)]
            "
          >
            {postCount} post
            {postCount === 1
              ? ""
              : "s"}
          </p>
        </div>
      </div>

      <button
        type="button"

        onClick={
          onFilter
        }

        className="
          mt-5
          w-full
          rounded-xl
          border
          border-[var(--os-border)]
          bg-[var(--os-panel-soft)]
          px-4
          py-2.5
          text-sm
          transition
          active:scale-[0.98]
        "
      >
        Focus category
      </button>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Empty Inspector
|--------------------------------------------------------------------------
*/

function GraphInspectorEmpty() {
  return (
    <div
      className="
        py-6
        text-center
        text-sm
        text-[var(--os-muted)]

        lg:py-10
      "
    >
      <AppIcon
        type="graph"

        className="
          mx-auto
          mb-3
          h-12
          w-12
          opacity-30
        "
      />

      <p>
        Select a node to inspect it.
      </p>

      <p
        className="
          mt-2
          text-xs
        "
      >
        Double-click a post node on desktop
        or use Open post.
      </p>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Filter Button
|--------------------------------------------------------------------------
*/

function FilterButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;

  onClick: () => void;

  children:
    React.ReactNode;
}) {
  return (
    <button
      type="button"

      onClick={
        onClick
      }

      className={`
        shrink-0
        rounded-full
        border
        px-3
        py-1.5
        text-xs
        transition

        ${
          selected
            ? "border-[var(--os-accent)] bg-[var(--os-accent)] text-white"
            : "border-[var(--os-border)] bg-[var(--os-panel-soft)] text-[var(--os-muted)]"
        }
      `}
    >
      {children}
    </button>
  );
}

/*
|--------------------------------------------------------------------------
| Selected
|--------------------------------------------------------------------------
*/

function isNodeSelected(
  node: GraphNode,
  selectedNode: SelectedNode
) {
  if (
    !selectedNode
  ) {
    return false;
  }

  if (
    node.kind ===
      "category" &&
    selectedNode.kind ===
      "category"
  ) {
    return (
      node.categoryId ===
      selectedNode.categoryId
    );
  }

  if (
    node.kind ===
      "post" &&
    selectedNode.kind ===
      "post"
  ) {
    return (
      node.postId ===
      selectedNode.postId
    );
  }

  return false;
}

/*
|--------------------------------------------------------------------------
| Utils
|--------------------------------------------------------------------------
*/

function clamp(
  value: number,
  min: number,
  max: number
) {
  return Math.min(
    Math.max(
      value,
      min
    ),
    max
  );
}

function truncateLabel(
  value: string,
  maxLength: number
) {
  if (
    value.length <=
    maxLength
  ) {
    return value;
  }

  return `${value.slice(
    0,
    maxLength - 1
  )}…`;
}