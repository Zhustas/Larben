<script>
  import Map from "../classes/Map.js";

  sendGETCookieCheck();

  function sendGETCookieCheck() {
    const hr = new XMLHttpRequest();
    hr.open("GET", "http://localhost:3000/checkSessionToken");
    hr.withCredentials = true;
    hr.send();
    hr.onload = () => {
      console.log(hr.response);
      if (hr.response === "Expired") {
        Cookies.remove("sessionToken");
        wincow.location = "/";
      } else if (hr.response === "Don't exist") {
        window.location = "/";
      }
    };
  }

  let MAPS_API_KEY = process.env.MAPS_API_KEY;
  let GEOCODING_API_KEY = process.env.GEOCODING_API_KEY;

  let map = new Map(MAPS_API_KEY, GEOCODING_API_KEY);
  map.loadMapsAPI();

  map.initMap();
</script>

<div id="map"></div>

<style>
  #map {
    width: 1200px;
    height: 700px;
  }
</style>
