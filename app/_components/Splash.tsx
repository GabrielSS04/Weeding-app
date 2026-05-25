"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Stage = "idle" | "letters-in" | "letters-out" | "fade-out" | "done";

const T_LETTERS_IN = 100;
const T_LETTERS_OUT = 1700;
const T_FADE_OUT = 3000;
const T_DONE = 3500;

export function Splash() {
  const [stage, setStage] = useState<Stage>("idle");

  useEffect(() => {
    document.cookie = "splash_seen=1; path=/; samesite=lax";

    const timers: number[] = [];

    const start = () => {
      timers.push(window.setTimeout(() => setStage("letters-in"), T_LETTERS_IN));
      timers.push(window.setTimeout(() => setStage("letters-out"), T_LETTERS_OUT));
      timers.push(window.setTimeout(() => setStage("fade-out"), T_FADE_OUT));
      timers.push(window.setTimeout(() => setStage("done"), T_DONE));
    };

    if (document.readyState === "complete") {
      start();
    } else {
      window.addEventListener("load", start, { once: true });
    }

    return () => {
      window.removeEventListener("load", start);
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  useEffect(() => {
    if (stage === "done") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [stage]);

  if (stage === "done") return null;

  const lettersVisible = stage === "letters-in";
  const overlayVisible = stage !== "fade-out";

  return (
    <div
      aria-hidden
      data-theme="junino"
      style={{
        opacity: overlayVisible ? 1 : 0,
        transition: "opacity 500ms ease-in-out",
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
    >
      <div
        style={{
          opacity: lettersVisible ? 1 : 0,
          transition: "opacity 800ms ease-in-out",
        }}
        className="w-[60vw] max-w-[420px] sm:w-[40vw]"
      >
        <Image
          src="/Vector.png"
          alt=""
          width={760}
          height={630}
          priority
          className="h-auto w-full"
        />
      </div>
    </div>
  );
}
