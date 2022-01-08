<script>
  import * as d3 from "d3";
  import { fade } from "svelte/transition";
  import Axes from "./Axes.svelte";
  import Defs from "./Defs.svelte";
  import Line from "./Line.svelte";

  export let data;
  export let type;
  export let dates;
  export let domain;

  let w;
  let h;
  let s = 0;

  var colorCode = {
    Mannheim: "#F0431E",
    München: "#EDF01E",
    Berlin: "#44F01E",
    Stuttgart: "#1E37F0",
  };

  $: valueScale = d3
    .scaleLinear()
    .domain(domain)
    .range([h * 0.95, h * 0.2]);

  $: dateScale = d3
    .scaleLinear()
    .domain(dates)
    .range([w * 0.03, w * 0.97]);

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

<div class="bottom_chart" bind:clientHeight={h} bind:clientWidth={w}>
  {#if data.size > 0}
    <svg xmlns="http://www.w3.org/2000/svg" width={w} height={h}>
      <Defs />
      <Axes
        {dateScale}
        {valueScale}
        width={w}
        dateTicks={createTicks(dates)}
        valueTicks={createTicks(domain)}
        {type}
        show={data.size > 0}
      />
      {#each Array.from(data.values()) as city}
        <Line
          {dateScale}
          {valueScale}
          data={city.get(type).filter(function (el) {
            return el.timeStamp >= dates[0] && el.timeStamp <= dates[1];
          })}
          {colorCode}
        />
      {/each}
    </svg>
    <ul class="city-labels">
      {#each Array.from(data.keys()) as c}
        <li class="city" style="color: {colorCode[c]};" transition:fade>
          {c}
        </li>
      {/each}
    </ul>
  {:else}
    <p>{dates}</p>
    <p>{domain}</p>
    <p>No Data!</p>
  {/if}
</div>

<style>
  svg {
    width: 100%;
    height: 100%;
  }

  .city-labels {
    position: absolute;
    list-style: none;
    text-align: right;
    right: 4vw;
    top: 2.5vh;
    width: 100%;
  }

  .city {
    margin-left: 0px;
  }
</style>
