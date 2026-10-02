import type {
  WallpaperType,
} from "../../types/system-settings";

type WallpaperProps = {
  wallpaper: WallpaperType;
};

export default function Wallpaper({
  wallpaper,
}: WallpaperProps) {
  if (
    wallpaper === "plain"
  ) {
    return (
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[var(--os-bg)]
        "
      />
    );
  }

  if (
    wallpaper === "grid"
  ) {
    return (
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
          bg-[var(--os-bg)]
        "
      >
        <div
          className="
            absolute
            inset-0
            opacity-[0.08]
          "
          style={{
            backgroundImage: `
              linear-gradient(
                currentColor 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                currentColor 1px,
                transparent 1px
              )
            `,

            backgroundSize:
              "44px 44px",
          }}
        />

        <div
          className="
            absolute
            bottom-[-250px]
            left-1/2
            h-[600px]
            w-[800px]
            -translate-x-1/2
            rounded-full
            bg-blue-500/10
            blur-[150px]
          "
        />
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Aurora
  |--------------------------------------------------------------------------
  */

  return (
    <div
      className="
        pointer-events-none
        absolute
        inset-0
        overflow-hidden
        bg-[var(--os-bg)]
      "
    >
      <div
        className="
          absolute
          -left-52
          -top-64
          h-[720px]
          w-[720px]
          rounded-full
          bg-blue-500/20
          blur-[150px]
        "
      />

      <div
        className="
          absolute
          -right-52
          top-[12%]
          h-[680px]
          w-[680px]
          rounded-full
          bg-violet-500/16
          blur-[160px]
        "
      />

      <div
        className="
          absolute
          bottom-[-350px]
          left-[45%]
          h-[700px]
          w-[850px]
          -translate-x-1/2
          rounded-full
          bg-cyan-500/10
          blur-[170px]
        "
      />
    </div>
  );
}