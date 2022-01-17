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
    get_mini_domain(reach_down);
    console.log(mini_domain);
  }

  function get_mini_domain(v) {
    var sum = 0;
    var elements = 0;
    console.log(v);
    for (const [ke, va] of v.entries()) {
      var c = new Map();
      var max = 0;

      for (const [k, v] of va.get(type)) {
        console.log(v);
        var p = v.reduce(function (a, b) {
          return a + b.value;
        }, 0);

        sum += p;
        elements += v.length;

        var contender = v.reduce(
          function (prev, curr) {
            return curr.value > prev.value ? curr : prev;
          },
          { value: 0 }
        ).value;
        if (max < contender) {
          max = contender;
        }
      }
      let avr = sum / elements;
      if (max > avr * 10) {
        mini_domain.set(ke, c.set(type, [0, avr * 10]));
      } else {
        mini_domain.set(ke, c.set(type, [0, max]));
      }
    }
    mini_domain = mini_domain;
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
      <div id={k} bind:clientHeight={h} bind:clientWidth={w}>
        <Minichart
          city={k}
          height={h}
          width={w}
          {h}
          {dateScale}
          colorCode={colorCode[k]}
          domain={mini_domain.get(k).get(type)}
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
