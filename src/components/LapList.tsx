import { Component, For, Show } from "solid-js";

export interface LapTime {
  seconds: number;
  minutes: number;
  hours: number;
  deciseconds: number;
}

export interface LapListProps {
  lapTimes: Array<LapTime>;
}

export const LapList: Component<LapListProps> = ({ lapTimes }) => {
  return (
    <Show when={lapTimes.length > 0}>
      <div>LAPS</div>
      <ol class="list-decimal list-inside">
        <For each={lapTimes}>
          {(lapTime) => (
            <li>
              {lapTime.hours}:{lapTime.minutes}:{lapTime.seconds}
            </li>
          )}
        </For>
      </ol>
    </Show>
  );
};
