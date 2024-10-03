import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as YUKA from 'yuka';
import { createGraphHelper } from './src/graph_helper';
import { createConvexRegionHelper } from './src/navmesh_helper';
import { MapControls } from 'three/addons/controls/MapControls.js';

// max map: x = 80
//          z = 25.2
//          x = 37.5
//          z = 103

const scene = new THREE.Scene();

// initialize camera with position
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
// camera.position.set( 55, 9, -14 );
camera.position.set( 69, 19, 8);

const loaderdemon = new GLTFLoader();

loaderdemon.load( './low_poly_city/Characters/demon/dimoni.gltf', function ( gltf ) {
    const model = gltf.scene;
    model.position.set(10.5, -2, 19.5);
    // model.position.set(10.5, -3, 19.5);
	scene.add( gltf.scene );
});
// Red cube
const redCubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const redCubeMaterial = new THREE.MeshStandardMaterial({ color: "red", emissive: 'red', emissiveIntensity: 0.7});
const redCube = new THREE.Mesh(redCubeGeometry, redCubeMaterial);

redCube.matrixAutoUpdate = false;
scene.add(redCube)
//path behavior
const path = new YUKA.Path();
const followPathBehaviour = new YUKA.FollowPathBehavior(path);
followPathBehaviour.active = false;
// followPathBehaviour.nextWaypointDistance = 1;
const onPathBehavior = new YUKA.OnPathBehavior();
onPathBehavior.radius = 0.2;

// path.add(new YUKA.Vector3(48, 5, -35));
path.add(new YUKA.Vector3(53, -2, -13));

// vehicle that moves the redcube


const entityManager = new YUKA.EntityManager();
// load city 3D model
const loader = new GLTFLoader();
// loader.load( './LowPolyCityWithNavmesh.gltf', function ( gltf ) {
loader.load( './low_poly_city/scene.gltf', function ( gltf ) {
    const model = gltf.scene;
    model.position.set(10.5, -2, 19.5);
    // model.position.set(10.5, -3, 19.5);
	scene.add( gltf.scene );
}, undefined, function ( error ) {
    console.log('Failed to load gltf model');
	console.error( error );
} );


const vehicle = new YUKA.Vehicle();
vehicle.position.copy(path.current());

vehicle.setRenderComponent(redCube, sync);

vehicle.steering.add(followPathBehaviour);
vehicle.steering.add(onPathBehavior);
// vehicle.steering.add(obstacleAvoidanceBehavior);
vehicle.maxSpeed = 2;
// vehicle.maxForce = 200;
// vehicle.maxTurnRate = 3;

entityManager.add(vehicle);

// load navigation mesh
const navmeshLoader = new YUKA.NavMeshLoader();
navmeshLoader.load('./low_poly_city/navmesh/testNavmeshglb.glb').then((navigationMesh) =>{
// navmeshLoader.load('./low_poly_city/navmesh/LowPolyCityNavmesh.glb').then((navigationMesh) =>{
// navmeshLoader.load('./NavmeshTest.gltf').then((navigationMesh) =>{
    const navMesh = navigationMesh;

    const graph = navMesh.graph;
    const graphHelper = createGraphHelper(graph, 0.2);
    // scene.add(graphHelper);

    const navmeshGroup = createConvexRegionHelper(navMesh);
    scene.add(navmeshGroup);
    const mousePosition = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    window.addEventListener('click', function(e) {
        mousePosition.x = (e.clientX/this.window.innerWidth) * 2 - 1;
        mousePosition.y = -(e.clientY/this.window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mousePosition, camera);
        const intersects = raycaster.intersectObject(navmeshGroup);

        if (intersects.length > 0){
            findPathTo(new YUKA.Vector3().copy(intersects[0].point));
            console.log('added point to path');    
        } else {
            console.log('try another point on the mesh');    
        }
    })
        function findPathTo(target){
            const from = vehicle.position;
            const to = target;
            const path = navMesh.findPath(from, to);

            const followPathBehaviour = vehicle.steering.behaviors[0];
            followPathBehaviour.active = true;
            followPathBehaviour.path.clear();
            onPathBehavior.path.clear();

            console.log('points added:', path.length);
            for (let point of path){
                followPathBehaviour.path.add(point);
                onPathBehavior.path.add(point);
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
const controls = new MapControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.target.set(53, 0, -13);


function sync(entity, renderComponent) {
    renderComponent.matrix.copy(entity.worldMatrix);
}

const time = new YUKA.Time();


// Adding bounding box to our red box
const redCubeBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
redCubeBB.setFromObject(redCube);

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
    console.log("redCube XYZ: ", vehicle.position.x, vehicle.position.y, vehicle.position.z)
    pointLight.position.copy(vehicle.position); //.add(new THREE.Vector3(0,1,0));
    // pointLight.intensity = 50 + 10 * Math.random();


    let a = new YUKA.Vector3();

}

// animate();

renderer.setAnimationLoop(animate);