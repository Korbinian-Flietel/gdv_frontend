<script>
  import * as d3 from "d3";
  import { onMount, afterUpdate, onDestroy } from "svelte";
  import Minichart from "./Minichart.svelte";
  export let data;
  export let type;
  export let domain;

  let s = 0;
  let h;
  let w;

  $: size = data.size;

  $: valueScale = d3
    .scaleLinear()
    .domain(domain)
    .range([h * 0.95, h * 0.2]);

  $: dateScale = d3
    .scaleLinear()
    .domain([1546300800, 1577836799])
    .range([w * 0.03, w * 0.97]);
</script>

<div class="chart">
  {#if data.size > 0}
    {#each [...data] as [k, v]}
      <div id={k} bind:clientHeight={h} bind:clientWidth={w}>
        <Minichart
          id={k}
          height={h}
          width={w}
          {valueScale}
          {dateScale}
          {domain}
          {type}
          data={v}
        />
      </div>
    {/each}
  {:else}
    <p>No Data!</p>
  {/if}
</div>

<style>
  #Mannheim {
    width: 45%;
    height: 50%;
    float: left;
    margin-top: 0;
    left: 15px;
  }
  #Stuttgart {
    width: 45%;
    height: 50%;
    float: left;
    margin-top: 0;
  }
  #München {
    width: 45%;
    height: 50%;
    float: left;
    margin-top: 0;
  }
  #Berlin {
    width: 45%;
    height: 50%;
    float: left;
    margin-top: 0;
    left: 15px;
  }
</style>
