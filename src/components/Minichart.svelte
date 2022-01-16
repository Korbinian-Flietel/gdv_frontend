<script>
  import * as d3 from "d3";
  import { fade } from "svelte/transition";
  import MiniLine from "./MiniLine.svelte";
  import Axes from "./Axes.svelte";
  import Defs from "./Defs.svelte";
  export let valueScale;
  export let dateScale;
  export let domain;
  export let height;
  export let data;
  export let type;
  export let width;

  function createTicks(d) {
    var diff = d[1] - d[0];
    var step = diff / 10;
    return range(d[0], d[1] + step, step);
  }

  function range(start, stop, step) {
    if (typeof stop == "undefined") {
      // one param defined
      stop = start;
      start = 0;
    }

    if (typeof step == "undefined") {
      step = 1;
    }

    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
      return [];
    }

    var result = [];
    for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
      result.push(i);
    }

    return result;
  }
</script>

<svg xmlns="http://www.w3.org/2000/svg" {width} {height}>
  <Defs />
  <Axes
    {dateScale}
    {valueScale}
    mini={true}
    {width}
    dateTicks={createTicks([1546300800, 1577836799])}
    valueTicks={createTicks(domain)}
    {type}
    show={data.size > 0}
  />
  {#each Array.from(data.keys()) as year}
    <MiniLine {dateScale} {valueScale} {year} data={data.get(year)} />
  {/each}
</svg>
