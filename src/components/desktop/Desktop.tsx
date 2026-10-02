"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  usePathname,
} from "next/navigation";

import ActivityMonitor from "../../components/activity/ActivityMonitor";
import PostContent from "../../components/blog/PostContent";
import CommandPalette from "../../components/command/CommandPalette";

import type {
  SystemAppId,
} from "../../components/command/CommandPalette";

import KnowledgeGraph from "../../components/graph/KnowledgeGraph";
import AppIcon from "../../components/icons/AppIcon";
import Search from "../../components/search/Search";
import SettingsApp from "../../components/settings/SettingsApp";

import {
  useSystemSettings,
} from "../../components/settings/SystemSettingsProvider";

import Terminal from "../../components/terminal/Terminal";

import {
  getThemeStyle,
} from "../../lib/system-theme";

import type {
  Post,
} from "../../types/post";

import DesktopIcon from "./DesktopIcon";
import Dock from "./Dock";
import MenuBar from "./MenuBar";
import Wallpaper from "./Wallpaper";
import OSWindow from "./Window";

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

type DesktopItem = {
  id: string;

  name: string;

  type:
    | "folder"
    | "search"
    | "graph"
    | "activity"
    | "settings"
    | "terminal";
};

type WindowKind =
  | "folder"
  | "search"
  | "graph"
  | "activity"
  | "settings"
  | "terminal"
  | "post";

type OpenWindow = {
  windowId: string;

  kind: WindowKind;

  contentId: string;

  title: string;

  x: number;

  y: number;

  zIndex: number;

  minimized: boolean;

  maximized: boolean;
};

type DesktopProps = {
  posts: Post[];
};

/*
|--------------------------------------------------------------------------
| Desktop
|--------------------------------------------------------------------------
*/

export default function Desktop({
  posts,
}: DesktopProps) {
  /*
  |--------------------------------------------------------------------------
  | Settings
  |--------------------------------------------------------------------------
  */

  const {
    settings,
  } =
    useSystemSettings();

  /*
  |--------------------------------------------------------------------------
  | Routing
  |--------------------------------------------------------------------------
  */

  const nextPathname =
    usePathname();

  const [
    activePathname,
    setActivePathname,
  ] =
    useState(
      nextPathname
    );

  /*
  |--------------------------------------------------------------------------
  | Windows
  |--------------------------------------------------------------------------
  */

  const [
    openWindows,
    setOpenWindows,
  ] =
    useState<OpenWindow[]>(
      []
    );

  /*
  |--------------------------------------------------------------------------
  | Closing Animation
  |--------------------------------------------------------------------------
  */

  const [
    closingWindowIds,
    setClosingWindowIds,
  ] =
    useState<
      Set<string>
    >(
      new Set()
    );

  const closeTimersRef =
    useRef<
      Map<
        string,
        number
      >
    >(
      new Map()
    );

  /*
  |--------------------------------------------------------------------------
  | Desktop Selection
  |--------------------------------------------------------------------------
  */

  const [
    selectedDesktopItem,
    setSelectedDesktopItem,
  ] =
    useState<string | null>(
      null
    );

  /*
  |--------------------------------------------------------------------------
  | Command Palette
  |--------------------------------------------------------------------------
  */

  const [
    commandPaletteOpen,
    setCommandPaletteOpen,
  ] =
    useState(
      false
    );

  /*
  |--------------------------------------------------------------------------
  | Z Index
  |--------------------------------------------------------------------------
  */

  const nextZIndex =
    useRef(30);

  function getNextZIndex() {
    nextZIndex.current +=
      1;

    return nextZIndex.current;
  }

  /*
  |--------------------------------------------------------------------------
  | Cleanup Close Timers
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    return () => {
      for (
        const timer of
        closeTimersRef.current.values()
      ) {
        window.clearTimeout(
          timer
        );
      }

      closeTimersRef.current.clear();
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Path Sync
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    setActivePathname(
      nextPathname
    );
  }, [
    nextPathname,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Browser Back / Forward
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    function handlePopState() {
      setActivePathname(
        window.location.pathname
      );
    }

    window.addEventListener(
      "popstate",
      handlePopState
    );

    return () => {
      window.removeEventListener(
        "popstate",
        handlePopState
      );
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Desktop Items
  |--------------------------------------------------------------------------
  */

  const desktopItems =
    useMemo<DesktopItem[]>(() => {
      const categories =
        new Map<
          string,
          string
        >();

      for (
        const post of posts
      ) {
        if (
          !categories.has(
            post.categoryId
          )
        ) {
          categories.set(
            post.categoryId,
            post.category
          );
        }
      }

      const folders =
        Array.from(
          categories.entries()
        )
          .map(
            ([
              id,
              name,
            ]) => ({
              id,

              name,

              type:
                "folder" as const,
            })
          )
          .sort(
            (a, b) =>
              a.name.localeCompare(
                b.name
              )
          );

      return [
        ...folders,

        {
          id:
            "search",

          name:
            "Search",

          type:
            "search",
        },

        {
          id:
            "graph",

          name:
            "Knowledge Graph",

          type:
            "graph",
        },

        {
          id:
            "activity",

          name:
            "Activity Monitor",

          type:
            "activity",
        },

        {
          id:
            "settings",

          name:
            "Settings",

          type:
            "settings",
        },

        {
          id:
            "terminal",

          name:
            "Terminal",

          type:
            "terminal",
        },
      ];
    }, [
      posts,
    ]);

  /*
  |--------------------------------------------------------------------------
  | Browser Path
  |--------------------------------------------------------------------------
  */

  function pushBrowserPath(
    pathname: string
  ) {
    if (
      window.location.pathname ===
      pathname
    ) {
      setActivePathname(
        pathname
      );

      return;
    }

    window.history.pushState(
      null,
      "",
      pathname
    );

    setActivePathname(
      pathname
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Post URL
  |--------------------------------------------------------------------------
  */

  function getPostPath(
    postId: string
  ) {
    return `/posts/${encodeURIComponent(
      postId
    )}`;
  }

  /*
  |--------------------------------------------------------------------------
  | Cancel Closing
  |--------------------------------------------------------------------------
  */

  function cancelClosingWindow(
    windowId: string
  ) {
    const timer =
      closeTimersRef.current.get(
        windowId
      );

    if (
      timer !== undefined
    ) {
      window.clearTimeout(
        timer
      );

      closeTimersRef.current.delete(
        windowId
      );
    }

    setClosingWindowIds(
      (
        current
      ) => {
        if (
          !current.has(
            windowId
          )
        ) {
          return current;
        }

        const next =
          new Set(
            current
          );

        next.delete(
          windowId
        );

        return next;
      }
    );
  }

  /*
  |--------------------------------------------------------------------------
  | URL → Post Window
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const routedPostId =
      getPostIdFromPathname(
        activePathname
      );

    /*
     * Root
     */

    if (!routedPostId) {
      if (
        activePathname ===
        "/"
      ) {
        document.title =
          "Jaejun.dev — Knowledge Operating System";

        /*
         * 모바일에서
         * 글 URL → /
         *
         * 로 돌아가면 Post를
         * 홈으로 보낸다.
         */

        if (
          isMobileViewport()
        ) {
          setOpenWindows(
            (
              currentWindows
            ) =>
              currentWindows.map(
                (
                  currentWindow
                ) =>
                  currentWindow.kind ===
                  "post"
                    ? {
                        ...currentWindow,

                        minimized:
                          true,
                      }
                    : currentWindow
              )
          );
        }
      }

      return;
    }

    /*
     * Find Post
     */

    const post =
      posts.find(
        (post) =>
          post.id ===
          routedPostId
      );

    if (!post) {
      return;
    }

    const windowId =
      `post-${post.id}`;

    cancelClosingWindow(
      windowId
    );

    document.title =
      `${post.title} | Jaejun.dev`;

    const zIndex =
      getNextZIndex();

    const mobile =
      isMobileViewport();

    setOpenWindows(
      (
        currentWindows
      ) => {
        /*
         * 모바일:
         *
         * 한 번에 하나의 앱만 표시
         */

        const normalizedWindows =
          mobile
            ? currentWindows.map(
                (
                  currentWindow
                ) => ({
                  ...currentWindow,

                  minimized:
                    currentWindow.windowId ===
                    windowId
                      ? currentWindow.minimized
                      : true,
                })
              )
            : currentWindows;

        const existing =
          normalizedWindows.find(
            (
              currentWindow
            ) =>
              currentWindow.windowId ===
              windowId
          );

        if (existing) {
          return normalizedWindows.map(
            (
              currentWindow
            ) =>
              currentWindow.windowId ===
              windowId
                ? {
                    ...currentWindow,

                    minimized:
                      false,

                    zIndex,
                  }
                : currentWindow
          );
        }

        const offset =
          (
            normalizedWindows.length %
            8
          ) * 28;

        const newWindow: OpenWindow =
          {
            windowId,

            kind:
              "post",

            contentId:
              post.id,

            title:
              post.title,

            x:
              130 +
              offset,

            y:
              80 +
              offset,

            zIndex,

            minimized:
              false,

            maximized:
              false,
          };

        return [
          ...normalizedWindows,

          newWindow,
        ];
      }
    );
  }, [
    activePathname,
    posts,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Open Window
  |--------------------------------------------------------------------------
  */

  function openWindow(
    windowId: string,
    kind: WindowKind,
    contentId: string,
    title: string
  ) {
    cancelClosingWindow(
      windowId
    );

    const zIndex =
      getNextZIndex();

    const mobile =
      isMobileViewport();

    setOpenWindows(
      (
        currentWindows
      ) => {
        /*
         * 모바일에서는
         * 다른 앱들을 모두 최소화
         */

        const normalizedWindows =
          mobile
            ? currentWindows.map(
                (
                  currentWindow
                ) => ({
                  ...currentWindow,

                  minimized:
                    currentWindow.windowId ===
                    windowId
                      ? currentWindow.minimized
                      : true,
                })
              )
            : currentWindows;

        const existing =
          normalizedWindows.find(
            (
              currentWindow
            ) =>
              currentWindow.windowId ===
              windowId
          );

        /*
         * Existing Window
         */

        if (existing) {
          return normalizedWindows.map(
            (
              currentWindow
            ) =>
              currentWindow.windowId ===
              windowId
                ? {
                    ...currentWindow,

                    minimized:
                      false,

                    zIndex,
                  }
                : currentWindow
          );
        }

        /*
         * New Window
         */

        const offset =
          (
            normalizedWindows.length %
            8
          ) * 28;

        const newWindow: OpenWindow =
          {
            windowId,

            kind,

            contentId,

            title,

            x:
              130 +
              offset,

            y:
              80 +
              offset,

            zIndex,

            minimized:
              false,

            maximized:
              false,
          };

        return [
          ...normalizedWindows,

          newWindow,
        ];
      }
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Open Post
  |--------------------------------------------------------------------------
  */

  function openPostWindow(
    postId: string,
    title: string
  ) {
    openWindow(
      `post-${postId}`,

      "post",

      postId,

      title
    );

    pushBrowserPath(
      getPostPath(
        postId
      )
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Open Category
  |--------------------------------------------------------------------------
  */

  function openCategoryWindow(
    categoryId: string,
    categoryName: string
  ) {
    openWindow(
      categoryId,

      "folder",

      categoryId,

      categoryName
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Close Window
  |--------------------------------------------------------------------------
  */

  function closeWindow(
    windowId: string
  ) {
    if (
      closingWindowIds.has(
        windowId
      )
    ) {
      return;
    }

    const closingWindow =
      openWindows.find(
        (
          currentWindow
        ) =>
          currentWindow.windowId ===
          windowId
      );

    /*
     * 현재 글 URL이라면
     * 먼저 홈 주소로 변경
     */

    if (
      closingWindow?.kind ===
      "post"
    ) {
      const routedPostId =
        getPostIdFromPathname(
          activePathname
        );

      if (
        routedPostId ===
        closingWindow.contentId
      ) {
        pushBrowserPath(
          "/"
        );
      }
    }

    /*
     * Exit Animation
     */

    setClosingWindowIds(
      (
        current
      ) => {
        const next =
          new Set(
            current
          );

        next.add(
          windowId
        );

        return next;
      }
    );

    /*
     * Reduced Motion이면
     * 바로 제거
     */

    const reduceMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    const duration =
      reduceMotion
        ? 0
        : 180;

    const timer =
      window.setTimeout(
        () => {
          setOpenWindows(
            (
              currentWindows
            ) =>
              currentWindows.filter(
                (
                  currentWindow
                ) =>
                  currentWindow.windowId !==
                  windowId
              )
          );

          setClosingWindowIds(
            (
              current
            ) => {
              const next =
                new Set(
                  current
                );

              next.delete(
                windowId
              );

              return next;
            }
          );

          closeTimersRef.current.delete(
            windowId
          );
        },
        duration
      );

    closeTimersRef.current.set(
      windowId,
      timer
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Focus Window
  |--------------------------------------------------------------------------
  */

  function focusWindow(
    windowId: string
  ) {
    if (
      closingWindowIds.has(
        windowId
      )
    ) {
      return;
    }

    const target =
      openWindows.find(
        (
          currentWindow
        ) =>
          currentWindow.windowId ===
          windowId
      );

    if (
      target?.kind ===
      "post"
    ) {
      pushBrowserPath(
        getPostPath(
          target.contentId
        )
      );
    }

    const zIndex =
      getNextZIndex();

    setOpenWindows(
      (
        currentWindows
      ) =>
        currentWindows.map(
          (
            currentWindow
          ) =>
            currentWindow.windowId ===
            windowId
              ? {
                  ...currentWindow,

                  zIndex,
                }
              : currentWindow
        )
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Move Window
  |--------------------------------------------------------------------------
  */

  function moveWindow(
    windowId: string,
    x: number,
    y: number
  ) {
    setOpenWindows(
      (
        currentWindows
      ) =>
        currentWindows.map(
          (
            currentWindow
          ) =>
            currentWindow.windowId ===
            windowId
              ? {
                  ...currentWindow,

                  x,

                  y,
                }
              : currentWindow
        )
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Minimize
  |--------------------------------------------------------------------------
  */

  function minimizeWindow(
    windowId: string
  ) {
    const target =
      openWindows.find(
        (
          currentWindow
        ) =>
          currentWindow.windowId ===
          windowId
      );

    setOpenWindows(
      (
        currentWindows
      ) =>
        currentWindows.map(
          (
            currentWindow
          ) =>
            currentWindow.windowId ===
            windowId
              ? {
                  ...currentWindow,

                  minimized:
                    true,
                }
              : currentWindow
        )
    );

    if (
      target?.kind ===
      "post"
    ) {
      const routedPostId =
        getPostIdFromPathname(
          activePathname
        );

      if (
        routedPostId ===
        target.contentId
      ) {
        pushBrowserPath(
          "/"
        );
      }
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Maximize
  |--------------------------------------------------------------------------
  */

  function toggleMaximizeWindow(
    windowId: string
  ) {
    const zIndex =
      getNextZIndex();

    setOpenWindows(
      (
        currentWindows
      ) =>
        currentWindows.map(
          (
            currentWindow
          ) =>
            currentWindow.windowId ===
            windowId
              ? {
                  ...currentWindow,

                  maximized:
                    !currentWindow.maximized,

                  minimized:
                    false,

                  zIndex,
                }
              : currentWindow
        )
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Select Window From Dock
  |--------------------------------------------------------------------------
  */

  function selectWindow(
    windowId: string
  ) {
    cancelClosingWindow(
      windowId
    );

    const target =
      openWindows.find(
        (
          currentWindow
        ) =>
          currentWindow.windowId ===
          windowId
      );

    if (
      target?.kind ===
      "post"
    ) {
      pushBrowserPath(
        getPostPath(
          target.contentId
        )
      );
    }

    const zIndex =
      getNextZIndex();

    const mobile =
      isMobileViewport();

    setOpenWindows(
      (
        currentWindows
      ) =>
        currentWindows.map(
          (
            currentWindow
          ) => {
            if (
              currentWindow.windowId ===
              windowId
            ) {
              return {
                ...currentWindow,

                minimized:
                  false,

                zIndex,
              };
            }

            if (mobile) {
              return {
                ...currentWindow,

                minimized:
                  true,
              };
            }

            return currentWindow;
          }
        )
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Launch Desktop Item
  |--------------------------------------------------------------------------
  */

  function launchItem(
    item: DesktopItem
  ) {
    let kind: WindowKind;

    switch (
      item.type
    ) {
      case "search":
        kind =
          "search";

        break;

      case "graph":
        kind =
          "graph";

        break;

      case "activity":
        kind =
          "activity";

        break;

      case "settings":
        kind =
          "settings";

        break;

      case "terminal":
        kind =
          "terminal";

        break;

      default:
        kind =
          "folder";
    }

    openWindow(
      item.id,

      kind,

      item.id,

      item.name
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Dock Launcher
  |--------------------------------------------------------------------------
  */

  function launchFromDock(
    id: string
  ) {
    const item =
      desktopItems.find(
        (
          desktopItem
        ) =>
          desktopItem.id ===
          id
      );

    if (!item) {
      return;
    }

    launchItem(
      item
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Launch System App
  |--------------------------------------------------------------------------
  */

  function launchSystemApp(
    id: SystemAppId
  ) {
    const item =
      desktopItems.find(
        (
          desktopItem
        ) =>
          desktopItem.id ===
          id
      );

    if (!item) {
      return;
    }

    launchItem(
      item
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Global Keyboard Shortcuts
  |--------------------------------------------------------------------------
  |
  | Cmd / Ctrl + K
  | → Command Palette
  |
  | Cmd / Ctrl + Shift + F
  | → Search
  |
  | Cmd / Ctrl + Shift + G
  | → Knowledge Graph
  |
  | Cmd / Ctrl + Shift + A
  | → Activity Monitor
  |
  | Cmd / Ctrl + ,
  | → Settings
  |
  | Cmd / Ctrl + `
  | → Terminal
  |
  */

  useEffect(() => {
    function handleKeyDown(
      event: KeyboardEvent
    ) {
      const modifier =
        event.metaKey ||
        event.ctrlKey;

      const key =
        event.key.toLowerCase();

      /*
       * Command Palette
       */

      if (
        modifier &&
        key === "k"
      ) {
        event.preventDefault();

        setCommandPaletteOpen(
          (
            current
          ) =>
            !current
        );

        return;
      }

      /*
       * ESC
       */

      if (
        event.key ===
          "Escape" &&
        commandPaletteOpen
      ) {
        event.preventDefault();

        setCommandPaletteOpen(
          false
        );

        return;
      }

      /*
       * Palette가 열려 있으면
       * 나머지 글로벌 단축키 차단
       */

      if (
        commandPaletteOpen
      ) {
        return;
      }

      /*
       * Search
       */

      if (
        modifier &&
        event.shiftKey &&
        key === "f"
      ) {
        event.preventDefault();

        launchSystemApp(
          "search"
        );

        return;
      }

      /*
       * Graph
       */

      if (
        modifier &&
        event.shiftKey &&
        key === "g"
      ) {
        event.preventDefault();

        launchSystemApp(
          "graph"
        );

        return;
      }

      /*
       * Activity
       */

      if (
        modifier &&
        event.shiftKey &&
        key === "a"
      ) {
        event.preventDefault();

        launchSystemApp(
          "activity"
        );

        return;
      }

      /*
       * Settings
       */

      if (
        modifier &&
        event.key === ","
      ) {
        event.preventDefault();

        launchSystemApp(
          "settings"
        );

        return;
      }

      /*
       * Terminal
       */

      if (
        modifier &&
        event.code ===
          "Backquote"
      ) {
        event.preventDefault();

        launchSystemApp(
          "terminal"
        );
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  });

  /*
  |--------------------------------------------------------------------------
  | Mobile Dock State
  |--------------------------------------------------------------------------
  */

  const hasVisibleWindow =
    openWindows.some(
      (
        currentWindow
      ) =>
        !currentWindow.minimized &&
        !closingWindowIds.has(
          currentWindow.windowId
        )
    );

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <main
      style={
        getThemeStyle(
          settings.theme
        )
      }

      onClick={() =>
        setSelectedDesktopItem(
          null
        )
      }

      className="
        relative
        min-h-dvh
        overflow-hidden
        bg-[var(--os-bg)]
        text-[var(--os-text)]
        transition-colors
        duration-300
      "
    >
      {/* Wallpaper */}

      <Wallpaper
        wallpaper={
          settings.wallpaper
        }
      />

      {/* Menu Bar */}

      <MenuBar
        onOpenCommandPalette={() =>
          setCommandPaletteOpen(
            true
          )
        }
      />

      {/* Desktop Icons */}

      <div
        className="
          relative
          z-10

          grid
          w-fit
          grid-cols-2

          gap-x-2
          gap-y-2

          p-4
          pb-24

          sm:grid-cols-3
          sm:gap-x-4

          md:grid-cols-4
          md:gap-x-5
          md:gap-y-3
          md:p-6
          md:pb-24

          xl:grid-cols-5
        "
      >
        {desktopItems.map(
          (item) => (
            <DesktopIcon
              key={
                item.id
              }

              name={
                item.name
              }

              type={
                item.type
              }

              size={
                settings.desktopIconSize
              }

              selected={
                selectedDesktopItem ===
                item.id
              }

              onSelect={() =>
                setSelectedDesktopItem(
                  item.id
                )
              }

              onOpen={() =>
                launchItem(
                  item
                )
              }
            />
          )
        )}
      </div>

      {/* Windows */}

      {openWindows.map(
        (
          currentWindow
        ) => (
          <OSWindow
            key={
              currentWindow.windowId
            }

            title={
              currentWindow.title
            }

            position={{
              x:
                currentWindow.x,

              y:
                currentWindow.y,
            }}

            zIndex={
              currentWindow.zIndex
            }

            minimized={
              currentWindow.minimized
            }

            maximized={
              currentWindow.maximized
            }

            closing={
              closingWindowIds.has(
                currentWindow.windowId
              )
            }

            onClose={() =>
              closeWindow(
                currentWindow.windowId
              )
            }

            onFocus={() =>
              focusWindow(
                currentWindow.windowId
              )
            }

            onMinimize={() =>
              minimizeWindow(
                currentWindow.windowId
              )
            }

            onToggleMaximize={() =>
              toggleMaximizeWindow(
                currentWindow.windowId
              )
            }

            onMove={(
              x,
              y
            ) =>
              moveWindow(
                currentWindow.windowId,

                x,

                y
              )
            }
          >
            {/* Terminal */}

            {currentWindow.kind ===
              "terminal" && (
              <Terminal
                posts={
                  posts
                }

                onOpenPost={
                  openPostWindow
                }
              />
            )}

            {/* Search */}

            {currentWindow.kind ===
              "search" && (
              <Search
                posts={
                  posts
                }

                onOpenPost={
                  openPostWindow
                }
              />
            )}

            {/* Knowledge Graph */}

            {currentWindow.kind ===
              "graph" && (
              <KnowledgeGraph
                posts={
                  posts
                }

                onOpenPost={
                  openPostWindow
                }
              />
            )}

            {/* Activity Monitor */}

            {currentWindow.kind ===
              "activity" && (
              <ActivityMonitor
                posts={
                  posts
                }

                onOpenPost={
                  openPostWindow
                }
              />
            )}

            {/* Settings */}

            {currentWindow.kind ===
              "settings" && (
              <SettingsApp />
            )}

            {/* Folder */}

            {currentWindow.kind ===
              "folder" && (
              <FolderContent
                items={
                  posts
                    .filter(
                      (
                        post
                      ) =>
                        post.categoryId ===
                        currentWindow.contentId
                    )
                    .map(
                      (
                        post
                      ) => ({
                        id:
                          post.id,

                        title:
                          post.title,
                      })
                    )
                }

                onOpenPost={
                  openPostWindow
                }
              />
            )}

            {/* Post */}

            {currentWindow.kind ===
              "post" && (
              <PostWindow
                postId={
                  currentWindow.contentId
                }

                posts={
                  posts
                }
              />
            )}
          </OSWindow>
        )
      )}

      {/* Dock */}

      <Dock
        launchers={
          desktopItems
        }

        windows={
          openWindows.map(
            (
              currentWindow
            ) => ({
              windowId:
                currentWindow.windowId,

              title:
                currentWindow.title,

              kind:
                currentWindow.kind,

              minimized:
                currentWindow.minimized,
            })
          )
        }

        onLaunch={
          launchFromDock
        }

        onSelectWindow={
          selectWindow
        }

        hideOnMobile={
          hasVisibleWindow
        }
      />

      {/* Command Palette */}

      {commandPaletteOpen && (
        <CommandPalette
          posts={
            posts
          }

          onClose={() =>
            setCommandPaletteOpen(
              false
            )
          }

          onLaunchApp={
            launchSystemApp
          }

          onOpenCategory={
            openCategoryWindow
          }

          onOpenPost={
            openPostWindow
          }
        />
      )}
    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Mobile
|--------------------------------------------------------------------------
*/

function isMobileViewport() {
  if (
    typeof window ===
    "undefined"
  ) {
    return false;
  }

  return window.matchMedia(
    "(max-width: 767px)"
  ).matches;
}

/*
|--------------------------------------------------------------------------
| URL → Post
|--------------------------------------------------------------------------
*/

function getPostIdFromPathname(
  pathname: string
): string | null {
  const match =
    pathname.match(
      /^\/posts\/([^/]+)\/?$/
    );

  if (!match) {
    return null;
  }

  try {
    return decodeURIComponent(
      match[1]
    );
  } catch {
    return match[1];
  }
}

/*
|--------------------------------------------------------------------------
| Folder
|--------------------------------------------------------------------------
*/

type FolderItem = {
  id: string;

  title: string;
};

function FolderContent({
  items,
  onOpenPost,
}: {
  items:
    readonly FolderItem[];

  onOpenPost: (
    id: string,
    title: string
  ) => void;
}) {
  if (
    items.length ===
    0
  ) {
    return (
      <div
        className="
          flex
          min-h-64
          items-center
          justify-center
          text-sm
          text-[var(--os-muted)]
        "
      >
        This folder is empty.
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Mobile Single Tap
  |--------------------------------------------------------------------------
  */

  function handleFileClick(
    id: string,
    title: string
  ) {
    if (
      !isMobileViewport()
    ) {
      return;
    }

    onOpenPost(
      id,
      title
    );
  }

  return (
    <div
      className="
        grid
        grid-cols-1
        gap-2

        sm:grid-cols-2

        md:gap-3
      "
    >
      {items.map(
        (item) => (
          <button
            type="button"

            key={
              item.id
            }

            onClick={() =>
              handleFileClick(
                item.id,
                item.title
              )
            }

            onDoubleClick={() => {
              if (
                isMobileViewport()
              ) {
                return;
              }

              onOpenPost(
                item.id,
                item.title
              );
            }}

            className="
              group
              flex
              min-h-14
              items-center
              gap-3

              rounded-xl
              border
              border-transparent

              p-3
              text-left

              transition

              active:bg-[var(--os-panel-soft)]

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

            <span
              className="
                truncate
                text-sm
                text-[var(--os-text)]
              "
            >
              {
                item.title
              }
            </span>
          </button>
        )
      )}
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Post
|--------------------------------------------------------------------------
*/

function PostWindow({
  postId,
  posts,
}: {
  postId: string;

  posts: Post[];
}) {
  const post =
    posts.find(
      (post) =>
        post.id ===
        postId
    );

  if (!post) {
    return (
      <div
        className="
          text-red-500
        "
      >
        Post not found.
      </div>
    );
  }

  return (
    <PostContent
      post={
        post
      }
    />
  );
}