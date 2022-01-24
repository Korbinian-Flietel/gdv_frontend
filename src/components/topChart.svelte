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
  let mini_domain = new Map();
  let s = 0;
  let h;
  let w;
  let bounds = [1546300800, 1577836799];

  $: type && update_reachdown(type);

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

  var save = "";

  function focus() {
    if (this.style.float == "none") {
      this.style.width = "49%";
      this.style.height = "50%";
      this.style.left = save;
      this.style.float = "left";
      this.style.zoom = "100%";
      this.style.position = "relative";
      this.style.top = "0";
      this.style.zIndex = "0";
    } else {
      this.style.top = "-6.5%";
      save = this.style.left;
      this.style.left = "40%";
      this.style.width = "60%";
      this.style.zoom = "150%";
      this.style.float = "none";
      this.style.position = "absolute";
      this.style.zIndex = "1";
    }
  }

  var colorCode = {
    Mannheim: "#F0431E",
    München: "#EDF01E",
    Berlin: "#44F01E",
    Stuttgart: "#1E37F0",
  };
</script>

<div class="chart">
  {#if data.size > 0}
    {#each [...reach_down] as [k, v]}
      <div on:click={focus} id={k} bind:clientHeight={h} bind:clientWidth={w}>
        <Minichart
          city={k}
          height={h}
          width={w}
          {h}
          {dateScale}
          colorCode={colorCode[k]}
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
    width: 49%;
    height: 50%;
    float: left;
    margin-top: 0;
  }
  #Stuttgart {
    width: 49%;
    height: 50%;
    float: left;
    margin-top: 0;
    left: 15px;
  }
  #München {
    width: 49%;
    height: 50%;
    float: left;
    margin-top: 0;
  }
  #Berlin {
    width: 49%;
    height: 50%;
    float: left;
    margin-top: 0;
    left: 15px;
  }
</style>
