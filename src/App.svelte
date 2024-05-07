<script>
  let username = "";
  let password = "";

  function login(event) {
    event.preventDefault();
  }

  function register() {}
</script>

<h1>Larben</h1>
<p>Sveiki atvykę į Lietuvos Archeologijos Bendruomenę!</p>
<p>Įveskite vartojo vardą ir slaptažodį, kad prisijungtumėte.</p>

<form>
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
