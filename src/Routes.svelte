<script>
  import { Router, Route } from "svelte-routing";
  import Login from "./routes/Login.svelte";
  import Register from "./routes/Register.svelte";
</script>

<Router>
  <Route path="/" component={Login} />
  <Route path="/register" component={Register} />
</Router>
