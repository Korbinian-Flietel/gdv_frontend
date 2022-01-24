<script>
  import { fade } from "svelte/transition";
  export let dateScale;
  export let valueScale;
  export let width;
  export let dateTicks;
  export let mini = false;
  export let show = false;
  export let years;
  export let dashCode;
  export let type;
  export let city;
  export let valueTicks = [];
</script>

{#if show}
  <g class="axes" transition:fade>
    <text
      class="label"
      transform="translate(15 {valueScale.range()[0]}) rotate(-90)">Time</text
    >{#if mini}
      <text
        class={city}
        transform="translate({dateScale.range()[1] / 2} {valueScale.range()[1] *
          0.9})">{city}</text
      >
      {#each years as year, i}
        <g class="year-{year}-{city}">
          <text
            class={year}
            transform="translate({dateScale.range()[1] * 0.99 -
              7} {valueScale.range()[1] * 0.9 + i * 20})">{year}</text
          >
          <line
            x1={dateScale.range()[1] * 0.99 - 37}
            y1={valueScale.range()[1] * 0.9 - 4 + i * 20}
            x2={dateScale.range()[1] * 0.99 - 12}
            y2={valueScale.range()[1] * 0.9 - 4 + i * 20}
            stroke-dasharray={dashCode[year]}
          /></g
        >
      {/each}
    {/if}
    <g class="axis-date" transform="translate(0 {valueScale.range()[0]})">
      {#each dateTicks as tick}
        {#if mini}
          <g transform="translate({dateScale(tick)} 0)">
            <text x="0" y="0"
              >{new Date(tick * 1000).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}</text
            >
            <line x1="0" y1="-12" x2="0" y2="-21" />
          </g>
        {:else}
          <g transform="translate({dateScale(tick)} 0)">
            <text x="0" y="0"
              >{new Date(tick * 1000).toLocaleDateString("de-De")}</text
            >
            <line x1="0" y1="-12" x2="0" y2="-21" />
          </g>
        {/if}
      {/each}
    </g>

    <g class="axis-value">
      <text
        class="label"
        transform="translate(15 {valueScale(valueTicks[5])}) rotate(-90)"
        >{type}</text
      >
      {#each valueTicks.slice(1) as tick}
        <g transform="translate(0 {valueScale(tick)})">
          <line
            class:faint={tick !== valueTicks[11]}
            x1="55"
            y1="0"
            x2={width}
            y2="0"
          />
          <text x="25" y="4">{tick.toPrecision(3)}</text>
        </g>
      {/each}
    </g>
  </g>
{/if}

<style>
  line {
    stroke: var(--red);
    stroke-width: 0.2vmin;
    stroke-opacity: 0.1;
  }

  .year-2019-Mannheim line {
    stroke: #f88379;
    stroke-width: 0.2vmin;
    stroke-opacity: 1;
  }

  .year-2019-Mannheim text {
    fill: #f88379;
  }

  .year-2020-Mannheim line {
    stroke: #ff3131;
    stroke-width: 0.2vmin;
    stroke-opacity: 1;
  }

  .year-2020-Mannheim text {
    fill: #ff3131;
  }

  .year-2021-Mannheim line {
    stroke: #a52a2a;
    stroke-width: 0.2vmin;
    stroke-opacity: 1;
  }

  .year-2021-Mannheim text {
    fill: #a52a2a;
  }

  .year-2022-Mannheim line {
    stroke: #630330;
    stroke-width: 0.2vmin;
    stroke-opacity: 1;
  }

  .year-2022-Mannheim text {
    fill: #630330;
  }

  .year-2019-Stuttgart line {
    stroke: #add8e6;
    stroke-width: 0.2vmin;
    stroke-opacity: 1;
  }

  .year-2019-Stuttgart text {
    fill: #add8e6;
  }

  .year-2020-Stuttgart line {
    stroke: #7fffd4;
    stroke-width: 0.2vmin;
    stroke-opacity: 1;
  }

  .year-2020-Stuttgart text {
    fill: #7fffd4;
  }

  .year-2021-Stuttgart line {
    stroke: #00bfff;
    stroke-width: 0.2vmin;
    stroke-opacity: 1;
  }

  .year-2021-Stuttgart text {
    fill: #00bfff;
  }

  .year-2022-Stuttgart line {
    stroke: #00008b;
    stroke-width: 0.2vmin;
    stroke-opacity: 1;
  }

  .year-2022-Stuttgart text {
    fill: #00008b;
  }

  .year-2019-Berlin line {
    stroke: #8fbc8f;
    stroke-width: 0.2vmin;
    stroke-opacity: 1;
  }

  .year-2019-Berlin text {
    fill: #8fbc8f;
  }

  .year-2020-Berlin line {
    stroke: #9acd32;
    stroke-width: 0.2vmin;
    stroke-opacity: 1;
  }

  .year-2020-Berlin text {
    fill: #9acd32;
  }

  .year-2021-Berlin line {
    stroke: #228b22;
    stroke-width: 0.2vmin;
    stroke-opacity: 1;
  }

  .year-2021-Berlin text {
    fill: #228b22;
  }

  .year-2022-Berlin line {
    stroke: #006400;
    stroke-width: 0.2vmin;
    stroke-opacity: 1;
  }

  .year-2022-Berlin text {
    fill: #006400;
  }

  .year-2019-München line {
    stroke: #ff7f50;
    stroke-width: 0.2vmin;
    stroke-opacity: 1;
  }

  .year-2019-München text {
    fill: #ff7f50;
  }

  .year-2020-München line {
    stroke: #f08080;

    stroke-width: 0.2vmin;
    stroke-opacity: 1;
  }

  .year-2020-München text {
    fill: #f08080;
  }

  .year-2021-München line {
    stroke: #ff6347;
    stroke-width: 0.2vmin;
    stroke-opacity: 1;
  }

  .year-2021-München text {
    fill: #ff6347;
  }

  .year-2022-München line {
    stroke: #8b4726;
    stroke-width: 0.2vmin;
    stroke-opacity: 1;
  }

  .year-2022-München text {
    fill: #8b4726;
  }

  .axis-value line.faint {
    stroke-opacity: 0.05;
  }

  text {
    font-family: "Source Sans Pro", sans-serif;
    font-size: 0.8rem;
    fill: var(--purple);
    fill-opacity: 0.4;
  }
  .axis-date text {
    text-anchor: middle;
  }
  .axis-value text {
    text-anchor: start;
  }
  text.label {
    text-anchor: middle;
  }
</style>
