// import * as THREE from 'three';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as YUKA from 'yuka';
import { createConvexRegionHelper } from './src/navmesh_helper';
import { MapControls } from 'three/addons/controls/MapControls.js';
// import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';
import BasicCharacterController from './src/player_controls';

// import { textureStore } from "three/webgpu";

// max map: x = 80
//          z = 25.2
//          x = 37.5
//          z = 103

class World {
    
    constructor(){
        this._Initialize();
    }
    
    _Initialize() {
        
        this.scene = new THREE.Scene();
        // scene.background = new THREE.Color(0xffffff);
        // scene.add(new THREE.GridHelper(10000, 1000));
        // scene.fog = new THREE.Fog(0xfffff, 0, 500);

        // set ambientlight
        this.AmbientLightlight = new THREE.AmbientLight( 0xffffff, .01 ); // soft white light
        this.scene.add( this.AmbientLightlight );
        // White directional light at half intensity shining from the top.
        this.DirectionalLight = new THREE.DirectionalLight( 0xffffff, 0.01 );
        this.scene.add( this.DirectionalLight );
        // initialize camera with position
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        // camera.position.set( 55, 9, -14 );
        this.camera.position.set( 69, 19, 8);


        // initialize renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
          });
          this.renderer.outputEncoding = THREE.sRGBEncoding;
          this.renderer.shadowMap.enabled = true;
          this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
          this.renderer.setPixelRatio(window.devicePixelRatio);
          this.renderer.setSize(window.innerWidth, window.innerHeight);
        
        this.renderer.setAnimationLoop( animate );
        document.body.appendChild( this.renderer.domElement );
        window.addEventListener('resize', () => {
            this._OnWindowResize();
          }, false);
        // initialize controls
        this.controls = new MapControls( this.camera, this.renderer.domElement );
        this.controls.enableDamping = true;
        this.controls.target.set(53, 0, -13);

          
        this._mixers = [];
        this._previousRAF = null;


        this._LoadMap();
        this._LoadDemon();
        this._LoadNavmesh();
        this._LoadAnimatedModel();
        this._RAF();
    }

    _LoadAnimatedModel() {
        const params = {
          camera: this.camera,
          scene: this.scene,
        }
        this._controls = new BasicCharacterController(params);
      }
    

    _LoadMap(){
        // load city 3D model
        const loader = new GLTFLoader();
        // let model;
        loader.load( './resources/low_poly_city/scene.gltf', ( gltf ) => {
            const model = gltf.scene;
            
            gltf.scene.traverse(o => {
                if (o.isMesh) {
                //   o.castShadow = true;
                o.receiveShadow = true;
                }
                this.scene.add( gltf.scene );
            });
            gltf.scene.position.set(10.5, -2, 19.5);
            // model.position.set(10.5, -3, 19.5);
        }, undefined, function ( error ) {
            console.log('Failed to load gltf model');
            console.error( error );
        } );
    }
    

    _LoadDemon() {
        const loaderdemon = new GLTFLoader();

        loaderdemon.load( './resources/low_poly_city/Characters/demon/dimoni_animated.glb', ( glb ) => {

            glb.scene.position.set(53, -2, -15);
            glb.scene.traverse(o => {
                if (o.isMesh) {
                o.castShadow = true;
                //   o.receiveShadow = true;
                }
                if (o.name == 'HandL'){
                    console.log("hand!, ", o.position);
                }
            });    
            this.mixer = new THREE.AnimationMixer(glb.scene);
            const clips = glb.animations;
            const clip = THREE.AnimationClip.findByName(clips, "Idle");
            const clip2 = THREE.AnimationClip.findByName(clips, "0TPose");
            const idleAction = this.mixer.clipAction(clip);
            const TPoseAction = this.mixer.clipAction(clip2);

            idleAction.play();
            this.mixer.addEventListener('finished', (e)=> {
                if(e.action._clip.name === 'Idle') {
                    TPoseAction.reset();
                    TPoseAction.play();
                }
            });

            this.scene.add( glb.scene );
        });        
    }

    _LoadNavmesh() {
        // load navigation mesh
        const navmeshLoader = new YUKA.NavMeshLoader();
        navmeshLoader.load('./resources/low_poly_city/navmesh/testNavmeshglb.glb').then((navigationMesh) =>{
            const navMesh = navigationMesh;


            const navmeshGroup = createConvexRegionHelper(navMesh);
            // for debugging and displaying navmesh
            // this.scene.add(navmeshGroup);
            const mousePosition = new THREE.Vector2();
            const raycaster = new THREE.Raycaster();

            window.addEventListener('click', function(e) {
                mousePosition.x = (e.clientX/this.window.innerWidth) * 2 - 1;
                mousePosition.y = -(e.clientY/this.window.innerHeight) * 2 + 1;

                raycaster.setFromCamera(mousePosition, world.camera);
                const intersects = raycaster.intersectObject(navmeshGroup);

                if (intersects.length > 0){
                    _findPathTo(new YUKA.Vector3().copy(intersects[0].point));
                    // console.log('added point to path');
                } else {
                    console.log('try another point on the mesh');
                }
            })
            function _findPathTo(target){
                const from = vehicle.position;
                const to = target;
                const path = navMesh.findPath(from, to);

                const followPathBehaviour = vehicle.steering.behaviors[0];
                followPathBehaviour.active = true;
                followPathBehaviour.path.clear();
                // onPathBehavior.path.clear();

                // console.log('points added:', path.length);
                for (let point of path){
                    followPathBehaviour.path.add(point);
                    // onPathBehavior.path.add(point);
                }
            }
        });
    }

    _RAF() {
        requestAnimationFrame((t) => {
          if (this._previousRAF === null) {
            this._previousRAF = t;
          }
    
          this._RAF();
    
          this.renderer.render(this.scene, this.camera);
          this._Step(t - this._previousRAF);
          this._previousRAF = t;
        });
    }

    _Step(timeElapsed) {
        const timeElapsedS = timeElapsed * 0.001;
        if (this._mixers) {
          this._mixers.map(m => m.update(timeElapsedS));
        }
    
        if (this._controls) {
          this._controls.Update(timeElapsedS);
        }
    }

    _OnWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
};

let world = new World();

// Red cube
const redCubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const redCubeMaterial = new THREE.MeshStandardMaterial({ color: "red", emissive: 'red', emissiveIntensity: 0.7});
const redCube = new THREE.Mesh(redCubeGeometry, redCubeMaterial);

redCube.matrixAutoUpdate = false;
world.scene.add(redCube)
//path behavior
const path = new YUKA.Path();
const followPathBehaviour = new YUKA.FollowPathBehavior(path);
followPathBehaviour.active = false;

path.add(new YUKA.Vector3(53, -2, -13));

// vehicle that moves the redcube


const entityManager = new YUKA.EntityManager();


const vehicle = new YUKA.Vehicle();
vehicle.position.copy(path.current());

vehicle.setRenderComponent(redCube, sync);

vehicle.steering.add(followPathBehaviour);
// vehicle.steering.add(wanderBehavior);
// vehicle.steering.add(onPathBehavior);
// vehicle.steering.add(obstacleAvoidanceBehavior);
vehicle.maxSpeed = 2;
// vehicle.maxForce = 200;
// vehicle.maxTurnRate = 3;

entityManager.add(vehicle);


// point light
const pointLight = new THREE.PointLight( 0xf0000, 25, 10, 1 );
pointLight.castShadow = true;
// pointLight.position.set( 47, 0.5, -32 );
world.scene.add( pointLight );





function sync(entity, renderComponent) {
    renderComponent.matrix.copy(entity.worldMatrix);
}

const time = new YUKA.Time();

// Adding bounding box to our red box
const redCubeBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
redCubeBB.setFromObject(redCube);

function animate() {
    const delta = time.update().getDelta();
    entityManager.update(delta);
    redCubeBB.setFromObject(redCube);;
    world.controls.update();
    world.renderer.render( world.scene, world.camera );
    // console.log("cam XYZ: ", camera.position.x, camera.position.y, camera.position.z)
    // console.log("redCube XYZ: ", vehicle.position.x, vehicle.position.y, vehicle.position.z)
    pointLight.position.copy(vehicle.position).add(new THREE.Vector3(0,1,0));
    if(world.mixer){
        world.mixer.update(delta);
        console.log('mixer online', world.mixer);
    }

}