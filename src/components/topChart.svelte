<script>
  import { onMount, afterUpdate, onDestroy } from "svelte";
  export let data;
  export let type;

  let s = 0;

  $: size = data.size;

  afterUpdate(() => {
    console.log("Update!");
    s = size;
  });
</script>

<div class="chart">
  {#if data.size > 0}
    <div>
      <p>{type}</p>
      {#each [...data] as [k, v]}
        <p>{k}</p>
      {/each}
    </div>
  {:else}
    <p>No Data!</p>
  {/if}
</div>
