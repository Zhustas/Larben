<script>
  import Map from "../classes/Map.js";

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
