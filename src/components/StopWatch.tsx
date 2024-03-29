import {
  Component,
  createEffect,
  createSignal,
  onCleanup,
  createMemo,
  Show,
  onMount,
  Accessor,
  on,
} from "solid-js";
import { createStore } from "solid-js/store";
import { zeroPadNum } from "../formatUtils";
import { speakMinutes } from "../timeSpeechUtils";
import { LapTime } from "./LapList";

interface StopWatchProps {
  id: number;
  selectedWatch: Accessor<number>;
  onClick: () => void;
}

export const StopWatch: Component<StopWatchProps> = ({id, selectedWatch, onClick}) => {
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

  const handleOnKeyDown = (e: KeyboardEvent) => {
    if (e.code === "Space" && selectedWatch() === id) {
      e.preventDefault();
      if (timePassedMs() == 0 && stopped()) {
        startWatch();
      } else if (!stopped()) {
        stopWatch();
      } else {
        resumeWatch();
      }
    }
  };

  createEffect(on(() => minutes(), (minutes) => {
    if (minutes > 0 && selectedWatch() === id) {
      speakMinutes(minutes);
    }
  }));

  let timer: number | null = null;
  let startFromTime = 0;

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
    <div
      class={`flex flex-col border-box text-zinc-200 gap-6 select-none pt-8 grow shadow-xl border-8 border-solid  
      ${selectedWatch() === id ? "border-slate-900" : "border-slate-500"} 
       bg-slate-500 rounded  m-2 p-2 justify-between relative`} 
      onClick={onClick}
    >
      <div class="absolute top-0 left-0 p-2 text-[1vw] bg-slate-600 rounded m-2">#{id}</div>
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

    </div>
  );
};
