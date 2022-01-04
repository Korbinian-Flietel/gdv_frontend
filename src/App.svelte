<script>
  import RangeSlider from "svelte-range-slider-pips";
  import * as d3 from "d3";
  import Chart from "./components/Chart.svelte";
  import TopChart from "./components/topChart.svelte";

  var citys = [];
  var type = "co";
  var data = [];
  var floorDate = new Date(
    new Date().getFullYear() - 5,
    new Date().getMonth(),
    new Date().getDate()
  ).getTime(); // was oben links steht
  let ceil = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  ).getTime();
  let values = [ceil - 7890000000, ceil];

  var reach_down = new Map();

  const load = () => {
    d3.json("https://gdv-api.herokuapp.com/get_mvv_data?typ=co,pm10", (d) => {
      return {
        city: d.city,
        id: d.timeSeriesId,
        date: +new Date(d.timeStamp * 1000),
        value: +d.value,
      };
    }).then((res) => {
      let tmp = d3.group(
        res,
        (d) => d.city,
        (d) => d.timeSeriesId
      );
      data = tmp;
      console.log(data);
    });
  };

  var t = "co";

  load();

  function update(type) {
    t = document.getElementById("select").options[select.selectedIndex].value;
    type = t;
  }

  function togleData(k) {
    if (reach_down.has(k.k)) {
      reach_down.delete(k.k);
      reach_down = reach_down;
    } else {
      reach_down.set(k.k, data.get(k.k));
      reach_down = reach_down;
    }
  }
</script>

<main>
  <h1 class="header">Team Yellow!</h1>
  <div class="main">
    <div id="checkboxes">
      <label>Citys</label>
      <ul style="list-style-type:none;">
        {#each [...data] as [k, v]}
          <li>
            <input on:click={togleData({ k })} type="checkbox" id={k} />{k}
          </li>
        {/each}
      </ul>
    </div>
    <select id="select" on:change={update({ t })}>
      <option value="co">co</option>
      <option value="pm10">pm10</option>
    </select>
    <RangeSlider
      bind:values
      formatter={(v) => new Date(v).toLocaleDateString("en-US")}
      min={floorDate}
      max={ceil}
      range
      pips
      step={7890000000 * 2}
      all="label"
    />
  </div>
  <TopChart {data} type={t} />
  <Chart data={reach_down} type={t} />
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
