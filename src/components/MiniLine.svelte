<script>
  import * as d3 from "d3";

  import { move } from "./move.js";
  export let dateScale;
  export let valueScale;
  export let data;
  export let year;

  var colorCode = {
    2019: "#F0431E",
    2020: "#EDF01E",
    2021: "#44F01E",
    2022: "#1E37F0",
  };

  $: line = d3
    .line()
    .x((d) => dateScale(d.timeStamp))
    .y((d) => valueScale(d.value))
    .curve(d3.curveBasis);
</script>

<g>
  {#if data[0]}
    <path
      class="mini-line"
      stroke={colorCode[year]}
      d={line(data)}
      transition:move
    />
  {/if}
</g>

<style>
  path.mini-line,
  path.line-blur {
    fill: none;
  }
  path.mini-line {
    stroke-dasharray: 10, 10;
    stroke-width: 1px;
  }
  path.line-blur {
    stroke-width: 2px;
    filter: url(#filter-blur);
  }
</style>
