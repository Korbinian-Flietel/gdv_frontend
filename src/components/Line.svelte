<script>
  import * as d3 from "d3";

  import { move } from "./move.js";
  import { transparentStroke } from "./transparentStroke.js";
  export let dateScale;
  export let valueScale;
  export let data;
  export let colorCode;

  $: line = d3
    .line()
    .x((d) => dateScale(d.timeStamp))
    .y((d) => valueScale(d.value))
    .curve(d3.curveBasis);
</script>

<g class="temperature-line">
  {#if data[0]}
    <path
      class="line-blur to-blur"
      d={line(data)}
      stroke={colorCode[data[0].city]}
      transition:move
      use:transparentStroke={{ duration: 3000, delay: 5000 }}
    />

    <path
      class="line to-blur"
      d={line(data)}
      stroke={colorCode[data[0].city]}
      transition:move
    />
  {/if}
</g>

<style>
  path:hover {
    cursor: pointer;
  }

  path.line,
  path.line-blur {
    fill: none;
  }
  path.line {
    /*stroke: var(--purple);*/
    stroke-width: 2px;
  }
  path.line-blur {
    stroke-width: 3px;
    filter: url(#filter-blur);
  }
</style>
