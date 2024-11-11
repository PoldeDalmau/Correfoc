// import * as THREE from 'three';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import * as YUKA from 'yuka';
import World from './src/world.js';

// import { textureStore } from "three/webgpu";

// max map: x = 80
//          z = 25.2
//          x = 37.5
//          z = 103


// const time = new YUKA.Time();
// const entityManager = new YUKA.EntityManager();
// // Red cube
// const redCubeGeometry = new THREE.BoxGeometry(1, 1, 1);
// const redCubeMaterial = new THREE.MeshStandardMaterial({ color: "red", emissive: 'red', emissiveIntensity: 0.7});
// const redCube = new THREE.Mesh(redCubeGeometry, redCubeMaterial);


// redCube.matrixAutoUpdate = false;
let world = new World();
world._RAF();
// world.scene.add(redCube)
// //path behavior
// const path = new YUKA.Path();
// const followPathBehaviour = new YUKA.FollowPathBehavior(path);
// followPathBehaviour.active = false;

// path.add(new YUKA.Vector3(53, -2, -13));

// vehicle that moves the redcube




// const vehicle = new YUKA.Vehicle();
// vehicle.position.copy(path.current());

// vehicle.setRenderComponent(redCube, sync);

// vehicle.steering.add(followPathBehaviour);
// // vehicle.steering.add(wanderBehavior);
// // vehicle.steering.add(onPathBehavior);
// // vehicle.steering.add(obstacleAvoidanceBehavior);
// vehicle.maxSpeed = 2;
// // vehicle.maxForce = 200;
// // vehicle.maxTurnRate = 3;

// entityManager.add(vehicle);


// point light
// const pointLight = new THREE.PointLight( 0xf0000, 25, 10, 1 );
// pointLight.castShadow = true;
// pointLight.position.set( 47, 0.5, -32 );
// world.scene.add( pointLight );





// function sync(entity, renderComponent) {
//     renderComponent.matrix.copy(entity.worldMatrix);
// }


// Adding bounding box to our red box
// const redCubeBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
// redCubeBB.setFromObject(redCube);

