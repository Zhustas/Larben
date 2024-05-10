<script>
  import { count } from "../stores.js";
  import Crier from "./Crier.svelte";

  let count_value;

  count.subscribe((value) => {
    count_value = value;
  });

  function increment() {
    count.update((value) => value + 1);
  }

  function redirect() {
    window.location = "/crier";
  }
</script>

<p>Welcome to <b>Guild</b>!</p>
<p>The count is {count_value}</p>
<button on:click={increment}>Increment</button>
<button on:click={redirect}>To Crier</button>

<Crier />
