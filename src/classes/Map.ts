'use strict';

import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { Loader } from '@googlemaps/js-api-loader';
import type { UserDB, MarkerDB } from './DatabaseClasses';

export default class Map {
	#MAPS_API_KEY: string;
	#GEOCODING_API_KEY: string;
	#map: google.maps.Map;
	#mapOptions = {
		zoom: 7,
		center: { lat: 55.1694, lng: 23.8813 },
		mapId: 'MAP_ID'
	};
	#currentLatLng: google.maps.LatLngLiteral;
	#marker: google.maps.marker.AdvancedMarkerElement | undefined;
	#clickedOnMarker: boolean;
	#loader: Loader;
	#mapLibrary: google.maps.MapsLibrary | undefined;
	#markerLibrary: google.maps.MarkerLibrary | undefined;

	constructor(MAPS_API_KEY: string, GEOCODING_API_KEY: string) {
		this.#MAPS_API_KEY = MAPS_API_KEY;
		this.#GEOCODING_API_KEY = GEOCODING_API_KEY;

		this.#map = new google.maps.Map(document.getElementById('map')!, this.#mapOptions);
		this.#currentLatLng = { lat: 0, lng: 0 };
		this.#clickedOnMarker = false;

		this.#loader = new Loader({
			apiKey: this.#MAPS_API_KEY,
			version: 'weekly'
		});
	}

	public async loadMapsAPI() {
		this.#mapLibrary = (await this.#loader.importLibrary('maps')) as google.maps.MapsLibrary;
		this.#map = new this.#mapLibrary.Map(document.getElementById('map')!, this.#mapOptions);
		this.#markerLibrary = (await this.#loader.importLibrary('marker')) as google.maps.MarkerLibrary;
	}

	getCurrentLatLng() {
		return this.#currentLatLng;
	}

	async initMap() {
		this.#map.addListener('click', async (mapsMouseEvent: google.maps.MapMouseEvent) => {
			if (mapsMouseEvent && mapsMouseEvent.latLng) {
				let latLng = mapsMouseEvent.latLng.toJSON();

				this.#currentLatLng = latLng;
				let isPointValid = await this.isPointInLithuania(this.#currentLatLng);

				if (isPointValid) {
					if (this.#marker) {
						this.removeMarker();
					}
					this.addMarker(latLng);
				}
			}
		});
	}

	removeMarker() {
		// this.#marker?.setMap(null);
		this.#marker = undefined;
	}

	async addMarker(latLng: google.maps.LatLngLiteral) {
		const { AdvancedMarkerElement, PinElement } = this.#markerLibrary as google.maps.MarkerLibrary;

		const pinBackground = new PinElement({
			background: '#3232FF',
			glyphColor: '#B2B2FF',
			borderColor: '#00007F'
		});

		this.#marker = new AdvancedMarkerElement({
			map: this.#map,
			position: latLng,
			content: pinBackground.element,
			gmpClickable: true
		});

		this.#marker.addListener('click', () => {
			this.#clickedOnMarker = true;
		});
	}

	setClicedkOnMarker(value: boolean) {
		this.#clickedOnMarker = value;
	}

	clickedOnMarker() {
		return this.#clickedOnMarker;
	}

	async loadMarkers(markers: MarkerDB[], users: UserDB[]) {
		const { AdvancedMarkerElement } = this.#markerLibrary as google.maps.MarkerLibrary;

		const originalMarkers = markers.map((value) => {
			let username;
			for (let user of users) {
				if (user.id === value.id) {
					username = user.username;
					break;
				}
			}

			const infoWindow = new google.maps.InfoWindow({
				content: `
					<strong>${username}</strong>
					<div></div>
					<strong>${value.description ?? ''}</strong>`
			});

			const position = {
				lat: value.latitude,
				lng: value.longitude
			};

			let marker = new AdvancedMarkerElement({ position });
			marker.addListener('click', () => {
				infoWindow.open({
					anchor: marker,
					map: this.#map
				});
			});

			return marker;
		});

		new MarkerClusterer({
			map: this.#map,
			markers: originalMarkers
		});
	}

	async isPointInLithuania({ lat, lng }: google.maps.LatLngLiteral) {
		let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${
			this.#GEOCODING_API_KEY
		}`;

		const response = await fetch(url);
		const data = await response.json();
		const results = data.results;

		for (let component of results) {
			for (let type of component.types) {
				if (type === 'country') {
					for (let address_component of component.address_components) {
						if (address_component.short_name === 'LT') {
							return true;
						}
					}
				}
			}
		}
		return false;
	}
}
