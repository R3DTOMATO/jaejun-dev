"use client";

import type {
  MouseEvent,
} from "react";

import AppIcon from "../../components/icons/AppIcon";

import type {
  DesktopIconSize,
} from "../../types/system-settings";

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

export type DesktopIconType =
  | "folder"
  | "search"
  | "graph"
  | "activity"
  | "settings"
  | "terminal";

type DesktopIconProps = {
  name: string;

  type: DesktopIconType;

  size: DesktopIconSize;

  selected: boolean;

  onSelect: () => void;

  onOpen: () => void;
};

/*
|--------------------------------------------------------------------------
| Sizes
|--------------------------------------------------------------------------
*/

const sizeClasses = {
  small: {
    button:
      "w-24",

    container:
      "h-12 w-12",

    icon:
      "h-11 w-11",

    text:
      "text-xs",
  },

  medium: {
    button:
      "w-28",

    container:
      "h-16 w-16",

    icon:
      "h-14 w-14",

    text:
      "text-sm",
  },

  large: {
    button:
      "w-32",

    container:
      "h-20 w-20",

    icon:
      "h-[72px] w-[72px]",

    text:
      "text-sm",
  },
} as const;

/*
|--------------------------------------------------------------------------
| Desktop Icon
|--------------------------------------------------------------------------
*/

export default function DesktopIcon({
  name,
  type,
  size,
  selected,
  onSelect,
  onOpen,
}: DesktopIconProps) {
  const classes =
    sizeClasses[
      size
    ];

  /*
  |--------------------------------------------------------------------------
  | Click
  |--------------------------------------------------------------------------
  */

  function handleClick(
    event: MouseEvent<HTMLButtonElement>
  ) {
    event.stopPropagation();

    const isMobile =
      window.matchMedia(
        "(max-width: 767px)"
      ).matches;

    if (isMobile) {
      onOpen();

      return;
    }

    onSelect();
  }

  /*
  |--------------------------------------------------------------------------
  | Double Click
  |--------------------------------------------------------------------------
  */

  function handleDoubleClick(
    event: MouseEvent<HTMLButtonElement>
  ) {
    event.stopPropagation();

    const isMobile =
      window.matchMedia(
        "(max-width: 767px)"
      ).matches;

    if (isMobile) {
      return;
    }

    onOpen();
  }

  const iconColor =
    getIconColor(
      type
    );

  return (
    <button
      type="button"

      onClick={
        handleClick
      }

      onDoubleClick={
        handleDoubleClick
      }

      aria-pressed={
        selected
      }

      className={`
        group
        flex
        flex-col
        items-center
        gap-2
        rounded-xl
        px-2
        py-3
        text-center
        outline-none
        transition

        ${classes.button}

        ${
          selected
            ? "bg-[var(--os-panel-soft)] ring-1 ring-[var(--os-border)]"
            : "hover:bg-[var(--os-panel-soft)]"
        }

        focus-visible:ring-2
        focus-visible:ring-[var(--os-accent)]
      `}
    >
      <div
        className={`
          flex
          items-center
          justify-center

          ${classes.container}
        `}
      >
        <AppIcon
          type={
            type
          }

          className={`
            ${classes.icon}

            ${iconColor}

            drop-shadow-lg
            transition
            duration-150

            md:group-hover:-translate-y-1
          `}
        />
      </div>

      <span
        className={`
          max-w-full
          rounded-md
          px-1.5
          py-0.5
          leading-5
          text-[var(--os-text)]
          drop-shadow

          ${classes.text}

          ${
            selected
              ? "bg-[var(--os-accent)] text-white"
              : ""
          }
        `}
      >
        {name}
      </span>
    </button>
  );
}

/*
|--------------------------------------------------------------------------
| Icon Color
|--------------------------------------------------------------------------
*/

function getIconColor(
  type: DesktopIconType
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

    case "terminal":
      return "text-slate-700";
  }
}