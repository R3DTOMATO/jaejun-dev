"use client";

import {
  useEffect,
  useState,
} from "react";

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

type BootScreenProps = {
  onComplete: () => void;
};

/*
|--------------------------------------------------------------------------
| Boot Steps
|--------------------------------------------------------------------------
*/

const bootSteps = [
  "Initializing Knowledge OS...",
  "Mounting knowledge base...",
  "Loading interface...",
  "System ready.",
] as const;

/*
|--------------------------------------------------------------------------
| Boot Screen
|--------------------------------------------------------------------------
*/

export default function BootScreen({
  onComplete,
}: BootScreenProps) {
  /*
  |--------------------------------------------------------------------------
  | 현재 표시할 Boot Step
  |--------------------------------------------------------------------------
  */

  const [
    currentStep,
    setCurrentStep,
  ] = useState(0);

  /*
  |--------------------------------------------------------------------------
  | Boot Progress
  |--------------------------------------------------------------------------
  */

  const [
    progress,
    setProgress,
  ] = useState(0);

  /*
  |--------------------------------------------------------------------------
  | Boot Sequence
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    /*
     * Progress bar
     *
     * 약 1.6초 동안
     * 0 → 100
     */

    const progressTimer =
      window.setInterval(
        () => {
          setProgress(
            (
              currentProgress
            ) => {
              if (
                currentProgress >=
                100
              ) {
                return 100;
              }

              return Math.min(
                currentProgress +
                  4,
                100
              );
            }
          );
        },
        60
      );

    /*
     * Boot Message
     */

    const stepTimers = [
      window.setTimeout(
        () => {
          setCurrentStep(
            1
          );
        },
        450
      ),

      window.setTimeout(
        () => {
          setCurrentStep(
            2
          );
        },
        900
      ),

      window.setTimeout(
        () => {
          setCurrentStep(
            3
          );
        },
        1350
      ),
    ];

    /*
     * Desktop 진입
     */

    const completeTimer =
      window.setTimeout(
        () => {
          onComplete();
        },
        1800
      );

    /*
     * Cleanup
     */

    return () => {
      window.clearInterval(
        progressTimer
      );

      for (
        const timer of stepTimers
      ) {
        window.clearTimeout(
          timer
        );
      }

      window.clearTimeout(
        completeTimer
      );
    };
  }, [onComplete]);

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <main
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        bg-[#05070c]
        text-white
      "
    >
      {/* Background */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        {/* Blue Glow */}

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-[520px]
            w-[520px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-blue-600/10
            blur-[130px]
          "
        />

        {/* Grid */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.035]
          "
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(255,255,255,0.45) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(255,255,255,0.45) 1px,
                transparent 1px
              )
            `,

            backgroundSize:
              "48px 48px",
          }}
        />
      </div>

      {/* Boot Content */}

      <section
        className="
          relative
          z-10
          flex
          w-full
          max-w-md
          flex-col
          items-center
          px-8
          text-center
        "
      >
        {/* Logo */}

        <div
          className="
            mb-7
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            border
            border-white/15
            bg-white
            text-2xl
            font-bold
            text-black
            shadow-[0_20px_60px_rgba(0,0,0,0.45)]
          "
        >
          J
        </div>

        {/* Brand */}

        <h1
          className="
            text-2xl
            font-semibold
            tracking-[0.18em]
          "
        >
          JAEJUN.DEV
        </h1>

        <p
          className="
            mt-2
            text-sm
            tracking-wide
            text-white/40
          "
        >
          Knowledge Operating System
        </p>

        {/* Boot Status */}

        <div
          className="
            mt-12
            w-full
          "
        >
          <div
            className="
              min-h-6
              font-mono
              text-xs
              text-white/55
            "
          >
            {
              bootSteps[
                currentStep
              ]
            }
          </div>

          {/* Progress Bar */}

          <div
            className="
              mt-4
              h-1
              w-full
              overflow-hidden
              rounded-full
              bg-white/10
            "
          >
            <div
              className="
                h-full
                rounded-full
                bg-white
                transition-[width]
                duration-100
                ease-out
              "
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          {/* Percentage */}

          <div
            className="
              mt-3
              text-right
              font-mono
              text-[10px]
              tabular-nums
              text-white/25
            "
          >
            {progress}%
          </div>
        </div>

        {/* Bottom Version */}

        <p
          className="
            mt-12
            font-mono
            text-[10px]
            tracking-wider
            text-white/20
          "
        >
          JAEJUN KNOWLEDGE OS
          / BUILD 1.0
        </p>
      </section>
    </main>
  );
}