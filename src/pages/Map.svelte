<script lang="ts">
	import Map from '../classes/Map.js';

	const a: number = 5;

	// sendGETCookieCheck();

	// function sendGETCookieCheck() {
	//   const hr = new XMLHttpRequest();
	//   hr.open("GET", "http://localhost:3000/checkSessionToken");
	//   hr.withCredentials = true;
	//   hr.send();
	//   hr.onload = () => {
	//     console.log(hr.response);
	//     if (hr.response === "Expired") {
	//       Cookies.remove("sessionToken");
	//       wincow.location = "/";
	//     } else if (hr.response === "Don't exist") {
	//       window.location = "/";
	//     }
	//   };
	// }

	let user = {};
	let users = {};

	(async function () {
		await getUser();
		await getAllUsers();
		await loadMarkers();
	})();

	async function getUser() {
		const hr = new XMLHttpRequest();
		hr.open('GET', 'https://localhost:3000/user');
		hr.withCredentials = true;
		hr.send();
		hr.onload = () => {
			user = JSON.parse(hr.response);
		};
	}

	async function getAllUsers() {
		const hr = new XMLHttpRequest();
		hr.open('GET', 'https://localhost:3000/users');
		hr.withCredentials = true;
		hr.send();
		hr.onload = () => {
			users = JSON.parse(hr.response);
		};
	}

	async function loadMarkers() {
		const hr = new XMLHttpRequest();
		hr.open('GET', 'https://localhost:3000/markers');
		hr.withCredentials = true;
		hr.send();
		hr.onload = () => {
			if (hr.response) {
				const res = JSON.parse(hr.response);

				map.loadMarkers(res, user['ID'], users);
			}
		};
	}

	function addMarker() {
		// Check if description is not empty
		if (!description) {
			return;
		}

		// Get current latitude and longitude
		const { lat, lng } = map.getCurrentLatLng();

		// Convert information into object
		const marker = {
			USER_ID: user['ID'],
			DESCRIPTION: description,
			LATITUDE: lat,
			LONGITUDE: lng
		};

		// Convert object to json
		const markerString = JSON.stringify(marker);

		// Make POST request
		doPOST(markerString);

		map.addMarker(map.getCurrentLatLng());

		// Hide add marker container
		hideAddMarkerContainer();
	}

	function doPOST(markerString) {
		const hr = new XMLHttpRequest();
		hr.open('POST', 'https://localhost:3000/marker');
		hr.withCredentials = true;
		hr.setRequestHeader('Content-Type', 'application/json');
		hr.send(markerString);
		hr.onload = () => {
			console.log(hr.response);
		};
	}

	function hideAddMarkerContainer() {
		addMarkerContainer.classList.add('hidden');
		description = '';
	}

	function hideAddMarkerContainerAndRemoveMarker() {
		addMarkerContainer.classList.add('hidden');
		map.removeMarker();
		description = '';
	}

	async function handleMapClick() {
		let currentLatLng = map.getCurrentLatLng();
		if (currentLatLng) {
			let isPointValid = await map.isPointInLithuania(currentLatLng);

			if (isPointValid && !map.clickedOnMarker()) {
				addMarkerContainer.classList.remove('hidden');
			} else {
				hideAddMarkerContainerAndRemoveMarker();
			}
		}

		map.setClicedkOnMarker(false);
	}

	let markerAdded = false;
	let description = '';
	let addMarkerContainer;

	let MAPS_API_KEY = process.env.MAPS_API_KEY;
	let GEOCODING_API_KEY = process.env.GEOCODING_API_KEY;

	let map = new Map(MAPS_API_KEY, GEOCODING_API_KEY);

	map.loadMapsAPI();
	map.initMap();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
<div on:click={handleMapClick} id="map"></div>
<div bind:this={addMarkerContainer} id="add-marker-container" class="hidden">
	<label for="description">Aprašymas</label>
	<textarea bind:value={description} id="description"></textarea>
	<button on:click={hideAddMarkerContainerAndRemoveMarker} class="cancel-btn">Atšaukti</button>
	<button on:click={addMarker} class="add-btn">Pridėti žymeklį</button>
</div>

<style>
	.add-btn {
		float: right;
		margin: 5px 15px 0 0;
		height: 40px;
		width: 150px;
		color: white;
		cursor: pointer;

		margin: 5px 15px 0 0;
		background-color: rgb(56, 196, 91);
	}

	.cancel-btn {
		margin: 5px 0 0 10px;
		height: 40px;
		width: 80px;
		color: white;
		cursor: pointer;
		background-color: rgb(208, 219, 56);
	}

	.cancel-btn:hover {
		background-color: rgb(178, 187, 57);
	}

	.cancel-btn:active {
		background-color: rgb(243, 253, 104);
	}

	.add-btn:hover {
		background-color: rgb(36, 155, 66);
	}

	.add-btn:active {
		background-color: rgb(85, 231, 122);
	}

	#map {
		width: 80%;
		/* width: 80%; */
		/* height: 700px; */
		height: 100%;

		/* width: 350px; */
		/* height: 500px; */

		float: left;

		border-right: 2px solid black;
		border-top: 2px solid black;
		border-bottom: 2px solid black;
	}

	label {
		display: block;
		margin: 10px 0 0 10px;
		font-size: 18px;
	}

	textarea {
		margin: 10px 0 0 10px;
		resize: vertical;
		min-height: 10%;
		width: 90%;
		max-height: 50%;
		font-size: 18px;
	}

	#add-marker-container {
		width: 19%;
		height: 100%;
		background-color: white;
		float: left;
		border-right: 2px solid black;
		border-top: 2px solid black;
		border-bottom: 2px solid black;
	}

	.hidden {
		display: none;
	}
</style>
