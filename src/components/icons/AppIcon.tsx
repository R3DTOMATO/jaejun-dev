export type AppIconType =
  | "folder"
  | "terminal"
  | "search"
  | "graph"
  | "activity"
  | "settings"
  | "post";

/*
|--------------------------------------------------------------------------
| Props
|--------------------------------------------------------------------------
*/

type AppIconProps = {
  type: AppIconType;

  className?: string;
};

/*
|--------------------------------------------------------------------------
| App Icon
|--------------------------------------------------------------------------
*/

export default function AppIcon({
  type,
  className = "",
}: AppIconProps) {
  switch (type) {
    /*
    |--------------------------------------------------------------------------
    | Folder
    |--------------------------------------------------------------------------
    */

    case "folder":
      return (
        <svg
          viewBox="0 0 64 64"

          fill="none"

          xmlns="http://www.w3.org/2000/svg"

          className={
            className
          }

          aria-hidden="true"
        >
          <path
            d="
              M7 17
              C7 13.6863 9.68629 11 13 11
              H26
              L32 17
              H51
              C54.3137 17 57 19.6863 57 23
              V47
              C57 50.3137 54.3137 53 51 53
              H13
              C9.68629 53 7 50.3137 7 47
              V17Z
            "

            fill="currentColor"

            opacity="0.75"
          />

          <path
            d="
              M7 24
              H57
              V47
              C57 50.3137 54.3137 53 51 53
              H13
              C9.68629 53 7 50.3137 7 47
              V24Z
            "

            fill="currentColor"
          />
        </svg>
      );

    /*
    |--------------------------------------------------------------------------
    | Terminal
    |--------------------------------------------------------------------------
    */

    case "terminal":
      return (
        <svg
          viewBox="0 0 64 64"

          fill="none"

          className={
            className
          }

          aria-hidden="true"
        >
          <rect
            x="6"
            y="8"

            width="52"
            height="48"

            rx="12"

            fill="currentColor"
          />

          <path
            d="M18 24L26 32L18 40"

            stroke="white"

            strokeWidth="3"

            strokeLinecap="round"

            strokeLinejoin="round"
          />

          <path
            d="M32 40H44"

            stroke="white"

            strokeWidth="3"

            strokeLinecap="round"
          />
        </svg>
      );

    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    case "search":
      return (
        <svg
          viewBox="0 0 64 64"

          fill="none"

          className={
            className
          }

          aria-hidden="true"
        >
          <rect
            x="6"
            y="6"

            width="52"
            height="52"

            rx="14"

            fill="currentColor"
          />

          <circle
            cx="29"
            cy="28"

            r="11"

            stroke="white"

            strokeWidth="3"
          />

          <path
            d="M37 36L46 45"

            stroke="white"

            strokeWidth="3"

            strokeLinecap="round"
          />
        </svg>
      );

    /*
    |--------------------------------------------------------------------------
    | Knowledge Graph
    |--------------------------------------------------------------------------
    */

    case "graph":
      return (
        <svg
          viewBox="0 0 64 64"

          fill="none"

          className={
            className
          }

          aria-hidden="true"
        >
          <rect
            x="6"
            y="6"

            width="52"
            height="52"

            rx="14"

            fill="currentColor"
          />

          <path
            d="
              M21 22
              L32 32
              L45 20

              M32 32
              L44 45

              M32 32
              L19 44
            "

            stroke="white"

            strokeOpacity="0.75"

            strokeWidth="2.5"

            strokeLinecap="round"
          />

          <circle
            cx="21"
            cy="22"

            r="4.5"

            fill="white"
          />

          <circle
            cx="45"
            cy="20"

            r="4.5"

            fill="white"
          />

          <circle
            cx="32"
            cy="32"

            r="5.5"

            fill="white"
          />

          <circle
            cx="19"
            cy="44"

            r="4.5"

            fill="white"
          />

          <circle
            cx="44"
            cy="45"

            r="4.5"

            fill="white"
          />
        </svg>
      );

    /*
    |--------------------------------------------------------------------------
    | Activity
    |--------------------------------------------------------------------------
    */

    case "activity":
      return (
        <svg
          viewBox="0 0 64 64"

          fill="none"

          className={
            className
          }

          aria-hidden="true"
        >
          <rect
            x="6"
            y="6"

            width="52"
            height="52"

            rx="14"

            fill="currentColor"
          />

          <path
            d="
              M15 38
              H23
              L28 23
              L35 44
              L40 31
              H49
            "

            stroke="white"

            strokeWidth="3"

            strokeLinecap="round"

            strokeLinejoin="round"
          />

          <circle
            cx="15"
            cy="38"

            r="2"

            fill="white"
          />

          <circle
            cx="49"
            cy="31"

            r="2"

            fill="white"
          />
        </svg>
      );

    /*
    |--------------------------------------------------------------------------
    | Settings
    |--------------------------------------------------------------------------
    */

    case "settings":
      return (
        <svg
          viewBox="0 0 64 64"

          fill="none"

          className={
            className
          }

          aria-hidden="true"
        >
          <rect
            x="6"
            y="6"

            width="52"
            height="52"

            rx="14"

            fill="currentColor"
          />

          <circle
            cx="32"
            cy="32"

            r="8"

            stroke="white"

            strokeWidth="3"
          />

          <path
            d="
              M32 16V21
              M32 43V48
              M16 32H21
              M43 32H48
              M20.7 20.7L24.2 24.2
              M39.8 39.8L43.3 43.3
              M43.3 20.7L39.8 24.2
              M24.2 39.8L20.7 43.3
            "

            stroke="white"

            strokeWidth="3"

            strokeLinecap="round"
          />
        </svg>
      );

    /*
    |--------------------------------------------------------------------------
    | Post
    |--------------------------------------------------------------------------
    */

    case "post":
      return (
        <svg
          viewBox="0 0 64 64"

          fill="none"

          className={
            className
          }

          aria-hidden="true"
        >
          <path
            d="
              M15 7
              H38
              L51 20
              V51
              C51 54.3137 48.3137 57 45 57
              H15
              C11.6863 57 9 54.3137 9 51
              V13
              C9 9.68629 11.6863 7 15 7Z
            "

            fill="currentColor"
          />

          <path
            d="M38 7V20H51"

            fill="white"

            fillOpacity="0.18"
          />

          <path
            d="M18 29H42"

            stroke="white"

            strokeWidth="2.5"

            strokeLinecap="round"
          />

          <path
            d="M18 37H42"

            stroke="white"

            strokeWidth="2.5"

            strokeLinecap="round"
          />

          <path
            d="M18 45H34"

            stroke="white"

            strokeWidth="2.5"

            strokeLinecap="round"
          />
        </svg>
      );
  }
}