<script>
  // The town crier (šauklys) used to make public announcements in the streets.

  import { onMount } from "svelte";

  let posts = [
    // {
    //   a: "Justas",
    //   b: "2024-05-14 15:13",
    //   c: "Labas",
    //   d: 12,
    // },
  ];

  let text = "";
  let author = "Justas";
  let likes = 124515;

  function handleClick() {
    if (!text) {
      console.log("No text!");
      return;
    }

    let datetime = new Date().toLocaleString("lt-LT", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });

    posts = [...posts, { a: author, b: datetime, c: text, d: likes }];
  }

  onMount(getPosts);

  // *************************************** GETTING POSTS ************************************
  function addToPosts(response) {
    const res = JSON.parse(response);

    for (let post of res) {
      if (post["ID"]) {
        post["USER_ID"] = "Justas";
        posts = [...posts, post];
      }
    }
  }

  function getPosts() {
    const hr = new XMLHttpRequest();
    hr.open("GET", "http://localhost:3000/posts");
    hr.send();
    hr.onload = () => {
      addToPosts(hr.response);
    };
  }

  // // *************************************** POSTING POST ************************************
  function post() {
    if (!text) {
      return;
    }

    let datetime = new Date().toLocaleString("lt-LT", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });

    // Convert information into object
    const post = {
      USER_ID: 1,
      TEXT: text,
      POST_DATETIME: datetime,
      LIKES: 15,
    };

    // Convert to json
    const postString = JSON.stringify(post);

    // Send to /insertPost with POST method
    postPost(postString);
  }

  function postPost(postString) {
    const hr = new XMLHttpRequest();
    hr.open("POST", "http://localhost:3000/insertPost");
    hr.setRequestHeader("Content-Type", "application/json");
    hr.send(postString);
    hr.onload = () => {
      console.log(hr.response);
    };
  }
</script>

<p>Welcome to <strong>Crier</strong>!</p>

<textarea bind:value={text} />
<button on:click={handleClick}>Click me</button>
<button on:click={post}>Post post</button>

<div class="posts">
  {#each posts as { USER_ID, POST_DATETIME, TEXT, LIKES }}
    <div class="post">
      <div class="container">
        <p class="author">{USER_ID}</p>
        <p class="datetime">{POST_DATETIME}</p>
        <p class="text">{TEXT}</p>
      </div>
      <button class="likes">{LIKES}</button>
    </div>
  {/each}
</div>

<style>
  .post {
    position: relative;
    padding: 0;
    margin: 0;
    width: 500px;
    /* background-color: blue; */
    margin: 40px 30px; /* Jei pakeisti "post" dydį */
    /* border: 1px solid black; */
  }

  .post p {
    margin: inherit;
  }

  .container {
    width: 500px;
    background-color: orange;
  }

  .author,
  .datetime {
    display: inline-block;
  }

  .author {
    padding: 5px 0 0 5px;
  }

  .datetime {
    float: right;
    padding: 5px 5px 0 0;
  }

  .text {
    padding: 10px 0 30px 15px;
  }

  .likes {
    text-wrap: wrap;
    border: 2px solid black;
    position: absolute;
    cursor: pointer;
    min-width: 40px;
    max-width: 100px;
    height: 40px;
    bottom: -20px;
    right: -20px;
  }
</style>
