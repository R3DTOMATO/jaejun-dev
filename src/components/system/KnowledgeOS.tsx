"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import BootScreen from "../../components/boot/BootScreen";
import Desktop from "../../components/desktop/Desktop";

import {
  SystemSettingsProvider,
  useSystemSettings,
} from "../../components/settings/SystemSettingsProvider";

import type {
  Post,
} from "../../types/post";

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

type KnowledgeOSProps = {
  posts: Post[];
};

type SystemState =
  | "checking"
  | "booting"
  | "desktop";

/*
|--------------------------------------------------------------------------
| Session Key
|--------------------------------------------------------------------------
*/

const BOOT_SESSION_KEY =
  "jaejun-os-booted";

/*
|--------------------------------------------------------------------------
| Knowledge OS Provider
|--------------------------------------------------------------------------
*/

export default function KnowledgeOS({
  posts,
}: KnowledgeOSProps) {
  return (
    <SystemSettingsProvider>
      <KnowledgeOSRuntime
        posts={
          posts
        }
      />
    </SystemSettingsProvider>
  );
}

/*
|--------------------------------------------------------------------------
| Runtime
|--------------------------------------------------------------------------
*/

function KnowledgeOSRuntime({
  posts,
}: KnowledgeOSProps) {
  const {
    settings,
    hydrated,
  } = useSystemSettings();

  const [
    systemState,
    setSystemState,
  ] =
    useState<SystemState>(
      "checking"
    );

  /*
   * Settings를 바꿨다고
   * 현재 실행 중인 OS가 갑자기
   * BootScreen으로 돌아가는 것을 방지한다.
   */

  const startupResolved =
    useRef(false);

  /*
  |--------------------------------------------------------------------------
  | Resolve Startup
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (
      !hydrated ||
      startupResolved.current
    ) {
      return;
    }

    startupResolved.current =
      true;

    /*
     * Boot Animation OFF
     */

    if (
      !settings.bootAnimation
    ) {
      setSystemState(
        "desktop"
      );

      return;
    }

    /*
     * 이미 현재 탭에서
     * 부팅했는지 확인
     */

    const hasBooted =
      window.sessionStorage.getItem(
        BOOT_SESSION_KEY
      );

    if (
      hasBooted ===
      "true"
    ) {
      setSystemState(
        "desktop"
      );

      return;
    }

    /*
     * Boot 시작
     */

    setSystemState(
      "booting"
    );
  }, [
    hydrated,
    settings.bootAnimation,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Boot Complete
  |--------------------------------------------------------------------------
  */

  const handleBootComplete =
    useCallback(() => {
      window.sessionStorage.setItem(
        BOOT_SESSION_KEY,
        "true"
      );

      setSystemState(
        "desktop"
      );
    }, []);

  /*
  |--------------------------------------------------------------------------
  | Checking
  |--------------------------------------------------------------------------
  */

  if (
    systemState ===
    "checking"
  ) {
    return (
      <main
        className="
          min-h-screen
          bg-[#05070c]
        "
      />
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Boot
  |--------------------------------------------------------------------------
  */

  if (
    systemState ===
    "booting"
  ) {
    return (
      <BootScreen
        onComplete={
          handleBootComplete
        }
      />
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Desktop
  |--------------------------------------------------------------------------
  */

  return (
    <Desktop
      posts={
        posts
      }
    />
  );
}