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
    München: "#f28500",
    Berlin: "#008000",
    Stuttgart: "#0000FF",
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

  function activate() {
    var a = document.getElementById("sylvester_a");
    var b = document.getElementById("sylvester_b");
    var c = document.getElementById("sandsturm");

    [a, b, c].map((el) => (el.style.color = "#F0431E"));
  }
  function deactivate() {
    var a = document.getElementById("sylvester_a");
    var b = document.getElementById("sylvester_b");
    var c = document.getElementById("sandsturm");

    [a, b, c].map((el) => (el.style.color = "black"));
  }
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
          <li
            class="city"
            style="color: {colorCode[c]}; font-size: 22px;"
            transition:fade
          >
            {c}
          </li>
        {/each}
      </ul>
    {/if}
  {:else}
    <div class="informationen">
      <h2>Warum gibt es diese Seite?</h2>

      <p class="infotxt">Diese Website entstand im Rahmen des Kurses <strong>GDV</strong> (<em
        >Grundlagen der Datenvisualisierung</em
      >) an der Hochschule Mannheim betreut von Prof.
      <a
        href="https://services.informatik.hs-mannheim.de/~nagel/"
        style="text-decoration: none;">Till Nagel</a
      >.

      Sie dient dazu vier ausgewählte Städte im Hinblick auf ihre
      <strong>Luftqualität</strong>
      zu untersuchen, insbesondere die Entwicklung seit Ausbruch der Coronapandemie.</p>

      <h2>Welche Daten wurden genutzt?</h2>
      <p class ="infotxt">Mithilfe der <a href="https://www.mvv.de/">MVV</a> und des
      <a href="https://www.umweltbundesamt.de/">Umweltbundesamts</a>
      wurden Daten für die Städte <span style="color:{colorCode["Mannheim"]}">Mannheim</span>, <span style="color:{colorCode["München"]}">München</span>, <span style="color:{colorCode["Stuttgart"]}">Stuttgart</span> & <span style="color:{colorCode["Berlin"]}">Berlin</span> gesammelt. Diese wurden zu einem täglichen Maximalwert zusammengefasst.
      Es wurden die Daten der Letzten 3 Jahre verwendet.</p> 

      <h2>Wie benutze ich diese Seite?</h2>
      <p class ="infotxt">Zur einfacheren Bedienung gibt es in der oberen linken Ecke
      <strong on:mouseenter={activate} on:mouseleave={deactivate}
        >Buttons,</strong
      >
      die als Schnellauswahl möglicher interessanter Ereignisse dienen.
      <br />
      Die Karte dient zur Menüführung, Städte können zur näheren Untersuchung per
      Click an und abgewählt werden. <br />
      Über das Dropdownmenü lässt sich der Schadstofftyp ändern.<br />
      Die Graphen oben rechts vergleichen alle Städte, im Hinblick auf den ausgewählten
      Schadstofftyp, mit sich selbst nach Jahren um einen Eindruck über langfristige
      Entwicklungen zu ermöglichen.<br />
      Bei Auswahl einer Stadt wechselt dieser Text zu einem detailliertem Chart, der die
      Entwicklung im ausgewählten Zeitintervall anzeigt.</p>
      <br />
      <br />
      <br />
      <p><a href="https://github.com/Korbinian-Flietel/gdv_frontend">GitHub</a></p>
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

  .informationen {
    margin-top: 5vh;
    font: 1.3em sans-serif;
    width: 60%;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  .infotxt{
    text-align: justify;
  }

  .city-labels {
    position: absolute;
    list-style: none;
    text-align: right;
    right: 4vw;
    top: 1.5vh;
    width: 5vw;
  }

  
  .city {
    margin-left: 0px;
  }
</style>
