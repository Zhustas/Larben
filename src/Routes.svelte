<script>
  import { Router, Route } from "svelte-routing";
  import Login from "./routes/Login.svelte";
  import Register from "./routes/Register.svelte";
  import Main from "./routes/Main.svelte";
</script>

<Router>
  <Route path="/" component={Main} />
  <Route path="/register" component={Register} />
  <Route path="/main" component={Main} />
</Router>
