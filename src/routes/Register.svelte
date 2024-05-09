<script>
  let name = "";
  let lastName = "";
  let date;
  let username = "";
  let email = "";
  let password = "",
    passwordRepeat = "";

  const errors = [];

  function register(event) {
    event.preventDefault();

    errors.splice(0, errors.length);
    let ret = checkForErrorsAndReturn();
    if (ret !== 0) {
      showErrors(errors);
      return;
    }

    // Send POST /register

    // Convert data into object
    const user = {
      NAME: name,
      LAST_NAME: lastName,
      BIRTH_DATE: date ? date : null,
      USERNAME: username,
      EMAIL: email,
      PASSWORD: password,
      GUILD_ID: null,
    };

    // Convert to json
    const userString = JSON.stringify(user);

    // Send to /register with POST method
    doPOST(userString);
  }

  function doPOST(userString) {
    const hr = new XMLHttpRequest();
    hr.open("POST", "http://localhost:3000/register");
    hr.setRequestHeader("Content-Type", "application/json");
    hr.send(userString);
    hr.onload = () => {
      if (hr.status === 200) {
        window.location = "/";
      }
    };
  }

  function checkForErrorsAndReturn() {
    if (!name) {
      errors.push({ name: "Vardas yra tuščias" });
    }
    if (!lastName) {
      errors.push({ lastName: "Pavardė yra tuščia" });
    }
    if (date && new Date(date) > new Date()) {
      errors.push({ date: "Gimimo data yra tolimesnė negu dabartinė data" });
    }
    if (!username) {
      errors.push({ username: "Vartotojo vardas yra tuščias" });
    }
    if (!email) {
      errors.push({ username: "Elektroninis paštas yra tuščias" });
    }
    if (!password) {
      errors.push({ password: "Slaptažodis yra tuščias" });
    }
    if (password && password !== passwordRepeat) {
      errors.push({ passwordRepeat: "Slaptažodžiai nesutampa" });
    }

    if (errors.length !== 0) {
      return 1;
    }

    return 0;
  }

  function showErrors(errors) {
    console.log(errors);
  }
</script>

<h2>Larben</h2>
<p>Užpildykite laukelius, kad prisiregistruotumėte.</p>

<form autocomplete="on">
  <label for="name" class="mandatory">Vardas</label>
  <input bind:value={name} type="text" id="name" name="name" />

  <label for="lastname" class="mandatory">Pavardė</label>
  <input bind:value={lastName} type="text" id="lastname" name="lastname" />

  <label for="date">Gimimo data</label>
  <input bind:value={date} type="date" id="date" name="date" />

  <label for="username" class="mandatory">Vartotojo vardas</label>
  <input bind:value={username} type="text" id="username" name="username" />

  <label for="email" class="mandatory">Elektroninis paštas</label>
  <input bind:value={email} type="email" id="email" name="email" />

  <label for="password" class="mandatory">Slaptažodis</label>
  <input bind:value={password} type="password" id="password" name="password" />

  <label for="passwordrepeat" class="mandatory">Pakartokite slaptažodį</label>
  <input
    bind:value={passwordRepeat}
    type="password"
    id="passwordrepeat"
    name="passwordrepeat"
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
