<script>
  import Cookies from "js-cookie";
  import { deleteSessionToken } from "./../HTTPfunctions.js";

  let name, lastName, birthDate, username, email, password, description;
  let user = {};

  getUser();

  function getUser() {
    const hr = new XMLHttpRequest();
    hr.open("GET", "https://localhost:3000/user");
    hr.withCredentials = true;
    hr.send();
    hr.onload = () => {
      user = JSON.parse(hr.response);
      name = user["NAME"];
      lastName = user["LAST_NAME"];
      birthDate = user["BIRTH_DATE"];
      username = user["USERNAME"];
      email = user["EMAIL"];
      password = user["PASSWORD"];
      description = user["DESCRIPTION"];
    };
  }
  function updateAccount() {
    if (!name || !lastName) {
      return;
    }

    const obj = {
      NAME: name,
      LAST_NAME: lastName,
      BIRTH_DATE: birthDate,
      DESCRIPTION: description,
    };

    const objString = JSON.stringify(obj);
    console.log("asd");
    const hr = new XMLHttpRequest();
    hr.open("PUT", `https://localhost:3000/user/${user["ID"]}`);
    hr.setRequestHeader("Content-Type", "application/json");
    hr.withCredentials = true;
    hr.send(objString);
  }
  function deleteAccount() {
    const hr = new XMLHttpRequest();
    hr.open("DELETE", `https://localhost:3000/user/${user["ID"]}`);
    hr.withCredentials = true;
    hr.send();
    hr.onload = () => {
      const hr2 = new XMLHttpRequest();
      hr2.open("DELETE", "https://localhost:3000/sessionToken");
      hr2.withCredentials = true;
      hr2.send();
      hr2.onload = () => {
        Cookies.remove("sessionToken");
        window.location = "/";
      };
    };
  }
</script>

<div class="acc-container">
  <div class="data-container">
    <h2>Vartotojo nustatymai</h2>
    <p>Asmeninė informacija</p>
    <div class="personal-info-container">
      <div class="pic-first-three">
        <div>
          <label for="name">Vardas</label>
          <input bind:value={name} id="name" />
        </div>
        <div>
          <label for="lastname">Pavardė</label>
          <input bind:value={lastName} id="lastname" />
        </div>
        <div>
          <label for="birthdate">Gimimo data</label>
          <input bind:value={birthDate} id="birthdate" type="date" />
        </div>
      </div>
      <div class="description-container">
        <label for="description">Aprašas</label>
        <textarea bind:value={description} id="description"></textarea>
      </div>
    </div>
    <p>Vartotojo informacija</p>
    <div class="user-info-container">
      <div>
        <label for="username">Vartotojo vardas</label>
        <input bind:value={username} disabled id="username" />
      </div>
      <div>
        <label for="email">Elektroninis paštas</label>
        <input bind:value={email} disabled id="email" />
      </div>
      <div>
        <label for="password">Slaptažodis</label>
        <input bind:value={password} disabled id="password" type="password" />
      </div>
      <!-- <div>
          <label for="guild">Gildija</label>
          <input disabled id="guild" />
        </div> -->
    </div>
  </div>
  <div class="buttons">
    <button on:click={deleteAccount} class="delete-btn">Ištrinti paskyrą</button
    >
    <button on:click={updateAccount} class="update-btn"
      >Atnaujinti paskyrą</button
    >
  </div>
</div>

<style>
  * {
    margin: 0;
    padding: 0;
  }

  .acc-container {
    width: 1200px;
    height: 100%;

    border-top: 2px solid black;
    border-bottom: 2px solid black;
    border-right: 2px solid black;
  }

  h2 {
    text-align: center;
    margin-top: 10px;
  }

  p {
    font-weight: bold;
    font-size: 21px;
    margin-left: 10px;
  }

  label {
    display: block;
    margin-bottom: 5px;
    font-size: 18px;
  }

  textarea {
    font-size: 18px;
  }

  input {
    width: 220px;
    height: 30px;
    font-size: 17px;
  }

  .personal-info-container {
    display: flex;
    flex-wrap: wrap;
    gap: 50px;
  }

  .pic-first-three {
    margin-left: 20px;
  }

  .pic-first-three div {
    margin-top: 15px;
  }

  .pic-first-three div:last-child {
    margin-bottom: 20px;
  }

  .description-container {
    margin-top: 15px;
  }

  #description {
    min-width: 500px;
    max-width: 870px;
    height: 130px;
    resize: horizontal;
  }

  .user-info-container {
    margin-left: 20px;
  }

  .user-info-container div {
    margin-top: 15px;
  }

  .user-info-container div:last-child {
    margin-bottom: 20px;
  }

  .acc-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .buttons {
    margin-bottom: 20px;
    margin-right: 20px;
    text-align: end;
  }

  .delete-btn {
    background-color: red;
  }

  .delete-btn:hover {
    background-color: rgb(182, 0, 0);
  }

  .delete-btn:active {
    background-color: rgb(255, 66, 66);
  }

  .update-btn {
    margin-left: 10px;
    background-color: rgb(56, 196, 91);
  }

  .update-btn:hover {
    background-color: rgb(36, 155, 66);
  }

  .update-btn:active {
    background-color: rgb(85, 231, 122);
  }

  button {
    width: 200px;
    height: 50px;
    cursor: pointer;
    color: white;
  }
</style>
