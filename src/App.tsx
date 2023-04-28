import {
  Component, createSignal, For,
} from "solid-js";
import { StopWatch } from "./components/StopWatch";

const App: Component = () => {

  const [selectedWatch, setSelectedWatch] = createSignal(1);

  const onSelectWatch = (id: number) => {
    setSelectedWatch(id);
  }

  const stopWatchCount = 4;
  const range = Array.from(Array(stopWatchCount).keys(), (n) => n + 1);

  return (
    <div class="flex flex-col gap-30-px bg-slate-600 h-screen w-screen justify-start">
      <div class="flex gap-20-px justify-between h-full flex-wrap">

      <For each={range}>
        {(i) => <StopWatch id={i} selectedWatch={selectedWatch} onClick={() => onSelectWatch(i)}/>}
      </For>

      </div>
      <ul class="m-2 text-sm text-zinc-300">
        <li>Click 'space' to start, stop or resume the selected watch</li>
      </ul>
    </div>
  
  );

};

export default App;
