import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// load city 3D model
const loader = new GLTFLoader();
loader.load( './low_poly_city/scene.gltf', function ( gltf ) {
	scene.add( gltf.scene );
}, undefined, function ( error ) {
	console.error( error );
} );

// set light
const light = new THREE.AmbientLight( 0xffffff, 0.5 ); // soft white light
scene.add( light );
// White directional light at half intensity shining from the top.
const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.9 );
scene.add( directionalLight );

// initialize renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );

controls.update();


camera.position.set( 0, 20, 100 );
// let angle = Math.PI/180;
// camera.rotateX(1);
console.log("cam XYZ: ", camera.position.x, camera.position.y, camera.position.z)

function animate() {

    controls.update();

    renderer.render( scene, camera );
    // camera.rotateY(angle);
}