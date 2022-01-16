<script>
  import * as _ from "lodash";
  import * as d3 from "d3";
  import { onMount, afterUpdate, onDestroy } from "svelte";
  import Minichart from "./Minichart.svelte";
  export let data;
  export let type;
  export let domain;

  var d = _.cloneDeep(data);
  var reach_down = new Map();
  let s = 0;
  let h;
  let w;
  let bounds = [1546300800, 1577836799];

  $: type && update_reachdown(type);

  $: size = data.size;

  $: valueScale = d3
    .scaleLinear()
    .domain(domain)
    .range([h * 0.95, h * 0.2]);

  $: dateScale = d3
    .scaleLinear()
    .domain([1546300800, 1577836799])
    .range([w * 0.1, w * 0.97]);

  function update_reachdown(t) {
    if (!reach_down.get("Mannheim")) {
      for (const [key, value] of d.entries()) {
        var type_map = new Map();
        var year_map = new Map();
        year_map.set(2019, []);
        year_map.set(2020, []);
        year_map.set(2021, []);
        year_map.set(2022, []);
        value.get(t).map(function (o) {
          var curr_year = 2019;
          while (o.timeStamp > bounds[1]) {
            o.timeStamp -= 31556952;
            curr_year += 1;
          }
          year_map.get(curr_year).push({
            timeStamp: o.timeStamp,
            value: o.value,
          });
        });
        type_map.set(t, year_map);
        reach_down.set(key, type_map);
      }
      reach_down = reach_down;
    } else if (!reach_down.get("Mannheim").has(t)) {
      for (const [key, value] of d.entries()) {
        var year_map = new Map();
        year_map.set(2019, []);
        year_map.set(2020, []);
        year_map.set(2021, []);
        year_map.set(2022, []);
        value.get(t).map(function (o) {
          var curr_year = 2019;
          while (o.timeStamp > bounds[1]) {
            o.timeStamp -= 31556952;
            curr_year += 1;
          }
          year_map.get(curr_year).push({
            timeStamp: o.timeStamp,
            value: o.value,
          });
        });
        reach_down.get(key).set(t, year_map);
      }
      reach_down = reach_down;
    }
  }
</script>

<div class="chart">
  {#if data.size > 0}
    {#each [...reach_down] as [k, v]}
      <div id={k} bind:clientHeight={h} bind:clientWidth={w}>
        <Minichart
          height={h}
          width={w}
          {valueScale}
          {dateScale}
          {domain}
          {type}
          data={v.get(type)}
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
