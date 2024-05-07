<script>
  let name;
  let lastName;
  let date;
  let username;
  let password, passwordRepeat;

  function register(event) {
    event.preventDefault();
  }
</script>

<h2>Larben</h2>
<p>Užpildykite laukelius, kad prisiregistruotumėte.</p>

<form>
  <label for="name" class="mandatory">Vardas</label>
  <input bind:value={name} type="text" id="name" name="name" />

  <label for="lastname" class="mandatory">Pavardė</label>
  <input bind:value={lastName} type="text" id="lastname" name="lastname" />

  <label for="date" class="mandatory">Gimimo data</label>
  <input bind:value={date} type="date" id="date" name="date" />

  <label for="username" class="mandatory">Vartotojo vardas</label>
  <input bind:value={username} type="text" id="username" name="username" />

  <label for="password" class="mandatory">Slaptažodis</label>
  <input bind:value={password} type="password" id="password" name="password" />

  <label for="password-repeat" class="mandatory">Pakartokite slaptažodį</label>
  <input
    bind:value={passwordRepeat}
    type="password"
    id="password-repeat"
    name="password-repeat"
  />

  <button on:click={register} id="reg-btn">Prisiregistruoti</button>
</form>

<style>
  label {
    display: block;
    margin: 7px 0 5px 0;
  }

  #reg-btn {
    display: block;
    margin: 1rem 0;
  }

  .mandatory::after {
    content: "*";
    color: red;
  }
</style>
