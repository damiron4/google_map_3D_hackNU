// Copyright 2021 Google LLC

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     https://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Loader } from '@googlemaps/js-api-loader';
import * as THREE from 'three';
import { Camera, PerspectiveCamera } from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
const apiOptions = {
  "apiKey": "AIzaSyAuB2wpky1mqRPWuFUjxmmfW2ZeLzYgSeo",
  "version": "beta"
};
var markersArray = [];
var fixPtr = 0;
const maxSteps = 50;
var step = 0;

const horizontalAccuracy = 7;
const verticalAccuracy = 8;
const confidenceInAccuracy = 0.6827;

import data from './dataset/dev9.json';

// Extract the selected user's fixes
var selectedUserFixes = [];
const path = [];
for (const fix of data) {
  if(fix.Identifier == 'Charlie')
  selectedUserFixes.push(fix);
  path.push({lat: fix.Latitude, lng: fix.Longitude});
}
// fetch('./dataset/dev5.json')
//     .then(response => response.json())
//     .then(json => console.log(json));

var LatStep =  (selectedUserFixes[1]["Latitude"] - selectedUserFixes[0]["Latitude"])/maxSteps;
var LngStep =  (selectedUserFixes[1]["Longitude"] - selectedUserFixes[0]["Longitude"])/maxSteps;
var AltStep = 0.000001;

const mapOptions = {
  "tilt": 0,
  "heading": 30, 
  "zoom": 18,
  "center": { lat: selectedUserFixes[0]["Latitude"], lng: selectedUserFixes[0]["Longitude"], altitude: selectedUserFixes[0]["Altitude"]},
  "mapId": "a9c41552dfc27a5"
}

async function initMap() {
  const mapDiv = document.getElementById("map");
  const apiLoader = new Loader(apiOptions);
  await apiLoader.load();
  const map = new google.maps.Map(mapDiv, mapOptions);

  // const path = new google.maps.Polyline({
  //   path: path,
  //   geodesic: true,
  //   strokeColor: "#0000FF",
  //   strokeOpacity: 0.4,
  //   strokeWeight: 2
  // });

  // path.setMap(map);

  return map;
}

async function initWebGLOverlayView (map) {

// Create a map instance.
//const map = new google.maps.Map(mapDiv, mapOptions);
let scene, renderer, camera, loader;
const webGLOverlayView = new google.maps.WebGLOverlayView();


webGLOverlayView.onAdd = () => {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera();
  camera.lookAt(scene.position);
  const ambientLight = new THREE.AmbientLight( 0xffffff, 0.75 ); // soft white light
  scene.add( ambientLight );
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);
  directionalLight.position.set(0.5, -1, 0.5);
  scene.add(directionalLight);

  loader = new GLTFLoader();
  const sphere = 'SPHERE.gltf';
  const sphere_transparent = 'sphere-transparent.gltf';
  const scaleHorizontal = horizontalAccuracy/confidenceInAccuracy;
  const scaleVertical = verticalAccuracy/confidenceInAccuracy;
  // Load transparent sphere
  loader.load(
    sphere_transparent,
    gltf => {
      gltf.scene.scale.set(0.0005 * scaleHorizontal, 0.0005 * scaleHorizontal, 0.0005 * scaleVertical);
      gltf.scene.translateZ(scaleVertical*0.5);
      scene.add(gltf.scene);
    }
  );
  
  // Load small sphere
  loader.load(
    sphere,
    gltf => {
      gltf.scene.scale.set(0.5 * scaleHorizontal, 0.5 * scaleHorizontal, 0.5 * scaleVertical);
      gltf.scene.translateZ(scaleVertical*0.375);
    
      scene.add(gltf.scene);
    }
  );
}

webGLOverlayView.onContextRestored = ({gl}) => {
  // Do setup that requires access to rendering context before onDraw call.
  renderer = new THREE.WebGLRenderer({
    canvas: gl.canvas,
    context: gl,
    ...gl.getContextAttributes(),
  });
  renderer.autoClear = false;

  loader.manager.onLoad = () => {
    renderer.setAnimationLoop(() => {
      map.moveCamera({
        // "tilt": mapOptions.tilt,
        // "heading": mapOptions.heading,
        // "zoom": mapOptions.zoom,
        "center": {lat: mapOptions.center.lat, lng: mapOptions.center.lng}
      });

      if (mapOptions.tilt <= 67.5) {
        mapOptions.tilt += 0.5;
      } else {
        mapOptions.center.lat += LatStep;
        mapOptions.center.lng += LngStep;
        step++;
        if(step >= maxSteps) {
          fixPtr = (fixPtr + 1) % selectedUserFixes.length;
          step = 0;
          LatStep =  (selectedUserFixes[(fixPtr + 1) % selectedUserFixes.length]["Latitude"] - selectedUserFixes[fixPtr]["Latitude"])/maxSteps;
          LngStep =  (selectedUserFixes[(fixPtr + 1) % selectedUserFixes.length]["Longitude"] - selectedUserFixes[fixPtr]["Longitude"])/maxSteps;
      }}
     } );
  }
}

// WebGLOverlayView.onStateUpdate = ({gl}) => {
//   // Do GL state setup or updates outside of the render loop.
// }

webGLOverlayView.onDraw = ({gl, transformer}) => {

  const latLngAltitudeLiteral = {
    lat: mapOptions.center.lat,
    lng: mapOptions.center.lng,
    altitude: mapOptions.center.altitude
  }
  const matrix = transformer.fromLatLngAltitude(latLngAltitudeLiteral);

  // Sphere Animation
  // LatStep =  (selectedUserFixes[(fixPtr + 1) % selectedUserFixes.length]["Latitude"] - selectedUserFixes[fixPtr]["Latitude"])/maxSteps;
  // mapOptions.center.lat += LatStep;

  // LngStep =  (selectedUserFixes[(fixPtr + 1) % selectedUserFixes.length]["Longitude"] - selectedUserFixes[fixPtr]["Longitude"])/maxSteps;
  // mapOptions.center.lng += LngStep;

  // AltStep =  (selectedUserFixes[(fixPtr + 1) % selectedUserFixes.length]["Altitude"] - selectedUserFixes[fixPtr]["Altitude"])/maxSteps;
  // mapOptions.center.altitude += AltStep;

  // step++;
  // if(step >= maxSteps) {
  //   fixPtr++;
  //   step = 0;
  // }
  // if(fixPtr>=selectedUserFixes.length) fixPtr = 0;

  camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix);

  // Render objects.
  webGLOverlayView.requestRedraw();
  renderer.render(scene, camera);
  renderer.resetState();

}

// WebGLOverlayView.onContextLost = () => {
//   // Clean up pre-existing GL state.
// }

// WebGLOverlayView.onRemove = () => {
//   // Remove all intermediate objects.
// }

webGLOverlayView.setMap(map);

}

(async () => {        
  const map = await initMap();
  initWebGLOverlayView(map);
})();