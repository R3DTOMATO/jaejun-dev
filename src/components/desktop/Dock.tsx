"use client";

import {
  useState,
} from "react";

import AppIcon from "../../components/icons/AppIcon";

import type {
  AppIconType,
} from "../../components/icons/AppIcon";

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

type DockWindowKind =
  | "folder"
  | "search"
  | "graph"
  | "activity"
  | "settings"
  | "terminal"
  | "post";

export type DockWindow = {
  windowId: string;

  title: string;

  kind: DockWindowKind;

  minimized: boolean;
};

type DockLauncher = {
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

type DockProps = {
  launchers:
    readonly DockLauncher[];

  windows:
    readonly DockWindow[];

  onLaunch: (
    id: string
  ) => void;

  onSelectWindow: (
    windowId: string
  ) => void;

  hideOnMobile?: boolean;
};

/*
|--------------------------------------------------------------------------
| Dock
|--------------------------------------------------------------------------
*/

export default function Dock({
  launchers,
  windows,
  onLaunch,
  onSelectWindow,
  hideOnMobile = false,
}: DockProps) {
  /*
  |--------------------------------------------------------------------------
  | Magnification
  |--------------------------------------------------------------------------
  */

  const [
    hoveredIndex,
    setHoveredIndex,
  ] =
    useState<number | null>(
      null
    );

  /*
   * Running Window의 index가
   * launcher 이후부터 시작하도록 한다.
   */

  const runningIndexOffset =
    launchers.length;

  return (
    <div
      className={`
        fixed
        bottom-2
        left-2
        right-2
        z-[9000]

        md:absolute
        md:bottom-5
        md:left-1/2
        md:right-auto
        md:-translate-x-1/2

        ${
          hideOnMobile
            ? "hidden md:block"
            : "block"
        }
      `}
    >
      <div
        onMouseLeave={() =>
          setHoveredIndex(
            null
          )
        }

        className="
          mx-auto
          flex
          w-fit
          max-w-full
          items-end
          gap-1.5
          overflow-x-auto
          overflow-y-visible

          rounded-[20px]
          border
          border-[var(--os-border)]
          bg-[var(--os-dock)]

          px-2
          py-2

          shadow-[0_20px_60px_rgba(0,0,0,0.4)]
          backdrop-blur-2xl

          md:gap-2
          md:rounded-[22px]
          md:px-3
          md:py-2.5
        "
      >
        {/* Launchers */}

        {launchers.map(
          (
            item,
            index
          ) => (
            <div
              key={
                item.id
              }

              className={
                item.type ===
                "folder"
                  ? "hidden md:block"
                  : "block"
              }
            >
              <DockButton
                title={
                  item.name
                }

                iconType={
                  item.type
                }

                magnificationClass={
                  getMagnificationClass(
                    hoveredIndex,
                    index
                  )
                }

                onMouseEnter={() =>
                  setHoveredIndex(
                    index
                  )
                }

                onClick={() =>
                  onLaunch(
                    item.id
                  )
                }
              />
            </div>
          )
        )}

        {/* Divider */}

        {windows.length >
          0 && (
          <div
            className="
              mx-1
              h-9
              w-px
              shrink-0
              bg-[var(--os-border)]

              md:h-10
            "
          />
        )}

        {/* Running Windows */}

        {windows.map(
          (
            window,
            index
          ) => {
            const dockIndex =
              runningIndexOffset +
              index;

            return (
              <DockButton
                key={
                  window.windowId
                }

                title={
                  window.title
                }

                iconType={
                  window.kind
                }

                running

                minimized={
                  window.minimized
                }

                magnificationClass={
                  getMagnificationClass(
                    hoveredIndex,
                    dockIndex
                  )
                }

                onMouseEnter={() =>
                  setHoveredIndex(
                    dockIndex
                  )
                }

                onClick={() =>
                  onSelectWindow(
                    window.windowId
                  )
                }
              />
            );
          }
        )}
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Dock Button
|--------------------------------------------------------------------------
*/

type DockButtonProps = {
  title: string;

  iconType:
    AppIconType;

  running?: boolean;

  minimized?: boolean;

  magnificationClass:
    string;

  onMouseEnter:
    () => void;

  onClick:
    () => void;
};

function DockButton({
  title,
  iconType,
  running = false,
  minimized = false,
  magnificationClass,
  onMouseEnter,
  onClick,
}: DockButtonProps) {
  return (
    <button
      type="button"

      onMouseEnter={
        onMouseEnter
      }

      onClick={
        onClick
      }

      className={`
        group
        relative

        flex
        h-12
        w-12
        shrink-0
        items-center
        justify-center

        rounded-xl

        bg-[var(--os-panel-soft)]

        transition-[transform,background-color]
        duration-150
        ease-out

        active:scale-95

        md:h-14
        md:w-14
        md:rounded-2xl

        ${magnificationClass}
      `}
    >
      <AppIcon
        type={
          iconType
        }

        className={`
          h-9
          w-9
          drop-shadow-lg

          md:h-11
          md:w-11

          ${getIconColor(
            iconType
          )}
        `}
      />

      {/* Running */}

      {running && (
        <span
          className="
            absolute
            -bottom-1
            h-1
            w-1
            rounded-full
            bg-[var(--os-text)]

            md:-bottom-1.5
          "
        />
      )}

      {/* Minimized */}

      {minimized && (
        <span
          className="
            absolute
            right-1
            top-1
            h-2
            w-2
            rounded-full
            bg-yellow-400
          "
        />
      )}

      <DockTooltip>
        {title}
      </DockTooltip>
    </button>
  );
}

/*
|--------------------------------------------------------------------------
| Magnification
|--------------------------------------------------------------------------
*/

function getMagnificationClass(
  hoveredIndex:
    number | null,

  currentIndex:
    number
) {
  if (
    hoveredIndex ===
    null
  ) {
    return "";
  }

  const distance =
    Math.abs(
      hoveredIndex -
      currentIndex
    );

  if (
    distance === 0
  ) {
    return `
      md:-translate-y-3
      md:scale-[1.32]
    `;
  }

  if (
    distance === 1
  ) {
    return `
      md:-translate-y-1.5
      md:scale-[1.15]
    `;
  }

  if (
    distance === 2
  ) {
    return `
      md:-translate-y-0.5
      md:scale-[1.05]
    `;
  }

  return "";
}

/*
|--------------------------------------------------------------------------
| Icon Colors
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

/*
|--------------------------------------------------------------------------
| Tooltip
|--------------------------------------------------------------------------
*/

function DockTooltip({
  children,
}: {
  children: string;
}) {
  return (
    <span
      className="
        pointer-events-none
        absolute
        -top-11
        left-1/2
        z-50

        hidden
        -translate-x-1/2
        whitespace-nowrap

        rounded-lg
        border
        border-[var(--os-border)]
        bg-[var(--os-panel)]

        px-2.5
        py-1.5

        text-xs
        text-[var(--os-text)]

        opacity-0
        shadow-xl

        transition
        group-hover:opacity-100

        md:block
      "
    >
      {children}
    </span>
  );
}