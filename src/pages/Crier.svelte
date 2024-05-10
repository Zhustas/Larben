<script>
  import { count } from "../stores.js";

  // The town crier (šauklys) used to make public announcements in the streets.

  function increment() {
    count.update((value) => value + 1);
  }

  function redirect() {
    window.location = "/guild";
  }
</script>

<p>Welcome to <b>Crier</b>!</p>
<button on:click={increment}>Increment</button>
<button on:click={redirect}>To Guild</button>
