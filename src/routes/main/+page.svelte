<script lang="ts">
	import Crier from '../../components/Crier.svelte';
	import Guild from '../../components/Guild.svelte';
	// import Map from '../../components/Map.svelte';
	import Account from '../../components/Account.svelte';

	import Cookies from 'js-cookie';
	import { onMount } from 'svelte';

	onMount(() => {
		if (!Cookies.get('sessionToken')) {
			window.location.assign('/');
		} else {
			fetch('http://localhost:3000/checkSessionToken', {
				method: 'GET',
				credentials: 'include'
			})
				.then((response) => {
					console.log(response);
				})
				.catch((error) => {
					console.log('Caught an error!');
				});

			// hr.onload = () => {
			// 	const response = hr.response;

			// 	if (response !== 'Session token valid') {
			// 		const hr2 = new XMLHttpRequest();
			// 		hr2.open('DELETE', 'https://localhost:3000/sessionToken');
			// 		hr2.withCredentials = true;
			// 		hr2.send();
			// 		hr2.onload = () => {
			// 			Cookies.remove('sessionToken');
			// 			window.location.assign('/');
			// 		};
			// 	}
			// };
		}
	});

	const Page = {
		Crier: 'crier',
		Guild: 'guild',
		Map: 'map',
		Account: 'account'
	};

	let index = 0;
	const pages = [Page.Crier, Page.Guild, Page.Map, Page.Account];

	$: page = Page.Crier;

	function handleLogOut() {
		Cookies.remove('sessionToken');
		window.location.assign('/');
	}

	let map;

	function changeToCrier() {
		page = Page.Crier;
	}

	function changeToMap() {
		page = Page.Map;
	}

	function changeToAccount() {
		page = Page.Account;
	}

	// function handleResize() {
	//   if (map.offsetWidth < 1845) {
	//     mapPercent = 95;
	//   }
	//   console.log(map.offsetWidth);
	// }
	// let mapPercent;
</script>

<!-- <svelte:window on:resize={handleResize} /> -->

<link
	rel="stylesheet"
	href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
/>

<div id="whole-container">
	<div id="side-bar">
		<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
		<div on:click={changeToCrier} class="side-bar-buttons">
			<i class="fa fa-home home-button"></i>
		</div>
		<hr />
		<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
		<div on:click={changeToMap} class="side-bar-buttons">
			<i class="fa fa-map map-button"></i>
		</div>
		<hr />

		<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
		<div on:click={changeToAccount} class="side-bar-buttons">
			<i class="fa fa-user map-button"></i>
		</div>
		<hr />
	</div>
	<div id="main">
		{#if page === Page.Crier}
			<Crier />
		{:else if page === Page.Guild}
			<Guild />
		{:else if page === Page.Map}
			<div bind:this={map} class="map">
				<!-- <Map /> -->
			</div>
		{:else if page === Page.Account}
			<Account />
		{/if}
	</div>
</div>

<!-- !-- -->
<!-- <p>Log out</p> -->
<!-- <button on:click={handleLogOut}>Click to log out</button> -->

<style>
	#whole-container {
		display: flex;

		/* width: 1800px; */

		width: auto;
		height: 850px;
		/* background-color: orange; */

		/* border: 2px solid black; */
	}

	#side-bar {
		/* float: left; */
		width: 70px;
		height: 100%;
		background-color: rgb(56, 196, 91);

		border: 2px solid black;

		word-wrap: break-word;
	}

	.side-bar-buttons {
		font-size: 50px;
		text-align: center;

		color: white;
		cursor: pointer;
	}

	.side-bar-buttons:hover {
		color: rgb(102, 102, 102);
	}

	.side-bar-buttons:active {
		color: rgb(207, 207, 207);
	}

	.map-button {
		font-size: 40px;
	}

	hr {
		margin: 0 auto;
		width: 80%;
		/* line-height: 2px; */
	}

	.map {
		width: 1600px;
		/* width: 1700px; */
		height: 100%;
		/* background-color: pink; */
	}

	#main {
		/* float: left; */
		height: 100%;
		/* background-color: red; */
	}

	/* @media (max-width: 1880px) {
      .map {
        background-color: aqua;
        width: 100%;
      }
    } */
</style>
