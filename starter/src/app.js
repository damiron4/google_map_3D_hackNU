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

function getFixesByName(name, data) {
  const fixes = [];
  for (const fix of data) {
    if (fix.Identifier == name) fixes.push(fix);
  }
  return fixes;
}

function recalc() {
  LatStep =  (selectedUserFixes[(fixPtr + 1) % selectedUserFixes.length]["Latitude"] - selectedUserFixes[fixPtr]["Latitude"])/maxSteps;
  LngStep =  (selectedUserFixes[(fixPtr + 1) % selectedUserFixes.length]["Longitude"] - selectedUserFixes[fixPtr]["Longitude"])/maxSteps;

  horizontalAccuracy = selectedUserFixes[fixPtr]["Horizontal accuracy"] / confidenceInAccuracy;
  verticalAccuracy = selectedUserFixes[fixPtr]["Vertical accuracy"] / confidenceInAccuracy;
}

function setMapOptions(height) {
  if (height >= 86000) {
    mapOptions.tilt = 0;
    mapOptions.zoom = 10;
    return;
  }
  if (height >= 43000) {
    mapOptions.tilt = 0;
    mapOptions.zoom = 11;
    return;
  }
  if (height >= 21500) {
    mapOptions.tilt = 0;
    mapOptions.zoom = 12;
    return;
  }
  if (height >= 10500) {
    mapOptions.tilt = 0;
    mapOptions.zoom = 13;
    return;
  }
  if (height >= 3000) {
    mapOptions.tilt = 0;
    mapOptions.zoom = 14;
    return;
  }
  if (height >= 1900) {
    mapOptions.tilt = 30;
    mapOptions.zoom = 14;
    return;
  }
  if (height >= 500) {
    mapOptions.tilt = 40;
    mapOptions.zoom = 15;
    return;
  }
  if (height >= 300) {
    mapOptions.tilt = 50;
    mapOptions.zoom = 16;
    return;
  }
  if (height >= 200) {
    mapOptions.tilt = 60;
    mapOptions.zoom = 17;
    return;
  }
  if (height >= 120) {
    mapOptions.tilt = 70;
    mapOptions.zoom = 17;
    return;
  }
  if (height >= 60) {
    mapOptions.tilt = 90;
    mapOptions.zoom = 18;
    return;
  }
  if (height >= 40) {
    mapOptions.tilt = 30;
    mapOptions.zoom = 19;
    return;
  }
  if (height >= 20) {
    mapOptions.tilt = 90;
    mapOptions.zoom = 21;
    return;
  }
  mapOptions.tilt = 20;
  mapOptions.zoom = 22;
  return;
}

var fixPtr = 0;
var step = 0;
const maxSteps = 100;
const confidenceInAccuracy = 0.6827;

import data from './dataset/prod3.json';

var selectedUserFixes = [];
// Extract the selected user's fixes
if (data.length > 1) {
  selectedUserFixes = getFixesByName(data[0]["Identifier"], data)
} else {
  selectedUserFixes = data;
}

var horizontalAccuracy = selectedUserFixes[0]["Horizontal accuracy"];
var verticalAccuracy = selectedUserFixes[0]["Vertical accuracy"];
var LatStep, LngStep;
if (data.length > 1) {
  horizontalAccuracy = selectedUserFixes[0]["Horizontal accuracy"];
  verticalAccuracy = selectedUserFixes[0]["Vertical accuracy"];
  LatStep =  (selectedUserFixes[1]["Latitude"] - selectedUserFixes[0]["Latitude"])/maxSteps;
  LngStep =  (selectedUserFixes[1]["Longitude"] - selectedUserFixes[0]["Longitude"])/maxSteps;
}

const mapOptions = {
  "tilt": 0,
  "heading": 40, 
  "zoom": 18,
  "center": { lat: selectedUserFixes[0]["Latitude"], lng: selectedUserFixes[0]["Longitude"], altitude: selectedUserFixes[0]["Altitude"]},
  "mapId": "a9c41552dfc27a5"
}

setMapOptions(data[0]["Altitude"]);

async function initMap() {
  const mapDiv = document.getElementById("map");
  const apiLoader = new Loader(apiOptions);
  await apiLoader.load();

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
  // camera.lookAt(scene.position);
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
  
  // Load small sphere
  loader.load(
    sphere,
    gltf => {
      gltf.scene.scale.set(0.5 * scaleVertical, 0.5 * scaleVertical, 0.5 * scaleVertical);
      gltf.scene.translateZ(scaleVertical*0.375);
    
      scene.add(gltf.scene);
    }
  );

  // Load transparent sphere
  loader.load(
    sphere_transparent,
    gltf => {
      gltf.scene.scale.set(0.0005 * scaleHorizontal, 0.0005 * scaleHorizontal, 0.0005 * scaleVertical);
      gltf.scene.translateZ(scaleVertical*0.5);
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
      if (selectedUserFixes.length < 2) {
        //renderer.setAnimationLoop(null);
        return;
      }
      map.moveCamera({
        // "tilt": mapOptions.tilt,
        // "heading": mapOptions.heading,
        // "zoom": mapOptions.zoom,
        "center": {lat: mapOptions.center.lat, lng: mapOptions.center.lng}
      });

      mapOptions.center.lat += LatStep;
      mapOptions.center.lng += LngStep;
      step++;
      if(step >= maxSteps) {
        fixPtr++;
        if(fixPtr >= selectedUserFixes.length) {
          mapOptions.center.lat = selectedUserFixes[0]["Latitude"];
          mapOptions.center.lng = selectedUserFixes[0]["Longitude"];
          fixPtr = 0;
        }
        step = 0;
        recalc();
      }
     });
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