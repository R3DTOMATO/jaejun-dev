"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  FormEvent,
  KeyboardEvent,
} from "react";

import type {
  Post,
} from "../../types/post";

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

type TerminalProps = {
  posts: Post[];

  onOpenPost: (
    postId: string,
    title: string
  ) => void;
};

type HistoryItem = {
  id: number;

  prompt?: string;

  command?: string;

  output?: string[];
};

/*
|--------------------------------------------------------------------------
| Commands
|--------------------------------------------------------------------------
*/

const commands = [
  "help",
  "pwd",
  "ls",
  "cd",
  "cat",
  "open",
  "history",
  "clear",
] as const;

/*
|--------------------------------------------------------------------------
| Terminal
|--------------------------------------------------------------------------
*/

export default function Terminal({
  posts,
  onOpenPost,
}: TerminalProps) {
  const [
    currentDirectory,
    setCurrentDirectory,
  ] =
    useState<string | null>(
      null
    );

  const [
    input,
    setInput,
  ] =
    useState("");

  const [
    history,
    setHistory,
  ] =
    useState<HistoryItem[]>([
      {
        id: 0,

        output: [
          "Jaejun Knowledge Operating System",
          "",
          'Type "help" to see available commands.',
        ],
      },
    ]);

  const [
    commandHistory,
    setCommandHistory,
  ] =
    useState<string[]>(
      []
    );

  const [
    historyIndex,
    setHistoryIndex,
  ] =
    useState<number | null>(
      null
    );

  const commandDraftRef =
    useRef("");

  const nextHistoryId =
    useRef(1);

  const terminalBottomRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const inputRef =
    useRef<HTMLInputElement | null>(
      null
    );

  /*
  |--------------------------------------------------------------------------
  | Auto Scroll
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({
      behavior:
        "smooth",
    });
  }, [
    history,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Categories
  |--------------------------------------------------------------------------
  */

  const categories =
    useMemo(() => {
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
  | Prompt
  |--------------------------------------------------------------------------
  */

  const prompt =
    currentDirectory
      ? `jaejun@blog:~/${currentDirectory}$`
      : "jaejun@blog:~$";

  /*
  |--------------------------------------------------------------------------
  | History
  |--------------------------------------------------------------------------
  */

  function getHistoryId() {
    const id =
      nextHistoryId.current;

    nextHistoryId.current +=
      1;

    return id;
  }

  function addHistory(
    command: string,
    output: string[]
  ) {
    setHistory(
      (
        currentHistory
      ) => [
        ...currentHistory,

        {
          id:
            getHistoryId(),

          prompt,

          command,

          output,
        },
      ]
    );
  }

  function addOutput(
    output: string[]
  ) {
    setHistory(
      (
        currentHistory
      ) => [
        ...currentHistory,

        {
          id:
            getHistoryId(),

          output,
        },
      ]
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Find Post
  |--------------------------------------------------------------------------
  */

  function findPost(
    fileName: string
  ) {
    if (
      !currentDirectory
    ) {
      return undefined;
    }

    const postId =
      fileName.replace(
        /\.md$/i,
        ""
      );

    return posts.find(
      (post) =>
        post.id ===
          postId &&
        post.categoryId ===
          currentDirectory
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Execute
  |--------------------------------------------------------------------------
  */

  function executeCommand(
    rawCommand: string
  ) {
    const trimmed =
      rawCommand.trim();

    if (!trimmed) {
      addHistory(
        rawCommand,
        []
      );

      return;
    }

    const nextCommandHistory =
      [
        ...commandHistory,

        trimmed,
      ];

    setCommandHistory(
      nextCommandHistory
    );

    setHistoryIndex(
      null
    );

    commandDraftRef.current =
      "";

    const parts =
      trimmed.split(
        /\s+/
      );

    const command =
      parts[0].toLowerCase();

    const args =
      parts.slice(1);

    switch (command) {
      case "help":
        addHistory(
          rawCommand,
          [
            "Available commands:",
            "",
            "help              Show available commands",
            "pwd               Show current directory",
            "ls                List files and directories",
            "cd <directory>    Change directory",
            "cd ..             Go to parent directory",
            "cd ~              Go to root directory",
            "cat <file.md>     Print a post in terminal",
            "open <file.md>    Open a post in GUI",
            "history           Show command history",
            "clear             Clear terminal output",
          ]
        );

        break;

      case "pwd":
        addHistory(
          rawCommand,
          [
            currentDirectory
              ? `/knowledge/${currentDirectory}`
              : "/knowledge",
          ]
        );

        break;

      case "ls":
        handleLs(
          rawCommand
        );

        break;

      case "cd":
        handleCd(
          rawCommand,
          args
        );

        break;

      case "cat":
        handleCat(
          rawCommand,
          args
        );

        break;

      case "open":
        handleOpen(
          rawCommand,
          args
        );

        break;

      case "history":
        addHistory(
          rawCommand,

          nextCommandHistory.map(
            (
              commandValue,
              index
            ) =>
              `${String(
                index + 1
              ).padStart(
                3,
                " "
              )}  ${commandValue}`
          )
        );

        break;

      case "clear":
        setHistory(
          []
        );

        break;

      default:
        addHistory(
          rawCommand,
          [
            `command not found: ${command}`,
            'Type "help" for available commands.',
          ]
        );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | ls
  |--------------------------------------------------------------------------
  */

  function handleLs(
    rawCommand: string
  ) {
    if (
      !currentDirectory
    ) {
      addHistory(
        rawCommand,

        categories.map(
          (category) =>
            `${category.id}/`
        )
      );

      return;
    }

    const directoryPosts =
      posts.filter(
        (post) =>
          post.categoryId ===
          currentDirectory
      );

    addHistory(
      rawCommand,

      directoryPosts.map(
        (post) =>
          `${post.id}.md`
      )
    );
  }

  /*
  |--------------------------------------------------------------------------
  | cd
  |--------------------------------------------------------------------------
  */

  function handleCd(
    rawCommand: string,
    args: string[]
  ) {
    const rawTarget =
      args[0];

    if (
      !rawTarget ||
      rawTarget === "~" ||
      rawTarget === ".."
    ) {
      addHistory(
        rawCommand,
        []
      );

      setCurrentDirectory(
        null
      );

      return;
    }

    const target =
      rawTarget.replace(
        /\/+$/,
        ""
      );

    if (
      currentDirectory
    ) {
      addHistory(
        rawCommand,
        [
          `cd: no such directory: ${target}`,
        ]
      );

      return;
    }

    const category =
      categories.find(
        (
          categoryItem
        ) =>
          categoryItem.id ===
          target
      );

    if (!category) {
      addHistory(
        rawCommand,
        [
          `cd: no such directory: ${target}`,
        ]
      );

      return;
    }

    addHistory(
      rawCommand,
      []
    );

    setCurrentDirectory(
      category.id
    );
  }

  /*
  |--------------------------------------------------------------------------
  | cat
  |--------------------------------------------------------------------------
  */

  function handleCat(
    rawCommand: string,
    args: string[]
  ) {
    const fileName =
      args[0];

    if (!fileName) {
      addHistory(
        rawCommand,
        [
          "cat: missing file operand",
        ]
      );

      return;
    }

    const post =
      findPost(
        fileName
      );

    if (!post) {
      addHistory(
        rawCommand,
        [
          `cat: ${fileName}: No such file`,
        ]
      );

      return;
    }

    addHistory(
      rawCommand,
      [
        `# ${post.title}`,
        "",
        `Category: ${post.category}`,
        `Status: ${post.status}`,
        `Created: ${post.createdAt}`,
        `Updated: ${post.updatedAt}`,
        "",
        post.content,
      ]
    );
  }

  /*
  |--------------------------------------------------------------------------
  | open
  |--------------------------------------------------------------------------
  */

  function handleOpen(
    rawCommand: string,
    args: string[]
  ) {
    const fileName =
      args[0];

    if (!fileName) {
      addHistory(
        rawCommand,
        [
          "open: missing file operand",
        ]
      );

      return;
    }

    const post =
      findPost(
        fileName
      );

    if (!post) {
      addHistory(
        rawCommand,
        [
          `open: ${fileName}: No such file`,
        ]
      );

      return;
    }

    addHistory(
      rawCommand,
      [
        `Opening ${post.id}.md...`,
      ]
    );

    onOpenPost(
      post.id,
      post.title
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    executeCommand(
      input
    );

    setInput("");

    commandDraftRef.current =
      "";

    setHistoryIndex(
      null
    );
  }

  /*
  |--------------------------------------------------------------------------
  | History Navigation
  |--------------------------------------------------------------------------
  */

  function showPreviousCommand() {
    if (
      commandHistory.length ===
      0
    ) {
      return;
    }

    if (
      historyIndex ===
      null
    ) {
      commandDraftRef.current =
        input;

      const index =
        commandHistory.length -
        1;

      setHistoryIndex(
        index
      );

      setInput(
        commandHistory[
          index
        ]
      );

      return;
    }

    const index =
      Math.max(
        0,
        historyIndex - 1
      );

    setHistoryIndex(
      index
    );

    setInput(
      commandHistory[
        index
      ]
    );
  }

  function showNextCommand() {
    if (
      historyIndex ===
      null
    ) {
      return;
    }

    const index =
      historyIndex + 1;

    if (
      index >=
      commandHistory.length
    ) {
      setHistoryIndex(
        null
      );

      setInput(
        commandDraftRef.current
      );

      return;
    }

    setHistoryIndex(
      index
    );

    setInput(
      commandHistory[
        index
      ]
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Common Prefix
  |--------------------------------------------------------------------------
  */

  function getCommonPrefix(
    values: string[]
  ) {
    if (
      values.length ===
      0
    ) {
      return "";
    }

    let prefix =
      values[0];

    for (
      let index = 1;
      index <
      values.length;
      index += 1
    ) {
      while (
        !values[
          index
        ].startsWith(
          prefix
        )
      ) {
        prefix =
          prefix.slice(
            0,
            -1
          );

        if (!prefix) {
          return "";
        }
      }
    }

    return prefix;
  }

  /*
  |--------------------------------------------------------------------------
  | Completion
  |--------------------------------------------------------------------------
  */

  function applyCompletion(
    prefix: string,
    partial: string,
    candidates: string[],
    addSpace: boolean
  ) {
    const matches =
      candidates.filter(
        (candidate) =>
          candidate.startsWith(
            partial
          )
      );

    if (
      matches.length ===
      0
    ) {
      return;
    }

    if (
      matches.length ===
      1
    ) {
      setInput(
        `${prefix}${matches[0]}${
          addSpace
            ? " "
            : ""
        }`
      );

      return;
    }

    const commonPrefix =
      getCommonPrefix(
        matches
      );

    if (
      commonPrefix.length >
      partial.length
    ) {
      setInput(
        `${prefix}${commonPrefix}`
      );

      return;
    }

    addOutput(
      matches
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Autocomplete
  |--------------------------------------------------------------------------
  */

  function handleAutocomplete() {
    const value =
      input.trimStart();

    if (!value) {
      addOutput(
        [...commands]
      );

      return;
    }

    const endsWithSpace =
      /\s$/.test(
        value
      );

    const parts =
      value.split(
        /\s+/
      );

    if (
      parts.length ===
        1 &&
      !endsWithSpace
    ) {
      applyCompletion(
        "",
        parts[0].toLowerCase(),
        [...commands],
        true
      );

      return;
    }

    const command =
      parts[0].toLowerCase();

    const partial =
      endsWithSpace
        ? ""
        : parts[
            parts.length -
              1
          ];

    if (
      command === "cd"
    ) {
      applyCompletion(
        "cd ",
        partial,
        currentDirectory
          ? [
              "..",
              "~",
            ]
          : [
              ...categories.map(
                (
                  category
                ) =>
                  category.id
              ),
              "~",
            ],
        false
      );

      return;
    }

    if (
      command === "cat" ||
      command === "open"
    ) {
      if (
        !currentDirectory
      ) {
        return;
      }

      applyCompletion(
        `${command} `,
        partial,

        posts
          .filter(
            (post) =>
              post.categoryId ===
              currentDirectory
          )
          .map(
            (post) =>
              `${post.id}.md`
          ),

        false
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Keyboard
  |--------------------------------------------------------------------------
  */

  function handleKeyDown(
    event: KeyboardEvent<HTMLInputElement>
  ) {
    switch (
      event.key
    ) {
      case "ArrowUp":
        event.preventDefault();

        showPreviousCommand();

        break;

      case "ArrowDown":
        event.preventDefault();

        showNextCommand();

        break;

      case "Tab":
        event.preventDefault();

        handleAutocomplete();

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
      onClick={() =>
        inputRef.current?.focus()
      }

      className="
        flex
        h-full
        min-h-[320px]
        flex-col
        overflow-hidden
        rounded-lg
        bg-black
        font-mono
        text-sm
        text-green-400

        md:h-[420px]
      "
    >
      {/* Output */}

      <div
        className="
          min-h-0
          flex-1
          overflow-y-auto
          p-4
        "
      >
        {history.map(
          (item) => (
            <div
              key={
                item.id
              }

              className="
                mb-3
              "
            >
              {item.command !==
                undefined && (
                <p
                  className="
                    break-all
                  "
                >
                  <span
                    className="
                      text-blue-300
                    "
                  >
                    {
                      item.prompt
                    }
                  </span>{" "}

                  <span
                    className="
                      text-white
                    "
                  >
                    {
                      item.command
                    }
                  </span>
                </p>
              )}

              {item.output?.map(
                (
                  line,
                  index
                ) => (
                  <pre
                    key={
                      `${item.id}-${index}`
                    }

                    className="
                      whitespace-pre-wrap
                      break-words
                      font-mono
                      text-green-400
                    "
                  >
                    {line ||
                      " "}
                  </pre>
                )
              )}
            </div>
          )
        )}

        <div
          ref={
            terminalBottomRef
          }
        />
      </div>

      {/* Input */}

      <form
        onSubmit={
          handleSubmit
        }

        className="
          flex
          shrink-0
          items-center
          border-t
          border-white/10
          px-3
          py-3

          sm:px-4
        "
      >
        <span
          className="
            mr-2
            max-w-[45%]
            shrink-0
            truncate
            whitespace-nowrap
            text-blue-300

            sm:max-w-none
          "
        >
          {prompt}
        </span>

        <input
          ref={
            inputRef
          }

          autoFocus

          value={
            input
          }

          onChange={(
            event
          ) => {
            setInput(
              event.target.value
            );

            setHistoryIndex(
              null
            );

            commandDraftRef.current =
              event.target.value;
          }}

          onKeyDown={
            handleKeyDown
          }

          spellCheck={
            false
          }

          autoComplete="off"

          aria-label="Terminal command"

          className="
            min-w-0
            flex-1
            bg-transparent
            text-base
            text-white
            outline-none

            md:text-sm
          "
        />
      </form>
    </div>
  );
}