"use strict";

export default class Map {
  #MAPS_API_KEY;
  #map;
  #mapOptions = {
    zoom: 7,
    center: { lat: 55.1694, lng: 23.8813 },
    mapId: "MAP_ID",
  };

  constructor(MAPS_API_KEY) {
    this.#MAPS_API_KEY = MAPS_API_KEY;
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

  async initMap() {
    const { Map } = await google.maps.importLibrary("maps");

    this.#map = new Map(document.getElementById("map"), this.#mapOptions);

    let latLng;
    this.#map.addListener("click", async (mapsMouseEvent) => {
      latLng = mapsMouseEvent.latLng.toJSON();
      if (await this.isPointInLithuania(latLng)) {
        this.addMarker(latLng);
      }
    });
  }

  async addMarker(latLng) {
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    const marker = new AdvancedMarkerElement({
      map: this.#map,
      position: latLng,
    });
  }

  async isPointInLithuania({ lat: latitude, lng: longitude }) {
    let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${
      this.#MAPS_API_KEY
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

// let map;

// async function initMap() {
//   let options = {
//     zoom: 4,
//     center: { lat: -25.344, lng: 131.031 },
//     mapId: "MAP_ID",
//   };

//   const { Map } = await google.maps.importLibrary("maps");
//   const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

//   map = new Map(document.getElementById("map"), options);

//   const marker = new AdvancedMarkerElement({
//     map: map,
//     position: options.center,
//   });
// }

// async function initMap() {
// Request needed libraries.
//   const { Map } = await google.maps.importLibrary("maps");
//   const myLatlng = { lat: -25.363, lng: 131.044 };
//   const map = new google.maps.Map(document.getElementById("map"), {
//     zoom: 4,
//     center: myLatlng,
//   });
// Create the initial InfoWindow.
// let infoWindow = new google.maps.InfoWindow({
//   content: "Click the map to get Lat/Lng!",
//   position: myLatlng,
// });

// infoWindow.open(map);
// map.addListener("click", (mapsMouseEvent) => {
// infoWindow.close();
// infoWindow = new google.maps.InfoWindow({
//   position: mapsMouseEvent.latLng,
// });
// infoWindow.setContent(
//   JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
// );
// infoWindow.open(map);
//     console.log(mapsMouseEvent.latLng.toJSON());
//   });
// }
