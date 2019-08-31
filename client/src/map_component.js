/* global fetch, L */
import React, { useEffect, useRef, useState } from "react";
import Moment from "moment";

const getRouteSummary = locations => {
  const to = Moment(locations[0].time).format("hh:mm DD.MM");
  const from = Moment(locations[locations.length - 1].time).format(
    "hh:mm DD.MM"
  );
  return `${from} - ${to}`;
};

const MapComponent = props => {
  const map = useRef();
  const [locations, setLocations] = useState();
  const [selectedLocation, setSelectedLocation] = useState();
  // Request location data.
  useEffect(() => {
    fetch("http://localhost:3000")
      .then(response => response.json())
      .then(json => {
        setLocations(json);
      });
  }, []);
  // TODO(Task 2): Request location closest to specified datetime from the back-end.
  useEffect(() => {
    fetch("http://localhost:3000/location/" + props.selectedDate)
      .then(response => response.json())
      .then(json => {
        setSelectedLocation(json);
      });
  }, [props]);
  // Initialize map.
  useEffect(() => {
    map.current = new L.Map("mapid");
    const osmUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    const attribution =
      'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
    const osm = new L.TileLayer(osmUrl, {
      minZoom: 8,
      maxZoom: 12,
      attribution
    });
    map.current.setView(new L.LatLng(52.51, 13.4), 9);
    map.current.addLayer(osm);
  }, []);
  // Update location data on map.
  useEffect(() => {
    if (!map.current || !locations) {
      return; // If map or locations not loaded yet.
    }
    // TODO(Task 1): Replace the single red polyline by the different segments on the map.
    for (var loc of locations) {
      let latlons = loc.map(({ lat, lon }) => [lat, lon]);
      let polyline = L.polyline(latlons, {
        color: "#" + (((1 << 24) * Math.random()) | 0).toString(16)
      })
        .bindPopup(getRouteSummary(locations))
        .addTo(map.current);
      map.current.fitBounds(polyline.getBounds());
    }
    return;
  }, [locations, map.current]);
  // TODO(Task 2): Display location that the back-end returned on the map as a marker.
  useEffect(() => {
    if (!map.current || !selectedLocation) {
      return; // If map or selected locations not loaded yet.
    }
    for (var i in map.current._layers) {
      console.log(map.current._layers[i]);

      if (
        map.current._layers[i]._path != undefined ||
        map.current._layers[i]._latlng != undefined
      ) {
        try {
          map.current.removeLayer(map.current._layers[i]);
        } catch (e) {
          console.log("problem with " + e + map.current._layers[i]);
        }
      }
    }
    if (!selectedLocation.selectedTrip) return;

    const latlons = selectedLocation.selectedTrip.map(({ lat, lon }) => [
      lat,
      lon
    ]);
    const polyline = L.polyline(latlons, { color: "blue" })
      .bindPopup(getRouteSummary(locations))
      .addTo(map.current);
    var marker = L.marker([
      selectedLocation.closest.lat,
      selectedLocation.closest.lon
    ]);
    map.current.addLayer(marker);
    // map.current.fitBounds(polyline.getBounds());
    return;
  }, [props, map.current]);
  
  return (
    <div>
      {locations && `${locations.length} locations loaded`}
      {!locations && "Loading..."}
      <div id="mapid" />
    </div>
  );
};

export default MapComponent;
