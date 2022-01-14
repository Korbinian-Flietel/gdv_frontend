<script>
  import * as d3 from "d3";
  import { update_await_block_branch } from "svelte/internal";
  import { fade } from "svelte/transition";
  import Axes from "./Axes.svelte";
  import Defs from "./Defs.svelte";
  import Line from "./Line.svelte";
  import Tooltip from "./Tooltip.svelte";

  export let data;
  export let type;
  export let dates;
  export let domain;

  let w;
  let h;

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

  $: yScale = d3.scaleLinear().domain([h, 0]).range([0, h]);

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

  let is_inside = false;
  let x;
  let y;
  $: current_ma = (x) => {
    var goal = Math.floor(dateScale.invert(x));
    let r = new Map();
    for (const [key, value] of data.entries()) {
      r.set(
        key,
        value.get(type).reduce(function (prev, curr) {
          return Math.abs(curr.timeStamp - goal) <
            Math.abs(prev.timeStamp - goal)
            ? curr
            : prev;
        }).value
      );
    }

    return r;
  };

  function toggle_inside() {
    is_inside = !is_inside;
  }

  function outside() {
    is_inside = false;
  }

  function handleMousemove(event) {
    x = event.clientX - 8;
    y = window.innerHeight - event.clientY;
  }

  /*function handleMousemove() {
    var goal = Math.floor(dateScale.invert(event.clientX - 8));
    v = data
      .get("Mannheim")
      .get(type)
      .reduce(function (prev, curr) {
        return Math.abs(curr.timeStamp - goal) < Math.abs(prev.timeStamp - goal)
          ? curr
          : prev;
      }).value;
  }*/
</script>

<div
  class="bottom_chart"
  bind:clientHeight={h}
  bind:clientWidth={w}
  on:mousemove={handleMousemove}
>
  {#if data.size > 0}
    {#if data.keys().next().value}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        id="test"
        width={w}
        height={h}
        on:click={toggle_inside}
        on:mouseleave={outside}
      >
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
        <Tooltip
          {is_inside}
          {current_ma}
          {type}
          {dateScale}
          {colorCode}
          {yScale}
          {x}
          {y}
        />
      </svg>
      <ul class="city-labels">
        {#each Array.from(data.keys()) as c}
          <li class="city" style="color: {colorCode[c]};" transition:fade>
            {c}
          </li>
        {/each}
      </ul>
    {/if}
  {:else}
    <div>
      // Hier wird solange keine Stadt zum auswählen angewählt wurde eine
      Beschreibung der WEbsite un der Interaktionen in Schriftform angezeigt
      werden. <br />// Der Text ist noch nicht ausgearbeitet deshalb steht hier
      nur dieser Platzhalter und ein Paar Informationen die Nützlich für die
      Programmierung sind.
    </div>
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
