import {
  Component,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  createMemo,
} from "solid-js";
import { zeroPadNum } from "./formatUtils";
import { speakMinutes } from "./timeSpeechUtils";

const App: Component = () => {
  const [timePassedMs, setTimePassedMs] = createSignal(0);
  const [stopped, setStopped] = createSignal(true);

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
  };

  const startTimer = () => {
    clearTimerIfExists();
    timer = setInterval(
      () => setTimePassedMs(performance.now() - startFromTime),
      100
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

  const seconds = createMemo<number>(() => {
    return Math.floor((timePassedMs() / 1000) % 60);
  });

  const minutes = createMemo<number>(() => {
    return Math.floor((timePassedMs() / 60000) % 60);
  });

  const hours = createMemo<number>(() => {
    return Math.floor(timePassedMs() / 3600000);
  });

  return (
    <header class="p-4 flex flex-col bg-slate-500 h-screen text-zinc-50 gap-5 select-none">
      <section class="text-[20vw] leading-none self-center">
        {zeroPadNum(hours(), 2)}:{zeroPadNum(minutes(), 2)}:
        {zeroPadNum(seconds(), 2)}
      </section>
      <section class="flex gap-3">
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
      </section>
      <ul class="text-xs text-zinc-300">
        <li>Click 'space' to start, stop or resume the watch</li>
        <li>Click 'r' to reset the watch</li>
      </ul>
    </header>
  );
};

export default App;
