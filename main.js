import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as YUKA from 'yuka';

// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MapControls } from 'three/addons/controls/MapControls.js';
// import { color } from 'three/webgpu';
// import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
// import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

// max map: x = 80
//          z = 25.2
//          x = 37.5
//          z = 103

const scene = new THREE.Scene();

// initialize camera with position
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( 55, 9, -14 );


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
// const controls = new OrbitControls( camera, renderer.domElement );
const controls = new MapControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.target.set(46, 1, -31);
// const controls = new FirstPersonControls( camera, renderer.domElement );
// const controls = new PointerLockControls( camera, renderer.domElement );


// controls.update();



// Red cube
const redCubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const redCubeMaterial = new THREE.MeshStandardMaterial({ color: "red", emissive: 'red', emissiveIntensity: 0.7});
const redCube = new THREE.Mesh(redCubeGeometry, redCubeMaterial);

redCube.matrixAutoUpdate = false;
scene.add(redCube)

// use yuka to give our red cue sprite some intelligence
const vehicle = new YUKA.Vehicle();

vehicle.setRenderComponent(redCube, sync);

function sync(entity, renderComponent) {
    renderComponent.matrix.copy(entity.worldMatrix);
}

const path = new YUKA.Path();
path.add(new YUKA.Vector3(48, 5, -30));
path.add(new YUKA.Vector3(27, 5, -41));
path.add(new YUKA.Vector3(30, 5, -69));
path.add(new YUKA.Vector3(63, 5, -70));
path.add(new YUKA.Vector3(66.5, 5, -24));

path.loop = true;

vehicle.position.copy(path.current());
const followPathBehaviour = new YUKA.FollowPathBehavior(path, 1);
vehicle.steering.add(followPathBehaviour);
vehicle.maxSpeed = 5;

const entityManager = new YUKA.EntityManager();
entityManager.add(vehicle);

// make a sprite (cube)
// black cube

for(let i = 0; i < 4; i ++){
    const wanderBehavior = new YUKA.WanderBehavior();
    const seekBehavior = new YUKA.OffsetPursuitBehavior(vehicle, new YUKA.Vector3(Math.random() * 10 - 5, 0, Math.random() * 10 - 5));
    let blackCubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    let blackCubeMaterial = new THREE.MeshLambertMaterial({ color: "white"});
    let blackCube = new THREE.Mesh(blackCubeGeometry, blackCubeMaterial);
    blackCube.position.set(47 - 5 + Math.random() * 10, 5, -32 - 5 + Math.random() * 10);
    
    let vehicleSeeker = new YUKA.Vehicle();
    vehicleSeeker.steering.add(seekBehavior);
    vehicleSeeker.steering.add(wanderBehavior);
    vehicleSeeker.position = blackCube.position;
    blackCube.matrixAutoUpdate = false;
    vehicleSeeker.maxSpeed = 20;
    vehicleSeeker.maxForce = 100;
    scene.add(blackCube)

    vehicleSeeker.setRenderComponent(blackCube, sync);


    entityManager.add(vehicleSeeker);

    
}

const time = new YUKA.Time();

// // Adding bounding box to our black box
// const blackCubeBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
// blackCubeBB.setFromObject(blackCube);


// Adding bounding box to our red box
const redCubeBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
redCubeBB.setFromObject(redCube);


let PL_Z = 1;
pointLight.position.set( 47, PL_Z, -32 );

// document.getElementById("play").onclick = ()=>{
//     controls.lock();
// }
// function checkCollision() {
//     if (redCubeBB.intersectsBox(blackCubeBB)) {
//         // console.log('test');
//         // blackCube.material.opacity = 0.5;
//         blackCube.material.color = new THREE.Color(0xffffff);
//     } else {
//         // blackCube.material.transparent = true;
//         // blackCube.material.opacity = 0.5;
//         blackCube.material.color = new THREE.Color(0x000000);
//     }
// }
// // Adding event listener to keyPressed event and changing position of red cube
// document.addEventListener("keydown", onDocumentKeyDown, false);
// function onDocumentKeyDown(event) {
//     var keyCode = event.which;
//     if (keyCode == 87) { // up
//         redCube.position.x -= .3;
//     } else if (keyCode == 83) { // down
//         redCube.position.x += .3;
//     } else if (keyCode == 65) { // left 
//         redCube.position.z += .3;
//     } else if (keyCode == 68) { // right
//         redCube.position.z -= .3;
//     }
// }

function animate() {
    const delta = time.update().getDelta();
    entityManager.update(delta);
    redCubeBB.setFromObject(redCube);;
    // checkCollision();
    controls.update();
    // requestAnimationFrame(animate);
    // PL_Z += 0.1;
    renderer.render( scene, camera );
    // console.log("cam XYZ: ", camera.position.x, camera.position.y, camera.position.z)
    // console.log("redCube XYZ: ", vehicle.position.x, vehicle.position.y, vehicle.position.z)
    pointLight.position.copy(vehicle.position); //.add(new THREE.Vector3(0,1,0));
    // pointLight.intensity = 50 + 10 * Math.random();
}

// animate();

renderer.setAnimationLoop(animate);
