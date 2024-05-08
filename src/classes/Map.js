export default class Map {
  #MAPS_API_KEY;
  #map;

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

    this.#map = new Map(document.getElementById("map"), {
      zoom: 4,
      center: { lat: -25.344, lng: 131.031 },
      mapId: "MAP_ID",
    });

    this.#map.addListener("click", (mapsMouseEvent) => {
      this.addMarker(mapsMouseEvent.latLng.toJSON());
    });
  }

  async addMarker(latLng) {
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    const marker = new AdvancedMarkerElement({
      map: this.#map,
      position: latLng,
    });
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
