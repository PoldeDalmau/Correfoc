import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

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

// set ambientlight
const light = new THREE.AmbientLight( 0xffffff, 0.1 ); // soft white light
// scene.add( light );
// White directional light at half intensity shining from the top.
const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.1 );
scene.add( directionalLight );
const pointLight = new THREE.PointLight( 0xff0000, 100, 100 );
pointLight.position.set( 47, 3, -32 );
scene.add( pointLight );

// initialize renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

// initialize controls
const controls = new OrbitControls( camera, renderer.domElement );
controls.update();

// make a sprite (cube)
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );
cube.position.x = 47;
cube.position.y = 1;
cube.position.z = -32;

function animate() {
    
    controls.update();
    
    renderer.render( scene, camera );
    console.log("cam XYZ: ", camera.position.x, camera.position.y, camera.position.z)
}