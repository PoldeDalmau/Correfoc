import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
// import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';



const scene = new THREE.Scene();

// initialize camera with position
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( 75, 13, -37.5 );

// load city 3D model
const loader = new GLTFLoader();
loader.load( './low_poly_city/scene.gltf', function ( gltf ) {
	scene.add( gltf.scene );
}, undefined, function ( error ) {
	console.error( error );
} );

// scene.background = new THREE.Color(0xffffff);
// scene.add(new THREE.GridHelper(10000, 1000));
// scene.fog = new THREE.Fog(0xfffff, 0, 500);

// set ambientlight
const light = new THREE.AmbientLight( 0xffffff, .1 ); // soft white light
scene.add( light );
// White directional light at half intensity shining from the top.
const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.1 );
scene.add( directionalLight );
// point light
const pointLight = new THREE.PointLight( 0xff0000, 100, 100 );
// pointLight.castShadow = true;
// pointLight.position.set( 47, 0.5, -32 );
scene.add( pointLight );

// initialize renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

// initialize controls
const controls = new OrbitControls( camera, renderer.domElement );
// const controls = new FirstPersonControls( camera, renderer.domElement );
// const controls = new PointerLockControls( camera, renderer.domElement );


// controls.update();

// make a sprite (cube)
// black cube
const blackCubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const blackCubeMaterial = new THREE.MeshLambertMaterial({ color: "black"});
const blackCube = new THREE.Mesh(blackCubeGeometry, blackCubeMaterial);
blackCube.position.set(47, 1, -32);
scene.add(blackCube)

// Red cube
const redCubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const redCubeMaterial = new THREE.MeshLambertMaterial({ color: "red"});
const redCube = new THREE.Mesh(redCubeGeometry, redCubeMaterial);
redCube.position.set(47, 1, -30);  // set position different from black cube
scene.add(redCube)

// Adding bounding box to our black box
const blackCubeBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
blackCubeBB.setFromObject(blackCube);


// Adding bounding box to our red box
const redCubeBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
redCubeBB.setFromObject(redCube);


let PL_Z = 1;
pointLight.position.set( 47, PL_Z, -32 );

// document.getElementById("play").onclick = ()=>{
//     controls.lock();
// }
function checkCollision() {
    if (redCubeBB.intersectsBox(blackCubeBB)) {
        // console.log('test');
        // blackCube.material.opacity = 0.5;
        blackCube.material.color = new THREE.Color(0xffffff);
    } else {
        // blackCube.material.transparent = true;
        // blackCube.material.opacity = 0.5;
        blackCube.material.color = new THREE.Color(0x000000);
    }
}
// Adding event listener to keyPressed event and changing position of red cube
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 87) { // up
        redCube.position.x -= .3;
    } else if (keyCode == 83) { // down
        redCube.position.x += .3;
    } else if (keyCode == 65) { // left 
        redCube.position.z += .3;
    } else if (keyCode == 68) { // right
        redCube.position.z -= .3;
    }
}

function animate() {
    redCubeBB.setFromObject(redCube);
    checkCollision();
    controls.update();
    // requestAnimationFrame(animate);
    // PL_Z += 0.1;
    
    renderer.render( scene, camera );
    // console.log("cam XYZ: ", camera.position.x, camera.position.y, camera.position.z)
}

// animate();