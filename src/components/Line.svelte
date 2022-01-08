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

  $: maxDate = d3.max(data.map((d) => d.timeStamp));
  $: minDate = d3.min(data.map((d) => d.timeStamp));
  $: maxValue = d3.max(data.map((d) => d.value));
  $: minValue = d3.min(data.map((d) => d.value));
</script>

<g class="temperature-line">
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
    transition:move
    use:transparentStroke={{ duration: 3000, delay: 5000 }}
  />
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
    stroke: var(--purple);
    stroke-width: 2px;
  }
  path.line-blur {
    stroke-width: 2px;
    filter: url(#filter-blur);
  }
</style>
