<script>
  let username = "";
  let password = "";

  function login() {
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

  // *********************************** Cookies ***************************************
  function setCookie(cName, cValue, expDays) {
    let date = new Date();
    date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1000);

    const expires = "expires=" + date.toUTCString();

    // Creating cookie
    document.cookie = cName + "=" + cValue + "; " + expires + "; path=/"; // path=/main
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

  function cookieMessage() {
    if (!getCookie("cookie")) {
      document.querySelector("#cookies").style.display = "block";
    }
  }

  function cookiesOnClick() {
    document.querySelector("#cookies").style.display = "none";

    // Creating cookie (expire in 30 days)
    setCookie("cookie", true, 30);
  }
</script>

<svelte:window on:load={cookieMessage} />

<h1>Larben</h1>
<p>Sveiki atvykę į Lietuvos Archeologijos Bendruomenę!</p>
<p>Įveskite vartojo vardą ir slaptažodį, kad prisijungtumėte.</p>

<form autocomplete="on">
  <label for="username">Vartotojo vardas</label>
  <input bind:value={username} type="text" id="username" name="username" />

  <label for="password" id="password-lbl">Slaptažodis</label>
  <input bind:value={password} type="password" id="password" name="password" />

  <button on:click|preventDefault={login} id="login-btn">Prisijungti</button>
</form>

<hr />
<div class="bot-region">
  <p>Neturi paskyros? Spausk registracijos mygtuką.</p>
  <button on:click={register} id="reg-btn">Registruotis</button>
</div>

<div id="cookies">
  <div class="container">
    <div class="subcontainer">
      <div class="cookies">
        <p>
          Ši svetainė naudoja slapukus (angl. <em>Cookies</em>), kad gautumėte
          geriausią patirtį naudojant mūsų svetainę.
          <a href="https://lad.lt/">Daugiau informacijos.</a>
          <button id="cookies-btn" on:click={cookiesOnClick}>Sutinku</button>
        </p>
      </div>
    </div>
  </div>
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

  /* ******************************** Cookies ************************** */
  #cookies {
    padding: 0;
    margin: 0;
  }

  .container {
    width: 1600px;
    margin: auto;
  }

  .subcontainer {
    width: 85%;
    margin: auto;
  }

  #cookies {
    width: 100%;
    position: fixed;
    bottom: 0;
    color: white;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 1;
    display: none;
  }

  .cookies {
    min-height: 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
  }

  .cookies a {
    color: yellow;
    font-weight: 500;
    text-decoration: none;
  }

  #cookies-btn {
    border-radius: 5px;
    padding: 6px 8px;
    font-size: 0.9rem;
    cursor: pointer;
    border: 2px solid white;
    background-color: black;
    color: white;
  }

  /* @media (max-height: 475px) {
    #cookies {
      display: none;
    }
  } */

  @media (max-width: 1600px) {
    .container {
      width: 100%;
    }
  }

  @media (max-width: 1024px) {
    .cookies {
      padding: 10px 0;
    }
  }
</style>
