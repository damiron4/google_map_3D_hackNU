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
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
const apiOptions = {
  "apiKey": "AIzaSyAuB2wpky1mqRPWuFUjxmmfW2ZeLzYgSeo",
  "version": "beta"
};
var markersArray = [];
var fixPtr = 0;
var step = 0;
const maxSteps = 30;
var LatStep = 0.000001;
var LngStep = 0.000001;
const horizontalAccuracy = 7;
const verticalAccuracy = 8;
const confidenceInAccuracy = 0.6827;
const altiutdeOur = 60;

import data from './dataset/dev8.json';
console.log(data);

var selectedUserFixes = [];

for (const fix of data) {
  if(fix.Identifier == 'Alice')
  selectedUserFixes.push(fix);
}

console.log(selectedUserFixes);

// fetch('./dataset/dev5.json')
//     .then(response => response.json())
//     .then(json => console.log(json));

const mapOptions = {
  "tilt":30 ,
  "heading":0, 
  "zoom": 19,
  "center": { lat: selectedUserFixes[0]["Latitude"], lng: selectedUserFixes[0]["Longitude"]},
  "mapId": "a9c41552dfc27a5"
}


async function initMap() {    
  const mapDiv = document.getElementById("map");
  const apiLoader = new Loader(apiOptions);
  await apiLoader.load()      
  return new google.maps.Map(mapDiv, mapOptions);
}

async function initWebGLOverlayView (map) {

  // Create a map instance.
//const map = new google.maps.Map(mapDiv, mapOptions);
let scene, renderer, camera, loader;
const webGLOverlayView = new google.maps.WebGLOverlayView();


webGLOverlayView.onAdd = () => {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera();
  const ambientLight = new THREE.AmbientLight( 0xffffff, 0.75 ); // soft white light
  scene.add( ambientLight );
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);
  directionalLight.position.set(0.5, -1, 0.5);
  scene.add(directionalLight);
  

  loader = new GLTFLoader();
  const source = 'pin.gltf';
  const sphere_transparent = 'sphere-transparent.gltf';
  
  loader.load(
    sphere_transparent,
    gltf => {
      gltf.scene.scale.set(0.0005*(horizontalAccuracy/confidenceInAccuracy),0.0005*(horizontalAccuracy/confidenceInAccuracy),0.0005*(verticalAccuracy/confidenceInAccuracy));
    
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
  
  // loader.manager.onLoad = () => {
  //   renderer.setAnimationLoop(() => {
  //      map.moveObject({
  //       "center.lng": mapOptions.center.lng,
  //       "center.lat" :mapOptions.center.lat
  //     });

  //     
  //   });
  // }
}

// WebGLOverlayView.onStateUpdate = ({gl}) => {
//   // Do GL state setup or updates outside of the render loop.
// }

webGLOverlayView.onDraw = ({gl, transformer}) => {

  const latLngAltitudeLiteral = {
    lat: mapOptions.center.lat,
    lng: mapOptions.center.lng,
    altitude: altiutdeOur
  }

  // Set the sphere position
  const matrix = transformer.fromLatLngAltitude(latLngAltitudeLiteral);

  LatStep =  (selectedUserFixes[(fixPtr + 1) % selectedUserFixes.length]["Latitude"] - selectedUserFixes[fixPtr]["Latitude"])/maxSteps;
  mapOptions.center.lat += LatStep;

  LngStep =  (selectedUserFixes[(fixPtr + 1) % selectedUserFixes.length]["Longitude"] - selectedUserFixes[fixPtr]["Longitude"])/maxSteps;
  mapOptions.center.lng += LngStep;
  step++;
  if(step >= maxSteps) {
    fixPtr++;
    step = 0;
  }
  if(fixPtr>=selectedUserFixes.length) fixPtr = 0;

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