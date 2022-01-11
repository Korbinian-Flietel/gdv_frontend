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
  <g class="tooltip" transform="translate({x + 15} {yScale(y) + 20})">
    {#each Array.from(current_ma(x).keys()) as city, i}
      <text fill={colorCode[city]} transform="translate(0 {i * 15})">
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
