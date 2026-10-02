"use client";

import {
  useRef,
} from "react";

import type {
  CSSProperties,
  PointerEvent,
  ReactNode,
} from "react";

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

type Position = {
  x: number;

  y: number;
};

type WindowProps = {
  title: string;

  children: ReactNode;

  position: Position;

  zIndex: number;

  minimized: boolean;

  maximized: boolean;

  closing?: boolean;

  onClose: () => void;

  onFocus: () => void;

  onMinimize: () => void;

  onToggleMaximize: () => void;

  onMove: (
    x: number,
    y: number
  ) => void;
};

/*
|--------------------------------------------------------------------------
| OS Window
|--------------------------------------------------------------------------
*/

export default function OSWindow({
  title,
  children,
  position,
  zIndex,
  minimized,
  maximized,
  closing = false,
  onClose,
  onFocus,
  onMinimize,
  onToggleMaximize,
  onMove,
}: WindowProps) {
  /*
  |--------------------------------------------------------------------------
  | Drag State
  |--------------------------------------------------------------------------
  */

  const dragStart =
    useRef<{
      pointerX: number;

      pointerY: number;

      windowX: number;

      windowY: number;
    } | null>(
      null
    );

  /*
  |--------------------------------------------------------------------------
  | Drag Start
  |--------------------------------------------------------------------------
  */

  function handlePointerDown(
    event: PointerEvent<HTMLDivElement>
  ) {
    /*
     * 모바일에서는
     * Window Drag 사용하지 않음
     */

    if (
      window.matchMedia(
        "(max-width: 767px)"
      ).matches
    ) {
      return;
    }

    if (
      maximized ||
      event.button !== 0
    ) {
      return;
    }

    event.currentTarget.setPointerCapture(
      event.pointerId
    );

    dragStart.current = {
      pointerX:
        event.clientX,

      pointerY:
        event.clientY,

      windowX:
        position.x,

      windowY:
        position.y,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Drag
  |--------------------------------------------------------------------------
  */

  function handlePointerMove(
    event: PointerEvent<HTMLDivElement>
  ) {
    if (
      !dragStart.current
    ) {
      return;
    }

    const deltaX =
      event.clientX -
      dragStart.current.pointerX;

    const deltaY =
      event.clientY -
      dragStart.current.pointerY;

    const nextX =
      dragStart.current.windowX +
      deltaX;

    const nextY =
      dragStart.current.windowY +
      deltaY;

    const maxX =
      Math.max(
        0,
        window.innerWidth -
          150
      );

    const maxY =
      Math.max(
        40,
        window.innerHeight -
          80
      );

    onMove(
      Math.min(
        Math.max(
          nextX,
          -450
        ),
        maxX
      ),

      Math.min(
        Math.max(
          nextY,
          40
        ),
        maxY
      )
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Drag End
  |--------------------------------------------------------------------------
  */

  function handlePointerUp(
    event: PointerEvent<HTMLDivElement>
  ) {
    dragStart.current =
      null;

    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Position
  |--------------------------------------------------------------------------
  */

  const windowStyle = {
    zIndex,

    "--window-x":
      `${position.x}px`,

    "--window-y":
      `${position.y}px`,
  } as CSSProperties;

  /*
  |--------------------------------------------------------------------------
  | Desktop Position
  |--------------------------------------------------------------------------
  */

  const desktopWindowClasses =
    maximized
      ? `
          md:fixed
          md:left-3
          md:right-3
          md:top-12
          md:bottom-20
          md:w-auto
          md:rounded-xl
          md:border
        `
      : `
          md:absolute
          md:left-[var(--window-x)]
          md:top-[var(--window-y)]
          md:right-auto
          md:bottom-auto
          md:w-[min(600px,calc(100vw-32px))]
          md:rounded-xl
          md:border
        `;

  return (
    <section
      onPointerDown={
        onFocus
      }

      style={
        windowStyle
      }

      aria-hidden={
        minimized
      }

      className={`
        fixed
        inset-x-0
        bottom-0
        top-10

        flex
        w-full
        flex-col
        overflow-hidden

        rounded-none

        border-0
        border-t
        border-[var(--os-border)]

        bg-[var(--os-panel)]
        text-[var(--os-text)]

        shadow-2xl
        backdrop-blur-2xl

        ${desktopWindowClasses}

        ${
          minimized
            ? "hidden"
            : ""
        }

        ${
          closing
            ? "os-window-exit"
            : "os-window-enter"
        }
      `}
    >
      {/* Title Bar */}

      <div
        onPointerDown={
          handlePointerDown
        }

        onPointerMove={
          handlePointerMove
        }

        onPointerUp={
          handlePointerUp
        }

        onPointerCancel={
          handlePointerUp
        }

        className="
          flex
          h-11
          shrink-0
          touch-none
          select-none
          items-center
          border-b
          border-[var(--os-border)]
          bg-[var(--os-panel-soft)]
          px-3

          md:h-10
          md:cursor-grab
          md:active:cursor-grabbing
        "
      >
        {/* Mobile */}

        <div
          className="
            grid
            w-full
            grid-cols-[48px_1fr_48px]
            items-center

            md:hidden
          "
        >
          <button
            type="button"

            onPointerDown={(
              event
            ) =>
              event.stopPropagation()
            }

            onClick={
              onMinimize
            }

            aria-label="Return to desktop"

            className="
              flex
              h-8
              items-center
              justify-start
              rounded-lg
              px-2
              text-lg
              text-[var(--os-muted)]
              transition
              active:bg-[var(--os-panel-soft)]
            "
          >
            ←
          </button>

          <span
            className="
              truncate
              text-center
              text-sm
              font-medium
            "
          >
            {title}
          </span>

          <button
            type="button"

            onPointerDown={(
              event
            ) =>
              event.stopPropagation()
            }

            onClick={
              onClose
            }

            aria-label="Close window"

            className="
              flex
              h-8
              items-center
              justify-end
              rounded-lg
              px-2
              text-xl
              text-[var(--os-muted)]
              transition
              active:bg-[var(--os-panel-soft)]
            "
          >
            ×
          </button>
        </div>

        {/* Desktop / Tablet */}

        <div
          className="
            hidden
            w-full
            items-center
            justify-between

            md:flex
          "
        >
          <div
            className="
              flex
              min-w-0
              items-center
              gap-3
            "
          >
            <div
              className="
                flex
                shrink-0
                gap-2
              "
            >
              <button
                type="button"

                onPointerDown={(
                  event
                ) =>
                  event.stopPropagation()
                }

                onClick={
                  onClose
                }

                className="
                  h-3
                  w-3
                  rounded-full
                  bg-red-500
                  transition
                  hover:brightness-110
                "

                aria-label="Close"
              />

              <button
                type="button"

                onPointerDown={(
                  event
                ) =>
                  event.stopPropagation()
                }

                onClick={
                  onMinimize
                }

                className="
                  h-3
                  w-3
                  rounded-full
                  bg-yellow-400
                  transition
                  hover:brightness-110
                "

                aria-label="Minimize"
              />

              <button
                type="button"

                onPointerDown={(
                  event
                ) =>
                  event.stopPropagation()
                }

                onClick={
                  onToggleMaximize
                }

                className="
                  h-3
                  w-3
                  rounded-full
                  bg-green-500
                  transition
                  hover:brightness-110
                "

                aria-label="Maximize"
              />
            </div>

            <span
              className="
                max-w-[320px]
                truncate
                text-sm
                font-medium
              "
            >
              {title}
            </span>
          </div>

          <button
            type="button"

            onPointerDown={(
              event
            ) =>
              event.stopPropagation()
            }

            onClick={
              onClose
            }

            className="
              rounded-md
              px-2
              py-1
              text-[var(--os-muted)]
              transition
              hover:bg-[var(--os-panel-soft)]
              hover:text-[var(--os-text)]
            "
          >
            ×
          </button>
        </div>
      </div>

      {/* Content */}

      <div
        className="
          min-h-0
          flex-1
          overflow-auto
          p-4

          md:p-5
        "
      >
        {children}
      </div>
    </section>
  );
}