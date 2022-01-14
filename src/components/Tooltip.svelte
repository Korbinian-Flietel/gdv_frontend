<script>
  export let current_ma;
  export let is_inside;
  export let type;
  export let colorCode;
  export let dateScale;
  export let x;
  export let y;
  export let yScale;

  let m;
</script>

{#if is_inside}
  <g class="tooltip" transform="translate({x + 15} {yScale(y)})">
    <rect
      x="10"
      y="-10"
      width="40"
      height={Array.from(current_ma(x).keys()).length * 20}
      rx="15"
      ry="15"
    />
    {#each Array.from(current_ma(x).keys()) as city, i}
      <text fill={colorCode[city]} transform="translate(15 {5 + i * 20})">
        {current_ma(x).get(city).toPrecision(3)}
      </text>
    {/each}
  </g>
{/if}

<style>
  .tooltip {
    position: absolute;
  }
</style>
