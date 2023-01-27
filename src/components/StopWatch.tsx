import {
  Component,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  createMemo,
  Show,
} from "solid-js";
import { createStore } from "solid-js/store";
import { zeroPadNum } from "../formatUtils";
import { speakMinutes } from "../timeSpeechUtils";
import { LapTime } from "./LapList";

export const StopWatch: Component = () => {
  const [timePassedMs, setTimePassedMs] = createSignal(0);
  const [stopped, setStopped] = createSignal(true);
  const [lapTimes, setLapTimes] = createStore<Array<LapTime>>([]);

  onCleanup(() => {
    clearTimerIfExists();
    document.body.removeEventListener("keydown", handleOnKeyDown);
  });

  onMount(() => {
    document.body.addEventListener("keydown", handleOnKeyDown);
  });

  createEffect(() => {
    if (minutes() > 0) {
      speakMinutes(minutes());
    }
  });

  let timer: number | null = null;
  let startFromTime = 0;

  const handleOnKeyDown = (e: KeyboardEvent) => {
    e.preventDefault();
    if (e.code === "Space") {
      if (timePassedMs() == 0 && stopped()) {
        startWatch();
      } else if (!stopped()) {
        stopWatch();
      } else {
        resumeWatch();
      }
    }
    if (e.key === "r") {
      resetWatch();
    }
    if (e.key === "l") {
      lapTime();
    }
  };

  const startTimer = () => {
    clearTimerIfExists();
    timer = setInterval(
      () => setTimePassedMs(performance.now() - startFromTime),
      50
    );
  };

  const clearTimerIfExists = () => {
    timer && clearInterval(timer);
    timer = null;
  };

  const startWatch = () => {
    startFromTime = performance.now();
    startTimer();
    setStopped(false);
  };

  const stopWatch = () => {
    clearTimerIfExists();
    setStopped(true);
  };

  const resumeWatch = () => {
    startFromTime = performance.now() - timePassedMs();
    startTimer();
    setStopped(false);
  };

  const resetWatch = () => {
    setTimePassedMs(0);
    startFromTime = performance.now();
  };

  const lapTime = () => {
    setLapTimes((prev) => [
      ...prev,
      {
        seconds: seconds(),
        minutes: minutes(),
        hours: hours(),
        deciseconds: deciseconds(),
      },
    ]);
  };

  const deciseconds = createMemo<number>(() => {
    return Math.floor((timePassedMs() / 100) % 10);
  });

  const seconds = createMemo<number>(() => {
    return Math.floor((timePassedMs() / 1000) % 60);
  });

  const minutes = createMemo<number>(() => {
    return Math.floor((timePassedMs() / 60000) % 60);
  });

  const hours = createMemo<number>(() => {
    return Math.floor(timePassedMs() / 3600000);
  });

  const lastLap = createMemo(() => {
    return lapTimes[lapTimes.length - 1];
  });

  return (
    <header class="flex flex-col text-zinc-50 gap-6 select-none pt-8 grow shadow-lg bg-slate-400 m-2 p-2 justify-between ">
      <div class="text-[10vw] leading-none self-center relative">
        <Show when={lapTimes.length > 0}>
          <div class="absolute -top-4 text-xl">
            LAP {lastLap().hours}:{zeroPadNum(lastLap().minutes, 2)}:
            {zeroPadNum(lastLap().seconds, 2)}:{lastLap().deciseconds}
          </div>
        </Show>
        {hours}:{zeroPadNum(minutes(), 2)}:{zeroPadNum(seconds(), 2)}
        <span class="text-[3vw]">{deciseconds}</span>
      </div>
      <div class="flex gap-3">
        {timePassedMs() == 0 && stopped() ? (
          <button class="primary-btn" onClick={startWatch}>
            Start
          </button>
        ) : null}
        {stopped() && timePassedMs() > 0 ? (
          <button class="primary-btn" onClick={resumeWatch}>
            Resume
          </button>
        ) : null}
        {!stopped() ? (
          <button class="primary-btn" onClick={stopWatch}>
            Stop
          </button>
        ) : null}
        <button class="primary-btn" onClick={resetWatch}>
          Reset
        </button>
        <button class="primary-btn" onClick={lapTime}>
          Lap
        </button>
      </div>

    </header>
  );
};
