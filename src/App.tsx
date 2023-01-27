import {
  Component,
} from "solid-js";
import { StopWatch } from "./components/StopWatch";

const App: Component = () => {
 
  return (
    <div class="flex flex-col gap-30-px bg-slate-500 h-screen w-screen justify-start">
      <div class="flex gap-20-px justify-between h-full flex-wrap">
        <StopWatch />
        <StopWatch />
        <StopWatch />
        <StopWatch />
      </div>
      <ul class="m-2 text-sm text-zinc-300">
        <li>Click 'space' to start, stop or resume the watch</li>
        <li>Click 'l' to lap</li>
        <li>Click 'r' to reset the watch</li>
      </ul>
    </div>
  
  );

};

export default App;
