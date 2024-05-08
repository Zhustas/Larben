<script>
  import Crier from "../pages/Crier.svelte";
  import Guild from "../pages/Guild.svelte";
  import Map from "../pages/Map.svelte";
  import Account from "../pages/Account.svelte";

  const Page = {
    Crier: "crier",
    Guild: "guild",
    Map: "map",
    Account: "account",
  };

  let index = 0;
  const pages = [Page.Crier, Page.Guild, Page.Map, Page.Account];

  $: page = Page.Map;
</script>

{#if page === Page.Crier}
  <Crier />
{:else if page === Page.Guild}
  <Guild />
{:else if page === Page.Map}
  <Map />
{:else if page === Page.Account}
  <Account />
{/if}
