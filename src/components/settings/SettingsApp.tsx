"use client";

import {
  useSystemSettings,
} from "../../components/settings/SystemSettingsProvider";

import type {
  DesktopIconSize,
  SystemTheme,
  WallpaperType,
} from "../../types/system-settings";

/*
|--------------------------------------------------------------------------
| Options
|--------------------------------------------------------------------------
*/

const themes: {
  id: SystemTheme;

  name: string;

  description: string;
}[] = [
  {
    id: "dark",

    name: "Dark",

    description:
      "Neutral dark interface",
  },

  {
    id: "midnight",

    name: "Midnight",

    description:
      "Deep blue night interface",
  },

  {
    id: "light",

    name: "Light",

    description:
      "Bright translucent interface",
  },
];

const wallpapers: {
  id: WallpaperType;

  name: string;
}[] = [
  {
    id: "aurora",

    name: "Aurora",
  },

  {
    id: "grid",

    name: "Grid",
  },

  {
    id: "plain",

    name: "Plain",
  },
];

const iconSizes: {
  id: DesktopIconSize;

  name: string;
}[] = [
  {
    id: "small",

    name: "Small",
  },

  {
    id: "medium",

    name: "Medium",
  },

  {
    id: "large",

    name: "Large",
  },
];

/*
|--------------------------------------------------------------------------
| Settings App
|--------------------------------------------------------------------------
*/

export default function SettingsApp() {
  const {
    settings,

    setTheme,

    setWallpaper,

    setBootAnimation,

    setDesktopIconSize,

    resetSettings,
  } =
    useSystemSettings();

  return (
    <div
      className="
        text-[var(--os-text)]

        md:max-h-[65vh]
        md:overflow-y-auto
        md:pr-2
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
        <h1
          className="
            text-2xl
            font-semibold
          "
        >
          Settings
        </h1>

        <p
          className="
            mt-2
            text-sm
            text-[var(--os-muted)]
          "
        >
          Customize your Knowledge OS.
        </p>
      </header>

      {/* Appearance */}

      <SettingsSection
        title="Appearance"

        description="Choose the overall system theme."
      >
        <div
          className="
            grid
            grid-cols-1
            gap-3

            sm:grid-cols-3
          "
        >
          {themes.map(
            (theme) => {
              const selected =
                settings.theme ===
                theme.id;

              return (
                <button
                  type="button"

                  key={
                    theme.id
                  }

                  onClick={() =>
                    setTheme(
                      theme.id
                    )
                  }

                  className={`
                    rounded-xl
                    border
                    p-3
                    text-left
                    transition

                    active:scale-[0.98]

                    ${
                      selected
                        ? "border-[var(--os-accent)] bg-[var(--os-panel-soft)]"
                        : "border-[var(--os-border)] md:hover:bg-[var(--os-panel-soft)]"
                    }
                  `}
                >
                  <ThemePreview
                    theme={
                      theme.id
                    }
                  />

                  <p
                    className="
                      mt-3
                      text-sm
                      font-medium
                    "
                  >
                    {
                      theme.name
                    }
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-[var(--os-muted)]
                    "
                  >
                    {
                      theme.description
                    }
                  </p>
                </button>
              );
            }
          )}
        </div>
      </SettingsSection>

      {/* Wallpaper */}

      <SettingsSection
        title="Wallpaper"

        description="Choose the desktop background."
      >
        <div
          className="
            grid
            grid-cols-1
            gap-3

            min-[420px]:grid-cols-3
          "
        >
          {wallpapers.map(
            (
              wallpaper
            ) => {
              const selected =
                settings.wallpaper ===
                wallpaper.id;

              return (
                <button
                  type="button"

                  key={
                    wallpaper.id
                  }

                  onClick={() =>
                    setWallpaper(
                      wallpaper.id
                    )
                  }

                  className={`
                    rounded-xl
                    border
                    p-2
                    transition

                    active:scale-[0.98]

                    ${
                      selected
                        ? "border-[var(--os-accent)]"
                        : "border-[var(--os-border)]"
                    }
                  `}
                >
                  <WallpaperPreview
                    wallpaper={
                      wallpaper.id
                    }
                  />

                  <p
                    className="
                      mt-2
                      text-xs
                      font-medium
                    "
                  >
                    {
                      wallpaper.name
                    }
                  </p>
                </button>
              );
            }
          )}
        </div>
      </SettingsSection>

      {/* Desktop Icon Size */}

      <SettingsSection
        title="Desktop icons"

        description="Adjust the size of icons on the desktop."
      >
        <div
          className="
            grid
            grid-cols-3
            rounded-xl
            border
            border-[var(--os-border)]
            bg-[var(--os-panel-soft)]
            p-1
          "
        >
          {iconSizes.map(
            (size) => {
              const selected =
                settings.desktopIconSize ===
                size.id;

              return (
                <button
                  type="button"

                  key={
                    size.id
                  }

                  onClick={() =>
                    setDesktopIconSize(
                      size.id
                    )
                  }

                  className={`
                    rounded-lg
                    px-2
                    py-2.5
                    text-sm
                    transition

                    sm:px-4

                    ${
                      selected
                        ? "bg-[var(--os-accent)] text-white"
                        : "text-[var(--os-muted)] md:hover:text-[var(--os-text)]"
                    }
                  `}
                >
                  {
                    size.name
                  }
                </button>
              );
            }
          )}
        </div>
      </SettingsSection>

      {/* Startup */}

      <SettingsSection
        title="Startup"

        description="Control the OS startup experience."
      >
        <div
          className="
            flex
            items-center
            justify-between
            gap-4
            rounded-xl
            border
            border-[var(--os-border)]
            bg-[var(--os-panel-soft)]
            p-4
          "
        >
          <div
            className="
              min-w-0
            "
          >
            <p
              className="
                text-sm
                font-medium
              "
            >
              Boot animation
            </p>

            <p
              className="
                mt-1
                text-xs
                leading-5
                text-[var(--os-muted)]
              "
            >
              Show the boot sequence when a new session starts.
            </p>
          </div>

          <Toggle
            enabled={
              settings.bootAnimation
            }

            onChange={
              setBootAnimation
            }
          />
        </div>
      </SettingsSection>

      {/* Reset */}

      <section
        className="
          mt-8
          border-t
          border-[var(--os-border)]
          pt-5
          pb-4
        "
      >
        <button
          type="button"

          onClick={
            resetSettings
          }

          className="
            w-full
            rounded-lg
            border
            border-[var(--os-border)]
            px-4
            py-3
            text-sm
            text-[var(--os-muted)]
            transition

            active:bg-[var(--os-panel-soft)]

            sm:w-auto
            sm:py-2

            md:hover:bg-[var(--os-panel-soft)]
            md:hover:text-[var(--os-text)]
          "
        >
          Reset to defaults
        </button>
      </section>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Section
|--------------------------------------------------------------------------
*/

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;

  description: string;

  children:
    React.ReactNode;
}) {
  return (
    <section
      className="
        mb-8
      "
    >
      <div
        className="
          mb-4
        "
      >
        <h2
          className="
            text-base
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
| Toggle
|--------------------------------------------------------------------------
*/

function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;

  onChange: (
    value: boolean
  ) => void;
}) {
  return (
    <button
      type="button"

      role="switch"

      aria-checked={
        enabled
      }

      onClick={() =>
        onChange(
          !enabled
        )
      }

      className={`
        relative
        h-7
        w-12
        shrink-0
        rounded-full
        transition

        ${
          enabled
            ? "bg-[var(--os-accent)]"
            : "bg-[var(--os-border)]"
        }
      `}
    >
      <span
        className={`
          absolute
          top-1
          h-5
          w-5
          rounded-full
          bg-white
          shadow
          transition
          duration-200

          ${
            enabled
              ? "left-6"
              : "left-1"
          }
        `}
      />
    </button>
  );
}

/*
|--------------------------------------------------------------------------
| Theme Preview
|--------------------------------------------------------------------------
*/

function ThemePreview({
  theme,
}: {
  theme: SystemTheme;
}) {
  const background =
    theme === "light"
      ? "#edf2f7"
      : theme ===
          "midnight"
        ? "#050812"
        : "#0b0f19";

  const panel =
    theme === "light"
      ? "#ffffff"
      : theme ===
          "midnight"
        ? "#111827"
        : "#1f2937";

  return (
    <div
      className="
        relative
        h-20
        overflow-hidden
        rounded-lg
        border
        border-black/10
      "

      style={{
        background,
      }}
    >
      <div
        className="
          absolute
          left-2
          right-2
          top-2
          h-2
          rounded-full
          opacity-40
        "

        style={{
          background:
            theme ===
            "light"
              ? "#334155"
              : "#ffffff",
        }}
      />

      <div
        className="
          absolute
          bottom-2
          left-3
          h-11
          w-[70%]
          rounded-lg
          shadow
        "

        style={{
          background:
            panel,
        }}
      />
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Wallpaper Preview
|--------------------------------------------------------------------------
*/

function WallpaperPreview({
  wallpaper,
}: {
  wallpaper:
    WallpaperType;
}) {
  let background =
    "#0b0f19";

  if (
    wallpaper ===
    "aurora"
  ) {
    background =
      "radial-gradient(circle at 20% 10%, #2563eb 0%, transparent 45%), radial-gradient(circle at 85% 50%, #7c3aed 0%, transparent 42%), #050812";
  }

  if (
    wallpaper ===
    "grid"
  ) {
    background =
      "linear-gradient(135deg, #0f172a, #020617)";
  }

  return (
    <div
      className="
        h-20
        overflow-hidden
        rounded-lg

        min-[420px]:h-16
      "

      style={{
        background,
      }}
    >
      {wallpaper ===
        "grid" && (
        <div
          className="
            h-full
            w-full
            opacity-30
          "

          style={{
            backgroundImage: `
              linear-gradient(
                rgba(255,255,255,.3) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(255,255,255,.3) 1px,
                transparent 1px
              )
            `,

            backgroundSize:
              "12px 12px",
          }}
        />
      )}
    </div>
  );
}