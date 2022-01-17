<script>
  import * as d3 from "d3";

  export let dateScale;
  export let valueScale;
  export let data;
  export let year;
  export let colorCode;
  export let dashCode;

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
      stroke-dasharray={dashCode[year]}
      d={line(data)}
    />
  {/if}
</g>

<style>
  path.mini-line,
  path.line-blur {
    fill: none;
  }
  path.mini-line {
    stroke-width: 1.5px;
  }
  path.line-blur {
    stroke-width: 2px;
    filter: url(#filter-blur);
  }
</style>
