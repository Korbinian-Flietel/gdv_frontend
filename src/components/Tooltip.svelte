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
  {console.log(
    Array.from(current_ma(x).entries()).sort((a, b) => (a[1] > b[1] ? 1 : -1))
  )}
  <g class="tooltip" transform="translate({x + 15} {yScale(y)})">
    <rect
      x="10"
      y="-10"
      style="fill:white;stroke-width:1.5;stroke:rgb(0,0,0)"
      width="100"
      height={30 + Array.from(current_ma(x).keys()).length * 22}
      rx="15"
      ry="15"
    />
    <text transform="translate(25 13)"
      >{new Date(dateScale.invert(x) * 1000).toLocaleDateString(undefined, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      })}</text
    >
    {#each Array.from(current_ma(x).entries()).sort( (a, b) => (a[1] < b[1] ? 1 : -1) ) as arr, i}
      <text fill={colorCode[arr[0]]} transform="translate(45 {30 + i * 22})">
        {arr[1].toPrecision(3)}
      </text>
    {/each}
  </g>
{/if}

<style>
  .tooltip {
    position: absolute;
  }
</style>
