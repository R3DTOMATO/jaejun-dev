"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import AppIcon from "../../components/icons/AppIcon";

import type {
  AppIconType,
} from "../../components/icons/AppIcon";

import type {
  Post,
} from "../../types/post";

/*
|--------------------------------------------------------------------------
| System Apps
|--------------------------------------------------------------------------
*/

export type SystemAppId =
  | "search"
  | "graph"
  | "activity"
  | "settings"
  | "terminal";

/*
|--------------------------------------------------------------------------
| Props
|--------------------------------------------------------------------------
*/

type CommandPaletteProps = {
  posts: Post[];

  onClose: () => void;

  onLaunchApp: (
    id: SystemAppId
  ) => void;

  onOpenCategory: (
    categoryId: string,
    categoryName: string
  ) => void;

  onOpenPost: (
    postId: string,
    title: string
  ) => void;
};

/*
|--------------------------------------------------------------------------
| Palette Item
|--------------------------------------------------------------------------
*/

type PaletteItem =
  | {
      id: string;

      kind: "app";

      title: string;

      subtitle: string;

      icon:
        AppIconType;

      appId:
        SystemAppId;

      keywords:
        string[];

      shortcut?: string;
    }
  | {
      id: string;

      kind:
        "category";

      title: string;

      subtitle: string;

      icon:
        "folder";

      categoryId:
        string;

      keywords:
        string[];
    }
  | {
      id: string;

      kind:
        "post";

      title: string;

      subtitle: string;

      icon:
        "post";

      postId:
        string;

      keywords:
        string[];
    };

/*
|--------------------------------------------------------------------------
| System Applications
|--------------------------------------------------------------------------
*/

const systemApps: PaletteItem[] =
  [
    {
      id:
        "app-search",

      kind:
        "app",

      title:
        "Search",

      subtitle:
        "Search the knowledge base",

      icon:
        "search",

      appId:
        "search",

      keywords: [
        "search",
        "find",
        "knowledge",
        "검색",
      ],

      shortcut:
        "⌘/Ctrl ⇧ F",
    },

    {
      id:
        "app-graph",

      kind:
        "app",

      title:
        "Knowledge Graph",

      subtitle:
        "Explore knowledge relationships",

      icon:
        "graph",

      appId:
        "graph",

      keywords: [
        "graph",
        "knowledge",
        "relation",
        "tag",
        "그래프",
      ],

      shortcut:
        "⌘/Ctrl ⇧ G",
    },

    {
      id:
        "app-activity",

      kind:
        "app",

      title:
        "Activity Monitor",

      subtitle:
        "View learning statistics",

      icon:
        "activity",

      appId:
        "activity",

      keywords: [
        "activity",
        "statistics",
        "learning",
        "dashboard",
        "통계",
      ],

      shortcut:
        "⌘/Ctrl ⇧ A",
    },

    {
      id:
        "app-settings",

      kind:
        "app",

      title:
        "Settings",

      subtitle:
        "Customize Knowledge OS",

      icon:
        "settings",

      appId:
        "settings",

      keywords: [
        "settings",
        "theme",
        "wallpaper",
        "설정",
      ],

      shortcut:
        "⌘/Ctrl ,",
    },

    {
      id:
        "app-terminal",

      kind:
        "app",

      title:
        "Terminal",

      subtitle:
        "Navigate knowledge with commands",

      icon:
        "terminal",

      appId:
        "terminal",

      keywords: [
        "terminal",
        "shell",
        "command",
        "cli",
        "터미널",
      ],

      shortcut:
        "⌘/Ctrl `",
    },
  ];

/*
|--------------------------------------------------------------------------
| Command Palette
|--------------------------------------------------------------------------
*/

export default function CommandPalette({
  posts,
  onClose,
  onLaunchApp,
  onOpenCategory,
  onOpenPost,
}: CommandPaletteProps) {
  /*
  |--------------------------------------------------------------------------
  | Query
  |--------------------------------------------------------------------------
  */

  const [
    query,
    setQuery,
  ] =
    useState("");

  /*
  |--------------------------------------------------------------------------
  | Selected Result
  |--------------------------------------------------------------------------
  */

  const [
    selectedIndex,
    setSelectedIndex,
  ] =
    useState(0);

  /*
  |--------------------------------------------------------------------------
  | Input
  |--------------------------------------------------------------------------
  */

  const inputRef =
    useRef<HTMLInputElement | null>(
      null
    );

  /*
  |--------------------------------------------------------------------------
  | Categories
  |--------------------------------------------------------------------------
  */

  const categories =
    useMemo(() => {
      const categoryMap =
        new Map<
          string,
          string
        >();

      for (
        const post of posts
      ) {
        if (
          !categoryMap.has(
            post.categoryId
          )
        ) {
          categoryMap.set(
            post.categoryId,
            post.category
          );
        }
      }

      return Array.from(
        categoryMap.entries()
      )
        .map(
          ([
            id,
            name,
          ]) => ({
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
  | All Palette Items
  |--------------------------------------------------------------------------
  */

  const allItems =
    useMemo<
      PaletteItem[]
    >(() => {
      const categoryItems: PaletteItem[] =
        categories.map(
          (
            category
          ) => ({
            id:
              `category-${category.id}`,

            kind:
              "category",

            title:
              category.name,

            subtitle:
              `Open ${category.name} folder`,

            icon:
              "folder",

            categoryId:
              category.id,

            keywords: [
              category.id,
              category.name,
              "folder",
              "category",
            ],
          })
        );

      const postItems: PaletteItem[] =
        posts.map(
          (post) => ({
            id:
              `post-${post.id}`,

            kind:
              "post",

            title:
              post.title,

            subtitle:
              `${post.category} · ${post.status}`,

            icon:
              "post",

            postId:
              post.id,

            keywords: [
              post.id,
              post.title,
              post.category,
              post.categoryId,
              post.description,
              ...post.tags,
            ],
          })
        );

      return [
        ...systemApps,
        ...categoryItems,
        ...postItems,
      ];
    }, [
      categories,
      posts,
    ]);

  /*
  |--------------------------------------------------------------------------
  | Search
  |--------------------------------------------------------------------------
  */

  const results =
    useMemo(() => {
      const normalizedQuery =
        normalize(
          query
        );

      /*
       * 아무것도 입력하지 않으면
       * 앱 → 카테고리 → 최근 글 순서
       */

      if (
        !normalizedQuery
      ) {
        const appItems =
          allItems.filter(
            (item) =>
              item.kind ===
              "app"
          );

        const categoryItems =
          allItems.filter(
            (item) =>
              item.kind ===
              "category"
          );

        const postItems =
          allItems
            .filter(
              (item) =>
                item.kind ===
                "post"
            )
            .slice(
              0,
              6
            );

        return [
          ...appItems,
          ...categoryItems,
          ...postItems,
        ].slice(
          0,
          18
        );
      }

      return allItems
        .map(
          (item) => ({
            item,

            score:
              getSearchScore(
                item,
                normalizedQuery
              ),
          })
        )
        .filter(
          (
            result
          ) =>
            result.score !==
            null
        )
        .sort(
          (a, b) =>
            (
              a.score ??
              999
            ) -
            (
              b.score ??
              999
            )
        )
        .map(
          (result) =>
            result.item
        )
        .slice(
          0,
          18
        );
    }, [
      allItems,
      query,
    ]);

  /*
  |--------------------------------------------------------------------------
  | Query가 바뀌면 첫 번째 결과 선택
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    setSelectedIndex(
      0
    );
  }, [
    query,
  ]);

  /*
  |--------------------------------------------------------------------------
  | 결과 개수 변경 대응
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (
      results.length ===
      0
    ) {
      setSelectedIndex(
        0
      );

      return;
    }

    if (
      selectedIndex >=
      results.length
    ) {
      setSelectedIndex(
        results.length -
          1
      );
    }
  }, [
    results.length,
    selectedIndex,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Auto Focus
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Execute
  |--------------------------------------------------------------------------
  */

  function executeItem(
    item: PaletteItem
  ) {
    switch (
      item.kind
    ) {
      case "app":
        onLaunchApp(
          item.appId
        );

        break;

      case "category":
        onOpenCategory(
          item.categoryId,
          item.title
        );

        break;

      case "post":
        onOpenPost(
          item.postId,
          item.title
        );

        break;
    }

    onClose();
  }

  /*
  |--------------------------------------------------------------------------
  | Keyboard
  |--------------------------------------------------------------------------
  */

  function handleKeyDown(
    event:
      React.KeyboardEvent<HTMLInputElement>
  ) {
    switch (
      event.key
    ) {
      case "ArrowDown": {
        event.preventDefault();

        if (
          results.length ===
          0
        ) {
          return;
        }

        setSelectedIndex(
          (
            currentIndex
          ) =>
            (
              currentIndex +
              1
            ) %
            results.length
        );

        break;
      }

      case "ArrowUp": {
        event.preventDefault();

        if (
          results.length ===
          0
        ) {
          return;
        }

        setSelectedIndex(
          (
            currentIndex
          ) =>
            (
              currentIndex -
              1 +
              results.length
            ) %
            results.length
        );

        break;
      }

      case "Enter": {
        event.preventDefault();

        const selected =
          results[
            selectedIndex
          ];

        if (selected) {
          executeItem(
            selected
          );
        }

        break;
      }

      case "Escape":
        event.preventDefault();

        onClose();

        break;
    }
  }

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <div
      role="dialog"

      aria-modal="true"

      aria-label="Command Palette"

      onMouseDown={(
        event
      ) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}

      className="
        fixed
        inset-0
        z-[20000]

        flex
        items-start
        justify-center

        bg-black/45
        p-3
        pt-14

        backdrop-blur-sm

        md:pt-[12vh]
      "
    >
      <div
        className="
          os-command-palette

          flex
          max-h-[78dvh]
          w-full
          max-w-2xl
          flex-col
          overflow-hidden

          rounded-2xl
          border
          border-[var(--os-border)]

          bg-[var(--os-panel)]
          text-[var(--os-text)]

          shadow-[0_30px_100px_rgba(0,0,0,0.55)]
          backdrop-blur-2xl
        "
      >
        {/* Search Input */}

        <div
          className="
            flex
            items-center
            gap-3
            border-b
            border-[var(--os-border)]
            px-4
            py-3

            sm:px-5
            sm:py-4
          "
        >
          <AppIcon
            type="search"

            className="
              h-6
              w-6
              shrink-0
              text-[var(--os-accent)]
            "
          />

          <input
            ref={
              inputRef
            }

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

            onKeyDown={
              handleKeyDown
            }

            placeholder="Search apps, folders, and posts..."

            autoComplete="off"

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
            "
          />

          <kbd
            className="
              hidden
              rounded-md
              border
              border-[var(--os-border)]
              bg-[var(--os-panel-soft)]
              px-2
              py-1
              font-mono
              text-[10px]
              text-[var(--os-muted)]

              sm:block
            "
          >
            ESC
          </kbd>
        </div>

        {/* Results */}

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            p-2
          "
        >
          {results.length ===
          0 ? (
            <div
              className="
                flex
                min-h-44
                items-center
                justify-center
                text-sm
                text-[var(--os-muted)]
              "
            >
              No results for
              &nbsp;&quot;
              {query}
              &quot;
            </div>
          ) : (
            results.map(
              (
                item,
                index
              ) => (
                <button
                  type="button"

                  key={
                    item.id
                  }

                  onMouseEnter={() =>
                    setSelectedIndex(
                      index
                    )
                  }

                  onClick={() =>
                    executeItem(
                      item
                    )
                  }

                  className={`
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-3
                    text-left
                    transition

                    ${
                      index ===
                      selectedIndex
                        ? "bg-[var(--os-panel-soft)]"
                        : ""
                    }
                  `}
                >
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                    "
                  >
                    <AppIcon
                      type={
                        item.icon
                      }

                      className={`
                        h-9
                        w-9

                        ${getIconColor(
                          item.icon
                        )}
                      `}
                    />
                  </div>

                  <div
                    className="
                      min-w-0
                      flex-1
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
                        item.title
                      }
                    </p>

                    <p
                      className="
                        mt-0.5
                        truncate
                        text-xs
                        text-[var(--os-muted)]
                      "
                    >
                      {
                        item.subtitle
                      }
                    </p>
                  </div>

                  <div
                    className="
                      flex
                      shrink-0
                      items-center
                      gap-2
                    "
                  >
                    <span
                      className="
                        hidden
                        rounded-full
                        border
                        border-[var(--os-border)]
                        px-2
                        py-1
                        text-[10px]
                        uppercase
                        tracking-wide
                        text-[var(--os-muted)]

                        sm:inline
                      "
                    >
                      {
                        item.kind
                      }
                    </span>

                    {"shortcut" in
                      item &&
                      item.shortcut && (
                        <kbd
                          className="
                            hidden
                            font-mono
                            text-[10px]
                            text-[var(--os-muted)]

                            md:inline
                          "
                        >
                          {
                            item.shortcut
                          }
                        </kbd>
                      )}
                  </div>
                </button>
              )
            )
          )}
        </div>

        {/* Footer */}

        <footer
          className="
            flex
            flex-wrap
            gap-x-4
            gap-y-1
            border-t
            border-[var(--os-border)]
            px-4
            py-2
            text-[10px]
            text-[var(--os-muted)]
          "
        >
          <span>
            ↑↓ Navigate
          </span>

          <span>
            Enter Open
          </span>

          <span>
            Esc Close
          </span>
        </footer>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Search Score
|--------------------------------------------------------------------------
*/

function getSearchScore(
  item: PaletteItem,
  query: string
): number | null {
  const title =
    normalize(
      item.title
    );

  const subtitle =
    normalize(
      item.subtitle
    );

  const keywordText =
    normalize(
      item.keywords.join(
        " "
      )
    );

  if (
    title === query
  ) {
    return 0;
  }

  if (
    title.startsWith(
      query
    )
  ) {
    return 1;
  }

  if (
    title.includes(
      query
    )
  ) {
    return 2;
  }

  if (
    subtitle.includes(
      query
    )
  ) {
    return 3;
  }

  if (
    keywordText.includes(
      query
    )
  ) {
    return 4;
  }

  return null;
}

/*
|--------------------------------------------------------------------------
| Normalize
|--------------------------------------------------------------------------
*/

function normalize(
  value: string
) {
  return value
    .trim()
    .toLowerCase();
}

/*
|--------------------------------------------------------------------------
| Icon Color
|--------------------------------------------------------------------------
*/

function getIconColor(
  type: AppIconType
) {
  switch (type) {
    case "folder":
      return "text-blue-400";

    case "search":
      return "text-violet-500";

    case "graph":
      return "text-cyan-500";

    case "activity":
      return "text-emerald-500";

    case "settings":
      return "text-slate-500";

    case "post":
      return "text-slate-400";

    case "terminal":
      return "text-slate-700";
  }
}