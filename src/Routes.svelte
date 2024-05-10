<script>
  import { Router, Route } from "svelte-routing";
  import Login from "./routes/Login.svelte";
  import Register from "./routes/Register.svelte";
  import Main from "./routes/Main.svelte";
  import Crier from "./pages/Crier.svelte";
  import Guild from "./pages/Guild.svelte";
  import Error from "./routes/Error.svelte";

  // import { onMount } from "svelte";

  // onMount(() => {
  //   const { pathname } = window.location;

  //   console.log(pathname);
  //   // if (pathname !== "/") {
  //   //   window.location = "/";
  //   // }
  // });
</script>

<Router>
  <!-- <Route path="/" component={Crier} /> -->
  <Route path="/" component={Login} />
  <Route path="/register" component={Register} />
  <Route path="/main" component={Main} />

  <!-- <Route path="/error" component={Error} /> -->

  <!-- For testing "stores" -->
  <!-- <Route path="/crier" component={Crier} />
  <Route path="/guild" component={Guild} /> -->
</Router>
