import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as YUKA from 'yuka';
import { createGraphHelper } from './src/graph_helper';
import { createConvexRegionHelper } from './src/navmesh_helper';
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



// Red cube
const redCubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const redCubeMaterial = new THREE.MeshStandardMaterial({ color: "red", emissive: 'red', emissiveIntensity: 0.7});
const redCube = new THREE.Mesh(redCubeGeometry, redCubeMaterial);

redCube.matrixAutoUpdate = false;
scene.add(redCube)
//path behavior
const followPathBehaviour = new YUKA.FollowPathBehavior();
followPathBehaviour.active = false;
followPathBehaviour.nextWaypointDistance = 0.5;

const path = new YUKA.Path();
// path.add(new YUKA.Vector3(48, 5, -35));
path.add(new YUKA.Vector3(-1.3, 0, 8));

// vehicle that moves the redcube
const vehicle = new YUKA.Vehicle();
vehicle.position.copy(path.current());

vehicle.setRenderComponent(redCube, sync);

vehicle.steering.add(followPathBehaviour);
// vehicle.steering.add(obstacleAvoidanceBehavior);
vehicle.maxSpeed = 3;

const entityManager = new YUKA.EntityManager();
entityManager.add(vehicle);
// load city 3D model
const loader = new GLTFLoader();
loader.load( './low_poly_city/scene.gltf', function ( gltf ) {
	scene.add( gltf.scene );
}, undefined, function ( error ) {
	console.error( error );
} );


// load navigation mesh
const navmeshLoader = new YUKA.NavMeshLoader();
navmeshLoader.load('./low_poly_city/LowPolyCityNavmesh.glb').then((navigationMesh) =>{
    const navMesh = navigationMesh;

    const graph = navMesh.graph;
    const graphHelper = createGraphHelper(graph, 0.2);
    scene.add(graphHelper);

    const navmeshGroup = createConvexRegionHelper(navMesh);
    scene.add(navmeshGroup);
    // const mousePosition = new THREE.Vector2();
    // const raycaster = new THREE.Raycaster();

    let i = 0;
    window.addEventListener('click', function(e) {
        // mousePosition.x = (e.clientX/this.window.innerWidth) * 2 - 1;
        // mousePosition.y = (e.clientY/this.window.innerHeight) * 2 + 1;

        // raycaster.setFromCamera(mousePosition, camera);
        // const intersects = raycaster.intersectObject(navmesh);
        // findPathTo(new YUKA.Vector3(63, 5, -70));
        i++;
        if (i % 2 == 0){
            findPathTo(new YUKA.Vector3(-1.3, 0, 8));
        } else {
            findPathTo(new YUKA.Vector3(-6.7, 0, 14.6));
        }
        console.log('clicked!');
    })


    function findPathTo(target){
        const from = vehicle.position;
        const to = target;
        const path = navMesh.findPath(from, to);

        const followPathBehaviour = vehicle.steering.behaviors[0];
        followPathBehaviour.active = true;
        followPathBehaviour.path.clear();

        for (let point of path){
            followPathBehaviour.path.add(point);
        }
    }
});


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
// town hall mesh for AI to know obstacle avoidance
// const townHallGeometry = new THREE.SphereGeometry(3);
// // const townHallGeometry = new THREE.BoxGeometry(22, 30, 22);
// townHallGeometry.computeBoundingSphere();
// const townHallMaterial = new THREE.MeshBasicMaterial();
// const townHall = new THREE.Mesh(townHallGeometry, townHallMaterial);
// // townHall.position.set(47, 1, -52);
// townHall.position.set(45, 5, -30);
// scene.add(townHall);
// const obstacleTH = new YUKA.GameEntity();
// obstacleTH.position.copy(townHall.position);
// obstacleTH.boundingRadius = townHallGeometry.boundingSphere.radius;
// entityManager.add(obstacleTH);
// const obstacleAvoidanceBehavior = new YUKA.ObstacleAvoidanceBehavior([obstacleTH]);


function sync(entity, renderComponent) {
    renderComponent.matrix.copy(entity.worldMatrix);
}

// path.add(new YUKA.Vector3(30, 5, -30));
// path.add(new YUKA.Vector3(60, 5, -30));
// // path.add(new YUKA.Vector3(48, 5, -35));
// // path.add(new YUKA.Vector3(40, 5, -35));
// path.add(new YUKA.Vector3(48, 5, -30));
// // path.add(new YUKA.Vector3(27, 5, -41));
// // path.add(new YUKA.Vector3(30, 5, -69));
// path.add(new YUKA.Vector3(63, 5, -70));
// path.add(new YUKA.Vector3(66.5, 5, -24));
// path.loop = true;
// make a sprite (cube)
// black cube
// const seekBehavior = new YUKA.SeekBehavior(vehicle.position);
// let behaviorFLock = [];
// for(let i = 0; i < 4; i ++){
//     // const wanderBehavior = new YUKA.WanderBehavior();
//     // const wanderBehavior = new YUKA.WanderBehavior(10, .2);
//     const seekBehavior = new YUKA.OffsetPursuitBehavior(vehicle, new YUKA.Vector3(Math.random() * 3 - 1, 0, Math.random() * 3 - 1), 2);
//     let blackCubeGeometry = new THREE.BoxGeometry(1, 1, 1);
//     let blackCubeMaterial = new THREE.MeshLambertMaterial({ color: "white"});
//     let blackCube = new THREE.Mesh(blackCubeGeometry, blackCubeMaterial);
//     blackCube.position.set(47 - 5 + Math.random() * 3, 5, -32 - 5 + Math.random() * 3);
//     let vehicleSeeker = new YUKA.Vehicle();
//     // vehicleSeeker.steering.add(obstacleAvoidanceBehavior);
//     vehicleSeeker.steering.add(seekBehavior);
//     behaviorFLock.push(seekBehavior);
//     // vehicleSeeker.steering.add(wanderBehavior);
//     vehicleSeeker.position = blackCube.position;
//     blackCube.matrixAutoUpdate = false;
//     vehicleSeeker.maxSpeed = 5;
//     vehicleSeeker.maxForce = 100;
//     scene.add(blackCube)
//     vehicleSeeker.setRenderComponent(blackCube, sync);
//     entityManager.add(vehicleSeeker);
// }

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
    // set new point:
    // for(let i = 0; i < 4; i ++){
    //     behaviorFLock[i] = new YUKA.OffsetPursuitBehavior(vehicle, new YUKA.Vector3(Math.random() * 3 - 1, 0, Math.random() * 3 - 1), 2);
    //     // entityManager.entities.at(i + 1).;
    // }



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


    let a = new YUKA.Vector3();
    // console.log(a.copy(behaviorFLock[0].offset).add(vehicle.position));

}

// animate();

renderer.setAnimationLoop(animate);


// const restrictedAreas = [];
// restrictedAreas.push([[35, -41], [57.7, -62]]); // townhall
// // restrictedAreas.push([[35, -41], [57.7, -62]]); // other
// const currpostest = [30, -42];
// const targettest = [37, -43];
// function checkIfRestricted(currentPos, target, restrictedAreas){
//     //only takes arrays containing two points defining an aabb
//     const p0 = currentPos;
//     const p1 = target;
//     // iterate through all restricted areas

//     for(let areaInd = 0; areaInd < restrictedAreas.length; areaInd++){
//         const p2 = restrictedAreas[areaInd][0];
//         const p3 = [restrictedAreas[areaInd][0][0], restrictedAreas[areaInd][1][1]];

//         const s1 = [0, 0];
//         const s2 = [0, 0];
//         s1[0] = p1[0] - p0[0];
//         s1[1] = p1[1] - p0[1];
//         s2[0] = p3[0] - p2[0];
//         s2[1] = p3[1] - p2[1];

//         let s, t;
//         s = (-s1[1] * (p0[0] - p2[0]) + s1[0] * (p0[1] - p2[1])) / (-s2[0] * s1[1] + s1[0] * s2[1]);
//         t = ( s2[0] * (p0[1] - p2[1]) - s2[1] * (p0[0] - p2[0])) / (-s2[0] * s1[1] + s1[0] * s2[1]);

//         if (s >= 0 && s <= 1 && t >= 0 && t <= 1){return true;}

//     }
//     return false; // no intersection
// }
// console.log(checkIfRestricted(currpostest, targettest, restrictedAreas));