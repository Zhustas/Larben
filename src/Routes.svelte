<script>
  import { Router, Route } from "svelte-routing";
  import Login from "./routes/Login.svelte";
  import Register from "./routes/Register.svelte";
  import Main from "./routes/Main.svelte";
  import Error from "./routes/Error.svelte";

  import { onMount } from "svelte";

  onMount(() => {
    const validPages = ["/", "/register", "/main", "/error"];
    const { pathname } = window.location;

    if (!validPages.includes(pathname)) {
      window.location = "/error";
      return;
    }
  });
</script>

<Router>
  <Route path="/" component={Login} />
  <Route path="/register" component={Register} />
  <Route path="/main" component={Main} />

  <Route path="/error" component={Error} />
</Router>
