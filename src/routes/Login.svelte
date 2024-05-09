<script>
  let username = "";
  let password = "";

  function login(event) {
    event.preventDefault();

    // Convert username and password into object
    const user = {
      USERNAME: username,
      PASSWORD: password,
    };

    // Convert to json
    const userString = JSON.stringify(user);

    // Send to /getUserByCredentials with POST method
    doPOST(userString);
  }

  function doPOST(userString) {
    const hr = new XMLHttpRequest();
    hr.open("POST", "http://localhost:3000/getUserByCredentials");
    hr.setRequestHeader("Content-Type", "application/json");
    hr.send(userString);
    hr.onload = () => {
      if (hr.status === 200) {
        window.location = "/main";
      }
    };
  }

  function register() {
    window.location = "/register";
  }
</script>

<h1>Larben</h1>
<p>Sveiki atvykę į Lietuvos Archeologijos Bendruomenę!</p>
<p>Įveskite vartojo vardą ir slaptažodį, kad prisijungtumėte.</p>

<form autocomplete="on">
  <label for="username">Vartotojo vardas</label>
  <input bind:value={username} type="text" id="username" name="username" />

  <label for="password" id="password-lbl">Slaptažodis</label>
  <input bind:value={password} type="password" id="password" name="password" />

  <button on:click={login} id="login-btn">Prisijungti</button>
</form>

<hr />
<div class="bot-region">
  <p>Neturi paskyros? Spausk registracijos mygtuką.</p>
  <button on:click={register} id="reg-btn">Registruotis</button>
</div>

<style>
  label {
    display: block;
    margin-bottom: 5px;
  }

  #password-lbl {
    margin-top: 7px;
  }

  #login-btn {
    display: block;
    margin: 1rem 0;
  }
</style>
