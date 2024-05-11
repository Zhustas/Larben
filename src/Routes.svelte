<script>
  import { Router, Route } from "svelte-routing";
  import Login from "./routes/Login.svelte";
  import Register from "./routes/Register.svelte";
  import Main from "./routes/Main.svelte";
  import Error from "./routes/Error.svelte";
  import Cookies from "js-cookie";

  const validPages = ["/", "/register", "/main", "/error"];

  const { pathname } = window.location;

  if (!validPages.includes(pathname)) {
    window.location = "/error";
  }

  function getCookie(cName) {
    const name = cName + "=";
    const cDecoded = decodeURIComponent(document.cookie);
    const cArray = cDecoded.split("; ");

    let value;
    cArray.forEach((val) => {
      if (val.indexOf(name) === 0) {
        value = val.substring(name.length);
      }
    });

    return value;
  }
</script>

<Router>
  <Route path="/" component={Login} />
  <Route path="/register" component={Register} />
  <Route path="/main" component={Main} />

  <Route path="/error" component={Error} />
</Router>
