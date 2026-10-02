"use client";

import {
  useEffect,
  useState,
} from "react";

/*
|--------------------------------------------------------------------------
| Props
|--------------------------------------------------------------------------
*/

type MenuBarProps = {
  onOpenCommandPalette:
    () => void;
};

/*
|--------------------------------------------------------------------------
| Menu Bar
|--------------------------------------------------------------------------
*/

export default function MenuBar({
  onOpenCommandPalette,
}: MenuBarProps) {
  const [
    currentTime,
    setCurrentTime,
  ] =
    useState<Date | null>(
      null
    );

  /*
  |--------------------------------------------------------------------------
  | Clock
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    function updateTime() {
      setCurrentTime(
        new Date()
      );
    }

    updateTime();

    const timer =
      window.setInterval(
        updateTime,
        30_000
      );

    return () =>
      window.clearInterval(
        timer
      );
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Date
  |--------------------------------------------------------------------------
  */

  const dateLabel =
    currentTime
      ? new Intl.DateTimeFormat(
          "ko-KR",
          {
            month:
              "long",

            day:
              "numeric",

            weekday:
              "short",
          }
        ).format(
          currentTime
        )
      : "";

  /*
  |--------------------------------------------------------------------------
  | Time
  |--------------------------------------------------------------------------
  */

  const timeLabel =
    currentTime
      ? new Intl.DateTimeFormat(
          "ko-KR",
          {
            hour:
              "2-digit",

            minute:
              "2-digit",

            hour12:
              false,
          }
        ).format(
          currentTime
        )
      : "--:--";

  return (
    <header
      className="
        relative
        z-[10000]

        flex
        h-10
        items-center
        justify-between

        border-b
        border-[var(--os-border)]
        bg-[var(--os-menubar)]

        px-3

        text-xs
        text-[var(--os-text)]

        shadow-sm
        backdrop-blur-2xl

        md:h-9
        md:px-4
        md:text-[13px]
      "
    >
      {/* Left */}

      <div
        className="
          flex
          min-w-0
          items-center
          gap-3

          md:gap-5
        "
      >
        {/* Logo */}

        <button
          type="button"

          onClick={
            onOpenCommandPalette
          }

          className="
            flex
            h-6
            w-6
            shrink-0
            items-center
            justify-center

            rounded-md

            bg-[var(--os-text)]
            text-[10px]
            font-bold
            text-[var(--os-bg)]

            transition
            hover:opacity-80
          "

          aria-label="Open Command Palette"
        >
          J
        </button>

        {/* Mobile */}

        <span
          className="
            truncate
            font-semibold

            md:hidden
          "
        >
          Jaejun OS
        </span>

        {/* Desktop */}

        <span
          className="
            hidden
            font-semibold

            md:inline
          "
        >
          Jaejun.dev
        </span>

        <span
          className="
            hidden
            text-[var(--os-muted)]

            lg:inline
          "
        >
          Knowledge OS
        </span>

        {/* Command Palette */}

        <button
          type="button"

          onClick={
            onOpenCommandPalette
          }

          className="
            hidden
            items-center
            gap-2

            rounded-md
            border
            border-[var(--os-border)]

            bg-[var(--os-panel-soft)]

            px-2
            py-1

            text-[11px]
            text-[var(--os-muted)]

            transition

            hover:text-[var(--os-text)]

            md:flex
          "
        >
          <span>
            Command
          </span>

          <kbd
            className="
              font-mono
              text-[9px]
            "
          >
            ⌘/Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right */}

      <div
        className="
          flex
          shrink-0
          items-center
          gap-3
          text-[var(--os-muted)]

          md:gap-4
        "
      >
        {/* Mobile Command Button */}

        <button
          type="button"

          onClick={
            onOpenCommandPalette
          }

          aria-label="Open Command Palette"

          className="
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-md
            text-base

            md:hidden
          "
        >
          ⌕
        </button>

        <WifiIcon />

        <BatteryIcon />

        <span
          className="
            hidden

            lg:inline
          "
        >
          {dateLabel}
        </span>

        <span
          className="
            min-w-10
            text-right
            font-medium
            tabular-nums
            text-[var(--os-text)]
          "
        >
          {timeLabel}
        </span>
      </div>
    </header>
  );
}

/*
|--------------------------------------------------------------------------
| Wi-Fi
|--------------------------------------------------------------------------
*/

function WifiIcon() {
  return (
    <svg
      viewBox="0 0 24 24"

      className="
        h-4
        w-4
      "

      fill="none"

      stroke="currentColor"

      strokeWidth="1.8"

      strokeLinecap="round"

      aria-hidden="true"
    >
      <path
        d="M3 8.5C8.5 4 15.5 4 21 8.5"
      />

      <path
        d="M6.5 12C10 9 14 9 17.5 12"
      />

      <path
        d="M10 15.5C11.3 14.5 12.7 14.5 14 15.5"
      />

      <circle
        cx="12"
        cy="18.5"
        r="1"

        fill="currentColor"

        stroke="none"
      />
    </svg>
  );
}

/*
|--------------------------------------------------------------------------
| Battery
|--------------------------------------------------------------------------
*/

function BatteryIcon() {
  return (
    <svg
      viewBox="0 0 28 14"

      className="
        h-4
        w-7
      "

      fill="none"

      aria-hidden="true"
    >
      <rect
        x="1"
        y="2"

        width="22"
        height="10"

        rx="2.5"

        stroke="currentColor"

        strokeWidth="1.5"
      />

      <rect
        x="3.5"
        y="4.5"

        width="16"
        height="5"

        rx="1"

        fill="currentColor"
      />

      <path
        d="M25 5C26.2 5 27 5.8 27 7C27 8.2 26.2 9 25 9V5Z"

        fill="currentColor"
      />
    </svg>
  );
}