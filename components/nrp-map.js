import Map, { Marker, Layer, NavigationControl, Source } from 'react-map-gl';
import sites from '../data/sites.json';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateSite } from '../src/selectedSite';
import InsideMarker from './inside-marker';
import MapControls from './map-controls';
import { point, featureCollection } from '@turf/helpers';
import circle from '@turf/circle'


const buildingLayer = {
  'id': 'add-3d-buildings',
  'source': 'composite',
  'source-layer': 'building',
  'filter': ['==', 'extrude', 'true'],
  'type': 'fill-extrusion',
  'minzoom': 15,
  'paint': {
    'fill-extrusion-color': '#aaa',

    // Use an 'interpolate' expression to
    // add a smooth transition effect to
    // the buildings as the user zooms in.
    'fill-extrusion-height': [
      'interpolate',
      ['linear'],
      ['zoom'],
      15,
      0,
      15.05,
      ['get', 'height']
    ],
    'fill-extrusion-base': [
      'interpolate',
      ['linear'],
      ['zoom'],
      15,
      0,
      15.05,
      ['get', 'min_height']
    ],
    'fill-extrusion-opacity': 0.6
  }
};

const initialViewState = {
  center: [-96.70554062901587, 40.819759045397525],
  longitude: -96.70554062901587,
  latitude: 40.819759045397525,
  zoom: 3.5,
  pitch: 0,
  bearing: 0,
  //projection: 'globe'
};

export default function NRPMap() {
  const mapRef = useRef();
  const [viewState, setViewState] = useState(initialViewState);
  const selectedSite = useSelector((state) => state.selectedSite.value);

  useEffect(() => {
    if (selectedSite && viewState.center != [sites.sites[selectedSite].lon, sites.sites[selectedSite].lat]) {
      setViewState({
        center: [sites.sites[selectedSite].lon, sites.sites[selectedSite].lat],
        zoom: 16,
        duration: 2000,
        pitch: 40,
        bearing: 0
      });
    }
  }, [selectedSite]);

  const dispatch = useDispatch();
  const [count, setCount] = useState(0);
  const [showRanges, setShowRanges] = useState(false);

  useEffect(() => {
    console.log("In use effect", viewState);
    mapRef.current?.flyTo(viewState);
  }, [viewState]);

  var circles = new Array();
  Object.keys(sites.sites).map((site, i) => {
    let _center = point([sites.sites[site].lon, sites.sites[site].lat]);
    let _radius = 500;
    let _options = {
      steps: 80,
      units: 'miles' // or "mile"
    };
    let _circle = circle(_center, _radius, _options);
    circles.push(_circle);
  });

  var collection = featureCollection(circles);

  var circleLayerStyle = {
    'id': 'circleLayer',
    'type': 'fill',
    paint: {
      "fill-color": "blue",
      "fill-opacity": 0.2,
      "fill-outline-color": "blue",
    },
  }

  return (
    <>
      <Map
        ref={mapRef}
        initialViewState={initialViewState}
        //mapStyle="mapbox://styles/mapbox/satellite-v9"
        //mapStyle="mapbox://styles/mapbox/dark-v10"
        mapStyle="mapbox://styles/mapbox/light-v10"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        attributionControl={false}

      >
        {Object.keys(sites.sites).map((site, i) => (
          <Marker
            key={i}
            longitude={sites.sites[site].lon}
            latitude={sites.sites[site].lat}
            anchor="center"
            onClick={(e) => {
              if (sites.sites[site].cache) {
                return;
              }
              console.log("Selected site: " + site);
              setViewState({
                center: [sites.sites[site].lon, sites.sites[site].lat],
                zoom: 16,
                duration: 2000,
                pitch: 40,
                bearing: 0
              })
              dispatch(updateSite(site));
              e.originalEvent.stopPropagation();
            }}
          >
            <InsideMarker site={sites.sites[site]} />
            {/* <img src="/Google_Maps_pin.svg" className="cursor-pointer" /> */}
          </Marker>
        ))}
        <Layer {...buildingLayer} />
        {showRanges &&
          <Source id="cache-circles" type="geojson" data={collection}>
            <Layer {...circleLayerStyle} />
          </Source>
        }
        <NavigationControl visualizePitch="true" />
        <MapControls
          position="top-left"
          mapRef={mapRef}
          initialView={initialViewState}
          onClick={() => {
            console.log("Clicked back button");
            setViewState({
              duration: 2000,
              ...initialViewState
            });
            dispatch(updateSite(null));
          }}
          enableCacheRange={(e) => {
            console.log("Checked = ", e.target.checked);
            console.log(e);
            setShowRanges(e.target.checked);
          }}
        />
      </Map>

    </>
  );
}

