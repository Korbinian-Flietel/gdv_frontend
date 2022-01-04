<script>
  import { onMount, afterUpdate, onDestroy } from "svelte";
  export let data;

  let s = 0;

  $: size = data.size;

  afterUpdate(() => {
    console.log("Update!");
    s = size;
  });
</script>

<div class="bottom_chart">
  {#if data.size > 0}
    <div>
      {#each [...data] as [k, v]}
        <p>{k}</p>
      {/each}
    </div>
  {:else}
    <p>No Data!</p>
  {/if}
  <p>{s}</p>
</div>
