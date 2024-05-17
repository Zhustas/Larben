"use strict";

import { MarkerClusterer } from "@googlemaps/markerclusterer";

export default class Map {
  #MAPS_API_KEY;
  #GEOCODING_API_KEY;
  #map;
  #mapOptions = {
    zoom: 7,
    center: { lat: 55.1694, lng: 23.8813 },
    mapId: "MAP_ID",
  };
  #currentLatLng;
  #marker;
  #clickedOnMarker;

  constructor(MAPS_API_KEY, GEOCODING_API_KEY) {
    this.#MAPS_API_KEY = MAPS_API_KEY;
    this.#GEOCODING_API_KEY = GEOCODING_API_KEY;
  }

  loadMapsAPI() {
    ((g) => {
      var h,
        a,
        k,
        p = "The Google Maps JavaScript API",
        c = "google",
        l = "importLibrary",
        q = "__ib__",
        m = document,
        b = window;
      b = b[c] || (b[c] = {});
      var d = b.maps || (b.maps = {}),
        r = new Set(),
        e = new URLSearchParams(),
        u = () =>
          h ||
          (h = new Promise(async (f, n) => {
            await (a = m.createElement("script"));
            e.set("libraries", [...r] + "");
            for (k in g)
              e.set(
                k.replace(/[A-Z]/g, (t) => "_" + t[0].toLowerCase()),
                g[k]
              );
            e.set("callback", c + ".maps." + q);
            a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
            d[q] = f;
            a.onerror = () => (h = n(Error(p + " could not load.")));
            a.nonce = m.querySelector("script[nonce]")?.nonce || "";
            m.head.append(a);
          }));
      d[l]
        ? console.warn(p + " only loads once. Ignoring:", g)
        : (d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)));
    })({
      key: this.#MAPS_API_KEY,
      v: "weekly",
    });
  }

  getCurrentLatLng() {
    return this.#currentLatLng;
  }

  async initMap() {
    const { Map } = await google.maps.importLibrary("maps");

    this.#map = new Map(document.getElementById("map"), this.#mapOptions);

    this.#map.addListener("click", async (mapsMouseEvent) => {
      let latLng = mapsMouseEvent.latLng.toJSON();

      this.#currentLatLng = latLng;
      let isPointValid = await this.isPointInLithuania(this.#currentLatLng);

      if (isPointValid) {
        if (this.#marker) {
          this.removeMarker();
        }
        this.addMarker(latLng);
      }
    });
  }

  removeMarker() {
    this.#marker?.setMap(null);
    this.#marker = undefined;
  }

  async addMarker(latLng) {
    const { AdvancedMarkerElement, PinElement, InfoWindow } =
      await google.maps.importLibrary("marker");

    const pinBackground = new PinElement({
      background: "#3232FF",
      glyphColor: "#B2B2FF",
      borderColor: "#00007F",
    });

    this.#marker = new AdvancedMarkerElement({
      map: this.#map,
      position: latLng,
      content: pinBackground.element,
      gmpClickable: true,
    });

    this.#marker.addListener("click", () => {
      this.#clickedOnMarker = true;
    });
  }

  setClicedkOnMarker(value) {
    this.#clickedOnMarker = value;
  }

  clickedOnMarker() {
    return this.#clickedOnMarker;
  }

  async loadMarkers(markers, id, users) {
    const { AdvancedMarkerElement, PinElement } =
      await google.maps.importLibrary("marker");

    const currentID = id;

    const currentMarker = new PinElement({
      background: "#3232FF",
      glyphColor: "#B2B2FF",
      borderColor: "#00007F",
    });

    markers = markers.map((value) => {
      const position = {
        lat: value["LATITUDE"],
        lng: value["LONGITUDE"],
      };

      let username;
      for (let user of users) {
        if (user["ID"] === value["USER_ID"]) {
          username = user["USERNAME"];
          break;
        }
      }
      const infoWindow = new google.maps.InfoWindow({
        content: `
        <strong>Vartotojas: ${username}</strong>
        <div></div>
        <strong>Aprašymas: ${value["DESCRIPTION"]}</strong>`,
      });

      let marker = new AdvancedMarkerElement({ position });

      marker.addListener("click", () => {
        infoWindow.open({
          anchor: marker,
          map: this.#map,
        });
      });

      return marker;
    });

    new MarkerClusterer({
      map: this.#map,
      markers: markers,
    });
  }

  async isPointInLithuania({ lat: latitude, lng: longitude }) {
    let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${
      this.#GEOCODING_API_KEY
    }`;

    const response = await fetch(url);
    const data = await response.json();
    const results = data.results;

    for (let component of results) {
      for (let type of component.types) {
        if (type === "country") {
          for (let address_component of component.address_components) {
            if (address_component.short_name === "LT") {
              return true;
            }
          }
        }
      }
    }
    return false;
  }
}
